from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.api.v1.dependencies import get_current_user
from app.core.database import supabase
import json

router = APIRouter()

class CourseInfo(BaseModel):
    code: str
    name: str
    credits: int
    grade: str
    attendance: int

class EventInfo(BaseModel):
    title: str
    date: str
    type: str

class StudentProfileUpdate(BaseModel):
    roll_no: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[str] = None
    cgpa: Optional[float] = None
    attendance: Optional[float] = None

def get_default_profile(user: dict):
    """Return default mock profile structure if the user hasn't saved one yet."""
    name = user.get("full_name") or user.get("email", "Student").split("@")[0]
    return {
        "id": user["id"],
        "name": name,
        "email": user.get("email", ""),
        "roll_no": "Not Set",
        "department": "Not Set",
        "semester": "Not Set",
        "cgpa": 0.0,
        "attendance": 0.0,
        "courses": [
            { "code": "CS301", "name": "Data Structures", "credits": 4, "grade": "A", "attendance": 95 },
            { "code": "CS302", "name": "Database Management", "credits": 3, "grade": "B+", "attendance": 88 }
        ],
        "upcomingEvents": [
            { "title": "Mid-term Exams", "date": "Coming Soon", "type": "exam" }
        ]
    }

@router.get("/profile")
def get_student_profile(current_user: dict = Depends(get_current_user)):
    """Fetch the student's dynamic profile. Returns defaults if none exists."""
    try:
        response = supabase.table("student_profiles").select("*").eq("id", current_user["id"]).execute()
        
        default_profile = get_default_profile(current_user)
        
        if response.data and len(response.data) > 0:
            db_data = response.data[0]
            # Merge DB data with defaults (since courses/events are hardcoded defaults for now to keep the UI rich)
            default_profile["roll_no"] = db_data.get("roll_no") or default_profile["roll_no"]
            default_profile["department"] = db_data.get("department") or default_profile["department"]
            default_profile["semester"] = db_data.get("semester") or default_profile["semester"]
            default_profile["cgpa"] = float(db_data.get("cgpa") or 0.0)
            default_profile["attendance"] = float(db_data.get("attendance") or 0.0)
            return default_profile
        else:
            return default_profile
            
    except Exception as e:
        print(f"Error fetching student profile: {e}")
        return get_default_profile(current_user)

@router.post("/profile")
def update_student_profile(profile_data: StudentProfileUpdate, current_user: dict = Depends(get_current_user)):
    """Create or update a student's profile."""
    try:
        # Check if exists
        check = supabase.table("student_profiles").select("id").eq("id", current_user["id"]).execute()
        
        payload = {
            "roll_no": profile_data.roll_no,
            "department": profile_data.department,
            "semester": profile_data.semester,
            "cgpa": profile_data.cgpa,
            "attendance": profile_data.attendance
        }
        
        # Remove None values
        payload = {k: v for k, v in payload.items() if v is not None}
        
        if check.data and len(check.data) > 0:
            # Update
            res = supabase.table("student_profiles").update(payload).eq("id", current_user["id"]).execute()
        else:
            # Insert
            payload["id"] = current_user["id"]
            res = supabase.table("student_profiles").insert(payload).execute()
            
        return {"success": True, "message": "Profile updated successfully!"}
        
    except Exception as e:
        print(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")
