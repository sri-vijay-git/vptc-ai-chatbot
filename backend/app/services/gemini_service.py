# Groq-based AI Service (replacing Gemini)

from groq import Groq
import os
from app.core.config import settings

# Get Groq API key from environment via settings
groq_client = None

def get_groq_client():
    """Lazy initialization of Groq client"""
    global groq_client
    if groq_client is None:
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not set in .env file")
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    return groq_client

class GeminiService:
    """
    AI Service using Groq (renamed for compatibility)
    Provides same interface as before but uses Groq's LLaMA models
    """
    
    def generate_text(self, prompt: str) -> str:
        """
        Simple text generation using Groq AI
        """
        try:
            client = get_groq_client()
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=150
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            return "Great job! Keep up the good work!"
    
    def summarize_text(self, text: str) -> str:
        """
        Summarize text using Groq AI
        """
        try:
            prompt = f"Summarize the following text in 3 bullet points:\n\n{text}"
            client = get_groq_client()
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=200
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            return "Could not generate summary."
    
    def analyze_image(self, prompt: str, image_data):
        """
        Placeholder for future vision capabilities
        """
        return "Vision analysis not yet available with Groq."

# Create singleton instance
gemini_service = GeminiService()
