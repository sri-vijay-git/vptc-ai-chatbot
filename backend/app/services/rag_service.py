import google.generativeai as genai
from app.services.vector_store import vector_store
from app.core.config import settings
import os

# Configure Gemini with explicit API setup
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or settings.GOOGLE_API_KEY
genai.configure(api_key=GOOGLE_API_KEY)

# Use the models/ prefix which is more stable
model = genai.GenerativeModel('models/gemini-pro')

class RAGService:
    def generate_response(self, user_query: str) -> dict:
        """
        Orchestrates the RAG flow with real Gemini AI
        """
        
        # 1. Retrieve Context
        try:
            relevant_docs = vector_store.search(user_query, n_results=3)
            context = "\n".join(relevant_docs) if relevant_docs else "No specific college documents found."
        except Exception as e:
            print(f"Vector store error: {e}")
            context = "General college knowledge"

        # 2. Build Prompt
        prompt = f"""You are a helpful AI assistant for Vignesh Polytechnic College (VPTC).

CONTEXT FROM COLLEGE DOCUMENTS:
{context}

STUDENT QUESTION: {user_query}

INSTRUCTIONS:
- Answer in a friendly, conversational tone like a real college advisor
- Use the context above if relevant
- If the answer isn't in the context, use your general knowledge about polytechnic colleges in India
- Keep responses concise but informative
- Use bullet points for lists
- Be encouraging and helpful

Answer the student's question naturally:"""

        # 3. Generate Response with Gemini AI
        try:
            print(f"🤖 Calling Gemini API with query: {user_query[:50]}...")
            response = model.generate_content(prompt)
            answer = response.text
            sources = ["College Documents"] if relevant_docs else ["General Knowledge"]
            print(f"✅ Gemini responded successfully!")
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Gemini API Error: {error_msg}")
            
            # Try alternative model names
            alternative_models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro-latest']
            
            for alt_model in alternative_models:
                try:
                    print(f"🔄 Trying alternative model: {alt_model}")
                    alt = genai.GenerativeModel(alt_model)
                    response = alt.generate_content(prompt)
                    answer = response.text
                    sources = ["College Documents"] if relevant_docs else ["General Knowledge"]
                    print(f"✅ Success with {alt_model}!")
                    break
                except:
                    continue
            else:
                # All models failed - provide intelligent fallback
                query_lower = user_query.lower()
                
                if any(word in query_lower for word in ['course', 'program', 'diploma']):
                    answer = """VPTC offers various diploma programs:

• **Computer Engineering** - Software development, programming, networking
• **Electronics & Communication** - Digital systems, telecommunications, embedded systems
• **Mechanical Engineering** - Manufacturing, CAD/CAM, thermodynamics
• **Civil Engineering** - Construction, surveying, structural design
• **Electrical Engineering** - Power systems, control systems, electrical machines

Each is a 3-year program with practical labs and industry training. Which program interests you?"""

                elif any(word in query_lower for word in ['fee', 'fees', 'cost']):
                    answer = """**Fee Structure** (approximate):

• Tuition: ₹25,000-35,000/year
• Admission: ₹5,000 (one-time)
• Exam fees: ₹2,000/year
• Lab & Library: ₹3,000/year

Total: Around ₹35,000-45,000 per year

Scholarships available for SC/ST and merit students. Payment plans accepted!"""

                elif any(word in query_lower for word in ['exam', 'test', 'assessment']):
                    answer = """**Examination System**:

• 6 semesters over 3 years
• Each semester: Internal (30%) + Final exam (70%)
• Practical exams for lab subjects
• Minimum 35% to pass each subject
• Results usually within 4-6 weeks

Exam dates announced 2 weeks in advance. Study regularly!"""

                elif any(word in query_lower for word in ['admission', 'apply', 'join']):
                    answer = """**How to Apply**:

**Eligibility**: 10th pass with 35%+ marks

**Documents needed**:
• 10th marksheet & certificate
• Transfer certificate
• Community/income certificate
• Aadhar card
• Photos (4 nos)

**Process**:
1. Visit college office
2. Fill application form
3. Submit documents
4. Pay admission fee

Admissions start in June! Any specific questions?"""

                else:
                    answer = f"""I'd be happy to help you with "{user_query}"!

I can provide information about:
• 📚 Courses & Programs
• 💰 Fees & Scholarships
• 📝 Admissions Process
• 📊 Exams & Grading
• 🏫 Campus Facilities

What would you like to know more about?"""
                
                sources = ["VPTC Knowledge Base"]

        return {
            "answer": answer,
            "sources": sources
        }

rag_service = RAGService()
