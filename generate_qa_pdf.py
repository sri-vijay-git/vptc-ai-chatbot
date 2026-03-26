"""
Generate a Q&A-structured PDF for VPTC knowledge base.
Q&A format embeds much better in vector DBs than paragraphs.
Run: python generate_qa_pdf.py
"""
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
import os

OUTPUT = os.path.join("backend", "data", "documents", "VPTC_Complete_KnowledgeBase.pdf")
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

doc = SimpleDocTemplate(OUTPUT, pagesize=A4,
                        rightMargin=20*mm, leftMargin=20*mm,
                        topMargin=20*mm, bottomMargin=20*mm)

styles = getSampleStyleSheet()
title_style = ParagraphStyle("Title", parent=styles["Title"],
                             fontSize=18, spaceAfter=6, textColor=colors.HexColor("#1a237e"))
h1_style = ParagraphStyle("H1", parent=styles["Heading1"],
                           fontSize=14, spaceBefore=12, spaceAfter=4,
                           textColor=colors.HexColor("#283593"), borderPad=4)
q_style = ParagraphStyle("Q", parent=styles["Normal"],
                          fontSize=10, spaceBefore=8, spaceAfter=2,
                          textColor=colors.HexColor("#1b5e20"), fontName="Helvetica-Bold")
a_style = ParagraphStyle("A", parent=styles["Normal"],
                          fontSize=10, spaceBefore=2, spaceAfter=6,
                          leftIndent=12)

story = []

def h1(text):
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(text, h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#3949ab")))
    story.append(Spacer(1, 2*mm))

def qa(q, a):
    story.append(Paragraph(f"Q: {q}", q_style))
    story.append(Paragraph(f"A: {a}", a_style))

# ─── Title ────────────────────────────────────────────────────────────────────
story.append(Paragraph("Vignesh Polytechnic College (VPTC) — Complete Knowledge Base", title_style))
story.append(Paragraph("Tiruvannamalai, Tamil Nadu | Q&A Format Knowledge Base for AI Chatbot", styles["Normal"]))
story.append(Spacer(1, 6*mm))

# ─── Section 1: Institution Overview ─────────────────────────────────────────
h1("1. Institution Overview")
qa("What is the full name of the college?",
   "Vignesh Polytechnic College, commonly known as VPTC.")
qa("Where is VPTC located?",
   "VPTC is located at Melputhiyandal Village, Manalurpet Road, Tiruvannamalai - 606603, Tamil Nadu, India.")
qa("What type of institution is VPTC?",
   "VPTC is a Government-aided Polytechnic College affiliated with the Directorate of Technical Education (DOTE), Tamil Nadu.")
qa("What are the contact details of VPTC?",
   "Phone: 9488853917 / 9488863917 | Mobile: 7373689294 | Email: vpt384@yahoo.co.in")
qa("Who founded VPTC?",
   "VPTC was founded by Vignesh, who also serves as the Chairman of the college.")

# ─── Section 2: Key Personnel ─────────────────────────────────────────────────
h1("2. Key Personnel — Principal, Chairman, and HODs")
qa("Who is the principal of VPTC?",
   "The principal of VPTC is Sarvesan D.")
qa("Who is the chairman of VPTC?",
   "The chairman of VPTC is Vignesh, the founder of the institution.")
qa("Who is the HOD of Civil Engineering?",
   "The Head of Department (HOD) for Civil Engineering at VPTC is Karthikeyan A.")
qa("Who is the HOD of Mechanical Engineering?",
   "The Head of Department (HOD) for Mechanical Engineering at VPTC is Arunpandi R.")
qa("Who is the HOD of Electrical and Electronics Engineering (EEE)?",
   "The Head of Department (HOD) for EEE at VPTC is Anbalagan M.")
qa("Who is the HOD of Electronics and Communication Engineering (ECE)?",
   "The Head of Department (HOD) for ECE at VPTC is Elumalai K.")
qa("Who is the HOD of Computer Science Engineering?",
   "The Head of Department (HOD) for Computer Science Engineering (CSE) at VPTC is Saravanan S.")
qa("Who is the placement officer at VPTC?",
   "The placement officer at VPTC is Viknesh Kumar R.")

# ─── Section 3: Courses ───────────────────────────────────────────────────────
h1("3. Courses Offered")
qa("What courses are offered at VPTC?",
   "VPTC offers 5 three-year Diploma Engineering courses: (1) Civil Engineering, (2) Mechanical Engineering, (3) Electrical & Electronics Engineering (EEE), (4) Electronics & Communication Engineering (ECE), (5) Computer Science Engineering (CSE).")
qa("How many years is the Diploma course at VPTC?",
   "The Diploma Engineering course at VPTC is 3 years (6 semesters).")
qa("Does VPTC offer Computer Science?",
   "Yes, VPTC offers a 3-year Diploma in Computer Science Engineering (CSE). HOD: Saravanan S.")
qa("Does VPTC offer Civil Engineering?",
   "Yes, VPTC offers a 3-year Diploma in Civil Engineering. HOD: Karthikeyan A.")
qa("Does VPTC offer Mechanical Engineering?",
   "Yes, VPTC offers a 3-year Diploma in Mechanical Engineering. HOD: Arunpandi R.")
qa("Does VPTC offer EEE or Electrical Engineering?",
   "Yes, VPTC offers Electrical & Electronics Engineering (EEE). HOD: Anbalagan M.")
qa("Does VPTC offer ECE?",
   "Yes, VPTC offers Electronics & Communication Engineering (ECE). HOD: Elumalai K.")

# ─── Section 4: Admission ─────────────────────────────────────────────────────
h1("4. Admission Details")
qa("What is the eligibility for admission to VPTC?",
   "Applicants must have passed SSLC (Class 10) or equivalent from a recognized board. There is no age limit for admission.")
qa("What documents are required for VPTC admission?",
   "Required documents: 10th Mark Sheet, Transfer Certificate (TC), Community Certificate, Conduct Certificate, and Passport-size Photographs.")
qa("Is lateral entry available at VPTC?",
   "Yes. ITI (Industrial Training Institute) holders can seek direct admission to the 2nd year of the Diploma course through lateral entry.")
qa("How do I apply to VPTC?",
   "Applications can be submitted through the Tamil Nadu Engineering Admissions (TNEA) Single Window Counselling portal or directly at the college office.")
qa("Is there a management quota at VPTC?",
   "Yes, some seats are available under management quota. Contact the college office for details: 9488853917.")

# ─── Section 5: Fees ─────────────────────────────────────────────────────────
h1("5. Fees and Scholarships")
qa("What are the fees at VPTC?",
   "Fees are governed by the Government of Tamil Nadu norms. As a government-aided institution, fees are subsidized and affordable.")
qa("Are scholarships available at VPTC?",
   "Yes. Scholarships are available for SC/ST students, BC/MBC students, and economically backward students through Tamil Nadu government schemes. Post-matric scholarships are also available.")
qa("Is there a free education scheme at VPTC?",
   "Yes. First-generation graduates from economically weaker sections may be eligible for full fee concessions under government schemes.")

# ─── Section 6: Examination & Results ────────────────────────────────────────
h1("6. Examination System")
qa("How are exams conducted at VPTC?",
   "VPTC follows the DOTE Tamil Nadu examination system. Each semester has internal assessments (30%) and final board exams (70%). Minimum pass mark is 35%.")
qa("How many semesters are there in the Diploma course?",
   "There are 6 semesters in the 3-year Diploma Engineering programme at VPTC.")
qa("When are semester exams held at VPTC?",
   "Semester exams are conducted twice a year — typically in April/May and October/November — as per the DOTE schedule.")

# ─── Section 7: Campus Facilities ────────────────────────────────────────────
h1("7. Campus Facilities")
qa("What facilities are available on the VPTC campus?",
   "VPTC campus has: Library, Computer Lab, Mechanical Workshop, Civil Surveying Lab, Electronics Lab, Canteen, Sports Ground, NSS & NCC units.")
qa("Does VPTC have a hostel?",
   "Yes. VPTC provides separate hostel facilities for boys and girls.")
qa("Is there a transport facility at VPTC?",
   "Yes. VPTC operates college buses from Tiruvannamalai city and surrounding areas for student convenience.")
qa("Does VPTC have a library?",
   "Yes. VPTC has a well-stocked library with technical books, journals, and digital resources for all departments.")
qa("Does VPTC have NCC or NSS?",
   "Yes. VPTC has both NSS (National Service Scheme) and NCC (National Cadet Corps) units for students.")

# ─── Section 8: Placements ────────────────────────────────────────────────────
h1("8. Placements and Career")
qa("Does VPTC have a placement cell?",
   "Yes. VPTC has an active Training and Placement cell. Placement Officer: Viknesh Kumar R.")
qa("Which companies recruit from VPTC?",
   "Students from VPTC have been placed in companies including DALMIA Cement, TATA group companies, L&T (Larsen & Toubro), and various local industries in Tamil Nadu.")
qa("What is the placement record of VPTC?",
   "VPTC maintains a consistently good placement record, with students being placed in industries related to their respective departments. The placement cell also conducts career guidance and soft skills training.")
qa("Does VPTC help with job preparation?",
   "Yes. VPTC conducts mock interviews, aptitude training, resume building workshops, and invites companies for on-campus recruitment drives.")

# ─── Section 9: Faculty ───────────────────────────────────────────────────────
h1("9. Faculty and Staff")
qa("Who are the faculty in the EEE department?",
   "EEE Department: HOD – Anbalagan M., Faculty – Anbalagan R., Kannan V., and other supporting staff.")
qa("Who are the faculty in the CSE department?",
   "CSE Department: HOD – Saravanan S., and supporting faculty members teaching programming, networks, data structures, and computer fundamentals.")
qa("Who are the faculty in the Civil Engineering department?",
   "Civil Engineering Department: HOD – Karthikeyan A., and faculty specializing in structural engineering, surveying, and construction materials.")
qa("Who are the faculty in the Mechanical Engineering department?",
   "Mechanical Engineering Department: HOD – Arunpandi R., and faculty specializing in thermodynamics, manufacturing, and machine design.")
qa("Who are the faculty in the ECE department?",
   "ECE Department: HOD – Elumalai K., and faculty specializing in communication systems, digital electronics, and signal processing.")

# ─── Section 10: General FAQ ──────────────────────────────────────────────────
h1("10. General FAQ")
qa("Is VPTC a government or private college?",
   "VPTC is a Government-aided private Polytechnic College. It receives government funding and follows Tamil Nadu Government norms.")
qa("Is VPTC approved by AICTE?",
   "Yes. VPTC is approved by the All India Council for Technical Education (AICTE) and affiliated with DOTE Tamil Nadu.")
qa("What is the medium of instruction at VPTC?",
   "The medium of instruction is Tamil and English.")
qa("How can I contact VPTC for more information?",
   "You can contact VPTC at: Phone: 9488853917 / 9488863917, Mobile: 7373689294, Email: vpt384@yahoo.co.in, Address: Melputhiyandal Village, Manalurpet Road, Tiruvannamalai - 606603, Tamil Nadu.")
qa("Can I visit VPTC campus for enquiry?",
   "Yes. The college office is open on all working days. You may visit directly or call 9488853917 to schedule a visit.")
qa("What is the vision of VPTC?",
   "VPTC's vision is to provide quality technical education that equips students with practical skills and professional values to meet industry standards.")

doc.build(story)
print(f"✅ Q&A PDF generated: {OUTPUT}")
print("Now upload this from Admin Dashboard → Knowledge Base")
