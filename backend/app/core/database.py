from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_KEY
    supabase: Client = create_client(url, key)
    return supabase

def get_supabase_admin_client() -> Client:
    """
    Returns a Supabase client initialized with the service_role key.
    Required for admin operations such as deleting users.
    Returns None if SUPABASE_SERVICE_ROLE_KEY is not configured.
    """
    if not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

supabase: Client = get_supabase_client()
