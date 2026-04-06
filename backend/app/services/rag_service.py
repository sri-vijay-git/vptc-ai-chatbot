from app.services.vector_store import vector_store
from app.core.config import settings
from app.services.groq_client import get_groq_client
import os

# -----------------------------------------------------------------------
# Hardcoded seed knowledge — RAM-friendly fallback (~2KB plain text).
# Injected when DB vector/keyword search returns zero results.
# -----------------------------------------------------------------------
SEED_KNOWLEDGE = """
=== VPTC Core Facts (Complete Knowledge Base) ===

INSTITUTION: Vignesh Polytechnic College (VPTC), Tiruvannamalai, Tamil Nadu.
ESTABLISHED: 1995. Started with 3 departments, now offers 5 diploma engineering courses.
INSTITUTION TYPE: Private, self-financed, co-education polytechnic college.
ADDRESS: Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu – 606603.
PHONE: 9488853917 / 9488863917 | MOBILE: 7373689294 | EMAIL: vpt384@yahoo.co.in
WEBSITE: https://vigneshpolytechniccollege.com
AICTE PERMANENT ID: 1-454848061
AICTE APPROVED: Yes. All courses approved by AICTE from 1995 to current 2024-2025 academic year.
AFFILIATING UNIVERSITY: Directorate of Technical Education (DTE), Tamil Nadu, Guindy, Chennai – 25. Website: www.dte.tn.gov.in
NEAREST RAILWAY STATION: Tiruvannamalai Railway Station.
NEAREST AIRPORT: Meenambakkam Airport, Chennai.
TOTAL 1ST YEAR INTAKE: 360 students.

MANAGING TRUST: Sree Selvavinayagar Trust, #262, Sesathri Madam Street, Tiruvannamalai - 606603.
Trust Email: sreeselvavinyagart@gmail.com

PRINCIPAL: Mr. Sarvesan D (M.Tech., Electronics & Communication Engineering). Phone: 9865854918 | Email: sdsarvesantvm@rediffmail.com
VICE PRINCIPAL: Mrs. Sujatha H (M.E.)
CHAIRMAN: Thiru R. Kuppusamy (Mani) — Chairman of Sree Selvavinayagar Trust which manages VPTC.
NOTE: There is NO individual founder named "Vignesh" — the college is named after the Sree Selvavinayagar Trust. The college was founded and is managed by the Trust, not by any person named Vignesh.

DEPARTMENTS, HODs & KEY FACULTY (5 Departments):
- Civil Engineering:
    HOD: Mr. S. Subash (ME. Civil, 15 years experience).
    Key Faculty: Ms. S. Savithiri (BE. Civil).
    Labs: Material Testing Lab, Surveying Lab, CAD in Civil Lab, Construction Practical Lab, Hydraulics & Plumbing Lab.

- Mechanical Engineering:
    HOD: Mr. Kumaran (ME. Mechanical, 20 years experience).
    Key Faculty: Mr. R. Ilaiyabharathi (BE. Mechanical), Mr. V. Vinoth (BE. Mechanical).
    Labs: Fluid Mechanics Lab, Material Testing Lab, Thermal Engineering Lab, Special Machines Lab, Automobile Lab, AutoCAD Lab, CAD/CAM Lab. Has a CNC machine.

- Electrical & Electronics Engineering (EEE):
    HOD: Mr. M. Anbalagan (ME. EEE, 20 years experience).
    Key Faculty: Mr. R. Anbalagan (BE. EEE), Mr. V. Kannan (ME. EEE).
    Labs: Electrical Circuits Lab, Electronics Devices Lab, Electrical Machines Lab, Digital Electronics Lab, Micro Controller Lab, Wiring & Winding Lab, Power Electronics Lab.

- Electronics & Communication Engineering (ECE):
    HOD: Mrs. H. Sujatha (ME. ECE).
    Key Faculty: Mrs. Thilagam (BE. ECE).
    Labs: Electronic Devices Lab, Electrical Circuits Lab, Linear Integrated Circuits Lab, Communication Systems Lab, Micro-controllers Lab, VLSI Lab, Embedded Systems Lab, Simulation Lab.

- Computer Science Engineering (CSE):
    HOD: Mr. S. Saravanan (MCA).
    Key Faculty: Mrs. A. Abirami (MCA). Computer Lab Incharge: Ms. Santhi (BE. CSE).
    Labs: 3 Computer Labs with 200+ latest computers. Individual computers per student. Software: Linux, C, Java, Web Programming, RDBMS, .Net, Networking, Multimedia.

- System Admin: Mr. Elango.

COURSES OFFERED (6 semesters / 3-year Diploma):
1. Civil Engineering
2. Mechanical Engineering
3. Electrical & Electronics Engineering (EEE)
4. Electronics & Communication Engineering (ECE)
5. Computer Science Engineering (CSE)

ADMISSION:
- Eligibility: Pass in SSLC (10th standard) or equivalent. NO AGE LIMIT.
- Documents Required: 10th Mark Sheet, Transfer Certificate (TC), Conduct Certificate, Community Certificate, Passport Photos. Parent/Guardian must accompany the student.
- Lateral Entry (Direct 2nd Year): Open to ITI graduates (2-year ITI after 10th), +2 Vocational stream, and +2 Academic stream students.
- Out-of-State Students: Additional documents — Migration Certificate & Certificate of Permanent Residence.
- Application Forms: Download at https://vigneshpolytechniccollege.com
- Online Admission Registration: Available on website.
- Anti-Ragging: Strictly prohibited. Zero-tolerance policy per AICTE regulations.

FEES (ALL DEPARTMENTS — CSE, ECE, EEE, MECHANICAL, CIVIL):
- Annual Fee: Rs.42,000 per year for ALL departments. No difference between departments.
- 1st Semester (Odd): Rs.20,000 | 2nd Semester (Even): Rs.22,000
- SC/ST Students: Rs.35,000 per year. 1st Semester: Rs.15,000. 2nd Semester: Rs.22,500 (Rs.2,500 returned as pocket money).
- Admission Fee (one-time): Rs.100 | Exam Fee: Rs.750/semester | Lab Fee: Rs.20/semester
- Transport is INCLUDED in the Rs.42,000 annual fee. No separate transport charge.
- Scholarship: Aadidravidar Scholarship — submit Income Certificate + Community Certificate + scholarship form at admission time.
- Payment options: Lump sum or semester-wise installments.

EXAM SYSTEM:
- 6 semesters over 3 years (3 years = 6 semesters).
- Internal Assessment: 30% | Final Exam: 70%.
- Minimum pass marks: 35%.
- Diploma students can join B.E. through Lateral Entry (direct 2nd year of B.E.) after completing diploma.

CAMPUS FACILITIES:
- Library: 21,000 volumes, 20 reference books, internet facility, capacity 30+ students.
- Sports: Football, Volleyball, Badminton, Kho-kho, Kabaddi (outdoor). Chess, Carrom (indoor).
- Hostel: Available for boys and girls separately.
- Transport: College bus service from Tiruvannamalai city. Included in annual fee.
- Canteen: Available on campus.
- NSS: Two units, 7-day annual camp, village adoption, medical/blood donation camps.
- ISTE: Student chapter active for 10+ years. Membership fee: Rs.150.
- Red Ribbon Club: AIDS awareness & personality development.

STUDENT ASSOCIATIONS:
- Every department has an active Students' Association.
- Annual Technical Symposium — open to all Polytechnic College students across Tamil Nadu.
- NSS (National Service Scheme) — Two units, social service activities.
- ISTE (Indian Society for Technical Education) — Technical seminars, guest lectures, career guidance.
- Red Ribbon Club — Youth awareness, AIDS awareness.

COMMITTEES:
- Anti-Ragging Committee: Zero tolerance for ragging.
- Grievance Redressal Committee (GRC): For academic and non-academic grievances.
- Internal Complaint Committee (ICC): For internal concerns.
- SC/ST Committee: For preventing discrimination.

PLACEMENTS:
- Placement Cell operated by Administrative Officer (AO).
- Placement Officer: Mr. Raja.
- Placement Percentage: 100% (for students who opt for placement).
- Annual Mega Job Mela since 1995 — open to students from other institutions too.
- Key Recruiters: Sundaram Fasteners, Brakes India Ltd, Lucas-TVS, India Nippon Electrical Ltd, Super Auto Forge, TVS-Sundaram Fasteners, Thai Summit Neel, Borg Warner, IFB, Sakthi Auto Components, Customised Technologies Bangalore, Avlon Technologies Chennai, TRR Automotive, Annaie Informations, and many more.

COLLEGE OFFICE HOURS: Monday to Friday. For appointments: call 7373689294.
"""


class RAGService:
    def generate_response(self, user_query: str, user: dict = None) -> dict:
        """
        RAG flow with REAL Groq AI - Fast & Free!
        """
        
        # 1. Retrieve Context from Vector Store (vector + keyword fallback)
        context_source = "College Documents + Seed Knowledge"
        try:
            relevant_docs = vector_store.search(user_query, n_results=5)
            context = SEED_KNOWLEDGE + "\n\n=== RELEVANT DOCUMENTS ===\n"
            if relevant_docs:
                context += "\n---\n".join(relevant_docs)
            else:
                context += "No additional documents found."
        except Exception as e:
            print(f"Vector store error: {e}")
            context = SEED_KNOWLEDGE
            context_source = "Seed Knowledge"

        # 2. Build Conversational Prompt
        prompt = f"""You are a friendly and knowledgeable AI assistant for Vignesh Polytechnic College (VPTC), Tiruvannamalai.

CONTEXT FROM COLLEGE KNOWLEDGE BASE:
{context}

STUDENT QUESTION: {user_query}

INSTRUCTIONS:
- ALWAYS use the CONTEXT above to answer. It contains verified facts about VPTC.
- For greetings like "hi" or "hello", respond warmly without pasting contact info.
- Be concise: 1-3 sentences for simple questions. Use bullet points for lists.
- If question asks about principal, HODs, courses, fees, admission - answer directly from the CONTEXT.
- Only say you don't know if the specific detail is truly absent from the context AND the seed knowledge.
- NEVER fabricate names, numbers, or facts not in the context.
- If genuinely unknown, share contact: Phone 9488853917 / 9488863917, Email: vpt384@yahoo.co.in

Answer concisely:"""

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
            sources = ["College Documents"] if context_source == "College Documents" else ["General Knowledge"]
            
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

                answer = """**Fee Structure (All Departments - CSE, ECE, EEE, Mechanical, Civil):**

• **Annual Fee: ₹42,000/year** (same for all departments)
• 1st Semester (Odd): **₹20,000** | 2nd Semester (Even): **₹22,000**
• **SC/ST Students: ₹35,000/year** — 1st Sem: ₹15,000 | 2nd Sem: ₹22,500 (₹2,500 returned as pocket money)
• Admission Fee (one-time): ₹100 | Exam Fee: ₹750/semester | Lab Fee: ₹20/semester
• Transport included in fees. Payment: Lump sum or semester-wise."""


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

        # Log Interaction to Database
        try:
            from app.core.database import supabase
            user_id = user["id"] if user else None
            user_email = user["email"] if user else "Guest"
            status = "Pending Data" if "contact the college office" in answer else "Resolved"
            
            supabase.table("chat_logs").insert({
                "user_id": user_id,
                "user_email": user_email,
                "query": user_query,
                "response": answer,
                "status": status
            }).execute()
        except Exception as e:
            print(f"Error logging chat to Supabase: {e}")

        return {
            "answer": answer,
            "sources": sources
        }

rag_service = RAGService()
