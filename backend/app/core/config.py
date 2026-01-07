import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "VPTC AI Chatbot"
    API_V1_STR: str = "/api/v1"
    
    # Cors
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # Gemini
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "temporary-secret-key-for-dev")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
