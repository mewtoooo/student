from sqlmodel import SQLModel, create_engine, Session
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:password@localhost:5432/student_marks"
    port: int = 8000
    host: str = "0.0.0.0"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

engine = create_engine(settings.database_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
