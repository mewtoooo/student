from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List
from datetime import datetime

# --- DEPARTMENT MASTER ---
class DepartmentBase(SQLModel):
    name: str = Field(index=True, unique=True)
    description: Optional[str] = None

class Department(DepartmentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    subjects: List["Subject"] = Relationship(back_populates="department")
    students: List["Student"] = Relationship(back_populates="department")

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentRead(DepartmentBase):
    id: int

# --- SUBJECT MASTER ---
class SubjectBase(SQLModel):
    name: str
    code: str = Field(index=True, unique=True)
    credits: int = Field(default=3)
    department_id: int = Field(foreign_key="department.id")

class Subject(SubjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relationships
    department: Optional[Department] = Relationship(back_populates="subjects")
    marks: List["Mark"] = Relationship(back_populates="subject")

class SubjectCreate(SubjectBase):
    pass

class SubjectRead(SubjectBase):
    id: int

# --- STUDENT REGISTRY ---
class StudentBase(SQLModel):
    student_id: str = Field(index=True, unique=True)
    name: str
    roll_no: str
    department_id: int = Field(foreign_key="department.id")

class Student(StudentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    department: Optional[Department] = Relationship(back_populates="students")
    marks: List["Mark"] = Relationship(back_populates="student")

class StudentCreate(StudentBase):
    pass

class StudentRead(StudentBase):
    id: int
    department: Optional[DepartmentRead] = None

class StudentUpdate(SQLModel):
    name: Optional[str] = None
    roll_no: Optional[str] = None
    department_id: Optional[int] = None

# --- MARKS ENGINE ---
class MarkBase(SQLModel):
    student_id: int = Field(foreign_key="student.id")
    subject_id: int = Field(foreign_key="subject.id")
    score: int = Field(default=0)

class Mark(MarkBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    student: Optional[Student] = Relationship(back_populates="marks")
    subject: Optional[Subject] = Relationship(back_populates="marks")

class MarkCreate(MarkBase):
    pass

class MarkRead(MarkBase):
    id: int
    subject: Optional[SubjectRead] = None

# --- USER AUTHENTICATION ---
class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str

class UserCreate(UserBase):
    password: str

# --- SYSTEM AUDIT LOGS ---
class AuditLogBase(SQLModel):
    message: str
    action_type: str

class AuditLog(AuditLogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: str = Field(index=True)

class AuditLogRead(AuditLogBase):
    id: int
    timestamp: str
