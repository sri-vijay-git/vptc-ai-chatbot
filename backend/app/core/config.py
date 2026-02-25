import os
from pydantic_settings import BaseSettings

_INSECURE_DEFAULT_KEY = "temporary-secret-key-for-dev"

class Settings(BaseSettings):
    PROJECT_NAME: str = "VPTC AI Chatbot"
    API_V1_STR: str = "/api/v1"
    
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # AI Service API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", _INSECURE_DEFAULT_KEY)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Frontend
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"  # Allow extra fields from .env

settings = Settings()

# Warn loudly if insecure default SECRET_KEY is used
if settings.SECRET_KEY == _INSECURE_DEFAULT_KEY:
    import warnings
    warnings.warn(
        "⚠️  WARNING: SECRET_KEY is using the insecure default value! "
        "Set a strong SECRET_KEY in your .env file before deploying to production.",
        stacklevel=2,
    )

# CORS Origins - Hardcoded for simplicity
BACKEND_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000", 
    "https://vptc-ai-chatbot-frontend.vercel.app",
    "https://vptc-ai.vercel.app"
]
