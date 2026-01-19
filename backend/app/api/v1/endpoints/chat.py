from fastapi import APIRouter, Depends, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.api.v1.dependencies import get_current_user_optional
from typing import Optional

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional)
):
    """
    Main Chatbot Endpoint - Supports both logged-in and guest users:
    - Guest users: 20 free trial conversations (tracked on frontend)
    - Logged-in users: Unlimited conversations
    
    1. Receives user message
    2. Sends query to RAG pipeline (Gemini + ChromaDB)
    3. Returns AI response with sources
    """
    
    # Real RAG implementation
    from app.services.rag_service import rag_service
    
    response_data = rag_service.generate_response(request.message)
    
    return ChatResponse(
        answer=response_data["answer"],
        sources=response_data["sources"]
    )
