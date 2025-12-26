# Notes App - Frontend

React frontend for a simple note-taking application with sticky notes UI.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:8000

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at: http://localhost:5173

### 4. Build for Production
```bash
npm run build
```

Built files will be in the `dist/` directory.
````

---

## Quick Start Instructions

### 1. Create Project Structure

Create a folder named `notes-app` and copy all files according to the structure above.

### 2. Set Up Backend
````bash
cd notes-app/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create PostgreSQL database
psql -U postgres
CREATE DATABASE notes_app;
\q

# Run backend
uvicorn app.main:app --reload
````

### 3. Set Up Frontend
````bash
cd notes-app/frontend

# Install dependencies
npm install

# Run frontend
npm run dev
````

### 4. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 5. Create a Zip File

**On macOS/Linux:**
````bash
cd /path/to/parent/directory
zip -r notes-app.zip notes-app/
````

**On Windows:**
- Right-click the `notes-app` folder
- Select "Send to" → "Compressed (zipped) folder"