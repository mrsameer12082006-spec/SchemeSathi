import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.groq_service import groq_service
from app.services.voice_service import voice_service

client = TestClient(app)


def test_groq_unit_conversion_bigha():
    """Verify that 3 bigha is converted to 0.75 hectares accurately."""
    user_text = "मैं उत्तर प्रदेश का किसान हूँ, मेरे पास 3 बीघा ज़मीन है और वार्षिक आय ₹80,000 है।"
    profile, details = groq_service.extract_attributes(user_text, language="hi")
    
    assert profile.occupation == "Farmer"
    assert profile.landholding_hectares == 0.75
    assert profile.annual_income == 80000.0
    assert profile.state == "Uttar Pradesh"


def test_groq_unit_conversion_acre():
    """Verify that 2 acres is converted to ~0.81 hectares."""
    user_text = "I am a farmer from Haryana with 2 acres land and below 1 lakh income."
    profile, details = groq_service.extract_attributes(user_text, language="en")
    
    assert profile.occupation == "Farmer"
    assert profile.landholding_hectares == 0.81
    assert profile.state == "Haryana"
    assert profile.annual_income == 75000.0


def test_ai_extract_endpoint():
    """Test /api/ai/extract endpoint with Hinglish input."""
    payload = {
        "text": "Main Bihar ka kisan hoon, 4 bigha kheti ki zameen hai.",
        "language": "hi"
    }
    response = client.post("/api/ai/extract", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    profile = data["profile"]
    assert profile["occupation"] == "Farmer"
    assert profile["landholding_hectares"] == 1.0  # 4 * 0.25 = 1.0 ha
    assert profile["state"] == "Bihar"


def test_ai_chat_end_to_end_pipeline():
    """Test full AI chat turn: text -> extraction -> deterministic evaluation -> response."""
    payload = {
        "message": "मैं एक छोटा किसान हूँ, 1.5 हेक्टेयर ज़मीन है और आय ₹75,000 है।",
        "language": "hi",
        "synthesize_audio": False
    }
    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["session_id"] is not None
    assert data["eligible_count"] >= 1
    assert len(data["results"]) > 0
    assert "reply" in data
    assert len(data["reply"]) > 10
    assert data["done"] is True


def test_voice_service_mock_fallback():
    """Verify VoiceService handles audio gracefully without throwing."""
    import asyncio
    audio_bytes = b"RIFF....WAVEfmt ...."
    res = asyncio.run(voice_service.transcribe(audio_bytes, language_code="hi-IN"))
    assert "transcript" in res
    assert res["status"] in ["mock", "success", "error"]


def test_rag_semantic_search_endpoint():
    """Verify RAG semantic retrieval matches relevant schemes."""
    payload = {
        "query": "फसल नुकसान और प्राकृतिक आपदा पर बीमा",
        "top_k": 3
    }
    response = client.post("/api/ai/search", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["count"] > 0
    # Should match crop insurance (pmfby)
    matched_codes = [r["scheme_code"] for r in data["results"]]
    assert "pmfby" in matched_codes
