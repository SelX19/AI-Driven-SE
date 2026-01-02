
import pytest
from faker import Faker
from app.crud import create_user

fake = Faker()

@pytest.fixture(scope="function")
def test_user(db_session):
    # Use the session from the fixture to create a user
    user = create_user(db_session, fake.email())
    db_session.commit() # Commit the user so it's available in the test
    return user

def test_create_note(client, test_user):
    response = client.post(
        f"/notes/?user_id={test_user.id}",
        json={"title": "Test Note", "content": "Test content"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Note"
    assert "id" in data

def test_get_notes(client, test_user):
    # Create a note first
    client.post(
        f"/notes/?user_id={test_user.id}",
        json={"title": "Another Note", "content": "More content"}
    )
    
    response = client.get(f"/notes/?user_id={test_user.id}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # The number of notes can vary depending on test execution order, so check for at least one
    assert len(response.json()) >= 1

def test_get_specific_note(client, test_user):
    create_response = client.post(
        f"/notes/?user_id={test_user.id}",
        json={"title": "Specific Note", "content": "Content to be found"}
    )
    note_id = create_response.json()["id"]

    response = client.get(f"/notes/{note_id}?user_id={test_user.id}")
    assert response.status_code == 200
    assert response.json()["id"] == note_id

def test_update_note(client, test_user):
    create_response = client.post(
        f"/notes/?user_id={test_user.id}",
        json={"title": "Old Title", "content": "Old content"}
    )
    note_id = create_response.json()["id"]

    response = client.patch(
        f"/notes/{note_id}?user_id={test_user.id}",
        json={"title": "New Title"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"

def test_update_note_status(client, test_user):
    create_response = client.post(
        f"/notes/?user_id={test_user.id}",
        json={"title": "Active Note", "content": "This note is active"}
    )
    note_id = create_response.json()["id"]

    response = client.patch(
        f"/notes/{note_id}/status?user_id={test_user.id}",
        json={"status": "archived"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "archived"
    
def test_get_non_existent_note(client, test_user):
    non_existent_uuid = fake.uuid4()
    response = client.get(f"/notes/{non_existent_uuid}?user_id={test_user.id}")
    assert response.status_code == 404
