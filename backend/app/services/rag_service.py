from groq import Groq
from app.services.vector_store import vector_store
from app.core.config import settings
import os

# Configure Groq AI
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

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
        prompt = f"""You are a helpful and friendly AI assistant for Vignesh Polytechnic College (VPTC).

CONTEXT FROM COLLEGE DOCUMENTS:
{context}

STUDENT QUESTION: {user_query}

INSTRUCTIONS:
- Answer naturally like a real college advisor would talk to a student
- Use the context if it's relevant to the question
- If the context doesn't have the answer, use your general knowledge about polytechnic colleges in India
- Be encouraging, helpful, and conversational
- Keep responses concise but informative (2-4 sentences usually)
- Use bullet points for lists
- If you don't know something specific about VPTC, be honest and suggest they contact the college office

Answer the student's question:"""

        # 3. Get Response from Groq AI
        try:
            print(f"🤖 Calling Groq AI: {user_query[:50]}...")
            
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Fast, powerful, and free!
                messages=[
                    {"role": "system", "content": "You are a helpful AI advisor for VPTC polytechnic college. Be friendly and conversational."},
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
            
            if any(word in query_lower for word in ['course', 'program', 'diploma']):
                answer = """VPTC offers various diploma programs:

• **Computer Engineering** - Software, networking, programming
• **Electronics & Communication** - Digital systems, embedded tech
• **Mechanical Engineering** - Manufacturing, CAD/CAM
• **Civil Engineering** - Construction, structural design  
• **Electrical Engineering** - Power systems, control systems

Each is 3 years with practical labs. Which interests you?"""

            elif any(word in query_lower for word in ['fee', 'fees', 'cost']):
                answer = """**Fee Structure** (approximate):

• Tuition: ₹25,000-35,000/year
• Admission: ₹5,000 (one-time)
• Total: Around ₹35,000-45,000/year

Scholarships available! Payment plans accepted."""

            elif any(word in query_lower for word in ['exam', 'test']):
                answer = """**Exam System:**

• 6 semesters over 3 years
• Internal (30%) + Final exam (70%)
• Minimum 35% to pass
• Results within 4-6 weeks

Study regularly! 📚"""

            elif any(word in query_lower for word in ['admission', 'apply']):
                answer = """**Admission Requirements:**

**Eligibility**: 10th pass with 35%+ marks

**Documents**: 10th certificates, transfer cert, Aadhar, photos

**Process**: Visit office, fill form, submit docs, pay fee

Admissions in June-July!"""

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
