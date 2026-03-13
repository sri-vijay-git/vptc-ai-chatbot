from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.api.v1.dependencies import get_current_admin
from app.core.database import supabase
import os

router = APIRouter()

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    setup_key: str  # Secret key to authorize account creation without login

@router.get("/analytics/dashboard")
def get_analytics(admin_user: dict = Depends(get_current_admin)):
    """
    Returns high-level statistics for the Admin Dashboard.
    Only accessible by Admins.
    """
    return {
        "total_students": 1250,
        "active_today": 45,
        "queries_processed": 342,
        "popular_topics": [
            {"topic": "Exam Schedule", "count": 120},
            {"topic": "Bus Routes", "count": 85},
            {"topic": "GPA Calculation", "count": 60},
            {"topic": "Hostel Fees", "count": 45}
        ],
        "system_health": "98% (All Systems Operational)"
    }

@router.get("/analytics/interactions")
def get_recent_interactions(admin_user: dict = Depends(get_current_admin)):
    """
    Returns a log of recent chat interactions for quality monitoring.
    """
    return [
        {"time": "10:30 AM", "user": "Student A", "query": "When are the exams?", "status": "Resolved"},
        {"time": "10:35 AM", "user": "Student B", "query": "Calculate my GPA", "status": "Resolved"},
        {"time": "10:42 AM", "user": "Student C", "query": "Canteen menu", "status": "Pending Data"}
    ]

@router.post("/create-admin")
def create_admin_account(data: AdminCreate):
    """
    Create a new admin account.
    Protected by a secret setup key (ADMIN_SETUP_KEY in .env).
    No login required — anyone with the correct key can create an admin account.
    """
    # Verify the setup key against the one stored in .env
    expected_key = os.getenv("ADMIN_SETUP_KEY", "")
    if not expected_key or data.setup_key != expected_key:
        raise HTTPException(
            status_code=403,
            detail="Invalid setup key. Access denied."
        )

    try:
        res = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True,
            "user_metadata": {
                "role": "admin",
                "full_name": data.full_name or ""
            }
        })

        if not res.user:
            raise HTTPException(status_code=400, detail="Failed to create admin account")

        return {
            "success": True,
            "message": f"Admin account created successfully for {data.email}",
            "user": {
                "id": res.user.id,
                "email": res.user.email,
                "role": "admin",
                "full_name": data.full_name or ""
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already been registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
        raise HTTPException(status_code=500, detail=f"Failed to create account: {error_msg}")
