# Authentication endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=schemas.UserResponse, status_code=status.HTTP_200_OK)
def login(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Login with email only.
    Returns user data if email exists, raises 404 if not found.
    """
    user = crud.get_user_by_email(db, email=user_login.email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please check your email address."
        )
    
    return user


@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_login: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Register a new user with email.
    Returns 400 if email already exists.
    """
    existing_user = crud.get_user_by_email(db, email=user_login.email)
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered."
        )
    
    user = crud.create_user(db, email=user_login.email)
    return user