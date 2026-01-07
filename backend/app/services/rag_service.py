import google.generativeai as genai
from app.services.vector_store import vector_store
from app.core.config import settings

# Configure Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class RAGService:
    def generate_response(self, user_query: str) -> dict:
        """
        Orchestrates the RAG flow:
        1. Retrieve relevant context from ChromaDB
        2. Construct a prompt with context
        3. Query Gemini Pro
        """
        
        # 1. Retrieve Context
        try:
            relevant_docs = vector_store.search(user_query, n_results=3)
        except Exception as e:
            # Fallback if vector store fails (e.g., empty)
            print(f"Vector search failed: {e}")
            relevant_docs = []

        context_text = "\n\n".join(relevant_docs)
        
        # 2. Construct Prompt
        # We give the AI a persona and strict instructions to use the context.
        prompt = f"""
You are the official AI Academic Advisor for Vignesh Polytechnic College (VPTC).
Your goal is to assist students and staff by providing accurate information based ONLY on the provided context.

CONTEXT FROM COLLEGE DOCUMENTS:
{context_text}

USER QUESTION: 
{user_query}

INSTRUCTIONS:
- Answer the user's question clearly and concisely using the context above.
- If the answer is not found in the context, politely say "I'm sorry, I don't have that information in my current records."
- Do NOT make up information.
- Format your response nicely (use bullet points if needed).
        """

        # 3. Generate Response
        try:
            response = model.generate_content(prompt)
            answer = response.text
        except Exception as e:
            # Log the detailed error for debugging
            error_message = str(e)
            print(f"❌ Gemini API Error: {error_message}")
            print(f"   Error type: {type(e).__name__}")
            
            # User-friendly error messages based on error type
            if "quota" in error_message.lower() or "429" in error_message:
                answer = "⚠️ API quota exceeded. Please wait a few minutes or use a different API key."
            elif "api_key" in error_message.lower() or "401" in error_message:
                answer = "⚠️ Invalid API key. Please check your GOOGLE_API_KEY in the .env file."
            elif "network" in error_message.lower() or "connection" in error_message.lower():
                answer = "⚠️ Network connection issue. Please check your internet connection."
            else:
                answer = f"I'm having trouble connecting to the AI brain right now. Error: {error_message[:100]}"

        return {
            "answer": answer,
            "sources": ["College Documents"] if relevant_docs else []
        }

rag_service = RAGService()
