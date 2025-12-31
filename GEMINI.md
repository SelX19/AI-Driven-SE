# GEMINI.md

This file provides a comprehensive overview of the Notes App project, its structure, and how to run it. It is intended to be used as a quick-start guide and a reference for developers.

## Project Overview

This project is a full-stack note-taking application. It allows users to create, view, update, and delete notes. The application features a modern, clean user interface and a RESTful backend API with email-based authentication.

## Architecture

The project is a monolith organized into two main parts:

-   `frontend/`: A React single-page application (SPA) that provides the user interface.
-   `backend/`: A FastAPI application that serves as the backend API.

The frontend and backend are developed and run as separate processes but are designed to work together.

## Backend

The backend is a Python-based RESTful API built with the FastAPI framework.

### Key Technologies

-   **Framework:** FastAPI
-   **Database:** PostgreSQL
-   **ORM:** SQLAlchemy
-   **Validation:** Pydantic
-   **Authentication:** Email-based, handled in-app.

### Setup and Running

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a Python virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the database:**
    -   Ensure you have PostgreSQL running.
    -   Create a database (e.g., `notes_app`).
    -   Create a `.env` file with your database connection string.

5.  **Run the development server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

### API Endpoints

-   `/docs`: Interactive API documentation (Swagger UI).
-   `/auth/token`: Get JWT token for authentication.
-   `/users/me`: Get current user's information.
-   `/notes/`: CRUD operations for notes.

## Frontend

The frontend is a React application built with Vite.

### Key Technologies

-   **Framework:** React.js
-   **Bundler:** Vite
-   **Routing:** React Router
-   **Styling:** Tailwind CSS
-   **State Management:** React Context API (for authentication)

### Setup and Running

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Component Structure

-   `src/pages`: Contains the main pages of the application (`Login`, `Dashboard`, `NoteDetail`).
-   `src/components`: Contains reusable components like `NoteCard` and `ProtectedRoute`.
-   `src/services/api.js`: A module for making API calls to the backend.
-   `src/context/AuthContext.js`: Manages authentication state.

## Development Conventions

-   **Backend:** Follows standard FastAPI project structure. Code is organized into `routers`, `models`, `schemas`, and `crud` modules.
-   **Frontend:** Uses functional components with hooks. Code is organized by feature into `pages` and `components`.
-   **Styling:** Utility-first CSS with Tailwind CSS.
-   **API Communication:** The frontend communicates with the backend via RESTful API calls. The base URL for the API is configured to be `http://localhost:8000`.

### Additional Coding Preferences

- Do not use Tailwind classes in component templates.
- Keep project dependencies minimal.