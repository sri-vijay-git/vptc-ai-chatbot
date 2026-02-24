# Shared Groq client - singleton used by all services to avoid duplication

from groq import Groq
from app.core.config import settings

_groq_client = None

def get_groq_client() -> Groq:
    """Lazy singleton initialization of the Groq client."""
    global _groq_client
    if _groq_client is None:
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not set in .env file")
        _groq_client = Groq(api_key=settings.GROQ_API_KEY)
    return _groq_client
