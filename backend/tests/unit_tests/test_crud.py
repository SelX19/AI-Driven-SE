
import pytest
from faker import Faker
from app.crud import (
    create_user,
    get_user_by_email,
    create_note,
    get_notes_by_user,
    get_note_by_id,
    update_note,
    delete_note_permanently
)
from app.schemas import NoteCreate, NoteUpdate

fake = Faker()

def test_create_and_get_user(db_session):
    email = fake.email()
    user = create_user(db_session, email)
    db_session.commit()
    
    retrieved_user = get_user_by_email(db_session, email)
    assert retrieved_user
    assert retrieved_user.email == email

def test_create_and_get_note(db_session):
    user_email = fake.email()
    user = create_user(db_session, user_email)
    db_session.commit()
    
    note_data = NoteCreate(title=fake.sentence(), content=fake.text())
    note = create_note(db_session, note_data, user.id)
    db_session.commit()

    retrieved_note = get_note_by_id(db_session, note.id, user.id)
    assert retrieved_note
    assert retrieved_note.id == note.id

def test_get_notes_by_user(db_session):
    user_email = fake.email()
    user = create_user(db_session, user_email)
    db_session.commit()

    for _ in range(3):
        note_data = NoteCreate(title=fake.sentence(), content=fake.text())
        create_note(db_session, note_data, user.id)
    db_session.commit()

    notes = get_notes_by_user(db_session, user.id)
    assert len(notes) == 3

def test_update_note_by_user(db_session):
    user_email = fake.email()
    user = create_user(db_session, user_email)
    db_session.commit()
    
    note_data = NoteCreate(title="Original Title", content="Original Content")
    note = create_note(db_session, note_data, user.id)
    db_session.commit()

    update_data = NoteUpdate(title="Updated Title")
    updated_note = update_note(db_session, note.id, user.id, update_data)
    db_session.commit()
    
    assert updated_note.title == "Updated Title"
    assert updated_note.content == "Original Content"

def test_delete_note(db_session):
    user_email = fake.email()
    user = create_user(db_session, user_email)
    db_session.commit()

    note_data = NoteCreate(title="Note to delete", content="This note will be deleted.")
    note = create_note(db_session, note_data, user.id)
    db_session.commit()

    deleted = delete_note_permanently(db_session, note.id, user.id)
    db_session.commit()
    assert deleted

    retrieved_note = get_note_by_id(db_session, note.id, user.id)
    assert retrieved_note is None
