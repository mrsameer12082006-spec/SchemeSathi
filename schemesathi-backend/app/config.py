from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

# Locate .env file relative to current file or project root
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

class Settings(BaseSettings):
    SUPABASE_URL: str = "https://yywtrgwhemfwywfnwmxf.supabase.co"
    SUPABASE_KEY: str = "sb_publishable_hBj_1ALXEzUorlS28aXOPg_AXM-b_xx"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    
    # Groq AI Voice & LLM Settings
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    GROQ_WHISPER_MODEL: str = "whisper-large-v3"
    
    # Sarvam AI Voice Settings (Hinglish/Hindi STT & Bulbul Neural TTS)
    SARVAM_API_KEY: str = ""
    SARVAM_MODEL: str = "bulbul:v3"
    SARVAM_SPEAKER: Optional[str] = "priya"
    SARVAM_PACE: float = 1.0
    SARVAM_TEMPERATURE: float = 0.7
    SARVAM_PITCH: float = -0.1
    SARVAM_LOUDNESS: float = 1.0
    
    SESSION_TTL_MINUTES: int = 30
    SCHEME_CACHE_TTL_MINUTES: int = 60
    
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = True

    model_config = {
        "env_file": str(ENV_FILE) if ENV_FILE.exists() else None,
        "env_file_encoding": "utf-8",
        "extra": "ignore"
    }

@lru_cache()
def get_settings() -> Settings:
    return Settings()
