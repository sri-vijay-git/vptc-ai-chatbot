from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend API for VPTC AI Chatbot using RAG and Gemini Pro",
    version="1.0.0",
)

# Set all CORS enabled origins
from app.core.config import BACKEND_CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to VPTC AI Chatbot API",
        "status": "active",
        "version": "1.0.0",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/v1/diagnostic/chroma")
def test_chroma():
    try:
        from app.services.vector_store import vector_store
        import os
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        db_path = os.path.join(base_dir, "data", "chromadb")
        
        # Check if the folder exists
        exists = os.path.exists(db_path)
        files = os.listdir(db_path) if exists else []
        
        # Try a search
        results = vector_store.search("test", n_results=1)
        
        return {
            "status": "success",
            "db_path": db_path,
            "path_exists": exists,
            "files_in_dir": files,
            "collection_count": vector_store.collection.count(),
            "search_results": results
        }
    except Exception as e:
        import traceback
        return {
            "status": "error",
            "error_type": type(e).__name__,
            "error_msg": str(e),
            "traceback": traceback.format_exc()
        }

# We will import and include the main router here in later steps
from app.api.v1.router import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
