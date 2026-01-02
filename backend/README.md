# Notes App - Backend

FastAPI backend for a simple note-taking application with email-only authentication.

## Setup Instructions

### 1. Prerequisites
- Python 3.10+
- PostgreSQL 14+

### 2. Install Dependencies
```bash
cd backend
python -m venv venv # to create Python Virtual Environment
source venv/bin/activate  # to activate it
pip install -r requirements.txt # to install dependencies
```

### 3. Configure Environment

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL=postgresql://user:password@localhost:5432/notes_app
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE notes_app;
```

### 5. Run the Application
```bash
# From the backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

### 5. Activate postgreSQL MCP server

Before starting CLI with 'gemini' command, set up the db credentials (not storing for security):

export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_DATABASE=notes_app
export POSTGRES_USER=selmadjozic
export POSTGRES_PASSWORD=replacewithown

