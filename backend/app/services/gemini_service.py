# DEPRECATED: This file is kept for backward compatibility only.
# Use groq_service.py instead. This will be removed in a future cleanup.
# All new code should import from app.services.groq_service

import warnings
warnings.warn(
    "gemini_service is deprecated. Import from app.services.groq_service instead.",
    DeprecationWarning,
    stacklevel=2,
)

from app.services.groq_service import GroqService as GeminiService, groq_service as gemini_service

__all__ = ["GeminiService", "gemini_service"]
