// Supabase Direct PostgREST Client for SchemeSathi
// Communicates with Supabase using native fetch (zero extra dependencies).
// Completely stateless: no cookies, no localStorage, no persistent user tokens.

import { translateText, translateStep, formatDisplayDate } from '../i18n';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Checks whether Supabase project credentials are configured in the environment.
 */
export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

/**
 * Low-level HTTP fetch helper for Supabase PostgREST endpoints.
 */
async function supabaseFetch(endpoint, options = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured in environment');
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${SUPABASE_URL}/rest/v1/${cleanEndpoint}`;

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Supabase request error (${response.status}): ${errorBody || response.statusText}`);
  }

  return await response.json();
}

/**
 * Fetches all active schemes joined with their category.
 * Formats the result to match the frontend expectations in either English or Hindi.
 */
export async function fetchSchemesFromSupabase(language = 'en') {
  const isHi = language === 'hi';
  const query = 'schemes?select=id,code,name_en,name_hi,summary_en,summary_hi,nodal_ministry,is_active,categories(id,code,name_en,name_hi)&is_active=eq.true&order=created_at.asc';
  const data = await supabaseFetch(query);

  return data.map(s => {
    const cat = s.categories || {};
    const rawName = (isHi && s.name_hi) ? s.name_hi : s.name_en;
    const rawSummary = (isHi && s.summary_hi) ? s.summary_hi : s.summary_en;
    const rawCategory = (isHi && cat.name_hi) ? cat.name_hi : (cat.name_en || 'General');

    return {
      id: s.code, // Use code as slug for URLs (/scheme/pm-kisan)
      db_id: s.id,
      code: s.code,
      name: translateText(rawName, isHi ? 'hi' : 'en'),
      summary: translateText(rawSummary, isHi ? 'hi' : 'en'),
      category: translateText(rawCategory, isHi ? 'hi' : 'en'),
      category_code: cat.code || '',
      nodal_ministry: s.nodal_ministry || '',
      demo: false
    };
  });
}

/**
 * Fetches a single scheme by either its code (slug) or its UUID.
 * Includes documents, steps, category, and eligibility criteria.
 */
export async function fetchSchemeByIdFromSupabase(idOrCode, language = 'en') {
  const isHi = language === 'hi';
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);

  const filter = isUUID
    ? `id=eq.${encodeURIComponent(idOrCode)}`
    : `code=eq.${encodeURIComponent(idOrCode)}`;

  const query = `schemes?${filter}&select=*,categories(*),scheme_eligibility_criteria(*),scheme_documents(*),scheme_steps(*)&limit=1`;
  const data = await supabaseFetch(query);

  if (!data || data.length === 0) {
    throw new Error(`Scheme '${idOrCode}' not found`);
  }

  const s = data[0];
  const cat = s.categories || {};

  // Sort documents by display_order
  const documents = (s.scheme_documents || [])
    .slice()
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map(doc => {
      const rawDocName = (isHi && doc.document_name_hi) ? doc.document_name_hi : doc.document_name_en;
      return translateText(rawDocName, isHi ? 'hi' : 'en');
    });

  // Sort steps by step_number
  const steps = (s.scheme_steps || [])
    .slice()
    .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
    .map(st => {
      let title = (isHi && st.title_hi) ? st.title_hi : st.title_en;
      let desc = (isHi && st.description_hi) ? st.description_hi : st.description_en;
      if (isHi) {
        title = translateText(title, 'hi');
        desc = translateText(desc, 'hi');
      } else {
        title = translateText(title, 'en');
        desc = translateText(desc, 'en');
      }
      let combined = '';
      if (title && desc && title !== desc) {
        combined = `${title}: ${desc}`;
      } else {
        combined = desc || title || '';
      }
      return translateStep(combined, isHi ? 'hi' : 'en');
    });

  const lastVerifiedDate = s.updated_at || s.created_at;
  const formattedDate = lastVerifiedDate
    ? formatDisplayDate(lastVerifiedDate, isHi ? 'hi' : 'en')
    : null;

  return {
    id: s.code,
    db_id: s.id,
    code: s.code,
    name: translateText((isHi && s.name_hi) ? s.name_hi : s.name_en, isHi ? 'hi' : 'en'),
    summary: translateText((isHi && s.summary_hi) ? s.summary_hi : s.summary_en, isHi ? 'hi' : 'en'),
    category: translateText((isHi && cat.name_hi) ? cat.name_hi : (cat.name_en || 'General'), isHi ? 'hi' : 'en'),
    category_code: cat.code || '',
    nodal_ministry: s.nodal_ministry || '',
    benefits: translateText((isHi && s.benefits_hi) ? s.benefits_hi : s.benefits_en, isHi ? 'hi' : 'en'),
    official_url: s.official_url || '',
    documents,
    steps,
    last_verified: formattedDate,
    demo: false
  };
}

/**
 * Fetches all schemes and their criteria for the dynamic eligibility evaluation engine.
 */
export async function fetchEligibilityCriteriaFromSupabase() {
  const query = 'schemes?select=id,code,name_en,name_hi,summary_en,summary_hi,categories(code,name_en,name_hi),scheme_eligibility_criteria(*)&is_active=eq.true';
  return await supabaseFetch(query);
}

/**
 * Client-side criteria evaluation engine.
 * Takes the extracted user profile and evaluates against all schemes in Supabase.
 */
export function evaluateEligibilityAgainstCriteria(profile = {}, schemesData = [], language = 'en') {
  const isHi = language === 'hi';
  const results = [];

  // Flatten profile values into lower-case strings for matching
  const profileEntries = Object.entries(profile);
  const profileString = profileEntries.map(([, v]) => String(v).toLowerCase()).join(' ');

  // Detect user attributes
  const isFarmer = profileString.includes('farmer') || profileString.includes('किसान') || profileString.includes('kisan');
  const isStudent = profileString.includes('student') || profileString.includes('छात्र') || profileString.includes('vidyarthi') || profileString.includes('college') || profileString.includes('school');
  const isWoman = profileString.includes('woman') || profileString.includes('महिला') || profileString.includes('female');
  const isSenior = profileString.includes('senior') || profileString.includes('वृद्ध') || profileString.includes('बुजुर्ग') || profileString.includes('वरिष्ठ');
  const isWorker = profileString.includes('worker') || profileString.includes('मज़दूर') || profileString.includes('मजदूर') || profileString.includes('labour');
  const isBusiness = profileString.includes('business') || profileString.includes('व्यापारी') || profileString.includes('दुकान') || profileString.includes('vendor');

  // Landholding details
  const landUpTo2 = profileString.includes('2 hectare') || profileString.includes('2 हेक्टेयर') || profileString.includes('up to 2');
  const landMoreThan2 = profileString.includes('more than 2') || profileString.includes('2 हेक्टेयर से अधिक') || profileString.includes('large');
  const landlessOrTenant = profileString.includes('tenant') || profileString.includes('बटाईदार') || profileString.includes('भूमिहीन') || profileString.includes('landless');

  // Income details
  const incomeBelow1Lakh = profileString.includes('below') || profileString.includes('कम') || profileString.includes('1 lakh se kam');
  const income1to25Lakh = profileString.includes('1 lakh -') || profileString.includes('1 -') || profileString.includes('2.5');
  const incomeAbove25Lakh = profileString.includes('above') || profileString.includes('अधिक') || profileString.includes('2.5 lakh se adhik');

  // Residence
  const isUrban = profileString.includes('urban') || profileString.includes('शहरी');
  const isRural = profileString.includes('rural') || profileString.includes('ग्रामीण');

  for (const item of schemesData) {
    const criteria = item.scheme_eligibility_criteria;
    const catCode = item.categories?.code || '';
    const passed_en = [];
    const passed_hi = [];
    const failed_en = [];
    const failed_hi = [];
    const missing_en = [];
    const missing_hi = [];

    // 1. Occupation / Category Affinity check
    let personaMatch = false;
    if (catCode === 'farmers' && isFarmer) personaMatch = true;
    else if (catCode === 'students' && isStudent) personaMatch = true;
    else if (catCode === 'women' && isWoman) personaMatch = true;
    else if (catCode === 'seniors' && isSenior) personaMatch = true;
    else if (catCode === 'workers' && isWorker) personaMatch = true;
    else if (catCode === 'business' && isBusiness) personaMatch = true;

    // Universal schemes (like social security or worker schemes applicable widely)
    const isUniversalWorkerScheme = (catCode === 'workers' && (item.code === 'pmsby' || item.code === 'pmjjby'));

    // Skip schemes from completely different personas unless universal
    if (!personaMatch && !isUniversalWorkerScheme) {
      continue;
    }

    if (personaMatch) {
      passed_en.push("Target occupation/category matches");
      passed_hi.push("लक्षित श्रेणी/पेशा मेल खाता है");
    }

    // 2. Specific criteria evaluations if criteria row exists
    if (criteria) {
      // Landholding evaluation
      if (criteria.max_landholding_hectares != null) {
        const maxLand = Number(criteria.max_landholding_hectares);
        if (landUpTo2) {
          if (2 <= maxLand) {
            passed_en.push(`Agricultural land within ${maxLand} hectare limit`);
            passed_hi.push(`खेती योग्य भूमि ${maxLand} हेक्टेयर सीमा के भीतर है`);
          } else {
            failed_en.push(`Landholding exceeds ${maxLand} hectare limit`);
            failed_hi.push(`भूमि ${maxLand} हेक्टेयर सीमा से अधिक है`);
          }
        } else if (landMoreThan2) {
          if (maxLand >= 5) {
            passed_en.push(`Landholding fits scheme limit`);
            passed_hi.push(`भूमि सीमा नियम के अनुकूल है`);
          } else {
            failed_en.push(`Scheme requires land up to ${maxLand} hectares`);
            failed_hi.push(`योजना केवल ${maxLand} हेक्टेयर तक के छोटे किसानों के लिए है`);
          }
        } else if (landlessOrTenant) {
          if (item.code === 'pm-kisan') {
            failed_en.push("Direct land ownership record required");
            failed_hi.push("सरकारी रिकॉर्ड में स्वयं की ज़मीन का मालिकाना हक आवश्यक है");
          } else {
            passed_en.push("Eligible as tenant/cultivator");
            passed_hi.push("बटाईदार/काश्तकार के रूप में आवेदन योग्य");
          }
        } else if (catCode === 'farmers') {
          missing_en.push("Landholding size details needed");
          missing_hi.push("ज़मीन के रकबे (हेक्टेयर) की जानकारी की आवश्यकता है");
        }
      }

      // Income evaluation
      if (criteria.max_annual_income != null) {
        const maxIncome = Number(criteria.max_annual_income);
        if (incomeBelow1Lakh) {
          passed_en.push(`Household annual income within ₹${maxIncome.toLocaleString('en-IN')} limit`);
          passed_hi.push(`वार्षिक पारिवारिक आय ₹${maxIncome.toLocaleString('en-IN')} की सीमा के भीतर है`);
        } else if (income1to25Lakh) {
          if (maxIncome >= 250000) {
            passed_en.push(`Annual income meets scheme eligibility`);
            passed_hi.push(`वार्षिक पारिवारिक आय ₹${maxIncome.toLocaleString('en-IN')} की सीमा के भीतर है`);
          } else {
            failed_en.push(`Annual income must be below ₹${maxIncome.toLocaleString('en-IN')}`);
            failed_hi.push(`वार्षिक आय ₹${maxIncome.toLocaleString('en-IN')} से कम होनी चाहिए`);
          }
        } else if (incomeAbove25Lakh) {
          failed_en.push(`Annual income exceeds ₹${maxIncome.toLocaleString('en-IN')} limit`);
          failed_hi.push(`वार्षिक पारिवारिक आय ₹${maxIncome.toLocaleString('en-IN')} की पात्रता सीमा से अधिक है`);
        } else {
          missing_en.push("Household annual income verification needed");
          missing_hi.push("पारिवारिक वार्षिक आय के सत्यापन की आवश्यकता है");
        }
      }

      // Area evaluation (Rural vs Urban)
      const allowedAreas = Array.isArray(criteria.allowed_areas) ? criteria.allowed_areas : [];
      if (allowedAreas.length === 1) {
        const reqArea = allowedAreas[0];
        if (reqArea === 'Rural' && isRural) {
          passed_en.push("Resident of rural area");
          passed_hi.push("ग्रामीण क्षेत्र के निवासी");
        } else if (reqArea === 'Rural' && isUrban) {
          failed_en.push("Restricted to rural areas only");
          failed_hi.push("यह योजना केवल ग्रामीण क्षेत्रों के लिए है");
        } else if (reqArea === 'Urban' && isUrban) {
          passed_en.push("Resident of urban area");
          passed_hi.push("शहरी क्षेत्र के निवासी");
        } else if (reqArea === 'Urban' && isRural) {
          failed_en.push("Restricted to urban areas only");
          failed_hi.push("यह योजना केवल शहरी क्षेत्रों के लिए है");
        }
      }

      // Gender evaluation
      const allowedGenders = Array.isArray(criteria.allowed_genders) ? criteria.allowed_genders : [];
      if (allowedGenders.length === 1 && allowedGenders[0] === 'Female') {
        if (isWoman) {
          passed_en.push("Eligible female beneficiary");
          passed_hi.push("महिला लाभार्थी पात्रता");
        }
      }

      // Crop sowing verification for PMFBY
      if (item.code === 'pmfby') {
        const cropSown = profileString.includes('sown') || profileString.includes('बोई') || profileString.includes('cultivated') || profileString.includes('मौसमी फसल');
        const landFallow = profileString.includes('fallow') || profileString.includes('खाली');
        if (cropSown) {
          passed_en.push("Seasonal crop cultivation verified");
          passed_hi.push("वर्तमान मौसम में फसल बुवाई सत्यापित");
        } else if (landFallow) {
          failed_en.push("Crop insurance applies only to cultivated land");
          failed_hi.push("फसल बीमा केवल बुवाई की गई भूमि के लिए लागू होता है");
        } else {
          missing_en.push("Crop sowing verification needed for current season");
          missing_hi.push("वर्तमान मौसम के लिए फसल बुवाई सत्यापन की आवश्यकता है");
        }
      }
    }

    const passed = isHi ? passed_hi : passed_en;
    const failed = isHi ? failed_hi : failed_en;
    const missing = isHi ? missing_hi : missing_en;

    // Determine status
    let status = 'potentially_eligible';
    if (failed.length > 0) {
      status = 'not_eligible';
    } else if (missing.length > 0) {
      status = 'needs_information';
    } else {
      status = 'potentially_eligible';
    }

    results.push({
      scheme_id: item.code,
      name: (isHi && item.name_hi) ? item.name_hi : item.name_en,
      name_en: item.name_en,
      name_hi: item.name_hi,
      summary: (isHi && item.summary_hi) ? item.summary_hi : item.summary_en,
      summary_en: item.summary_en,
      summary_hi: item.summary_hi,
      benefits: (isHi && item.benefits_hi) ? item.benefits_hi : item.benefits_en,
      benefits_en: item.benefits_en,
      benefits_hi: item.benefits_hi,
      status,
      passed,
      passed_en,
      passed_hi,
      failed,
      failed_en,
      failed_hi,
      missing,
      missing_en,
      missing_hi
    });
  }

  // Sort results: potentially_eligible first, then needs_information, then not_eligible
  const rank = s => (s === 'potentially_eligible' ? 1 : s === 'needs_information' ? 2 : 3);
  results.sort((a, b) => rank(a.status) - rank(b.status));

  return results;
}
