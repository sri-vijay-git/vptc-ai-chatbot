from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> Optional[dict]:
    """
    Verify JWT token with Supabase and return user information.
    This ensures only authenticated users can access protected endpoints.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        # Import Supabase client
        from app.core.database import supabase
        
        # Verify token with Supabase and get user data
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Extract user information from the verified token
        user = user_response.user
        return {
            "id": user.id,
            "email": user.email,
            "role": user.user_metadata.get("role", "student"),
            "full_name": user.user_metadata.get("full_name", "")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_admin(current_user: dict = Depends(get_current_user)):
    """
    Verify that the current user has admin role.
    Only users with role='admin' can access admin-protected endpoints.
    """
    user_role = current_user.get("role", "student")
    
    if user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. You do not have permission to access this resource."
        )
    
    return current_user

def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional)) -> Optional[dict]:
    """
    Optional authentication - allows both logged-in and guest users.
    Returns user dict if authenticated, None if guest/unauthenticated.
    Used for endpoints that support guest/trial mode (e.g., chat with 20 free messages).
    """
    if not token:
        return None  # Guest user
    
    try:
        # Import Supabase client
        from app.core.database import supabase
        
        # Verify token with Supabase and get user data
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            return None  # Invalid token, treat as guest
        
        # Extract user information from the verified token
        user = user_response.user
        return {
            "id": user.id,
            "email": user.email,
            "role": user.user_metadata.get("role", "student"),
            "full_name": user.user_metadata.get("full_name", "")
        }
        
    except Exception as e:
        print(f"Token verification error (treating as guest): {e}")
        return None  # Error verifying token, treat as guest
