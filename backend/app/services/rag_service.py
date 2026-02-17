from groq import Groq
from app.services.vector_store import vector_store
from app.core.config import settings
import os

# Configure Groq AI
# GROQ_API_KEY will be loaded from .env via settings
groq_client = None

def get_groq_client():
    """Lazy initialization of Groq client"""
    global groq_client
    if groq_client is None:
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not set in .env file")
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
    return groq_client

class RAGService:
    def generate_response(self, user_query: str) -> dict:
        """
        RAG flow with REAL Groq AI - Fast & Free!
        """
        
        # 1. Retrieve Context from Vector Store
        try:
            relevant_docs = vector_store.search(user_query, n_results=3)
            context = "\n".join(relevant_docs) if relevant_docs else "No specific documents found."
        except Exception as e:
            print(f"Vector store error: {e}")
            context = "General knowledge"

        # 2. Build Conversational Prompt
        prompt = f"""You are a helpful and friendly AI assistant for Vignesh Polytechnic College (VPTC), Tiruvannamalai.

CONTEXT FROM COLLEGE DOCUMENTS:
{context}

STUDENT QUESTION: {user_query}

INSTRUCTIONS:
- ALWAYS prioritize information from the CONTEXT above. If the answer is in the context, use it directly.
- Answer naturally like a real college advisor would talk to a student.
- Be encouraging, helpful, and conversational.
- Keep responses concise but informative (2-4 sentences for simple questions, more for detailed ones).
- Use bullet points for lists.
- When suggesting to contact the college, ALWAYS include: Phone: 9488853917 / 9488863917, Mobile: 7373689294, Email: vpt384@yahoo.co.in
- DO NOT make up or fabricate any information that is not in the context. If the context doesn't have specific data, say you don't have that specific detail and direct them to the college office with the contact numbers above.
- For questions about the principal, chairman, or other staff, ALWAYS check the context first — these details are available in the college documents. Use the information from the context directly.
- For placement questions, mention VPTC's 100% placement record and list some recruiters from the context.
- For fee questions, mention fees are as per government norms and provide the contact details.

Answer the student's question:"""

        # 3. Get Response from Groq AI
        try:
            print(f"🤖 Calling Groq AI: {user_query[:50]}...")
            
            client = get_groq_client()
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Fast, powerful, and free!
                messages=[
                    {"role": "system", "content": "You are a helpful AI advisor for Vignesh Polytechnic College (VPTC), Tiruvannamalai. Always prioritize the provided context data in your answers. Be friendly, accurate, and conversational. Never fabricate information not present in the context. The context contains verified details about the principal, chairman, courses, placements, and more — use them directly. When information is unavailable, direct users to the college office: Phone 9488853917/9488863917, Email vpt384@yahoo.co.in."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500,
                top_p=0.9
            )
            
            answer = response.choices[0].message.content
            sources = ["College Documents"] if relevant_docs else ["General Knowledge"]
            
            print(f"✅ Groq responded successfully!")
            
        except Exception as e:
            print(f"❌ Groq AI Error: {e}")
            
            # Intelligent fallback if API fails
            query_lower = user_query.lower()
            
            if any(word in query_lower for word in ['course', 'program', 'diploma', 'branch']):
                answer = """Vignesh Polytechnic College offers the following 3-year Diploma courses:

• **Civil Engineering**
• **Mechanical Engineering**
• **Electrical & Electronics Engineering (EEE)**
• **Electronics & Communication Engineering (ECE)**
• **Computer Science Engineering**

Lateral entry options are available for direct admission to the 2nd year. Which one are you interested in?"""

            elif any(word in query_lower for word in ['fee', 'fees', 'cost']):
                answer = """**Fee Structure:**

• Tuition fees are collected as per the norms fixed by the **Government of Tamil Nadu**.
• Scholarships are available for SC/ST and eligible students.

For exact fee details, you can download the fee structure PDF from the official website or contact the college office at **9488853917 or 9488863917**."""


            elif any(word in query_lower for word in ['exam', 'test']):
                answer = """**Exam System:**

• 6 semesters over 3 years
• Internal (30%) + Final exam (70%)
• Minimum 35% to pass
• Results within 4-6 weeks

Study regularly! 📚"""

            elif any(word in query_lower for word in ['admission', 'apply']):
                answer = """**Admission Process:**

**Eligibility**: Pass in SSLC (10th) or equivalent. **No Age Limit.**
**Location**: Melputhiyandal Village, Manalurpet Road, Tiruvannamalai - 606603.

**Documents Required**:
• 10th Mark Sheet
• Transfer Certificate (TC)
• Community Certificate
• Passport Size Photos
• Conduct Certificate

**Contact**: 9488853917 / 7373689294
**Email**: vpt384@yahoo.co.in

Please visit the campus with your Parent/Guardian for admission!"""

            else:
                answer = f"""I'd love to help with "{user_query}"!

I can provide info about:
• 📚 Courses & Programs
• 💰 Fees & Scholarships  
• 📝 Admissions
• 📊 Exams
• 🏫 Facilities

What would you like to know?"""
            
            sources = ["VPTC Knowledge Base"]

        return {
            "answer": answer,
            "sources": sources
        }

rag_service = RAGService()
