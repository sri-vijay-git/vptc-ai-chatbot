from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

class UserBase(BaseModel):
    email: EmailStr
    role: Literal["student", "admin"] = "student"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    full_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
