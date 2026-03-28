import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

os.chdir(r'd:\Final project\vptc-ai-chatbot')

pdf_path = r'backend\data\documents\VPTC_Complete_KnowledgeBase.pdf'
doc = SimpleDocTemplate(pdf_path, pagesize=letter,
                        rightMargin=72, leftMargin=72,
                        topMargin=72, bottomMargin=18)

styles = getSampleStyleSheet()

# Custom Styles
title_style = ParagraphStyle(
    'TitleStyle',
    parent=styles['Heading1'],
    fontSize=18,
    textColor=colors.HexColor('#214D82'),
    alignment=1, # Center
    spaceAfter=6
)
subtitle_style = ParagraphStyle(
    'SubtitleStyle',
    parent=styles['Normal'],
    fontSize=11,
    textColor=colors.gray,
    alignment=1,
    spaceAfter=20
)
h1_style = ParagraphStyle(
    'H1Style',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=colors.white,
    backColor=colors.HexColor('#214D82'),
    spaceBefore=15,
    spaceAfter=10,
    leftIndent=5,
    rightIndent=5,
)
h2_style = ParagraphStyle(
    'H2Style',
    parent=styles['Heading3'],
    fontSize=12,
    textColor=colors.HexColor('#214D82'),
    spaceBefore=10,
    spaceAfter=5
)
body_style = ParagraphStyle(
    'BodyStyle',
    parent=styles['Normal'],
    fontSize=10,
    spaceAfter=6,
    leading=14
)
bullet_style = ParagraphStyle(
    'BulletStyle',
    parent=styles['Normal'],
    fontSize=10,
    leftIndent=20,
    spaceAfter=4,
    leading=14,
    bulletIndent=10
)

Story = []

def add_title(text):
    Story.append(Paragraph(text, title_style))
def add_subtitle(text):
    Story.append(Paragraph(text, subtitle_style))
def add_h1(text):
    Story.append(Paragraph(text, h1_style))
def add_h2(text):
    Story.append(Paragraph(text, h2_style))
def add_body(text):
    Story.append(Paragraph(text, body_style))
def add_bullet(text):
    Story.append(Paragraph(text, bullet_style, bulletText='-'))
def add_kv(k, v):
    text = f"<b>{k}:</b> {v}"
    Story.append(Paragraph(text, body_style))

# Content
add_title("Vignesh Polytechnic College (VPTC)")
add_subtitle("Complete College Knowledge Base for AI Reference")

add_h1("1. General Information")
add_kv("Full Name", "Vignesh Polytechnic College (VPTC)")
add_kv("Established", "1995 - First institution under Sree Selvavinayagar Trust")
add_kv("Trust", "Sree Selvavinayagar Trust")
add_kv("Chairman", "Thiru R. Kuppusamy (alias Mani) - Founder and Chairman")
add_kv("Principal", "Sarvesan D. (M.Tech, Electronics and Communication Engineering)")
add_kv("Accreditation", "AICTE Approved, New Delhi (continuously since 1995)")
add_kv("Total Intake", "360 students per year")
add_kv("Website", "https://vigneshpolytechniccollege.com/")
add_kv("Location", "Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu - 606 603")
add_kv("Phone", "9488853917 / 9488863917")
add_kv("Mobile", "7373689294")
add_kv("Email", "vpt384@yahoo.co.in")

add_h1("2. Vision and Mission")
add_h2("Vision")
add_body("We at Vignesh Polytechnic College impart Futuristic Technical Education as per curriculum with due importance to Practical oriented training based on the needs of the industries. We with a team of dedicated staff instill high standards of discipline in our students making them technologically superior and ethically strong.")
add_h2("Mission")
add_body("Our mission is to provide quality Technical Education in a highly disciplined atmosphere with ethical and moral values to students from all over Tamil Nadu especially from local and rural areas. We provide individual attention, high quality education, practical training and character building.")

add_h1("3. Courses Offered (5 Diploma Programs - 3 Years / 6 Semesters)")
for i, c in enumerate(['Civil Engineering', 'Mechanical Engineering', 'Electrical and Electronics Engineering (EEE)', 'Electronics and Communication Engineering (ECE)', 'Computer Science Engineering'], 1):
    add_bullet(f"{i}. {c}")
add_body("All courses are 3-year Diploma programs with 6 semesters. Lateral entry (direct 2nd year admission) is available for HSC and ITI qualified candidates.")

add_h1("4. Admission Details")
add_h2("Eligibility")
add_bullet("NO AGE LIMIT for any admission.")
add_bullet("First Year (Semester 1): Pass SSLC (10th) or equivalent from Tamil Nadu Board.")
add_bullet("Lateral Entry (Direct 2nd Year): HSC Vocational/Academic stream pass OR 2-year ITI pass.")
add_bullet("Other state students must provide Migration Certificate and Permanent Residence Certificate.")

add_h2("Documents Required")
for d in ['10th Mark Sheet (SSLC)', 'Transfer Certificate (TC)', 'Community Certificate', 'Passport Size Photos (4 copies)', 'Conduct Certificate', 'Migration Certificate (other state students only)', 'Permanent Residence Certificate (other state only)']:
    add_bullet(d)

add_h2("How to Apply")
add_bullet("Online: https://vigneshpolytechniccollege.com/ (Online Admission Registration)")
add_bullet("Download application form from college website.")
add_bullet("In person: Visit campus with Parent/Guardian.")
add_bullet("Phone: 9488853917 / 9488863917 / 7373689294")
add_bullet("Email: vpt384@yahoo.co.in")

add_h1("5. Fees and Scholarships")
add_body("Tuition fees are fixed as per Government of Tamil Nadu norms. Fee structure: https://vigneshpolytechniccollege.com/wp-content/uploads/2024/06/fee24-25.pdf")
add_bullet("Government scholarships for SC/ST students per Tamil Nadu government norms.")
add_bullet("Other eligible category scholarships available. Contact college office for details.")

add_h1("6. Examination System")
for b in ['6 semesters over 3 years.', 'Internal Assessment (30%) + Final Semester Exam (70%).', 'Minimum 35% marks required to pass each subject.', 'Results typically within 4-6 weeks after exams.', 'Exams conducted by DOTE (Directorate of Technical Education), Tamil Nadu.']:
    add_bullet(b)

add_h1("7. Placement Cell and Career Services")
add_body("VPTC has maintained a steady record of 100% placements every year. A full-fledged Placement Cell manages placements for final year students. The college also organizes a Mega Job Mela for students from multiple institutions since 1995.")
add_h2("Companies that recruit from VPTC")
for r in ['Sundaram Fasteners (Autolec Division), Chennai', 'Customised Technologies, Bangalore', 'Brakes India Ltd (Padi and Sholingar)', 'Lucas-TVS, Puducherry', 'India Nippon Electrical Ltd, Puducherry', 'TVS-Sundaram Fasteners, Puducherry', 'Thai Summit Neel, Hosur', 'Borg Warner Cooling System Pvt Ltd, Chennai', 'Sakthi Auto Components, Erode', 'Steel Stripes Wheel India Ltd, Chennai', 'TRR Automotive, Tindivanam', 'Annaie Informations, Chennai (IT Roles)', 'Avlon Technologies, Chennai (IT Roles)', 'Customised Technologies, Bangalore (IT Roles)', 'And many more leading organizations across India']:
    add_bullet(r)

add_h1("8. Campus Facilities")
facilities = [
    ('Library', '300+ sq.m area, 16,500+ volumes, 2500 reference books, 9 newspapers, 65 magazines, internet and computer access, open access system, 200 visitors/day.'),
    ('Hostel', 'On-campus hostel with mess, strict study hours and games hours.'),
    ('Computer Center', 'Centralized AC computer center with internet and printer. 100 Mbps network. Internet cafe for 35 students simultaneously.'),
    ('Transport', '40+ km coverage across all routes in Tiruvannamalai including Tirukovilur, Polur, Vettavalam, Chengam, Thanipadi. Two-wheelers are NOT permitted - students must use college transport.'),
    ('WiFi', 'Campus-wide Wi-Fi connectivity.'),
    ('Canteen', 'On-campus canteen and bakery.'),
    ('Drinking Water', 'Portable RO purified drinking water throughout campus.'),
    ('Play Field', 'Dedicated outdoor sports and play field.'),
    ('Sanitation', 'Good sanitation facilities throughout campus.')
]
for name, desc in facilities:
    add_kv(name, desc)

add_h1("9. Frequently Asked Questions (FAQ)")
faqs = [
    ('Duration of diploma courses?', 'All diploma courses are 3-year programs with 6 semesters.'),
    ('Age limit for admission?', 'NO - there is absolutely NO AGE LIMIT for admission at VPTC.'),
    ('Can I join 2nd year directly?', 'Yes. Lateral entry is available for HSC (Vocational/Academic) pass and ITI qualified candidates.'),
    ('Are two-wheelers allowed on campus?', 'No. Students MUST use college transport. Two-wheelers are NOT permitted on campus.'),
    ('Is hostel facility available?', 'Yes, on-campus hostel with mess, study hours, and games hours is available.'),
    ('What is the placement record?', 'VPTC maintains a steady 100% placement record every year since 1995.'),
    ('Who is the Principal?', 'Sarvesan D. (M.Tech, Electronics and Communication Engineering). Contact via college office: 9488853917.'),
    ('Who is the Chairman?', 'Thiru R. Kuppusamy (alias Mani) - Founder and Chairman of Sree Selvavinayagar Trust.'),
    ('Is VPTC AICTE approved?', 'Yes. All courses are approved by AICTE, New Delhi. Continuously approved since 1995.'),
    ('How to apply for admission?', 'Apply online at college website, download form, or visit campus in person with Parent/Guardian. Call: 9488853917 / 7373689294.'),
    ('What scholarships are available?', 'Government scholarships for SC/ST and other eligible categories under Tamil Nadu government norms.'),
    ('Best course for IT/software jobs?', 'Computer Science Engineering - covers programming, software development, databases, networking. Companies like Avlon Technologies and Annaie Informations recruit CSE graduates.'),
    ('What is the anti-ragging policy?', 'Ragging is a strict offence. VPTC enforces a zero-tolerance anti-ragging policy.'),
    ('What is the address of VPTC?', 'Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu - 606 603.')
]
for q, a in faqs:
    add_kv(f"Q: {q}", f"A: {a}")
    Story.append(Spacer(1, 6))

add_h1("10. Faculty and Staff Directory")
add_h2("Principal & Administration")
add_bullet("Principal: Sarvesan D. (ME, 25 years experience)")
add_bullet("Placement Officer: Raja (Administrative Officer)")

add_h2("Civil Engineering Department")
add_bullet("HOD: Subash S. (ME)")
add_bullet("Lecturer: Savithiri S. (BE)")

add_h2("Mechanical Engineering Department")
add_bullet("HOD: Kumaran V. (ME)")
add_bullet("Lecturers: Vinoth V. (BE), Ilayabharathi R. (BE)")

add_h2("Electrical and Electronics Engineering (EEE)")
add_bullet("HOD I/C: Anbalagan M. (ME)")
add_bullet("Lecturers: Anbalagan R. (BE), Kannan V. (ME)")

add_h2("Electronics and Communication Engineering (ECE)")
add_bullet("HOD: Sujatha H. (ME)")
add_bullet("Lecturer: Thilagam. (BE)")

add_h2("Computer Engineering Department")
add_bullet("HOD: Saravanan S. (MCA)")
add_bullet("Lecturer: Abirami A. (MCA)")

add_h1("11. Contact Information Summary")
add_kv("Address", "Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu - 606 603")
add_kv("Phone", "9488853917, 9488863917")
add_kv("Mobile", "7373689294")
add_kv("Email", "vpt384@yahoo.co.in")
add_kv("Website", "https://vigneshpolytechniccollege.com/")
add_kv("Principal", "Sarvesan D. (M.Tech, ECE)")
add_kv("Chairman", "Thiru R. Kuppusamy (alias Mani)")

doc.build(Story)
print(f"PDF successfully generated at {pdf_path}")
