# Groq AI Service - provides simple text generation via Groq's LLaMA models

from app.services.groq_client import get_groq_client


class GroqService:
    """
    AI Service using Groq's LLaMA models.
    Provides text generation and summarization capabilities.
    """

    def generate_text(self, prompt: str) -> str:
        """Simple text generation using Groq AI."""
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
        """Summarize text using Groq AI."""
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
        """Placeholder for future vision capabilities."""
        return "Vision analysis not yet available with Groq."


# Singleton instance
groq_service = GroqService()
