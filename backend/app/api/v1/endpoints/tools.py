from fastapi import APIRouter
from app.models.tools import GPACalculationRequest, GPAResponse
from app.services.gemini_service import gemini_service

router = APIRouter()

@router.post("/calculate-gpa", response_model=GPAResponse)
def calculate_gpa(data: GPACalculationRequest):
    """
    Calculates GPA based on credits and grade points.
    Formula: Sum(Credits * GradePoints) / Sum(Credits)
    """
    total_credits = 0
    weighted_sum = 0
    
    for item in data.grades:
        total_credits += item.credits
        weighted_sum += (item.credits * item.grade_points)
        
    if total_credits == 0:
        return GPAResponse(total_credits=0, gpa=0.0, message="No credits provided.")
        
    gpa = round(weighted_sum / total_credits, 2)
    
    # Use Gemini to give a motivational message based on the GPA
    message = gemini_service.generate_text(
        f"A student just calculated their GPA and got {gpa}/10. Give a 1-sentence encouraging remark."
    )
    
    return GPAResponse(
        total_credits=total_credits,
        gpa=gpa,
        message=message
    )
