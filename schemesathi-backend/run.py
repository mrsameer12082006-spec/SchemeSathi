import uvicorn
from app.config import get_settings

if __name__ == "__main__":
    settings = get_settings()
    print(f"==================================================================")
    print(f" Starting SchemeSathi FastAPI Server & Eligibility Engine")
    print(f" URL: http://{settings.HOST}:{settings.PORT}")
    print(f" OpenAPI Docs: http://{settings.HOST}:{settings.PORT}/docs")
    print(f" Zero User PII Guaranteed: All user profiles ephemeral in RAM")
    print(f"==================================================================")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
