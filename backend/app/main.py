from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func
from typing import List, Optional, Dict
from .database import engine, create_db_and_tables, get_session
from .models import (
    Department, DepartmentCreate, DepartmentRead,
    Subject, SubjectCreate, SubjectRead,
    Student, StudentCreate, StudentRead, StudentUpdate,
    Mark, MarkCreate, MarkRead,
    User, UserCreate,
    AuditLog, AuditLogRead
)
from datetime import datetime
from passlib.context import CryptContext
from pydantic import BaseModel

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    username: str
    password: str

class DashboardMetrics(BaseModel):
    total: int
    avg: str
    passed: int
    failed: int

class StudentReadWithPerformance(StudentRead):
    percentage: float = 0.0
    grade: str = "N/A"
    status: str = "INCOMPLETE"
    backlog_count: int = 0

def create_audit_log(session: Session, message: str, action_type: str):
    new_log = AuditLog(
        message=message,
        action_type=action_type,
        timestamp=datetime.now().strftime("%I:%M:%S %p")
    )
    session.add(new_log)
    session.commit()

app = FastAPI(title="Professional Student Management ERD")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        statement = select(User).where(User.username == "admin")
        if not session.exec(statement).first():
            hashed_password = pwd_context.hash("admin123")
            admin_user = User(username="admin", hashed_password=hashed_password)
            session.add(admin_user)
            session.commit()

# --- AUTH ---
@app.post("/register")
def register_user(*, session: Session = Depends(get_session), user_in: UserCreate):
    statement = select(User).where(User.username == user_in.username)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(user_in.password)
    db_user = User(username=user_in.username, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    return {"msg": "User created successfully"}

@app.post("/login")
def login(*, session: Session = Depends(get_session), login_data: LoginRequest):
    statement = select(User).where(User.username == login_data.username)
    user = session.exec(statement).first()
    if not user or not pwd_context.verify(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"msg": "Login successful", "username": user.username}

# --- AUDIT ---
@app.get("/audit-logs/", response_model=List[AuditLogRead])
def read_audit_logs(*, session: Session = Depends(get_session), limit: int = 5):
    logs = session.exec(select(AuditLog).order_by(AuditLog.id.desc()).limit(limit)).all()
    return logs

# --- METRICS HUB ---
@app.get("/metrics/", response_model=DashboardMetrics)
def get_dashboard_metrics(*, session: Session = Depends(get_session)):
    students = session.exec(select(Student)).all()
    total_students = len(students)
    if total_students == 0:
        return {"total": 0, "avg": "0%", "passed": 0, "failed": 0}

    weighted_total_sum = 0.0
    total_weighted_credits = 0
    passed_students = 0
    failed_students = 0

    for s in students:
        marks = session.exec(select(Mark).where(Mark.student_id == s.id)).all()
        if not marks:
            continue
        
        s_weighted_score = 0.0
        s_credits = 0
        is_failed = False
        
        for m in marks:
            subject = session.get(Subject, m.subject_id)
            if subject:
                s_weighted_score += (m.score * subject.credits)
                s_credits += subject.credits
                if m.score < 35: # 35% Rules for Fail/Supply
                    is_failed = True
        
        if s_credits > 0:
            weighted_total_sum += (s_weighted_score / s_credits)
            total_weighted_credits += 1
            
        if is_failed:
            failed_students += 1
        else:
            passed_students += 1

    final_avg = (weighted_total_sum / total_weighted_credits) if total_weighted_credits > 0 else 0.0
    return {
        "total": total_students, 
        "avg": f"{final_avg:.1f}%", 
        "passed": passed_students, 
        "failed": failed_students
    }

# --- DEPARTMENT CRUD (SAFE DELETE) ---
@app.post("/departments/", response_model=DepartmentRead)
def create_department(*, session: Session = Depends(get_session), dept_in: DepartmentCreate):
    db_dept = Department.from_orm(dept_in)
    session.add(db_dept)
    session.commit()
    session.refresh(db_dept)
    create_audit_log(session, f"A.I: Dept Created [{db_dept.name}]", "CREATE")
    return db_dept

@app.get("/departments/", response_model=List[DepartmentRead])
def read_departments(*, session: Session = Depends(get_session)):
    return session.exec(select(Department)).all()

@app.patch("/departments/{id}", response_model=DepartmentRead)
def update_department(*, session: Session = Depends(get_session), id: int, dept_in: DepartmentCreate):
    db_dept = session.get(Department, id)
    if not db_dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept_data = dept_in.dict(exclude_unset=True)
    for key, value in dept_data.items():
        setattr(db_dept, key, value)
    session.add(db_dept)
    session.commit()
    session.refresh(db_dept)
    create_audit_log(session, f"A.I: Dept Updated [{db_dept.name}]", "UPDATE")
    return db_dept

@app.delete("/departments/{id}")
def delete_department(*, session: Session = Depends(get_session), id: int):
    db_dept = session.get(Department, id)
    if not db_dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # SAFE CHECK: Students & Subjects verification
    students_check = session.exec(select(Student).where(Student.department_id == id)).first()
    subjects_check = session.exec(select(Subject).where(Subject.department_id == id)).first()
    if students_check or subjects_check:
        raise HTTPException(status_code=400, detail="HUB LOCK: Department contains active students or modules. Purge them first.")

    session.delete(db_dept)
    session.commit()
    create_audit_log(session, f"A.I: Dept Expunged [ID: {id}]", "DELETE")
    return {"ok": True}

# --- SUBJECT CRUD (SAFE DELETE) ---
@app.post("/subjects/", response_model=SubjectRead)
def create_subject(*, session: Session = Depends(get_session), sub_in: SubjectCreate):
    db_sub = Subject.from_orm(sub_in)
    session.add(db_sub)
    session.commit()
    session.refresh(db_sub)
    create_audit_log(session, f"A.I: Subject Created [{db_sub.code}]", "CREATE")
    return db_sub

@app.get("/subjects/", response_model=List[SubjectRead])
def read_subjects(*, session: Session = Depends(get_session), department_id: Optional[int] = None):
    statement = select(Subject)
    if department_id:
        statement = statement.where(Subject.department_id == department_id)
    return session.exec(statement).all()

@app.patch("/subjects/{id}", response_model=SubjectRead)
def update_subject(*, session: Session = Depends(get_session), id: int, sub_in: SubjectCreate):
    db_sub = session.get(Subject, id)
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    sub_data = sub_in.dict(exclude_unset=True)
    for key, value in sub_data.items():
        setattr(db_sub, key, value)
    session.add(db_sub)
    session.commit()
    session.refresh(db_sub)
    create_audit_log(session, f"A.I: Subject Updated [{db_sub.code}]", "UPDATE")
    return db_sub

@app.delete("/subjects/{id}")
def delete_subject(*, session: Session = Depends(get_session), id: int):
    db_sub = session.get(Subject, id)
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # SAFE CHECK: Marks dependency
    marks_check = session.exec(select(Mark).where(Mark.subject_id == id)).first()
    if marks_check:
        raise HTTPException(status_code=400, detail="HUB LOCK: Subject has recorded assessment marks. Cannot expunge active data.")

    session.delete(db_sub)
    session.commit()
    create_audit_log(session, f"A.I: Subject Expunged [ID: {id}]", "DELETE")
    return {"ok": True}

# --- STUDENT CRUD ---
@app.post("/students/", response_model=StudentRead)
def create_student(*, session: Session = Depends(get_session), student_in: StudentCreate):
    statement = select(Student).where(Student.student_id == student_in.student_id)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Student ID already exists")
    db_student = Student.from_orm(student_in)
    session.add(db_student)
    session.commit()
    session.refresh(db_student)
    create_audit_log(session, f"A.I: Student Registered [{db_student.student_id}]", "CREATE")
    return db_student

@app.get("/students/", response_model=List[StudentReadWithPerformance])
def read_students(*, session: Session = Depends(get_session)):
    students = session.exec(select(Student)).all()
    results = []
    for s in students:
        marks_statement = select(Mark).where(Mark.student_id == s.id)
        student_marks = session.exec(marks_statement).all()
        
        weighted_score = 0.0
        total_credits = 0
        backlog_count = 0
        grade = "N/A"
        status = "INCOMPLETE"
        final_percentage = 0.0

        if student_marks:
            for m in student_marks:
                subject = session.get(Subject, m.subject_id)
                if subject:
                    weighted_score += (m.score * subject.credits)
                    total_credits += subject.credits
                    if m.score < 35:
                        backlog_count += 1
            
            if total_credits > 0:
                final_percentage = weighted_score / total_credits
            
            # DETERMINISTIC STATUS LOGIC
            if backlog_count == 0:
                status = "PASS"
                grade = "A+" if final_percentage >= 90 else "A" if final_percentage >= 80 else "B" if final_percentage >= 60 else "C" if final_percentage >= 40 else "F"
            elif backlog_count == 1:
                status = "SUPPLY"
                grade = "D" # Automatic downgrade for compartment
            else:
                status = "FAIL"
                grade = "F"

        s_dict = s.dict()
        s_dict["department"] = s.department
        s_dict["percentage"] = round(final_percentage, 1)
        s_dict["grade"] = grade
        s_dict["status"] = status
        s_dict["backlog_count"] = backlog_count
        results.append(s_dict)
    return results

@app.patch("/students/{id}", response_model=StudentRead)
def update_student(*, session: Session = Depends(get_session), id: int, student_in: StudentUpdate):
    db_student = session.get(Student, id)
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    student_data = student_in.dict(exclude_unset=True)
    for key, value in student_data.items():
        setattr(db_student, key, value)
    session.add(db_student)
    session.commit()
    session.refresh(db_student)
    create_audit_log(session, f"A.I: Student Profile Updated [{db_student.student_id}]", "UPDATE")
    return db_student

@app.delete("/students/{id}")
def delete_student(*, session: Session = Depends(get_session), id: int):
    student = session.get(Student, id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # SAFE CHECK: Marks dependency
    marks_check = session.exec(select(Mark).where(Mark.student_id == id)).first()
    if marks_check:
        raise HTTPException(status_code=400, detail="HUB LOCK: Student has recorded assessments. Transfer marks before deletion.")

    session.delete(student)
    session.commit()
    create_audit_log(session, f"A.I: Student Expunged [ID: {id}]", "DELETE")
    return {"ok": True}

# --- MARKS ENGINE ---
@app.post("/marks/", response_model=MarkRead)
def add_mark(*, session: Session = Depends(get_session), mark_in: MarkCreate):
    student = session.get(Student, mark_in.student_id)
    subject = session.get(Subject, mark_in.subject_id)
    if not student or not subject:
        raise HTTPException(status_code=404, detail="Student or Subject not found")
    if student.department_id != subject.department_id:
        raise HTTPException(status_code=400, detail="Subject mismatch for student department")
    statement = select(Mark).where(Mark.student_id == mark_in.student_id, Mark.subject_id == mark_in.subject_id)
    existing_mark = session.exec(statement).first()
    if existing_mark:
        existing_mark.score = mark_in.score
        db_mark = existing_mark
    else:
        db_mark = Mark.from_orm(mark_in)
    session.add(db_mark)
    session.commit()
    session.refresh(db_mark)
    create_audit_log(session, f"A.I: Marks Logged [S.ID: {student.student_id}]", "CREATE")
    return db_mark

@app.get("/marks/{student_id}", response_model=List[MarkRead])
def read_student_marks(*, session: Session = Depends(get_session), student_id: int):
    return session.exec(select(Mark).where(Mark.student_id == student_id)).all()
