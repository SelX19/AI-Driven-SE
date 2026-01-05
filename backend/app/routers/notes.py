# Notes CRUD endpoints

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app import schemas, crud
from app.database import get_db

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=List[schemas.NoteResponse])
def get_notes(
    user_id: UUID = Query(..., description="User ID"),
    status: Optional[str] = Query(None, description="Filter by status: active or archived"),
    db: Session = Depends(get_db)
):
    """
    Get all notes for a user.
    Optionally filter by status (active/archived).
    """
    # Verify user exists
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Validate status parameter if provided
    if status and status not in ["active", "archived"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'active' or 'archived'"
        )
    
    notes = crud.get_notes_by_user(db, user_id=user_id, status=status)
    return notes


@router.get("/{note_id}", response_model=schemas.NoteResponse)
def get_note(
    note_id: UUID,
    user_id: UUID = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """
    Get a specific note by ID for a user.
    """
    note = crud.get_note_by_id(db, note_id=note_id, user_id=user_id)
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return note


@router.post("/", response_model=schemas.NoteResponse, status_code=status.HTTP_201_CREATED)
def create_note(
    note: schemas.NoteCreate,
    user_id: UUID = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """
    Create a new note for a user.
    """
    # Verify user exists
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    new_note = crud.create_note(db, note=note, user_id=user_id)
    return new_note


@router.patch("/{note_id}", response_model=schemas.NoteResponse)
def update_note(
    note_id: UUID,
    note_update: schemas.NoteUpdate,
    user_id: UUID = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """
    Update note title and/or content.
    """
    updated_note = crud.update_note(db, note_id=note_id, user_id=user_id, note_update=note_update)
    
    if not updated_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return updated_note





@router.patch("/{note_id}/status", response_model=schemas.NoteResponse)


def update_note_status(


    note_id: UUID,


    status_update: schemas.NoteStatusUpdate,


    user_id: UUID = Query(..., description="User ID"),


    db: Session = Depends(get_db)


):


    """


    Update note status (archive/unarchive).


    """


    updated_note = crud.update_note_status(


        db, 


        note_id=note_id, 


        user_id=user_id, 


        status=status_update.status


    )


    


    if not updated_note:


        raise HTTPException(


            status_code=status.HTTP_404_NOT_FOUND,


            detail="Note not found"


        )


    


    return updated_note








@router.patch("/{note_id}/favorite", response_model=schemas.NoteResponse)


def toggle_favorite_note(


    note_id: UUID,


    favorite_update: schemas.NoteFavoriteUpdate,


    user_id: UUID = Query(..., description="User ID"),


    db: Session = Depends(get_db)


):


    """


    Update note's favorite status.


    """


    note_update_schema = schemas.NoteUpdate(is_favorite=favorite_update.is_favorite)


    updated_note = crud.update_note(db, note_id=note_id, user_id=user_id, note_update=note_update_schema)


    


    if not updated_note:


        raise HTTPException(


            status_code=status.HTTP_404_NOT_FOUND,


            detail="Note not found"


        )


    


    return updated_note








@router.get("/favorites/", response_model=List[schemas.NoteResponse])


def get_favorite_notes(


    user_id: UUID = Query(..., description="User ID"),


    db: Session = Depends(get_db)


):


    """


    Get all favorite notes for a user.


    """


    user = crud.get_user_by_id(db, user_id)


    if not user:


        raise HTTPException(


            status_code=status.HTTP_404_NOT_FOUND,


            detail="User not found"


        )


    


    notes = crud.get_notes_by_user(db, user_id=user_id, is_favorite=True)


    return notes

