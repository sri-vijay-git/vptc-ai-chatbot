from fastapi import APIRouter, Body, HTTPException, Depends
from typing import List
from app.models.chat_history import ChatHistoryItem, ChatMessage
from app.api.v1.dependencies import get_current_user
import json
from pathlib import Path
from datetime import datetime
import uuid

router = APIRouter()

HISTORY_DIR = Path("data/chat_history")
HISTORY_DIR.mkdir(parents=True, exist_ok=True)

@router.get("/", response_model=List[ChatHistoryItem])
async def get_chat_history(
    current_user: dict = Depends(get_current_user)
):
    """
    Get all chat history for the current user
    """
    user_id = current_user.get("email") # Using email as ID for simple auth
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")
        
    user_history_dir = HISTORY_DIR / user_id
    if not user_history_dir.exists():
        return []
        
    history_items = []
    for file_path in user_history_dir.glob("*.json"):
        try:
            with open(file_path, "r") as f:
                data = json.load(f)
                history_items.append(ChatHistoryItem(**data))
        except Exception as e:
            print(f"Error loading {file_path}: {e}")
            continue
            
    # Sort by timestamp desc
    history_items.sort(key=lambda x: x.timestamp, reverse=True)
    return history_items

@router.post("/save", response_model=ChatHistoryItem)
async def save_chat_history(
    messages: List[ChatMessage] = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Save a chat session
    """
    user_id = current_user.get("email")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not found")
    
    # Generate session ID
    session_id = str(uuid.uuid4())
    timestamp = datetime.now()
    
    # Create title from first user message
    title = "New Chat"
    for msg in messages:
        if msg.role == "user":
            title = msg.content[:50] + "..." if len(msg.content) > 50 else msg.content
            break
            
    history_item = ChatHistoryItem(
        id=session_id,
        user_id=user_id,
        title=title,
        timestamp=timestamp,
        messages=messages
    )
    
    # Save to file
    user_history_dir = HISTORY_DIR / user_id
    user_history_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = user_history_dir / f"{session_id}.json"
    with open(file_path, "w") as f:
        f.write(history_item.model_dump_json())
        
    return history_item
