from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional

from app.models.scheme import SchemeSummary, SchemeDetail
from app.services.supabase_service import supabase_service

router = APIRouter(prefix="/api/schemes", tags=["Schemes Catalog"])

@router.get("", response_model=List[SchemeSummary], summary="List active verified schemes")
async def list_schemes(
    language: str = Query("en", description="'en' or 'hi'"),
    category: Optional[str] = Query(None, description="Optional category code filter (e.g. farmers, students, women, seniors, workers, business)")
):
    """
    Returns active schemes from the database, localized into English or Hindi.
    """
    try:
        schemes = await supabase_service.get_all_schemes(language=language)
        if category and category.lower() != "all":
            norm = category.lower()
            schemes = [s for s in schemes if s.category_code.lower() == norm or norm in s.category.lower()]
        return schemes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch schemes: {str(e)}")

@router.get("/{code_or_id}", response_model=SchemeDetail, summary="Get full scheme details by code or UUID")
async def get_scheme(
    code_or_id: str = Path(..., description="Scheme code slug (e.g. pm-kisan) or UUID"),
    language: str = Query("en", description="'en' or 'hi'")
):
    try:
        scheme = await supabase_service.get_scheme_by_code_or_id(code_or_id, language=language)
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        return scheme
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch scheme detail: {str(e)}")
