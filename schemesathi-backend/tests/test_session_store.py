import pytest
from app.services.session_store import EphemeralSessionStore
from app.models.profile import IngestProfileRequest

def test_create_and_get_session():
    store = EphemeralSessionStore()
    created = store.create_session(language="hi")
    assert created.session_id.startswith("sess_")
    assert created.language == "hi"

    retrieved = store.get_session(created.session_id)
    assert retrieved is not None
    assert retrieved.session_id == created.session_id
    assert retrieved.language == "hi"

def test_ingest_profile_attributes():
    store = EphemeralSessionStore()
    created = store.create_session(language="en")
    
    # Ingest partial attributes from Voice LLM
    updated = store.update_profile(
        created.session_id,
        IngestProfileRequest(
            occupation="Farmer",
            landholding_hectares=1.8,
            annual_income=120000.0,
            raw_attributes={"crops": "Wheat, Mustard", "district": "Karnal"}
        )
    )
    assert updated is not None
    assert updated.occupation == "Farmer"
    assert updated.landholding_hectares == 1.8
    assert updated.annual_income == 120000.0
    assert updated.raw_attributes["crops"] == "Wheat, Mustard"

def test_explicit_session_deletion_purges_memory():
    store = EphemeralSessionStore()
    created = store.create_session(language="en")
    sid = created.session_id

    # Populate profile
    store.update_profile(sid, IngestProfileRequest(occupation="Student", age=20))
    assert store.get_session(sid) is not None

    # User closes browser / resets -> trigger explicit deletion
    deleted = store.delete_session(sid)
    assert deleted is True

    # Confirm profile is completely purged from RAM
    assert store.get_session(sid) is None

def test_nonexistent_session():
    store = EphemeralSessionStore()
    assert store.get_session("non_existent_id") is None
    assert store.delete_session("non_existent_id") is False
