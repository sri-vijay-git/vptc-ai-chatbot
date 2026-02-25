from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.core.database import get_supabase_admin_client
from app.api.v1.dependencies import get_current_user
import httpx

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

@router.delete("/me")
def delete_own_account(
    current_user: dict = Depends(get_current_user),
    token: str = Depends(oauth2_scheme)
):
    user_id = current_user["id"]

    # --- Approach 1: Admin client with service role key ---
    admin_client = get_supabase_admin_client()
    if admin_client:
        try:
            admin_client.auth.admin.delete_user(user_id)
            return {"message": "Account deleted successfully."}
        except Exception as e:
            print(f"[Delete] Admin client failed: {e}")
            # Fall through to Approach 2

    # --- Approach 2: Call Supabase REST API with user's own JWT ---
    # Requires "Allow users to delete own accounts" enabled in Supabase
    # Dashboard → Authentication → Settings → User Deletion
    try:
        supabase_url = settings.SUPABASE_URL.rstrip("/")
        api_key = settings.SUPABASE_KEY

        response = httpx.delete(
            f"{supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": api_key,
                "Content-Type": "application/json",
            },
            timeout=10.0,
        )

        if response.status_code in (200, 204):
            return {"message": "Account deleted successfully."}

        print(f"[Delete] Self-delete API response: {response.status_code} - {response.text}")
        raise HTTPException(
            status_code=500,
            detail="Failed to delete account. Please contact the administrator."
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Delete] Self-delete request failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete account. Please try again.")
