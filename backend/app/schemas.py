# Pydantic schemas for validation

from pydantic import BaseModel, EmailStr, Field
from typing import Literal
from datetime import datetime
from uuid import UUID


# User Schemas
class UserLogin(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Note Schemas
class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(default="")
    tags: str = Field(default="")
    category: str | None = None
    is_favorite: bool = False


class NoteUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    content: str | None = None
    tags: str | None = None
    category: str | None = None
    is_favorite: bool | None = None


class NoteStatusUpdate(BaseModel):
    status: Literal["active", "archived"]


class NoteFavoriteUpdate(BaseModel):
    is_favorite: bool


class NoteResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    content: str
    tags: str
    category: str | None = None
    status: Literal["active", "archived"]
    is_favorite: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True