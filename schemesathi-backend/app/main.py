<<<<<<< HEAD
import os
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.limiter import limiter, custom_rate_limit_exceeded_handler
from app.routers.session import router as session_router
from app.routers.schemes import router as schemes_router
from app.routers.eligibility import router as eligibility_router
from app.routers.ai_chat import router as ai_chat_router
=======
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers.session import router as session_router
from app.routers.schemes import router as schemes_router
from app.routers.eligibility import router as eligibility_router
>>>>>>> origin/master
from app.services.session_store import session_store
from app.services.supabase_service import supabase_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("schemesathi")

async def periodic_session_cleanup():
    """Background task to periodically sweep expired sessions from memory."""
    while True:
        try:
            await asyncio.sleep(300)  # Sweep every 5 minutes
            session_store.cleanup_expired()
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error during periodic session cleanup: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: pre-warm scheme catalog cache and start cleanup task
    logger.info("Initializing SchemeSathi FastAPI backend...")
    cleanup_task = asyncio.create_task(periodic_session_cleanup())
    
    try:
        # Pre-warm Supabase cache so first evaluation is instant
        await supabase_service.get_schemes_with_criteria()
        logger.info("Pre-warmed Supabase schemes & criteria catalog.")
    except Exception as e:
        logger.warning(f"Could not pre-warm Supabase cache during startup: {e}")

    yield

    # Shutdown: cancel background sweep task
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass
    logger.info("SchemeSathi backend shut down cleanly.")

app = FastAPI(
    title="SchemeSathi API & Eligibility Engine",
    description="Privacy-First Backend for SchemeSathi. Deterministic rules-based eligibility checking, live Supabase integration, and zero persistent user PII.",
    version="1.0.0",
    lifespan=lifespan
)

<<<<<<< HEAD
# ─── Layer 2: Application-Level Rate Limiter (SlowAPI) ──────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)

# ─── Layer 3: Hardened Security Headers Middleware ──────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# ─── Layer 3: Controlled CORS Policy ─────────────────────────────────────────
cors_origins_env = os.environ.get("CORS_ORIGINS", "*")
if cors_origins_env == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
=======
# Enable CORS for frontend applications & Voice LLM Agent
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
>>>>>>> origin/master
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(session_router)
app.include_router(schemes_router)
app.include_router(eligibility_router)
<<<<<<< HEAD
app.include_router(ai_chat_router)
=======
>>>>>>> origin/master

@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "SchemeSathi API & Eligibility Engine",
        "version": "1.0.0",
        "privacy": "Zero-PII ephemeral in-memory storage",
        "database": "Supabase PostgreSQL connected",
        "docs_url": "/docs"
    }
