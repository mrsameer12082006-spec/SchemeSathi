from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class CategoryModel(BaseModel):
    id: Optional[str] = None
    code: str
    name_en: str
    name_hi: str

class SchemeDocumentModel(BaseModel):
    id: Optional[str] = None
    document_name_en: str
    document_name_hi: str
    is_mandatory: bool = True
    display_order: int = 0

class SchemeStepModel(BaseModel):
    id: Optional[str] = None
    step_number: int
    title_en: str
    title_hi: str
    description_en: str
    description_hi: str
    channel: str = "Online"

class SchemeCriteriaModel(BaseModel):
    id: Optional[str] = None
    min_age: int = 0
    max_age: int = 120
    max_annual_income: Optional[float] = None
    max_landholding_hectares: Optional[float] = None
    allowed_occupations: List[str] = Field(default_factory=list)
    allowed_genders: List[str] = Field(default_factory=lambda: ["Male", "Female", "Other"])
    allowed_areas: List[str] = Field(default_factory=lambda: ["Rural", "Urban"])
    caste_categories: List[str] = Field(default_factory=lambda: ["General", "OBC", "SC", "ST", "EWS"])

class SchemeSummary(BaseModel):
    id: str  # Code slug
    db_id: Optional[str] = None
    code: str
    name: str
    summary: str
    category: str
    category_code: str
    nodal_ministry: Optional[str] = ""
    official_url: Optional[str] = ""

class SchemeDetail(BaseModel):
    id: str
    db_id: Optional[str] = None
    code: str
    name: str
    summary: str
    category: str
    category_code: str
    nodal_ministry: Optional[str] = ""
    benefits: str
    official_url: str
    documents: List[str] = Field(default_factory=list)
    steps: List[str] = Field(default_factory=list)
    last_verified: Optional[str] = None
    demo: bool = False

class EvaluationResult(BaseModel):
    scheme_id: str
    name: str
    summary: str
    category: str
    status: str = Field(..., description="'potentially_eligible', 'needs_information', or 'not_eligible'")
    passed: List[str] = Field(default_factory=list)
    failed: List[str] = Field(default_factory=list)
    missing: List[str] = Field(default_factory=list)
    benefits: Optional[str] = None
    official_url: Optional[str] = None
    documents: Optional[List[str]] = None
    steps: Optional[List[str]] = None

class EvaluationResponse(BaseModel):
    session_id: Optional[str] = None
    language: str
    total_schemes_checked: int
    eligible_count: int
    needs_info_count: int
    not_eligible_count: int
    understood_profile: Dict[str, Any]
    results: List[EvaluationResult]
    llm_spoken_summary: Optional[str] = Field(
        None, 
        description="A pre-formulated concise conversational summary designed for the Voice LLM Agent to speak out to the user"
    )
