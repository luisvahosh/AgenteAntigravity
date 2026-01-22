from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Real Estate CRM SaaS"
    PROJECT_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # SECURITY
    SECRET_KEY: str = "CHANGE_THIS_IN_PRODUCTION_SECRET_KEY_123"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # DATABASE
    # Default to sqlite for local dev if Postgres url not provided, but we aim for Postgres
    # DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/realestate_crm"
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000", "http://localhost:5173", "http://localhost:5174"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
