from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Feedback(BaseModel):
    message_id: str
    user_id: str
    rating: int  # 1 for helpful, -1 for not helpful
    comment: Optional[str] = None
    timestamp: datetime = datetime.now()

class FeedbackCreate(BaseModel):
    message_id: str
    rating: int
    comment: Optional[str] = None
