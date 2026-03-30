from fastapi import APIRouter
from app.api.v1.endpoints import auth, chat, tools, admin, users, history, feedback, student, staff

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(tools.router, prefix="/tools", tags=["Tools"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(history.router, prefix="/history", tags=["History"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
api_router.include_router(student.router, prefix="/student", tags=["Student"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff"])
