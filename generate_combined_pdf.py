"""
Generate VPTC All-in-One Knowledge Base PDF
Uses fpdf2 to create a clean, well-formatted PDF
"""
import sys
sys.path.insert(0, 'backend')

from fpdf import FPDF, XPos, YPos

class VPTCPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(33, 77, 130)  # Dark blue
        self.rect(0, 0, 210, 14, 'F')
        self.set_xy(0, 2)
        self.cell(210, 10, 'Vignesh Polytechnic College (VPTC) - Official Knowledge Base', align='C')
        self.set_text_color(0, 0, 0)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()} | VPTC - Tiruvannamalai | vpt384@yahoo.co.in | 9488853917', align='C')

    def chapter_title(self, title):
        self.set_font('Helvetica', 'B', 13)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(33, 77, 130)
        self.cell(0, 9, f'  {title}', new_x=XPos.LMARGIN, new_y=YPos.NEXT, fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(33, 77, 130)
        self.cell(0, 7, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_text_color(0, 0, 0)
        self.ln(1)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.multi_cell(0, 5.5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_x(self.get_x() + 5)
        self.multi_cell(0, 5.5, f'\u2022  {text}')

    def key_value(self, key, value):
        self.set_font('Helvetica', 'B', 10)
        self.set_x(self.get_x() + 2)
        self.write(5.5, f'{key}: ')
        self.set_font('Helvetica', '', 10)
        self.write(5.5, value)
        self.ln()

pdf = VPTCPDF()
pdf.set_auto_page_break(auto=True, margin=18)
pdf.set_margins(15, 18, 15)
pdf.add_page()

# ── COVER SECTION ──────────────────────────────────────────────────
pdf.set_font('Helvetica', 'B', 20)
pdf.set_text_color(33, 77, 130)
pdf.ln(5)
pdf.cell(0, 12, 'Vignesh Polytechnic College', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font('Helvetica', '', 13)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 8, '"Technology \u2013 let\'s put more meaning to it\u2026"', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(3)
pdf.set_font('Helvetica', 'B', 11)
pdf.set_text_color(0,0,0)
pdf.cell(0, 6, 'Melputhiyandal Village, Manalurpet Road, Tiruvannamalai \u2013 606 603, Tamil Nadu', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font('Helvetica', '', 10)
pdf.cell(0, 6, 'Phone: 9488853917 / 9488863917  |  Mobile: 7373689294  |  Email: vpt384@yahoo.co.in', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.cell(0, 6, 'Website: https://vigneshpolytechniccollege.com/', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.ln(5)

# ── GENERAL INFO ──────────────────────────────────────────────────
pdf.chapter_title('1. General Information')
pdf.key_value('Established', '1995 — First institution under Sree Selvavinayagar Trust')
pdf.key_value('Trust', 'Sree Selvavinayagar Trust')
pdf.key_value('Chairman', 'Thiru R. Kuppusamy (alias Mani) — Founder & Chairman')
pdf.key_value('Principal', 'Sarvesan D. (M.Tech, Electronics and Communication Engineering)')
pdf.key_value('Accreditation', 'AICTE Approved, New Delhi (continuously since 1995)')
pdf.key_value('Total Intake', '360 students per year (First Year)')
pdf.key_value('Group', 'Part of Vignesh Group of Institutions')
pdf.ln(3)

# ── VISION & MISSION ──────────────────────────────────────────────
pdf.chapter_title('2. Vision & Mission')
pdf.section_title('Vision')
pdf.body_text(
    'We at Vignesh Polytechnic College impart Futuristic Technical Education as per curriculum with due importance to '
    'Practical oriented training based on the needs of the industries. We with a team of dedicated staff instill high '
    'standards of discipline in our students thus making them technologically superior and ethically strong.'
)
pdf.section_title('Mission')
pdf.body_text(
    'Our mission is to provide quality Technical Education in a highly disciplined atmosphere with ethical and moral '
    'values to the students from all over Tamil Nadu and especially to those from local and rural areas. We, with a '
    'dedicated team of staff provide individual attention, high quality education, enough practical training and take '
    'care of character building to improve living standards and contribute to industry and society.'
)

# ── COURSES ──────────────────────────────────────────────────────
pdf.chapter_title('3. Courses Offered (5 Diploma Programs — 3 Years)')
courses = [
    ('Civil Engineering', 'Infrastructure, construction, and urban planning.'),
    ('Mechanical Engineering', 'Design, manufacturing, and machine systems.'),
    ('Electrical & Electronics Engineering (EEE)', 'Power systems, electrical machines, and control.'),
    ('Electronics & Communication Engineering (ECE)', 'Circuits, embedded systems, and communications.'),
    ('Computer Science Engineering', 'Programming, software, databases, and networking.'),
]
for i, (name, desc) in enumerate(courses, 1):
    pdf.set_font('Helvetica', 'B', 10)
    pdf.cell(0, 6, f'  {i}. {name}', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_x(pdf.get_x() + 8)
    pdf.multi_cell(0, 5.5, desc)
pdf.ln(1)
pdf.body_text('All courses are 3-year programs over 6 semesters. Lateral entry (direct 2nd year) is also available.')

# ── ADMISSION ──────────────────────────────────────────────────────
pdf.chapter_title('4. Admission Details')
pdf.section_title('Eligibility')
pdf.bullet('NO AGE LIMIT for any admission.')
pdf.bullet('First Year (Sem 1): Pass in SSLC (10th) or equivalent from Tamil Nadu Board.')
pdf.bullet('Lateral Entry (Direct 2nd Year): HSC Vocational / Academic pass OR 2-year ITI qualified candidates.')
pdf.bullet('Students from other states must provide Migration Certificate + Permanent Residence Certificate.')
pdf.ln(2)

pdf.section_title('Documents Required')
docs = ['10th Mark Sheet (SSLC)', 'Transfer Certificate (TC)', 'Community Certificate',
        'Passport Size Photos (4)', 'Conduct Certificate',
        'Migration Certificate (for other state students)', 'Permanent Residence Certificate (other state)']
for d in docs:
    pdf.bullet(d)
pdf.ln(2)

pdf.section_title('How to Apply')
pdf.bullet('Online: Visit https://vigneshpolytechniccollege.com/ for Online Admission Registration.')
pdf.bullet('Download application form from the website (First Year & Direct 2nd Year).')
pdf.bullet('In person: Visit the campus with your Parent/Guardian.')
pdf.bullet('Phone: 9488853917 / 9488863917 / 7373689294')
pdf.bullet('Email: vpt384@yahoo.co.in')

# ── FEES & SCHOLARSHIPS ──────────────────────────────────────────
pdf.chapter_title('5. Fees & Scholarships')
pdf.body_text(
    'Tuition fees are collected as per the norms fixed by the Government of Tamil Nadu. '
    'For exact fee details, download the fee structure PDF from the college website or contact the college office.'
)
pdf.key_value('Fee Structure Link', 'https://vigneshpolytechniccollege.com/wp-content/uploads/2024/06/fee24-25.pdf')
pdf.section_title('Scholarships Available')
pdf.bullet('Government scholarships for SC/ST students as per Tamil Nadu government norms.')
pdf.bullet('Other eligible category scholarships as per government schemes.')
pdf.bullet('Contact the college office for detailed scholarship application procedures.')

# ── EXAM SYSTEM ──────────────────────────────────────────────────
pdf.chapter_title('6. Examination System')
pdf.bullet('6 semesters over 3 years.')
pdf.bullet('Evaluation: Internal Assessment (30%) + Final Semester Exam (70%).')
pdf.bullet('Minimum 35% marks required to pass in each subject.')
pdf.bullet('Results typically available within 4-6 weeks after exams.')
pdf.bullet('Exams conducted by DOTE (Directorate of Technical Education), Tamil Nadu.')

# ── PLACEMENT ──────────────────────────────────────────────────────
pdf.chapter_title('7. Placement Cell & Career Services')
pdf.body_text(
    'A full-fledged Placement Cell with a dedicated Placement Officer is functioning in the college. '
    'VPTC has maintained a steady record of 100% placements. '
    'The Placement Cell also arranges a "Mega Job Mela" for students from other institutions since 1995.'
)
pdf.section_title('Our Recruiters (Sample List)')
recruiters = [
    'Sundaram Fasteners (Autolec Division), Chennai', 'Customised Technologies, Bangalore',
    'Brakes India Ltd, Padi & Sholingar', 'Lucas-TVS, Puducherry',
    'India Nippon Electrical Ltd, Puducherry', 'TVS-Sundaram Fasteners, Puducherry',
    'Super Auto Forge, Chennai', 'Thai Summit Neel, Hosur',
    'Borg Warner Cooling System Pvt Ltd, Chennai', 'IFB, Chennai',
    'Sakthi Auto Components, Erode', 'Annaie Informations, Chennai (IT)',
    'Avlon Technologies, Chennai (IT)', 'Customised Technologies, Bangalore (IT)',
    'And many more leading organizations...'
]
for r in recruiters:
    pdf.bullet(r)

# ── CAMPUS FACILITIES ──────────────────────────────────────────────
pdf.chapter_title('8. Campus Facilities')
facilities = [
    ('Library', '300+ sq.m area, 16,500+ volumes, 2,500 reference books, 9 newspapers, 65 magazines, internet & computer access, 200 visitors/day.'),
    ('Hostel', 'On-campus hostel with mess, strict study hours and games hours.'),
    ('Computer Center', 'Centralized AC computer center with internet, printer. Each department networked at 100 Mbps. Internet cafe for 35 students.'),
    ('Transport', '40+ km coverage across all routes in Tiruvannamalai. Two-wheelers are NOT permitted.'),
    ('WiFi', 'Campus-wide Wi-Fi connectivity.'),
    ('Canteen & Bakery', 'On-campus canteen and bakery.'),
    ('Drinking Water', 'Portable RO drinking water available.'),
    ('Play Field', 'Dedicated outdoor play field.'),
    ('Sanitation', 'Good sanitation facilities throughout the campus.'),
]
for name, desc in facilities:
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_x(pdf.get_x() + 4)
    pdf.write(5.5, f'{name}: ')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, desc)
pdf.ln(1)

# ── TRANSPORT ROUTES ──────────────────────────────────────────────
pdf.section_title('Transport Routes')
routes = [
    'Tirukovilur (via Manalurpet & Veraiyur)', 'Polur', 'Vettavalam',
    'Chengam', 'Mazar', 'Thanipadi', 'Sangarapuram', 'Kanji',
    'Kilpenathur', 'Avalurpet'
]
pdf.body_text('Routes: ' + ', '.join(routes) + '.')

# ── FAQ ──────────────────────────────────────────────────────────
pdf.chapter_title('9. Frequently Asked Questions (FAQ)')
faqs = [
    ('What is the duration of diploma courses?', 'All diploma courses are 3-year programs with 6 semesters.'),
    ('Is there an age limit for admission?', 'NO, there is absolutely NO AGE LIMIT for admission to VPTC.'),
    ('Can I get direct 2nd year admission?', 'Yes. Lateral entry is available for HSC (Vocational/Academic) pass and ITI qualified candidates.'),
    ('Are two-wheelers allowed?', 'No. Students MUST use college transport. Two-wheelers are not permitted on campus.'),
    ('Is hostel available?', 'Yes, hostel facility is available within the campus with mess and study/games hours.'),
    ('What is the placement record?', 'VPTC maintains a steady 100% placement record. Leading companies recruit every year.'),
    ('Who is the Principal?', 'Sarvesan D. (M.Tech, ECE). Contact via office: 9488853917.'),
    ('Who is the Chairman?', 'Thiru R. Kuppusamy (alias Mani) — Founder & Chairman of Sree Selvavinayagar Trust.'),
    ('Is VPTC AICTE approved?', 'Yes. All courses are approved by AICTE, New Delhi, continuously since 1995.'),
    ('How can I apply?', 'Apply online at vigneshpolytechniccollege.com, download the form, or visit in person. Call: 9488853917 / 7373689294.'),
    ('What scholarships are available?', 'Government scholarships for SC/ST and other eligible categories under Tamil Nadu government norms.'),
    ('What is the best course for IT jobs?', 'Computer Science Engineering — provides training in programming, software, databases, networking. Companies like Avlon Technologies, Customised Technologies, and Annaie Informations recruit from CSE.'),
    ('What is Anti-Ragging policy?', 'Ragging is a strict offence. VPTC enforces a zero-tolerance anti-ragging policy.'),
]
for q, a in faqs:
    pdf.set_font('Helvetica', 'B', 10)
    pdf.multi_cell(0, 5.5, f'Q: {q}')
    pdf.set_font('Helvetica', '', 10)
    pdf.set_x(pdf.get_x() + 4)
    pdf.multi_cell(0, 5.5, f'A: {a}')
    pdf.ln(1)

# ── CONTACT ──────────────────────────────────────────────────────
pdf.chapter_title('10. Contact Information')
pdf.key_value('Address', 'Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu \u2013 606 603')
pdf.key_value('Phone', '9488853917, 9488863917')
pdf.key_value('Mobile', '7373689294')
pdf.key_value('Email', 'vpt384@yahoo.co.in')
pdf.key_value('Website', 'https://vigneshpolytechniccollege.com/')
pdf.key_value('Principal', 'Sarvesan D. (M.Tech, ECE)')
pdf.key_value('Chairman', 'Thiru R. Kuppusamy (alias Mani)')

output_path = 'backend/data/documents/VPTC_Complete_KnowledgeBase.pdf'
pdf.output(output_path)
print(f'SUCCESS! PDF saved to {output_path}')
