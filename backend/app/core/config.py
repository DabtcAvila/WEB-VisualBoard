from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
import json
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "Visual Board API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Handle Render's postgres:// vs postgresql:// issue
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/visualboard")
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    UNSPLASH_ACCESS_KEY: Optional[str] = os.getenv("UNSPLASH_ACCESS_KEY")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:3000",
        "https://dabtcavila.github.io",
        "https://DabtcAvila.github.io"
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = True


settings = Settings()