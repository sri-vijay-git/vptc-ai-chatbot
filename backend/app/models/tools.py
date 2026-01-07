from pydantic import BaseModel
from typing import List

class GradeInput(BaseModel):
    subject_name: str
    credits: int
    grade_points: float  # Example: S=10, A=9, B=8, etc.

class GPACalculationRequest(BaseModel):
    grades: List[GradeInput]

class GPAResponse(BaseModel):
    total_credits: int
    gpa: float
    message: str
