from fastapi import APIRouter, Body, HTTPException, Depends
from app.models.feedback import Feedback, FeedbackCreate
from app.api.v1.dependencies import get_current_user_optional
import json
from pathlib import Path
from datetime import datetime

router = APIRouter()

FEEDBACK_DIR = Path("data/feedback")
FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
FEEDBACK_FILE = FEEDBACK_DIR / "feedback.jsonl"

@router.post("/", response_model=dict)
async def submit_feedback(
    feedback: FeedbackCreate,
    current_user: dict = Depends(get_current_user_optional)
):
    """
    Submit feedback for a chat message
    """
    user_id = current_user.get("email") if current_user else "guest"
    
    feedback_entry = Feedback(
        message_id=feedback.message_id,
        user_id=user_id,
        rating=feedback.rating,
        comment=feedback.comment,
        timestamp=datetime.now()
    )
    
    # Append to JSONL file
    try:
        with open(FEEDBACK_FILE, "a") as f:
            f.write(feedback_entry.model_dump_json() + "\n")
    except Exception as e:
        print(f"Error saving feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to save feedback")
        
    return {"status": "success", "message": "Feedback received"}

@router.get("/stats")
async def get_feedback_stats():
    """
    Get simple feedback statistics
    """
    if not FEEDBACK_FILE.exists():
        return {"total": 0, "thumbs_up": 0, "thumbs_down": 0}
        
    total = 0
    thumbs_up = 0
    thumbs_down = 0
    
    try:
        with open(FEEDBACK_FILE, "r") as f:
            for line in f:
                if not line.strip(): continue # Skip empty lines
                data = json.loads(line)
                total += 1
                if data["rating"] == 1:
                    thumbs_up += 1
                elif data["rating"] == -1:
                    thumbs_down += 1
    except Exception as e:
        print(f"Error reading stats: {e}")
        return {"error": "Failed to read stats"}
        
    return {
        "total": total,
        "thumbs_up": thumbs_up,
        "thumbs_down": thumbs_down
    }
