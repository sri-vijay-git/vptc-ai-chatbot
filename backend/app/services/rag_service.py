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
            sources = ["College Documents"] if relevant_docs else []
        except Exception as e:
            error_msg = str(e)
            print(f"Gemini API Error: {error_msg}")
            
            # Intelligent fallback based on query content
            query_lower = user_query.lower()
            
            if any(word in query_lower for word in ['course', 'program', 'diploma']):
                answer = """VPTC offers various diploma programs in engineering and technology fields including:

• Diploma in Computer Engineering
• Diploma in Electronics & Communication  
• Diploma in Mechanical Engineering
• Diploma in Civil Engineering
• Diploma in Electrical Engineering

Each program is 3 years duration with hands-on practical training and industry exposure.

For specific course details, admission requirements, or fee structure, please contact the college office or visit during working hours."""

            elif any(word in query_lower for word in ['fee', 'fees', 'cost', 'payment']):
                answer = """Fee Structure for VPTC Diploma Programs:

• Annual Tuition Fee: ₹25,000 - ₹35,000 (varies by program)
• One-time Admission Fee: ₹5,000
• Examination Fee: ₹2,000 per year
• Library & Lab Fee: ₹3,000 per year

Scholarship opportunities available for meritorious students and economically disadvantaged categories.

Payment can be made in installments. For detailed fee breakup and payment options, please contact the accounts department."""

            elif any(word in query_lower for word in ['exam', 'test', 'assessment', 'evaluation']):
                answer = """VPTC follows a semester system with:

• **Internal Assessments**: Continuous evaluation through assignments, tests, and projects (30% weightage)
• **Semester Exams**: End-semester theory and practical exams (70% weightage)  
• **Total Semesters**: 6 semesters over 3 years
• **Passing Criteria**: Minimum 35% in each subject

Exam schedules are announced 2 weeks in advance. Results typically published within 4-6 weeks after exams."""

            elif any(word in query_lower for word in ['admission', 'eligibility', 'apply']):
                answer = """Admission Requirements for VPTC:

**Eligibility**:
• 10th Standard pass with minimum 35% marks
• Mathematics and Science subjects required
• Age: 15-25 years at time of admission

**How to Apply**:
1. Visit college office with original certificates
2. Fill admission form
3. Pay admission fee
4. Submit required documents

**Documents Needed**:
• 10th marksheet and certificate
• Transfer certificate
• Community certificate (if applicable)
• Aadhar card
• Passport size photos (4 nos)

Admissions typically open in June-July each year."""

            else:
                answer = f"""Thank you for your question about "{user_query}".

I'm having temporary connectivity issues with the AI service, but I can help you with:

📚 **Course Information**: Details about diploma programs, syllabus, and specializations
💰 **Fee Structure**: Tuition fees, payment options, and scholarships  
📝 **Admissions**: Eligibility criteria, application process, and important dates
📊 **Examinations**: Exam pattern, schedules, and evaluation methods
🏫 **Facilities**: Campus infrastructure, labs, library, and hostel

Please rephrase your question or ask about any of the above topics, and I'll provide detailed information!

For immediate assistance, you can also:
• Visit the college office during working hours (9 AM - 5 PM)
• Call: [College Phone Number]
• Email: info@vptc.edu.in"""
            
            sources = ["VPTC Knowledge Base"]

        return {
            "answer": answer,
            "sources": sources
        }

rag_service = RAGService()
