// Supabase Direct PostgREST Client for SchemeSathi
// Communicates with Supabase using native fetch (zero extra dependencies).
// Completely stateless: no cookies, no localStorage, no persistent user tokens.

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
    return {
      id: s.code, // Use code as slug for URLs (/scheme/pm-kisan)
      db_id: s.id,
      code: s.code,
      name: (isHi && s.name_hi) ? s.name_hi : s.name_en,
      summary: (isHi && s.summary_hi) ? s.summary_hi : s.summary_en,
      category: (isHi && cat.name_hi) ? cat.name_hi : (cat.name_en || 'General'),
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
    .map(doc => (isHi && doc.document_name_hi) ? doc.document_name_hi : doc.document_name_en);

  // Sort steps by step_number
  const steps = (s.scheme_steps || [])
    .slice()
    .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
    .map(st => {
      const title = (isHi && st.title_hi) ? st.title_hi : st.title_en;
      const desc = (isHi && st.description_hi) ? st.description_hi : st.description_en;
      if (title && desc && title !== desc) {
        return `${title}: ${desc}`;
      }
      return desc || title || '';
    });

  const lastVerifiedDate = s.updated_at || s.created_at;
  const formattedDate = lastVerifiedDate
    ? new Date(lastVerifiedDate).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return {
    id: s.code,
    db_id: s.id,
    code: s.code,
    name: (isHi && s.name_hi) ? s.name_hi : s.name_en,
    summary: (isHi && s.summary_hi) ? s.summary_hi : s.summary_en,
    category: (isHi && cat.name_hi) ? cat.name_hi : (cat.name_en || 'General'),
    category_code: cat.code || '',
    nodal_ministry: s.nodal_ministry || '',
    benefits: (isHi && s.benefits_hi) ? s.benefits_hi : s.benefits_en,
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
    const passed = [];
    const failed = [];
    const missing = [];

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
      passed.push(isHi ? "लक्षित श्रेणी/पेशा मेल खाता है" : "Target occupation/category matches");
    }

    // 2. Specific criteria evaluations if criteria row exists
    if (criteria) {
      // Landholding evaluation
      if (criteria.max_landholding_hectares != null) {
        const maxLand = Number(criteria.max_landholding_hectares);
        if (landUpTo2) {
          if (2 <= maxLand) {
            passed.push(isHi ? `खेती भूमि ${maxLand} हेक्टेयर की सीमा में है` : `Agricultural land within ${maxLand} hectare limit`);
          } else {
            failed.push(isHi ? `भूमि ${maxLand} हेक्टेयर सीमा से अधिक है` : `Landholding exceeds ${maxLand} hectare limit`);
          }
        } else if (landMoreThan2) {
          if (maxLand >= 5) {
            passed.push(isHi ? `भूमि सीमा नियम के अनुकूल है` : `Landholding fits scheme limit`);
          } else {
            failed.push(isHi ? `योजना केवल ${maxLand} हेक्टेयर तक के छोटे किसानों के लिए है` : `Scheme requires land up to ${maxLand} hectares`);
          }
        } else if (landlessOrTenant) {
          if (item.code === 'pm-kisan') {
            failed.push(isHi ? "सरकारी रिकॉर्ड में स्वयं की ज़मीन का मालिकाना हक आवश्यक है" : "Direct land ownership record required");
          } else {
            passed.push(isHi ? "बटाईदार/श्रमिक के रूप में आवेदन योग्य" : "Eligible as tenant/cultivator");
          }
        } else if (catCode === 'farmers') {
          missing.push(isHi ? "ज़मीन के रकबे (हेक्टेयर) की जानकारी की आवश्यकता है" : "Landholding size details needed");
        }
      }

      // Income evaluation
      if (criteria.max_annual_income != null) {
        const maxIncome = Number(criteria.max_annual_income);
        if (incomeBelow1Lakh) {
          passed.push(isHi ? `वार्षिक आय ₹${maxIncome.toLocaleString('en-IN')} की सीमा में है` : `Household annual income within ₹${maxIncome.toLocaleString('en-IN')} ceiling`);
        } else if (income1to25Lakh) {
          if (maxIncome >= 250000) {
            passed.push(isHi ? `आय सीमा पात्रता के अंतर्गत है` : `Annual income meets scheme eligibility`);
          } else {
            failed.push(isHi ? `वार्षिक आय ₹${maxIncome.toLocaleString('en-IN')} से कम होनी चाहिए` : `Annual income must be below ₹${maxIncome.toLocaleString('en-IN')}`);
          }
        } else if (incomeAbove25Lakh) {
          failed.push(isHi ? `वार्षिक आय ₹${maxIncome.toLocaleString('en-IN')} की पात्रता सीमा से अधिक है` : `Annual income exceeds ₹${maxIncome.toLocaleString('en-IN')} limit`);
        } else {
          missing.push(isHi ? "पारिवारिक वार्षिक आय के सत्यापन की आवश्यकता है" : "Annual family income verification needed");
        }
      }

      // Area evaluation (Rural vs Urban)
      const allowedAreas = Array.isArray(criteria.allowed_areas) ? criteria.allowed_areas : [];
      if (allowedAreas.length === 1) {
        const reqArea = allowedAreas[0];
        if (reqArea === 'Rural' && isRural) {
          passed.push(isHi ? "ग्रामीण क्षेत्र के निवासी" : "Resident of rural area");
        } else if (reqArea === 'Rural' && isUrban) {
          failed.push(isHi ? "यह योजना केवल ग्रामीण क्षेत्रों के लिए है" : "Scheme is restricted to rural areas only");
        } else if (reqArea === 'Urban' && isUrban) {
          passed.push(isHi ? "शहरी क्षेत्र के निवासी" : "Resident of urban area");
        } else if (reqArea === 'Urban' && isRural) {
          failed.push(isHi ? "यह योजना केवल शहरी क्षेत्रों के लिए है" : "Scheme is restricted to urban areas only");
        }
      }

      // Gender evaluation
      const allowedGenders = Array.isArray(criteria.allowed_genders) ? criteria.allowed_genders : [];
      if (allowedGenders.length === 1 && allowedGenders[0] === 'Female') {
        if (isWoman) {
          passed.push(isHi ? "महिला लाभार्थी पात्रता" : "Eligible female beneficiary");
        }
      }
    }

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
      summary: (isHi && item.summary_hi) ? item.summary_hi : item.summary_en,
      status,
      passed,
      failed,
      missing
    });
  }

  // Sort results: potentially_eligible first, then needs_information, then not_eligible
  const rank = s => (s === 'potentially_eligible' ? 1 : s === 'needs_information' ? 2 : 3);
  results.sort((a, b) => rank(a.status) - rank(b.status));

  return results;
}
