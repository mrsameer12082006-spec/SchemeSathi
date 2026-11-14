from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from pathlib import Path

# Locate .env file relative to current file or project root
ENV_FILE = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    SUPABASE_URL: str = "https://yywtrgwhemfwywfnwmxf.supabase.co"
    SUPABASE_KEY: str = "sb_publishable_hBj_1ALXEzUorlS28aXOPg_AXM-b_xx"
    
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
