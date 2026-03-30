from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.api.v1.dependencies import get_current_user
from app.core.database import supabase
from app.services.academic_records import read_academic_record, write_academic_record
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
    courses: Optional[List[Dict[str, Any]]] = None
    exam_marks: Optional[List[Dict[str, Any]]] = None

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
        
        # Read by email (student self-updates) and by id (staff updates)
        user_email = current_user.get("email", current_user["id"])
        user_id = current_user["id"]
        
        academic_by_email = read_academic_record(user_email)
        academic_by_id = read_academic_record(user_id)
        
        # Staff writes by id → id-based record is authoritative for courses/marks
        # Fall back to email-based if id-based is default/empty
        use_id_record = bool(academic_by_id.get("courses") or academic_by_id.get("marks_history") or academic_by_id.get("exam_marks"))
        academic_data = academic_by_id if use_id_record else academic_by_email
        
        # Merge local dynamic records
        staff_courses = academic_data.get("courses", [])
        default_profile["courses"] = staff_courses if staff_courses else default_profile["courses"]
        
        # Support both marks_history (staff field) and exam_marks (student field)
        staff_marks = academic_data.get("marks_history") or academic_data.get("exam_marks", [])
        # Normalize marks_history format → exam_marks format for the frontend
        normalized_marks = []
        for m in staff_marks:
            normalized_marks.append({
                "subject": m.get("subject", ""),
                "obtainedMarks": int(m.get("obtained_marks", m.get("obtainedMarks", 0))),
                "maxMarks": int(m.get("total_marks", m.get("maxMarks", 100))),
                "minMarks": int(m.get("minMarks", 0)),
            })
        default_profile["exam_marks"] = normalized_marks
        
        # Merge attendance tracking percentage if calculated dynamically by staff
        att_history = academic_data.get("attendance_history", {})
        if att_history.get("total", 0) > 0:
            default_profile["attendance"] = round((att_history["present"] / att_history["total"]) * 100, 1)

        if response.data and len(response.data) > 0:
            db_data = response.data[0]
            default_profile["roll_no"] = db_data.get("roll_no") or default_profile["roll_no"]
            default_profile["department"] = db_data.get("department") or default_profile["department"]
            default_profile["semester"] = db_data.get("semester") or default_profile["semester"]
            default_profile["cgpa"] = float(db_data.get("cgpa") or 0.0)
            
            # Use database attendance if local file attendance tracking isn't active
            if att_history.get("total", 0) == 0:
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
        
        # Save academic data locally
        if profile_data.courses is not None or profile_data.exam_marks is not None:
            user_email = current_user.get("email", current_user["id"])
            current_records = read_academic_record(user_email)
            if profile_data.courses is not None:
                current_records["courses"] = profile_data.courses
            if profile_data.exam_marks is not None:
                current_records["exam_marks"] = profile_data.exam_marks
            write_academic_record(user_email, current_records)

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
