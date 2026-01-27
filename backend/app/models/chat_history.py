from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime = datetime.now()

class ChatHistoryItem(BaseModel):
    id: str  # Session ID or specific history ID
    user_id: str
    title: Optional[str] = "New Chat"
    timestamp: datetime = datetime.now()
    messages: List[ChatMessage]

class ChatHistoryList(BaseModel):
    items: List[ChatHistoryItem]
