 # Configuration and settings

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()