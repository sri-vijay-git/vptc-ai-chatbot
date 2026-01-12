# Groq-based AI Service (replacing Gemini)

from groq import Groq
import os

# Get Groq API key from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

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
            response = groq_client.chat.completions.create(
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
            response = groq_client.chat.completions.create(
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
