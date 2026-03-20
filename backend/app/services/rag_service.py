from app.services.vector_store import vector_store
from app.core.config import settings
from app.services.groq_client import get_groq_client
import os

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
- Answer naturally, helpfully, and concisely like a real college advisor. 
- For casual greetings (e.g., "hi", "hello"), just respond warmly and briefly asking how you can help. DO NOT paste contact info for greetings.
- ALWAYS prioritize information from the CONTEXT above. If the answer is in the context, use it directly.
- Keep responses concise (1-3 sentences for simple questions). Use bullet points for lists.
- DO NOT fabricate information. If a user asks a specific college-related question that is NOT in the context, ONLY THEN say you don't have that detail and provide the contact info: Phone: 9488853917 / 9488863917, Mobile: 7373689294, Email: vpt384@yahoo.co.in.
- Do not proactively offer contact information unless the database doesn't have the answer or the user asks to speak to a human/office.

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
