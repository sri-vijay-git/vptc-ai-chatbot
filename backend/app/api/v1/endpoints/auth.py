import os
from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, Token, UserResponse
from app.core.database import supabase
from gotrue.errors import AuthApiError

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def create_user(user: UserCreate):
    try:
        # Sign up with Supabase Auth
        # We store metadata (role, full_name) in the user_metadata field
        # Get frontend URL for redirect
        frontend_url = os.getenv("FRONTEND_URL", "https://vptc-ai-chatbot-frontend.vercel.app")
        redirect_url = f"{frontend_url}/verified"

        res = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "role": user.role,
                    "full_name": user.full_name
                },
                "email_redirect_to": redirect_url
            }
        })
        
        if not res.user:
            raise HTTPException(status_code=400, detail="Registration failed")
            
        return UserResponse(
            id=res.user.id,
            email=res.user.email,
            role=res.user.user_metadata.get("role", "student"),
            full_name=res.user.user_metadata.get("full_name")
        )
        
    except AuthApiError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
def login_user(user: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        
        if not res.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return Token(
            access_token=res.session.access_token,
            token_type="bearer"
        )
        
    except AuthApiError as e:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
