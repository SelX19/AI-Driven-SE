# Database operations

from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app import models, schemas
from uuid import UUID
from typing import List, Optional
from datetime import datetime, timedelta, timezone


# User CRUD
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    """Get user by email"""
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: UUID) -> Optional[models.User]:
    """Get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, email: str) -> models.User:
    """Create new user"""
    user = models.User(email=email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Note CRUD
def get_note_by_id(db: Session, note_id: UUID, user_id: UUID) -> Optional[models.Note]:
    """Get a specific note by ID for a user"""
    return db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == user_id
    ).first()


def get_notes_by_user(
    db: Session, 
    user_id: UUID, 
    status: Optional[str] = None,
    is_favorite: Optional[bool] = None
) -> List[models.Note]:
    """Get all notes for a user, optionally filtered by status and favorite"""
    query = db.query(models.Note).filter(models.Note.user_id == user_id)
    
    if status:
        query = query.filter(models.Note.status == status)
    
    if is_favorite is not None:
        query = query.filter(models.Note.is_favorite == is_favorite)
    
    return query.order_by(desc(models.Note.created_at)).all()


def get_recent_notes_by_user(db: Session, user_id: UUID) -> List[models.Note]:
    """Get notes for a user that were created or updated in the last 24 hours."""
    twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(days=1)
    
    query = db.query(models.Note).filter(
        models.Note.user_id == user_id,
        or_(
            models.Note.created_at >= twenty_four_hours_ago,
            models.Note.updated_at >= twenty_four_hours_ago
        )
    )
    
    return query.order_by(desc(models.Note.created_at)).all()



def create_note(db: Session, note: schemas.NoteCreate, user_id: UUID) -> models.Note:
    """Create a new note"""
    db_note = models.Note(
        user_id=user_id,
        title=note.title,
        content=note.content,
        tags=note.tags,
        is_favorite=note.is_favorite,
        status="active"
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def update_note(
    db: Session, 
    note_id: UUID, 
    user_id: UUID, 
    note_update: schemas.NoteUpdate
) -> Optional[models.Note]:
    """Update note title and/or content"""
    db_note = get_note_by_id(db, note_id, user_id)
    
    if not db_note:
        return None
    
    update_data = note_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)
    
    db.commit()
    db.refresh(db_note)
    return db_note


def update_note_status(
    db: Session,
    note_id: UUID,
    user_id: UUID,
    status: str
) -> Optional[models.Note]:
    """Update note status (archive/unarchive)"""
    db_note = get_note_by_id(db, note_id, user_id)
    
    if not db_note:
        return None
    
    db_note.status = status
    db.commit()
    db.refresh(db_note)
    return db_note


def delete_note_permanently(db: Session, note_id: UUID, user_id: UUID) -> bool:
    """Permanently delete a note (not used in MVP, but available for future)"""
    db_note = get_note_by_id(db, note_id, user_id)
    
    if not db_note:
        return False
    
    db.delete(db_note)
    db.commit()
    return True