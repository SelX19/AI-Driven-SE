import pytest
from faker import Faker

fake = Faker()

def test_register_and_login(client):
    email = fake.email()
    
    # Register a new user
    response = client.post("/auth/register", json={"email": email})
    assert response.status_code == 201
    assert response.json()["email"] == email

    # Try to register the same user again
    response = client.post("/auth/register", json={"email": email})
    assert response.status_code == 400

    # Login with the new user
    response = client.post("/auth/login", json={"email": email})
    assert response.status_code == 200
    assert response.json()["email"] == email

def test_login_not_found(client):
    email = fake.email()
    response = client.post("/auth/login", json={"email": email})
    assert response.status_code == 404
