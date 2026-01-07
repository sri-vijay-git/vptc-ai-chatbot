from fastapi import APIRouter, Depends, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.post("/message", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Main Chatbot Endpoint:
    1. Receives user message
    2. (TODO: Step 5-7) Sends query to RAG pipeline (Gemini + ChromaDB)
    3. Returns AI response
    """
    
    # Real RAG implementation
    from app.services.rag_service import rag_service
    
    response_data = rag_service.generate_response(request.message)
    
    return ChatResponse(
        answer=response_data["answer"],
        sources=response_data["sources"]
    )
