import google.generativeai as genai
from app.core.config import settings

# Configure once at module level
genai.configure(api_key=settings.GOOGLE_API_KEY)

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.vision_model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_text(self, prompt: str) -> str:
        """
        Simple text generation for general queries.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Sorry, I encountered an error extracting information."

    def summarize_text(self, text: str) -> str:
        try:
            prompt = f"Summarize the following text in 3 bullet points:\n\n{text}"
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return "Could not generate summary."

    def analyze_image(self, prompt: str, image_data):
        """
        Future proofing: Vision capabilities for analyzing diagrams/charts.
        """
        try:
            response = self.vision_model.generate_content([prompt, image_data])
            return response.text
        except Exception as e:
            return "Vision analysis failed."

gemini_service = GeminiService()
