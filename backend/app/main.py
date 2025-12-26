# FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, notes

app = FastAPI(
    title="Notes API",
    description="Simple note-taking application API",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(notes.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Notes API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}