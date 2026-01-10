import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "VPTC AI Chatbot"
    API_V1_STR: str = "/api/v1"
    
    # Cors - Can be set via env var as JSON array or uses defaults
    BACKEND_CORS_ORIGINS: List[str] = []
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # If BACKEND_CORS_ORIGINS not set via env, use defaults
        if not self.BACKEND_CORS_ORIGINS:
            self.BACKEND_CORS_ORIGINS = [
                "http://localhost:3000", 
                "http://localhost:8000",
                "https://vptc-ai-chatbot-frontend.vercel.app"
            ]

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
