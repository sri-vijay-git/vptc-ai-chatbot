def generate_followup_questions(user_question: str, ai_answer: str) -> list:
    """Generate smart follow-up questions based on context"""
    
    # Simple keyword-based approach (can be enhanced with AI later)
    keywords_to_followups = {
        "courses": [
            "What is the fee for these courses?",
            "Show me placement statistics",
            "Which course is best for software jobs?",
            "What is the admission process?"
        ],
        "fee": [
            "Are there any scholarships available?",
            "Can I pay in installments?",
            "What is included in the fee?",
            "Is there a hostel fee?"
        ],
        "admission": [
            "What documents do I need?",
            "When is the deadline?",
            "What is the eligibility criteria?",
            "How do I apply online?"
        ],
        "placement": [
            "Which companies visit for placements?",
            "What is the average salary package?",
            "Show me placement records",
            "Do you provide training for placements?"
        ],
        "scholarship": [
            "What is the income limit for scholarships?",
            "How do I apply for SC/ST scholarship?",
            "Is there a merit-based scholarship?",
            "When is the scholarship deadline?"
        ],
        "hostel": [
            "What is the hostel fee?",
            "Is food included in hostel fee?",
            "What are the hostel rules?",
            "How far is the hostel from college?"
        ],
        "exam": [
            "When are the semester exams?",
            "What is the passing mark?",
            "How to apply for revaluation?",
            "Where can I get previous question papers?"
        ]
    }
    
    # Find matching keywords
    question_lower = user_question.lower()
    answer_lower = ai_answer.lower()
    
    # Combine content for matching
    context = question_lower + " " + answer_lower
    
    for keyword, questions in keywords_to_followups.items():
        if keyword in context:
            return questions[:3]  # Return top 3
    
    # Default questions if no match
    return [
        "Tell me more about this",
        "What are the important dates?",
        "How can I apply?",
        "Show me contact details"
    ][:3]
