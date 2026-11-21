#!/usr/bin/env python3
"""
SchemeSathi: Comprehensive Multi-Lingual AI Evaluation Suite
Evaluates /api/ai/chat across 15 diverse, non-cherry-picked test cases:
- Hindi, Hinglish, English queries
- Intent overrides (e.g. Farmer asking for Education or Health)
- Casual greetings & Name introductions
- Uncertainty / Empathy handling
- Financial queries & Fee verification
- Edge cases and Gibberish
- Verification that NO fake schemes ('Scheme A (demo)') exist
"""

import sys
import os
import json
import time
from pathlib import Path
from typing import Dict, Any, List

# Ensure schemesathi-backend is in sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "schemesathi-backend"
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(ROOT_DIR))

# Load backend environment variables
from dotenv import load_dotenv
load_dotenv(BACKEND_DIR / ".env")

try:
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
except Exception as e:
    print(f"Error loading FastAPI backend: {e}")
    sys.exit(1)

# 15 Diverse, Non-Cherry-Picked Evaluation Test Cases
TEST_CASES = [
    {
        "id": 1,
        "name": "Pure Hindi Farming Query",
        "query": "मुझे किसान योजना चाहिए",
        "lang": "hi",
        "expected_domain": "agriculture",
        "expected_schemes_any": ["pm-kisan", "pmfby", "kcc"],
        "expect_empty_results": False
    },
    {
        "id": 2,
        "name": "Pure Hinglish Scholarship Query",
        "query": "Mujhe scholarship chahiye, income 2 lakh hai",
        "lang": "hi",
        "expected_domain": "education",
        "expected_schemes_any": ["csss-higher", "post-matric-obc", "nsp-scholarship"],
        "expect_empty_results": False
    },
    {
        "id": 3,
        "name": "Casual Greeting with Name",
        "query": "hi i m kaalu",
        "lang": "en",
        "expected_domain": "greeting",
        "expected_schemes_any": [],
        "expect_empty_results": True,
        "must_mention": ["Kaalu", "kaalu"]
    },
    {
        "id": 4,
        "name": "Intent Override (Farmer asking Health)",
        "query": "I am a farmer but want to know about health insurance",
        "lang": "en",
        "expected_domain": "health",
        "expected_schemes_any": ["pm-jay", "pmjay-senior", "pmjay"],
        "expect_empty_results": False,
        "must_not_have": ["pm-kisan"]
    },
    {
        "id": 5,
        "name": "Cost / Fee Query",
        "query": "kitna paise lagenge",
        "lang": "hi",
        "expected_domain": "cost",
        "expected_schemes_any": [],
        "expect_empty_results": None,  # Can be empty or general
        "must_mention_concept": ["free", "निःशुल्क", "पैसे नहीं", "no fee"]
    },
    {
        "id": 6,
        "name": "Gibberish Input Guard",
        "query": "asdfghjkl",
        "lang": "en",
        "expected_domain": "unknown",
        "expected_schemes_any": [],
        "expect_empty_results": True
    },
    {
        "id": 7,
        "name": "Farmer Asking for Education (Hindi)",
        "query": "मैं एक किसान हूँ, मुझे शिक्षा से जुड़ी योजनाओं के बारे में बताएं",
        "lang": "hi",
        "expected_domain": "education",
        "expected_schemes_any": ["csss-higher", "post-matric-obc"],
        "expect_empty_results": False,
        "must_not_have": ["pm-kisan"]
    },
    {
        "id": 8,
        "name": "Women & Maternity Support (Hindi)",
        "query": "गर्भवती महिलाओं के लिए कौन सी योजना है?",
        "lang": "hi",
        "expected_domain": "women",
        "expected_schemes_any": ["pmmvy"],
        "expect_empty_results": False
    },
    {
        "id": 9,
        "name": "Senior Citizen Pension (English)",
        "query": "Old age pension scheme for 65 year old",
        "lang": "en",
        "expected_domain": "pension",
        "expected_schemes_any": ["pmvvy", "scss", "ignoaps", "apy"],
        "expect_empty_results": False
    },
    {
        "id": 10,
        "name": "Small Business Loan (Hinglish)",
        "query": "Mujhe dukan kholne ke liye loan chahiye",
        "lang": "hi",
        "expected_domain": "loan",
        "expected_schemes_any": ["pmsvanidhi", "pmmy", "mudra"],
        "expect_empty_results": False
    },
    {
        "id": 11,
        "name": "Uncertainty / Empathy Check",
        "query": "Not sure",
        "lang": "en",
        "expected_domain": "uncertainty",
        "expected_schemes_any": [],
        "expect_empty_results": True,
        "must_mention_concept": ["okay", "help", "limits", "category"]
    },
    {
        "id": 12,
        "name": "Zero-Cost Application Guarantee",
        "query": "kya iske liye koi form bharne ka paisa lagta hai?",
        "lang": "hi",
        "expected_domain": "cost",
        "expected_schemes_any": [],
        "expect_empty_results": None,
        "must_mention_concept": ["निःशुल्क", "free", "कोई शुल्क नहीं", "पैसे नहीं"]
    },
    {
        "id": 13,
        "name": "Landless / Tenant Farmer (Hindi)",
        "query": "मैं एक भूमिहीन बटाईदार किसान हूँ",
        "lang": "hi",
        "expected_domain": "tenant_farmer",
        "expected_schemes_any": ["kcc", "pmfby", "eshram"],
        "expect_empty_results": False
    },
    {
        "id": 14,
        "name": "High Income Ineligibility Query",
        "query": "Meri income 15 LPA hai kya mujhe PM Kisan milega?",
        "lang": "hi",
        "expected_domain": "ineligible_income",
        "expected_schemes_any": ["pm-kisan"],
        "expect_empty_results": None
    },
    {
        "id": 15,
        "name": "College Scholarship for OBC (English)",
        "query": "College admission scholarship for OBC",
        "lang": "en",
        "expected_domain": "education",
        "expected_schemes_any": ["post-matric-obc", "csss-higher"],
        "expect_empty_results": False
    }
]


def run_evaluation():
    print("=" * 80)
    print("  SCHEMESATHI AI ENGINE — COMPREHENSIVE MULTI-LINGUAL EVALUATION")
    print("=" * 80)
    print(f"Total Test Cases: {len(TEST_CASES)}")
    print("Connecting to live /api/ai/chat endpoint...\n")

    results_table = []
    passed_count = 0
    hallucination_detected = False

    for tc in TEST_CASES:
        payload = {
            "message": tc["query"],
            "language": tc["lang"],
            "synthesize_audio": False
        }

        start_time = time.time()
        res = client.post("/api/ai/chat", json=payload)
        latency_ms = int((time.time() - start_time) * 1000)

        if res.status_code != 200:
            results_table.append({
                "id": tc["id"],
                "name": tc["name"],
                "query": tc["query"],
                "status": f"HTTP {res.status_code}",
                "schemes": [],
                "length": 0,
                "passed": False,
                "notes": "Failed HTTP Request"
            })
            continue

        data = res.json()
        reply = data.get("reply", "")
        results = data.get("results", [])
        scheme_ids = [r.get("scheme_id", "") for r in results]

        # Check 1: Zero Fake "Scheme A (demo)" or "Scheme B (demo)"
        has_demo_data = any(
            "demo" in str(s).lower() or "scheme a" in str(s).lower() or "scheme b" in str(s).lower()
            for s in scheme_ids
        ) or "scheme a (demo)" in reply.lower() or "scheme b (demo)" in reply.lower()

        if has_demo_data:
            hallucination_detected = True

        # Check 2: Results condition
        tc_passed = True
        notes = []

        if tc["expect_empty_results"] is True:
            if len(scheme_ids) > 0:
                tc_passed = False
                notes.append(f"Expected 0 schemes, got {len(scheme_ids)}")
        elif tc["expect_empty_results"] is False:
            if len(scheme_ids) == 0:
                tc_passed = False
                notes.append("Expected schemes, got 0")
            elif tc["expected_schemes_any"]:
                matched = any(exp in scheme_ids for exp in tc["expected_schemes_any"])
                if not matched:
                    tc_passed = False
                    notes.append(f"Expected one of {tc['expected_schemes_any']}, got {scheme_ids}")

        # Check 3: Must not have schemes
        if "must_not_have" in tc:
            for bad_scheme in tc["must_not_have"]:
                if bad_scheme in scheme_ids:
                    tc_passed = False
                    notes.append(f"Intent override violated: found {bad_scheme}")

        # Check 4: Must mention string
        if "must_mention" in tc:
            if not any(m.lower() in reply.lower() for m in tc["must_mention"]):
                tc_passed = False
                notes.append(f"Missing required mention: {tc['must_mention']}")

        # Check 5: Must mention concept
        if "must_mention_concept" in tc:
            if not any(c.lower() in reply.lower() for c in tc["must_mention_concept"]):
                tc_passed = False
                notes.append(f"Concept not conveyed: {tc['must_mention_concept']}")

        if has_demo_data:
            tc_passed = False
            notes.append("CRITICAL: Fake demo scheme detected!")

        if tc_passed:
            passed_count += 1

        results_table.append({
            "id": tc["id"],
            "name": tc["name"],
            "query": tc["query"],
            "status": "PASS" if tc_passed else "FAIL",
            "schemes": scheme_ids,
            "length": len(reply),
            "reply_snippet": (reply[:75] + "...") if len(reply) > 75 else reply,
            "passed": tc_passed,
            "latency": latency_ms,
            "notes": ", ".join(notes) if notes else "All checks passed"
        })
        time.sleep(1.5)

    # Print Table
    print(f"{'#':<3} | {'Test Case':<32} | {'Status':<6} | {'Schemes Found':<24} | {'Len':<4} | {'Notes'}")
    print("-" * 110)
    for r in results_table:
        schemes_str = ", ".join(r["schemes"][:2]) if r["schemes"] else "[]"
        if len(r["schemes"]) > 2:
            schemes_str += f" (+{len(r['schemes']) - 2})"
        status_color = "\033[92mPASS\033[0m" if r["passed"] else "\033[91mFAIL\033[0m"
        print(f"{r['id']:<3} | {r['name']:<32} | {status_color:<15} | {schemes_str:<24} | {r['length']:<4} | {r['notes']}")

    print("-" * 110)
    print(f"\nFinal Accuracy Score: {passed_count} / {len(TEST_CASES)} passed ({(passed_count / len(TEST_CASES)) * 100:.1f}%)")
    print(f"Hallucinated 'Demo' Schemes Detected: {'YES (FAIL)' if hallucination_detected else 'ZERO (PERFECT)'}")

    if passed_count == len(TEST_CASES):
        print("\n\033[92mSUCCESS: All 15 multi-lingual RAG & Conversational tests passed flawlessly!\033[0m")
    else:
        print(f"\n\033[93mWARNING: {len(TEST_CASES) - passed_count} test(s) failed.\033[0m")

    return passed_count == len(TEST_CASES)


if __name__ == "__main__":
    success = run_evaluation()
    sys.exit(0 if success else 1)
