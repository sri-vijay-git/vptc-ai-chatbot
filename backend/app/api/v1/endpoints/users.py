from fastapi import APIRouter, HTTPException, Depends
from app.core.database import supabase
from app.api.v1.dependencies import get_current_user
import os

router = APIRouter()

@router.delete("/me")
def delete_own_account(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user["id"]

        # Use Supabase Admin API with the service_role key for real deletion
        service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not service_role_key:
            raise HTTPException(
                status_code=501,
                detail="Account deletion is not configured on the server. Please contact the administrator."
            )

        from supabase import create_client
        supabase_url = os.getenv("SUPABASE_URL")
        admin_client = create_client(supabase_url, service_role_key)
        admin_client.auth.admin.delete_user(user_id)

        return {"message": "Account deleted successfully."}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete account. Please try again.")
