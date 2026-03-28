import os
os.chdir(r'd:\Final project\vptc-ai-chatbot')
from fpdf import FPDF, XPos, YPos

pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=18)
pdf.set_margins(15, 20, 15)
pdf.add_page()

def h1(t):
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_fill_color(33, 77, 130)
    pdf.set_text_color(255,255,255)
    pdf.cell(0, 9, '  '+t, new_x=XPos.LMARGIN, new_y=YPos.NEXT, fill=True)
    pdf.set_text_color(0,0,0)
    pdf.ln(2)

def h2(t):
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(33, 77, 130)
    pdf.cell(0, 7, t, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_text_color(0,0,0)

def body(t):
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, t)
    pdf.ln(1)

def bullet(t):
    pdf.set_font('Helvetica', '', 10)
    pdf.set_x(pdf.get_x()+4)
    pdf.multi_cell(0, 5.5, '- '+t)

def kv(k, v):
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_x(pdf.get_x()+2)
    pdf.write(5.5, k+': ')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, v)

# Title
pdf.set_font('Helvetica', 'B', 18)
pdf.set_text_color(33, 77, 130)
pdf.cell(0, 12, 'Vignesh Polytechnic College (VPTC)', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_font('Helvetica', '', 11)
pdf.set_text_color(80, 80, 80)
pdf.cell(0, 7, 'Complete College Knowledge Base for AI Reference', align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)
pdf.set_text_color(0,0,0)
pdf.ln(4)

h1('1. General Information')
kv('Full Name','Vignesh Polytechnic College (VPTC)')
kv('Established','1995 - First institution under Sree Selvavinayagar Trust')
kv('Trust','Sree Selvavinayagar Trust')
kv('Chairman','Thiru R. Kuppusamy (alias Mani) - Founder and Chairman')
kv('Principal','Sarvesan D. (M.Tech, Electronics and Communication Engineering)')
kv('Accreditation','AICTE Approved, New Delhi (continuously since 1995)')
kv('Total Intake','360 students per year')
kv('Website','https://vigneshpolytechniccollege.com/')
kv('Location','Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu 606603')
kv('Phone','9488853917 / 9488863917')
kv('Mobile','7373689294')
kv('Email','vpt384@yahoo.co.in')
pdf.ln(2)

h1('2. Vision and Mission')
h2('Vision')
body('We at Vignesh Polytechnic College impart Futuristic Technical Education as per curriculum with due importance to Practical oriented training based on the needs of the industries. We with a team of dedicated staff instill high standards of discipline in our students making them technologically superior and ethically strong.')
h2('Mission')
body('Our mission is to provide quality Technical Education in a highly disciplined atmosphere with ethical and moral values to students from all over Tamil Nadu especially from local and rural areas. We provide individual attention, high quality education, practical training and character building.')

h1('3. Courses Offered (5 Diploma Programs - 3 Years / 6 Semesters)')
for i,c in enumerate(['Civil Engineering','Mechanical Engineering','Electrical and Electronics Engineering (EEE)','Electronics and Communication Engineering (ECE)','Computer Science Engineering'],1):
    bullet(f'{i}. {c}')
pdf.ln(1)
body('All courses are 3-year Diploma programs with 6 semesters. Lateral entry (direct 2nd year admission) is available for HSC and ITI qualified candidates.')

h1('4. Admission Details')
h2('Eligibility')
bullet('NO AGE LIMIT for any admission.')
bullet('First Year (Semester 1): Pass SSLC (10th) or equivalent from Tamil Nadu Board.')
bullet('Lateral Entry (Direct 2nd Year): HSC Vocational/Academic stream pass OR 2-year ITI pass.')
bullet('Other state students must provide Migration Certificate and Permanent Residence Certificate.')
pdf.ln(1)
h2('Documents Required')
for d in ['10th Mark Sheet (SSLC)','Transfer Certificate (TC)','Community Certificate','Passport Size Photos (4 copies)','Conduct Certificate','Migration Certificate (other state students only)','Permanent Residence Certificate (other state only)']:
    bullet(d)
pdf.ln(1)
h2('How to Apply')
bullet('Online: https://vigneshpolytechniccollege.com/ (Online Admission Registration)')
bullet('Download application form from college website.')
bullet('In person: Visit campus with Parent/Guardian.')
bullet('Phone: 9488853917 / 9488863917 / 7373689294')
bullet('Email: vpt384@yahoo.co.in')
pdf.ln(2)

h1('5. Fees and Scholarships')
body('Tuition fees are fixed as per Government of Tamil Nadu norms. Fee structure: https://vigneshpolytechniccollege.com/wp-content/uploads/2024/06/fee24-25.pdf')
bullet('Government scholarships for SC/ST students per Tamil Nadu government norms.')
bullet('Other eligible category scholarships available. Contact college office for details.')
pdf.ln(2)

h1('6. Examination System')
for b in ['6 semesters over 3 years.','Internal Assessment (30%) + Final Semester Exam (70%).','Minimum 35% marks required to pass each subject.','Results typically within 4-6 weeks after exams.','Exams conducted by DOTE (Directorate of Technical Education), Tamil Nadu.']:
    bullet(b)
pdf.ln(2)

h1('7. Placement Cell and Career Services')
body('VPTC has maintained a steady record of 100% placements every year. A full-fledged Placement Cell manages placements for final year students. The college also organizes a Mega Job Mela for students from multiple institutions since 1995.')
h2('Companies that recruit from VPTC')
pdf.ln(1)
for r in ['Sundaram Fasteners (Autolec Division), Chennai','Customised Technologies, Bangalore','Brakes India Ltd (Padi and Sholingar)','Lucas-TVS, Puducherry','India Nippon Electrical Ltd, Puducherry','TVS-Sundaram Fasteners, Puducherry','Thai Summit Neel, Hosur','Borg Warner Cooling System Pvt Ltd, Chennai','Sakthi Auto Components, Erode','Steel Stripes Wheel India Ltd, Chennai','TRR Automotive, Tindivanam','Annaie Informations, Chennai (IT Roles)','Avlon Technologies, Chennai (IT Roles)','Customised Technologies, Bangalore (IT Roles)','And many more leading organizations across India']:
    bullet(r)
pdf.ln(2)

h1('8. Campus Facilities')
for name,desc in [
    ('Library','300+ sq.m area, 16,500+ volumes, 2500 reference books, 9 newspapers, 65 magazines, internet and computer access, open access system, 200 visitors/day.'),
    ('Hostel','On-campus hostel with mess, strict study hours and games hours.'),
    ('Computer Center','Centralized AC computer center with internet and printer. 100 Mbps network. Internet cafe for 35 students simultaneously.'),
    ('Transport','40+ km coverage across all routes in Tiruvannamalai including Tirukovilur, Polur, Vettavalam, Chengam, Thanipadi. Two-wheelers are NOT permitted - students must use college transport.'),
    ('WiFi','Campus-wide Wi-Fi connectivity.'),
    ('Canteen','On-campus canteen and bakery.'),
    ('Drinking Water','Portable RO purified drinking water throughout campus.'),
    ('Play Field','Dedicated outdoor sports and play field.'),
    ('Sanitation','Good sanitation facilities throughout campus.'),
]:
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_x(pdf.get_x()+4)
    pdf.write(5.5, name+': ')
    pdf.set_font('Helvetica', '', 10)
    pdf.multi_cell(0, 5.5, desc)
pdf.ln(2)

h1('9. Frequently Asked Questions (FAQ)')
faqs = [
    ('Duration of diploma courses?','All diploma courses are 3-year programs with 6 semesters.'),
    ('Age limit for admission?','NO - there is absolutely NO AGE LIMIT for admission at VPTC.'),
    ('Can I join 2nd year directly?','Yes. Lateral entry is available for HSC (Vocational/Academic) pass and ITI qualified candidates.'),
    ('Are two-wheelers allowed on campus?','No. Students MUST use college transport. Two-wheelers are NOT permitted on campus.'),
    ('Is hostel facility available?','Yes, on-campus hostel with mess, study hours, and games hours is available.'),
    ('What is the placement record?','VPTC maintains a steady 100% placement record every year since 1995.'),
    ('Who is the Principal?','Sarvesan D. (M.Tech, Electronics and Communication Engineering). Contact via college office: 9488853917.'),
    ('Who is the Chairman?','Thiru R. Kuppusamy (alias Mani) - Founder and Chairman of Sree Selvavinayagar Trust.'),
    ('Is VPTC AICTE approved?','Yes. All courses are approved by AICTE, New Delhi. Continuously approved since 1995.'),
    ('How to apply for admission?','Apply online at college website, download form, or visit campus in person with Parent/Guardian. Call: 9488853917 / 7373689294.'),
    ('What scholarships are available?','Government scholarships for SC/ST and other eligible categories under Tamil Nadu government norms.'),
    ('Best course for IT/software jobs?','Computer Science Engineering - covers programming, software development, databases, networking. Companies like Avlon Technologies and Annaie Informations recruit CSE graduates.'),
    ('What is the anti-ragging policy?','Ragging is a strict offence. VPTC enforces a zero-tolerance anti-ragging policy.'),
    ('What is the address of VPTC?','Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu - 606 603.'),
]
for q,a in faqs:
    pdf.set_font('Helvetica', 'B', 10)
    pdf.multi_cell(0, 5.5, 'Q: '+q)
    pdf.set_font('Helvetica', '', 10)
    pdf.set_x(pdf.get_x()+4)
    pdf.multi_cell(0, 5.5, 'A: '+a)
    pdf.ln(1)

h1('10. Contact Information Summary')
kv('Address','Melputhiyandal Village, Manalurpet Road, Tiruvannamalai, Tamil Nadu - 606 603')
kv('Phone','9488853917, 9488863917')
kv('Mobile','7373689294')
kv('Email','vpt384@yahoo.co.in')
kv('Website','https://vigneshpolytechniccollege.com/')
kv('Principal','Sarvesan D. (M.Tech, ECE)')
kv('Chairman','Thiru R. Kuppusamy (alias Mani)')

out = r'd:\Final project\vptc-ai-chatbot\backend\data\documents\VPTC_Complete_KnowledgeBase.pdf'
pdf.output(out)
print('PDF saved successfully to:', out)
print('File size:', os.path.getsize(out), 'bytes')
