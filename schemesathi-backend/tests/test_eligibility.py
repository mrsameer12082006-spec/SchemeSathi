import pytest
from app.services.eligibility_engine import EligibilityEngine
from app.models.profile import UserProfile

MOCK_SCHEMES_CATALOG = [
    {
        "code": "pm-kisan",
        "name_en": "PM Kisan Samman Nidhi",
        "name_hi": "पीएम किसान सम्मान निधि",
        "summary_en": "₹6,000 per year income support for small farmers.",
        "summary_hi": "छोटे किसानों के लिए ₹6,000 वार्षिक सहायता।",
        "benefits_en": "₹6,000 annually via DBT.",
        "benefits_hi": "₹6,000 प्रति वर्ष डीबीटी द्वारा।",
        "official_url": "https://pmkisan.gov.in",
        "categories": {"code": "farmers", "name_en": "Farmer", "name_hi": "किसान"},
        "scheme_eligibility_criteria": {
            "min_age": 18,
            "max_age": 100,
            "max_landholding_hectares": 2.0,
            "max_annual_income": None,
            "allowed_occupations": ["Farmer"],
            "allowed_genders": ["Male", "Female", "Other"],
            "allowed_areas": ["Rural", "Urban"]
        },
        "scheme_documents": [
            {"document_name_en": "Aadhaar Card", "document_name_hi": "आधार कार्ड", "display_order": 1}
        ],
        "scheme_steps": [
            {"description_en": "Register on PM-Kisan portal", "description_hi": "पीएम-किसान पोर्टल पर पंजीकरण करें", "step_number": 1}
        ]
    },
    {
        "code": "pmmvy",
        "name_en": "Pradhan Mantri Matru Vandana Yojana",
        "name_hi": "प्रधानमंत्री मातृ वंदना योजना",
        "summary_en": "Maternity cash incentive of ₹5,000.",
        "summary_hi": "गर्भवती माताओं के लिए ₹5,000 सहायता।",
        "benefits_en": "₹5,000 in stages.",
        "benefits_hi": "किस्तों में ₹5,000।",
        "official_url": "https://pmmvy.wcd.gov.in",
        "categories": {"code": "women", "name_en": "Woman", "name_hi": "महिला"},
        "scheme_eligibility_criteria": {
            "min_age": 19,
            "max_age": 45,
            "max_annual_income": None,
            "allowed_occupations": ["Woman", "Mother"],
            "allowed_genders": ["Female"],
            "allowed_areas": ["Rural", "Urban"]
        },
        "scheme_documents": [],
        "scheme_steps": []
    },
    {
        "code": "nsp-scholarship",
        "name_en": "Post-Matric Scholarship for Students",
        "name_hi": "छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
        "summary_en": "Tuition reimbursement for low-income students.",
        "summary_hi": "कम आय वाले छात्रों के लिए शिक्षण शुल्क प्रतिपूर्ति।",
        "benefits_en": "Tuition fee waiver.",
        "benefits_hi": "शिक्षण शुल्क माफी।",
        "official_url": "https://scholarships.gov.in",
        "categories": {"code": "students", "name_en": "Student", "name_hi": "छात्र"},
        "scheme_eligibility_criteria": {
            "min_age": 15,
            "max_age": 30,
            "max_annual_income": 250000.0,
            "allowed_occupations": ["Student"],
            "allowed_genders": ["Male", "Female", "Other"],
            "allowed_areas": ["Rural", "Urban"]
        },
        "scheme_documents": [],
        "scheme_steps": []
    }
]

def test_small_farmer_is_potentially_eligible():
    engine = EligibilityEngine()
    profile = UserProfile(
        occupation="Farmer",
        landholding_hectares=1.5,
        annual_income=120000.0
    )
    resp = engine.evaluate(profile, MOCK_SCHEMES_CATALOG, language="en")
    assert resp.total_schemes_checked == 3
    
    # PM-Kisan should be potentially eligible
    pm_kisan = next((r for r in resp.results if r.scheme_id == "pm-kisan"), None)
    assert pm_kisan is not None
    assert pm_kisan.status == "potentially_eligible"
    assert any("within 2.0 ha limit" in p for p in pm_kisan.passed)
    assert len(pm_kisan.failed) == 0

def test_large_farmer_fails_landholding_limit():
    engine = EligibilityEngine()
    profile = UserProfile(
        occupation="Farmer",
        landholding_hectares=4.0  # Exceeds 2.0 ha
    )
    resp = engine.evaluate(profile, MOCK_SCHEMES_CATALOG, language="en")
    pm_kisan = next((r for r in resp.results if r.scheme_id == "pm-kisan"), None)
    assert pm_kisan is not None
    assert pm_kisan.status == "not_eligible"
    assert any("exceeds 2.0 ha limit" in f for f in pm_kisan.failed)

def test_student_income_check():
    engine = EligibilityEngine()
    
    # Low-income student: eligible
    student_low = UserProfile(occupation="Student", annual_income=150000.0)
    resp_low = engine.evaluate(student_low, MOCK_SCHEMES_CATALOG, language="en")
    res_low = next((r for r in resp_low.results if r.scheme_id == "nsp-scholarship"), None)
    assert res_low is not None
    assert res_low.status == "potentially_eligible"

    # High-income student: not eligible
    student_high = UserProfile(occupation="Student", annual_income=400000.0)
    resp_high = engine.evaluate(student_high, MOCK_SCHEMES_CATALOG, language="en")
    res_high = next((r for r in resp_high.results if r.scheme_id == "nsp-scholarship"), None)
    assert res_high is not None
    assert res_high.status == "not_eligible"

def test_gender_restriction():
    engine = EligibilityEngine()
    
    # Male citizen should fail women-only schemes
    male_profile = UserProfile(occupation="Farmer", gender="Male")
    resp_male = engine.evaluate(male_profile, MOCK_SCHEMES_CATALOG, language="en")
    pmmvy_male = next((r for r in resp_male.results if r.scheme_id == "pmmvy"), None)
    # pmmvy shouldn't even be included or if evaluated must be not_eligible
    if pmmvy_male:
        assert pmmvy_male.status == "not_eligible"

    # Female citizen should be eligible
    female_profile = UserProfile(occupation="Woman", gender="Female")
    resp_female = engine.evaluate(female_profile, MOCK_SCHEMES_CATALOG, language="en")
    pmmvy_female = next((r for r in resp_female.results if r.scheme_id == "pmmvy"), None)
    assert pmmvy_female is not None
    assert pmmvy_female.status == "potentially_eligible"

def test_spoken_summary_generation_hindi_and_english():
    engine = EligibilityEngine()
    profile = UserProfile(occupation="किसान", landholding_hectares=1.2)
    resp_hi = engine.evaluate(profile, MOCK_SCHEMES_CATALOG, language="hi")
    assert resp_hi.llm_spoken_summary is not None
    assert "पात्र" in resp_hi.llm_spoken_summary

    resp_en = engine.evaluate(profile, MOCK_SCHEMES_CATALOG, language="en")
    assert resp_en.llm_spoken_summary is not None
    assert "eligible" in resp_en.llm_spoken_summary.lower()
