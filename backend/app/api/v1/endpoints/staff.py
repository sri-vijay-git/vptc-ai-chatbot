from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.api.v1.dependencies import get_current_user
from app.core.database import supabase
from app.services.academic_records import read_academic_record, write_academic_record

router = APIRouter()

class AttendanceUpdateReq(BaseModel):
    student_id: str
    student_email: str
    status: str # "Present" or "Absent"

class BulkAttendanceReq(BaseModel):
    records: List[AttendanceUpdateReq]

@router.get("/students")
def get_students_for_staff(department: str, current_user: dict = Depends(get_current_user)):
    """
    Fetch students based on staff department.
    If '1st Year Staff', fetch all students with semester 1 or 2.
    Else, fetch students strictly matching the department AND semester >= 3.
    """
    # Ensure role is staff or admin
    if current_user.get("role") not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized as staff")

    try:
        # Fetch all students for now to filter securely
        response = supabase.table("student_profiles").select("*").execute()
        if not response.data:
            return []

        all_students = response.data
        filtered_students = []

        for student in all_students:
            sem_str = str(student.get("semester", "")).lower()
            
            # Simple heuristic to detect 1st year (Semester 1 or 2)
            is_first_year = "1" in sem_str or "2" in sem_str or "first" in sem_str
            
            if department == "1st Year Staff (S&H)":
                if is_first_year:
                    filtered_students.append(student)
            else:
                # Department match AND not 1st year
                if student.get("department") == department and not is_first_year:
                    filtered_students.append(student)

        # Enhance student data with their names/emails from Supabase auth
        # Since we don't have a joined view, we just return the raw profiles.
        # But wait, frontend needs email to lookup academic_records. We can fallback to `id` for filename.

        # Fetch local JSON attendance to enrich
        enhanced_students = []
        for s in filtered_students:
            s_id = s["id"]
            local_data = read_academic_record(s_id) # Using ID as fallback email
            att_hist = local_data.get("attendance_history", {"total": 0, "present": 0})
            
            s["total_classes"] = att_hist["total"]
            s["present_classes"] = att_hist["present"]
            enhanced_students.append(s)

        return enhanced_students

    except Exception as e:
        print(f"Error fetching students for staff: {e}")
        raise HTTPException(status_code=500, detail="Error fetching students")

@router.post("/attendance")
def submit_bulk_attendance(payload: BulkAttendanceReq, current_user: dict = Depends(get_current_user)):
    """
    Submits daily attendance for a batch of students.
    """
    if current_user.get("role") not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        for record in payload.records:
            user_id = record.student_id
            
            local_data = read_academic_record(user_id)
            att_hist = local_data.get("attendance_history", {"total": 0, "present": 0})
            
            # Increment total
            att_hist["total"] += 1
            if record.status == "Present":
                att_hist["present"] += 1
                
            local_data["attendance_history"] = att_hist
            write_academic_record(user_id, local_data)
        
        return {"success": True, "message": "Attendance submitted successfully"}
    except Exception as e:
        print(f"Error bulk saving attendance: {e}")
        raise HTTPException(status_code=500, detail="Failed to save attendance")
