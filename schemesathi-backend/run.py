import os
import uvicorn
from app.config import get_settings

if __name__ == "__main__":
    settings = get_settings()
    host = os.environ.get("HOST", settings.HOST)
    port = int(os.environ.get("PORT", str(settings.PORT)))
    print(f"==================================================================")
    print(f" Starting SchemeSathi FastAPI Server & Eligibility Engine")
    print(f" URL: http://{host}:{port}")
    print(f" OpenAPI Docs: http://{host}:{port}/docs")
    print(f" Zero User PII Guaranteed: All user profiles ephemeral in RAM")
    print(f"==================================================================")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=settings.DEBUG
    )
