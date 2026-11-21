from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class UserProfile(BaseModel):
    """
    Ephemeral citizen profile model.
    Held strictly in volatile RAM memory during the session.
    Never persisted to database or disk.
    """
    occupation: Optional[str] = Field(None, description="Primary occupation (Farmer, Student, Woman, Worker, Senior citizen, Small business)")
    landholding_hectares: Optional[float] = Field(None, description="Cultivable landholding size in hectares")
    land_ownership: Optional[str] = Field(None, description="Ownership type: 'Own land', 'Tenant', 'Landless'")
    annual_income: Optional[float] = Field(None, description="Total household annual income in INR")
    income_bracket: Optional[str] = Field(None, description="Categorical income bracket (e.g. Below 1 Lakh, 1 - 2.5 Lakh, Above 2.5 Lakh)")
    age: Optional[int] = Field(None, description="Citizen age in years")
    gender: Optional[str] = Field(None, description="'Male', 'Female', 'Other'")
    state: Optional[str] = Field(None, description="State of residence (e.g. Haryana, UP, Bihar, etc.)")
    area: Optional[str] = Field(None, description="'Rural' or 'Urban'")
    education_level: Optional[str] = Field(None, description="Current education level (e.g. Class 9-10, College, Higher Studies)")
    caste_category: Optional[str] = Field(None, description="Caste category: 'General', 'OBC', 'SC', 'ST', 'EWS'")
    raw_attributes: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary key-value attributes extracted by the Voice LLM Agent in Hindi or English")

class SessionCreateRequest(BaseModel):
    language: str = Field("en", description="'en' or 'hi'")

class SessionResponse(BaseModel):
    session_id: str
    created_at: str
    language: str
    profile: UserProfile

class IngestProfileRequest(BaseModel):
    """
    Endpoint request model for the Voice LLM Agent to stream or update extracted profile data.
    """
    occupation: Optional[str] = None
    landholding_hectares: Optional[float] = None
    land_ownership: Optional[str] = None
    annual_income: Optional[float] = None
    income_bracket: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    area: Optional[str] = None
    education_level: Optional[str] = None
    caste_category: Optional[str] = None
    raw_attributes: Optional[Dict[str, Any]] = None
    language: Optional[str] = None
