import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "Zero-PII" in data["privacy"]

def test_get_schemes_catalog_from_supabase():
    res = client.get("/api/schemes?language=en")
    assert res.status_code == 200
    schemes = res.json()
    assert len(schemes) == 30
    assert any(s["code"] == "pmksy" for s in schemes)

def test_single_scheme_detail():
    res = client.get("/api/schemes/pmksy?language=en")
    assert res.status_code == 200
    scheme = res.json()
    assert scheme["code"] == "pmksy"
    assert len(scheme["documents"]) > 0
    assert len(scheme["steps"]) > 0

def test_end_to_end_ephemeral_session_and_evaluation():
    # 1. Start anonymous session
    res = client.post("/api/session", json={"language": "en"})
    assert res.status_code == 200
    session_id = res.json()["session_id"]
    assert session_id.startswith("sess_")

    # 2. Ingest profile attributes (simulating Voice LLM Agent extraction)
    ingest_res = client.post(
        f"/api/session/{session_id}/profile",
        json={
            "occupation": "Farmer",
            "landholding_hectares": 1.5,
            "annual_income": 120000.0,
            "state": "Haryana",
            "area": "Rural"
        }
    )
    assert ingest_res.status_code == 200

    # 3. Evaluate session against Supabase
    eval_res = client.post(f"/api/session/{session_id}/evaluate?language=en")
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert eval_data["total_schemes_checked"] == 30
    assert eval_data["eligible_count"] > 0
    assert eval_data["llm_spoken_summary"] is not None

    # Check that PM-Kisan is potentially eligible
    pm_kisan = next((r for r in eval_data["results"] if r["scheme_id"] == "pm-kisan"), None)
    assert pm_kisan is not None
    assert pm_kisan["status"] == "potentially_eligible"

    # 4. User closes browser / tab -> purge session
    del_res = client.delete(f"/api/session/{session_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 5. Confirm session is gone from RAM
    check_res = client.get(f"/api/session/{session_id}")
    assert check_res.status_code == 404

def test_direct_raw_evaluation_for_voice_llm_agent():
    """
    Simulates friend's Voice LLM Agent passing extracted citizen parameters directly.
    """
    res = client.post(
        "/api/eligibility/evaluate",
        json={
            "occupation": "Student",
            "annual_income": 150000.0,
            "area": "Urban",
            "language": "hi"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "hi"
    assert data["eligible_count"] > 0
    assert "पात्र" in data["llm_spoken_summary"]
