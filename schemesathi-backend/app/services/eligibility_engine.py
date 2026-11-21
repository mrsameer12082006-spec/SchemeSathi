from typing import List, Dict, Any, Optional
import logging

from app.models.profile import UserProfile
from app.models.scheme import EvaluationResult, EvaluationResponse

logger = logging.getLogger("schemesathi.engine")

class EligibilityEngine:
    """
    Deterministic Rules-Based Eligibility Engine.
    
    Evaluates citizen profile attributes against official criteria rules 
    stored in the database (scheme_eligibility_criteria).
    Produces structured evaluation results with bilingual explanations 
    and a conversational summary formatted for the Voice LLM Agent.
    """

    @staticmethod
    def _extract_attributes(profile: UserProfile) -> Dict[str, Any]:
        """
        Combines structured profile fields and raw_attributes from the Voice LLM agent
        into normalized comparison variables.
        """
        attrs: Dict[str, Any] = {}
        
        # Flatten raw attributes to a searchable lowercase string
        raw_text = " ".join([f"{k} {v}" for k, v in profile.raw_attributes.items()]).lower()
        if profile.occupation:
            raw_text += f" {profile.occupation.lower()}"
        if profile.land_ownership:
            raw_text += f" {profile.land_ownership.lower()}"
        if profile.income_bracket:
            raw_text += f" {profile.income_bracket.lower()}"
        if profile.state:
            raw_text += f" {profile.state.lower()}"
        if profile.area:
            raw_text += f" {profile.area.lower()}"
        if profile.gender:
            raw_text += f" {profile.gender.lower()}"

        # 1. Persona / Occupation
        attrs["is_farmer"] = any(k in raw_text for k in ["farmer", "किसान", "kisan", "farming", "खेती", "कृषि"])
        attrs["is_student"] = any(k in raw_text for k in ["student", "छात्र", "विद्यार्थी", "vidyarthi", "college", "school", "पढ़ाई"])
        attrs["is_woman"] = any(k in raw_text for k in ["woman", "women", "महिला", "female", "widow", "विधवा", "गर्भवती", "lactating"])
        attrs["is_senior"] = any(k in raw_text for k in ["senior", "वृद्ध", "बुजुर्ग", "वरिष्ठ", "pension", "पेंशन"])
        attrs["is_worker"] = any(k in raw_text for k in ["worker", "मज़दूर", "मजदूर", "labour", "श्रमिक", "unorganized", "दिहाड़ी"])
        attrs["is_business"] = any(k in raw_text for k in ["business", "व्यापारी", "दुकान", "vendor", "वेंडर", "रेहड़ी", "उद्यमी", "shop"])

        # 2. Landholding
        attrs["land_hectares"] = profile.landholding_hectares
        attrs["is_tenant_or_landless"] = any(k in raw_text for k in ["tenant", "बटाईदार", "भूमिहीन", "landless"])
        if attrs["land_hectares"] is None:
            if "2 hectare se adhik" in raw_text or "more than 2" in raw_text or "2 हेक्टेयर से अधिक" in raw_text:
                attrs["land_hectares"] = 3.5  # Represents large farmer > 2ha
            elif "up to 2" in raw_text or "2 hectare tak" in raw_text or "2 हेक्टेयर तक" in raw_text:
                attrs["land_hectares"] = 1.5  # Represents small/marginal farmer <= 2ha

        # 3. Income
        attrs["annual_income"] = profile.annual_income
        attrs["income_below_1lakh"] = any(k in raw_text for k in ["below 1", "1 lakh se kam", "1 लाख से कम", "₹1 लाख से कम"])
        attrs["income_1_to_25lakh"] = any(k in raw_text for k in ["1 lakh -", "1 - 2.5", "1 से 2.5", "₹1 - ₹2.5 लाख"])
        attrs["income_above_25lakh"] = any(k in raw_text for k in ["above 2.5", "2.5 lakh se adhik", "2.5 लाख से अधिक", "₹2.5 लाख से अधिक"])

        if attrs["annual_income"] is None:
            if attrs["income_below_1lakh"]:
                attrs["annual_income"] = 75000.0
            elif attrs["income_1_to_25lakh"]:
                attrs["annual_income"] = 180000.0
            elif attrs["income_above_25lakh"]:
                attrs["annual_income"] = 350000.0

        # 4. Demographics
        attrs["age"] = profile.age
        if attrs["age"] is None and attrs["is_senior"]:
            attrs["age"] = 65

        attrs["is_female"] = attrs["is_woman"] or (profile.gender and profile.gender.lower() in ["female", "woman", "महिला"])
        attrs["is_male"] = profile.gender and profile.gender.lower() in ["male", "पुरुष"]
        attrs["is_rural"] = any(k in raw_text for k in ["rural", "गाँव", "गांव", "ग्रामीण", "village"])
        attrs["is_urban"] = any(k in raw_text for k in ["urban", "शहर", "शहरी", "city", "town"])

        return attrs

    @staticmethod
    def _check_occupation_match(allowed_occupations: List[str], attrs: Dict[str, Any], profile_occupation: Optional[str]) -> tuple[bool, bool]:
        """
        Checks if citizen profile matches allowed occupations.
        Returns: (is_match, is_mismatch)
        """
        if not allowed_occupations:
            return True, False

        allowed_lower = [str(o).lower() for o in allowed_occupations]

        # Check if user has an identified persona/occupation
        has_any_occ = bool(
            profile_occupation or 
            attrs.get("is_farmer") or 
            attrs.get("is_student") or 
            attrs.get("is_woman") or 
            attrs.get("is_worker") or 
            attrs.get("is_senior") or 
            attrs.get("is_business")
        )
        if not has_any_occ:
            return False, False  # Unknown occupation, not a hard mismatch

        # Check persona matches against allowed occupations
        matched = False
        if attrs.get("is_farmer") and any(w in o for o in allowed_lower for w in ["farmer", "kisan", "cultivator", "agriculture"]):
            matched = True
        elif attrs.get("is_student") and any(w in o for o in allowed_lower for w in ["student", "विद्यार्थी", "छात्र", "scholarship"]):
            matched = True
        elif attrs.get("is_worker") and any(w in o for o in allowed_lower for w in ["worker", "labour", "मजदूर", "मज़दूर", "shramik", "unorganized", "any worker", "dihadi"]):
            matched = True
        elif attrs.get("is_business") and any(w in o for o in allowed_lower for w in ["business", "vendor", "व्यापारी", "self employed", "shop"]):
            matched = True
        elif attrs.get("is_woman") and any(w in o for o in allowed_lower for w in ["woman", "women", "महिला", "female"]):
            matched = True
        elif attrs.get("is_senior") and any(w in o for o in allowed_lower for w in ["senior", "elderly", "बुजुर्ग", "pensioner"]):
            matched = True
        elif profile_occupation and any(profile_occupation.lower() in o or o in profile_occupation.lower() for o in allowed_lower):
            matched = True

        if matched:
            return True, False
        else:
            return False, True

    def evaluate(self, profile: UserProfile, schemes_data: List[Dict[str, Any]], language: str = "en") -> EvaluationResponse:
        is_hi = language == "hi"
        attrs = self._extract_attributes(profile)
        results: List[EvaluationResult] = []

        for item in schemes_data:
            cat = item.get("categories") or {}
            cat_code = cat.get("code", "")
            scheme_code = item.get("code", "")
            criteria = item.get("scheme_eligibility_criteria") or {}

            passed_en: List[str] = []
            passed_hi: List[str] = []
            failed_en: List[str] = []
            failed_hi: List[str] = []
            missing_en: List[str] = []
            missing_hi: List[str] = []

            # Step 1: Target Persona & Category Affinity Match
            persona_matched = False
            if cat_code == "farmers" and attrs["is_farmer"]:
                persona_matched = True
            elif cat_code == "students" and attrs["is_student"]:
                persona_matched = True
            elif cat_code == "women" and attrs["is_female"]:
                persona_matched = True
            elif cat_code == "seniors" and attrs["is_senior"]:
                persona_matched = True
            elif cat_code == "workers" and attrs["is_worker"]:
                persona_matched = True
            elif cat_code == "business" and attrs["is_business"]:
                persona_matched = True

            # Check explicit allowed occupations rules from criteria
            crit_occs = criteria.get("allowed_occupations") or item.get("eligibility", {}).get("allowed_occupations") or []
            occ_matched, occ_mismatch = self._check_occupation_match(crit_occs, attrs, profile.occupation)

            if occ_mismatch:
                failed_en.append(f"Scheme not applicable for {profile.occupation or 'your occupation'}")
                failed_hi.append(f"यह योजना आपके वर्तमान व्यवसाय/पेशा ({profile.occupation or 'वर्ग'}) के लिए नहीं है")
            elif (occ_matched and crit_occs) or persona_matched:
                passed_en.append("Target occupation/category matches")
                passed_hi.append("लक्षित श्रेणी/पेशा मेल खाता है")

            # Universal social security schemes available to workers & general citizens
            # CRITICAL SAFEGUARD: Do not match universal schemes if citizen profile is completely blank,
            # or if the citizen has an explicit occupation mismatch (e.g. APY is not for students)
            has_any_profile = bool(
                attrs["is_worker"] or attrs["is_farmer"] or attrs["is_student"] or 
                attrs["is_female"] or attrs["is_senior"] or attrs["is_business"] or 
                profile.occupation or profile.landholding_hectares is not None or 
                profile.annual_income is not None or profile.age is not None
            )

            is_universal = (cat_code == "workers" and scheme_code in ["pmsby", "pmjjby"] and has_any_profile and not occ_mismatch)

            if not persona_matched and not is_universal:
                continue

            # Step 2: Landholding Limit Checks
            max_land = criteria.get("max_landholding_hectares")
            if max_land is not None:
                max_land_val = float(max_land)
                if attrs["land_hectares"] is not None:
                    if attrs["land_hectares"] <= max_land_val:
                        passed_en.append(f"Agricultural land within {max_land_val} ha limit")
                        passed_hi.append(f"खेती योग्य भूमि {max_land_val} हेक्टेयर सीमा के भीतर है")
                    else:
                        failed_en.append(f"Landholding exceeds {max_land_val} ha limit")
                        failed_hi.append(f"भूमि {max_land_val} हेक्टेयर सीमा से अधिक है")
                elif attrs["is_tenant_or_landless"]:
                    if scheme_code == "pm-kisan":
                        failed_en.append("Direct land ownership record required")
                        failed_hi.append("सरकारी रिकॉर्ड में स्वयं की ज़मीन का मालिकाना हक आवश्यक है")
                    else:
                        passed_en.append("Eligible as tenant/cultivator")
                        passed_hi.append("बटाईदार/काश्तकार के रूप में आवेदन योग्य")
                elif cat_code == "farmers":
                    missing_en.append("Landholding size (in hectares) needed")
                    missing_hi.append("ज़मीन के रकबे (हेक्टेयर) की जानकारी आवश्यक है")

            # Step 3: Income Threshold Checks
            max_income = criteria.get("max_annual_income")
            if max_income is not None:
                max_income_val = float(max_income)
                if attrs["annual_income"] is not None:
                    if attrs["annual_income"] <= max_income_val:
                        passed_en.append(f"Household annual income within ₹{int(max_income_val):,} limit")
                        passed_hi.append(f"वार्षिक पारिवारिक आय ₹{int(max_income_val):,} की सीमा के भीतर है")
                    else:
                        failed_en.append(f"Annual income exceeds ₹{int(max_income_val):,} limit")
                        failed_hi.append(f"वार्षिक पारिवारिक आय ₹{int(max_income_val):,} की पात्रता सीमा से अधिक है")
                else:
                    missing_en.append("Household annual income verification needed")
                    missing_hi.append("पारिवारिक वार्षिक आय के सत्यापन की आवश्यकता है")

            # Step 4: Age Limit Checks
            min_age = criteria.get("min_age", 0)
            max_age = criteria.get("max_age", 120)
            if min_age > 0 or max_age < 100:
                if attrs["age"] is not None:
                    if min_age <= attrs["age"] <= max_age:
                        passed_en.append(f"Age {attrs['age']} is within {min_age}-{max_age} years range")
                        passed_hi.append(f"आयु {attrs['age']} वर्ष ({min_age}-{max_age} वर्ष सीमा में)")
                    else:
                        failed_en.append(f"Age must be between {min_age} and {max_age} years")
                        failed_hi.append(f"आयु {min_age} से {max_age} वर्ष के बीच होनी चाहिए")
                elif cat_code == "seniors":
                    passed_en.append("Senior citizen (60+ years) eligibility")
                    passed_hi.append("वरिष्ठ नागरिक (60+ वर्ष) पात्रता")

            # Step 5: Gender Exclusivity Checks
            allowed_genders = criteria.get("allowed_genders") or []
            if len(allowed_genders) == 1 and allowed_genders[0] == "Female":
                if attrs["is_female"]:
                    passed_en.append("Eligible female beneficiary")
                    passed_hi.append("महिला लाभार्थी पात्रता")
                elif attrs["is_male"]:
                    failed_en.append("Scheme is exclusively for women")
                    failed_hi.append("यह योजना विशेष रूप से महिलाओं के लिए है")
                else:
                    missing_en.append("Exclusively for female beneficiaries (female applicant required)")
                    missing_hi.append("यह योजना केवल महिलाओं के लिए है (महिला लाभार्थी होना आवश्यक है)")

            # Step 6: Residential Area (Rural/Urban) Checks
            allowed_areas = criteria.get("allowed_areas") or []
            if len(allowed_areas) == 1:
                req_area = allowed_areas[0]
                if req_area == "Rural":
                    if attrs["is_rural"]:
                        passed_en.append("Resident of rural area")
                        passed_hi.append("ग्रामीण क्षेत्र के निवासी")
                    elif attrs["is_urban"]:
                        failed_en.append("Restricted to rural areas only")
                        failed_hi.append("यह योजना केवल ग्रामीण क्षेत्रों के लिए है")
                elif req_area == "Urban":
                    if attrs["is_urban"]:
                        passed_en.append("Resident of urban area")
                        passed_hi.append("शहरी क्षेत्र के निवासी")
                    elif attrs["is_rural"]:
                        failed_en.append("Restricted to urban areas only")
                        failed_hi.append("यह योजना केवल शहरी क्षेत्रों के लिए है")

            # Active language passed/failed/missing
            passed = passed_hi if is_hi else passed_en
            failed = failed_hi if is_hi else failed_en
            missing = missing_hi if is_hi else missing_en

            # Determine Result Status
            if failed:
                status = "not_eligible"
            elif missing:
                status = "needs_information"
            else:
                status = "potentially_eligible"

            # Prepare documents & steps
            raw_docs = sorted(item.get("scheme_documents") or [], key=lambda d: d.get("display_order", 0))
            docs_list = [
                (d.get("document_name_hi") if is_hi and d.get("document_name_hi") else d.get("document_name_en", ""))
                for d in raw_docs
            ]

            raw_steps = sorted(item.get("scheme_steps") or [], key=lambda st: st.get("step_number", 0))
            steps_list = [
                (st.get("description_hi") if is_hi and st.get("description_hi") else st.get("description_en", ""))
                for st in raw_steps
            ]

            results.append(
                EvaluationResult(
                    scheme_id=scheme_code,
                    name=(item.get("name_hi") if is_hi and item.get("name_hi") else item.get("name_en", "")),
                    summary=(item.get("summary_hi") if is_hi and item.get("summary_hi") else item.get("summary_en", "")),
                    category=(cat.get("name_hi") if is_hi and cat.get("name_hi") else cat.get("name_en", "General")),
                    status=status,
                    passed=passed,
                    failed=failed,
                    missing=missing,
                    benefits=(item.get("benefits_hi") if is_hi and item.get("benefits_hi") else item.get("benefits_en", "")),
                    official_url=item.get("official_url", ""),
                    documents=docs_list,
                    steps=steps_list,
                    name_en=item.get("name_en", ""),
                    name_hi=item.get("name_hi", ""),
                    summary_en=item.get("summary_en", ""),
                    summary_hi=item.get("summary_hi", ""),
                    category_en=cat.get("name_en", "General"),
                    category_hi=cat.get("name_hi", "सामान्य"),
                    benefits_en=item.get("benefits_en", ""),
                    benefits_hi=item.get("benefits_hi", ""),
                    passed_en=passed_en,
                    passed_hi=passed_hi,
                    missing_en=missing_en,
                    missing_hi=missing_hi,
                    failed_en=failed_en,
                    failed_hi=failed_hi
                )
            )

        # Sort: potentially_eligible first, then needs_information, then not_eligible
        rank_order = {"potentially_eligible": 1, "needs_information": 2, "not_eligible": 3}
        results.sort(key=lambda r: (rank_order.get(r.status, 4), -len(r.passed)))

        # Compute counts
        eligible_count = sum(1 for r in results if r.status == "potentially_eligible")
        needs_info_count = sum(1 for r in results if r.status == "needs_information")
        not_eligible_count = sum(1 for r in results if r.status == "not_eligible")

        # Create spoken summary for the Voice LLM Agent
        spoken_summary = self._generate_spoken_summary(
            eligible_count=eligible_count,
            needs_info_count=needs_info_count,
            results=results,
            is_hi=is_hi
        )

        return EvaluationResponse(
            language=language,
            total_schemes_checked=len(schemes_data),
            eligible_count=eligible_count,
            needs_info_count=needs_info_count,
            not_eligible_count=not_eligible_count,
            understood_profile=profile.raw_attributes or profile.model_dump(exclude_none=True),
            results=results,
            llm_spoken_summary=spoken_summary
        )

    @staticmethod
    def _generate_spoken_summary(eligible_count: int, needs_info_count: int, results: List[EvaluationResult], is_hi: bool) -> str:
        """
        Creates a natural, empathetic summary text that the Voice LLM Agent 
        can immediately speak out loud to the citizen.
        """
        top_eligible = [r.name for r in results if r.status == "potentially_eligible"][:3]
        
        if is_hi:
            if eligible_count > 0:
                schemes_text = " और ".join(top_eligible)
                text = f"आपके बताए अनुसार, आप {eligible_count} सरकारी योजनाओं के पात्र हो सकते हैं, जिनमें {schemes_text} शामिल हैं।"
                if needs_info_count > 0:
                    text += f" साथ ही, {needs_info_count} अन्य योजनाओं की पुष्टि के लिए हमें एक या दो और जानकारियों की आवश्यकता है।"
                return text
            elif needs_info_count > 0:
                return f"हमने आपके विवरण की जाँच की है। {needs_info_count} योजनाओं की पात्रता सुनिश्चित करने के लिए कुछ और विवरण चाहिए।"
            else:
                return "आपके वर्तमान विवरण के अनुसार अभी कोई सीधी योजना मेल नहीं खा रही है, लेकिन आप अन्य श्रेणियों के विकल्प भी देख सकते हैं।"
        else:
            if eligible_count > 0:
                schemes_text = " and ".join(top_eligible)
                text = f"Based on the details you shared, you appear potentially eligible for {eligible_count} schemes, including {schemes_text}."
                if needs_info_count > 0:
                    text += f" We also found {needs_info_count} schemes where just 1 or 2 more details are needed to confirm."
                return text
            elif needs_info_count > 0:
                return f"We evaluated your profile. For {needs_info_count} schemes, we need a couple more details to confirm your eligibility."
            else:
                return "Based on your current details, no exact scheme matches were found, but you can browse other categories anytime."

# Global singleton eligibility engine instance
eligibility_engine = EligibilityEngine()
