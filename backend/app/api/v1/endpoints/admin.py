from fastapi import APIRouter, Depends
from app.api.v1.dependencies import get_current_admin

router = APIRouter()

@router.get("/analytics/dashboard")
def get_analytics(admin_user: dict = Depends(get_current_admin)):
    """
    Returns high-level statistics for the Admin Dashboard.
    Only accessible by Admins.
    """
    # Mock data for the diploma project demo
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
