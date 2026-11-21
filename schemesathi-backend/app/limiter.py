import os
import logging
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

logger = logging.getLogger("schemesathi.limiter")

# Configurable rate limits with sensible defaults for public login-free deployment
# Generous for legitimate rural users and test suites, strict against automated abuse
CHAT_RATE_LIMIT = os.environ.get("RATE_LIMIT_CHAT", "60/minute")
TTS_RATE_LIMIT = os.environ.get("RATE_LIMIT_TTS", "60/minute")
STT_RATE_LIMIT = os.environ.get("RATE_LIMIT_STT", "30/minute")
DEFAULT_RATE_LIMIT = os.environ.get("RATE_LIMIT_DEFAULT", "120/minute")


def get_client_ip(request: Request) -> str:
    """
    Extracts true client IP address:
    1. Cloudflare CF-Connecting-IP (Layer 1 Edge Protection)
    2. X-Forwarded-For (standard reverse proxy)
    3. Direct client remote address
    """
    # Cloudflare edge header
    cf_connecting_ip = request.headers.get("CF-Connecting-IP")
    if cf_connecting_ip:
        return cf_connecting_ip.strip()

    # Standard X-Forwarded-For header
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()

    # Direct client socket IP
    return get_remote_address(request) or "127.0.0.1"


# Initialize central Limiter instance
limiter = Limiter(
    key_func=get_client_ip,
    default_limits=[DEFAULT_RATE_LIMIT],
    headers_enabled=False
)


async def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Friendly bilingual rate-limit error response for SchemeSathi.
    Provides clear advice and retry headers instead of a raw cryptic crash.
    """
    client_ip = get_client_ip(request)
    logger.warning(f"Rate limit exceeded for client {client_ip} on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "message": "आप बहुत तेज़ी से अनुरोध कर रहे हैं। कृपया कुछ क्षण प्रतीक्षा करें। / You are making requests too quickly. Please wait a moment and try again.",
            "detail": exc.detail,
            "retry_after_seconds": 60
        },
        headers={
            "Retry-After": "60",
            "X-RateLimit-Error": "RateLimitExceeded"
        }
    )
