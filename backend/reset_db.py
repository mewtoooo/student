import os
import sys
from sqlmodel import SQLModel, create_engine
# Import models to ensure they are registered with SQLModel.metadata
from app.models import Department, Subject, Student, Mark, User, AuditLog
from app.database import settings

def reset_database():
    print("--- ⚠️ DATABASE RESET UTILITY ⚠️ ---")
    confirm = input("Are you sure you want to PERMANENTLY DELETE all student data, departments, and subjects? (type 'yes' to confirm): ")
    
    if confirm.lower() != 'yes':
        print("Reset aborted.")
        return

    engine = create_engine(settings.database_url)
    
    print("Dropping all existing tables...")
    SQLModel.metadata.drop_all(engine)
    
    print("Re-creating fresh tables from models.py schema...")
    SQLModel.metadata.create_all(engine)
    
    print("✅ System Hub Resetted Successfully.")
    print("Please restart your FastAPI server to re-initialize the default 'admin' user.")

if __name__ == "__main__":
    # Ensure current directory is in path for imports
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    reset_database()
