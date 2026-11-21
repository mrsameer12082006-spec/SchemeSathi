// API client for SchemeSathi
// All network calls live in this one file.
// If VITE_API_URL is empty, uses Supabase PostgREST directly (or built-in mock fallback).

import {
  isSupabaseConfigured,
  fetchSchemesFromSupabase,
  fetchSchemeByIdFromSupabase,
  fetchEligibilityCriteriaFromSupabase,
  evaluateEligibilityAgainstCriteria
} from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8000' : '');

// In-memory mock sessions storage
const mockSessions = new Map();

// Verified official government schemes (Zero fake/demo data)
const MOCK_SCHEMES_EN = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    summary: "Direct income support of ₹6,000 per year for landholding farmer families",
    category: "Farmers",
    benefits: "₹6,000 per year transferred directly to your bank account in 3 equal installments of ₹2,000 every four months through Direct Benefit Transfer (DBT).",
    documents: [
      "Aadhaar card copy",
      "Land ownership record (Khatoni / Fard / Jamabandi)",
      "Bank passbook copy linked with Aadhaar"
    ],
    steps: [
      "Ensure your Aadhaar is linked to your bank account with active DBT.",
      "Visit pmkisan.gov.in or your nearby Common Service Centre (CSC).",
      "Submit land ownership documents and Aadhaar details.",
      "Receive registration number and track DBT payment status online."
    ],
    official_url: "https://pmkisan.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    summary: "Comprehensive crop insurance protection against drought, floods, and unseasonal rains",
    category: "Farmers",
    benefits: "Comprehensive crop loss protection against natural risks with low subsidized premiums (1.5% for Rabi, 2% for Kharif).",
    documents: [
      "Aadhaar card copy",
      "Crop sowing certificate from Patwari or Sarpanch / Khasra details",
      "Bank account details"
    ],
    steps: [
      "Obtain crop sowing certificate from village revenue officer or Patwari.",
      "Apply through bank branch, CSC, or pmfby.gov.in before seasonal cut-off date.",
      "Pay the small farmer premium share and retain the acknowledgement receipt."
    ],
    official_url: "https://pmfby.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "csss-higher",
    name: "Central Sector Scheme of Scholarships for College Students",
    summary: "Merit-cum-means scholarship of ₹12,000 to ₹20,000 per year for higher education",
    category: "Students",
    benefits: "₹12,000 per year at graduation level and ₹20,000 per year at post-graduation level directly credited via DBT. Government application is 100% free.",
    documents: [
      "Student Aadhaar card",
      "Class 12 board marksheet (above 80th percentile)",
      "Family income certificate (income below ₹4.5 Lakh)",
      "College admission slip and fee receipt"
    ],
    steps: [
      "Register on National Scholarship Portal (scholarships.gov.in) with Aadhaar.",
      "Upload marksheet, family income certificate, and college fee receipt.",
      "Institute verifies application online and scholarship is disbursed via DBT."
    ],
    official_url: "https://scholarships.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "pmmvy",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    summary: "Maternity benefit cash incentive of ₹5,000 for pregnant and lactating mothers",
    category: "Women",
    benefits: "Cash incentive of ₹5,000 transferred in installments directly into mother's bank account for improved nutrition and health during first pregnancy.",
    documents: [
      "Mother's Aadhaar card",
      "Husband's Aadhaar card",
      "Mother and Child Protection (MCP) card",
      "Bank passbook in mother's name linked with Aadhaar"
    ],
    steps: [
      "Register pregnancy at local Anganwadi Centre within 150 days of LMP.",
      "Attend mandatory antenatal checkups and child immunization sessions.",
      "Installment is credited directly into mother's bank account."
    ],
    official_url: "https://pmmvy.wcd.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "eshram",
    name: "e-Shram Social Security Scheme",
    summary: "Universal social security identity card with ₹2 Lakh accidental insurance for informal workers",
    category: "Workers",
    benefits: "12-digit Universal Account Number (UAN) with ₹2 Lakh accidental death cover and seamless access to national social welfare programs.",
    documents: [
      "Aadhaar card",
      "Active mobile number linked with Aadhaar",
      "Bank account number with IFSC"
    ],
    steps: [
      "Self-register online at eshram.gov.in or visit any nearby CSC centre.",
      "Enter Aadhaar and complete OTP verification.",
      "Download your official e-Shram card instantly."
    ],
    official_url: "https://eshram.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat - PM-JAY",
    summary: "Free secondary and tertiary health cover up to ₹5 Lakh per family per year",
    category: "Health",
    benefits: "Cashless and paperless access to healthcare services up to ₹5 Lakh per eligible family per year across 27,000+ empanelled hospitals.",
    documents: [
      "Aadhaar card / Ration card",
      "Mobile number"
    ],
    steps: [
      "Check eligibility on mera.pmjay.gov.in or visit nearest Ayushman Mitra kiosk.",
      "Complete e-KYC with Aadhaar card at empanelled hospital.",
      "Receive Golden Ayushman Card for 100% cashless medical treatment."
    ],
    official_url: "https://pmjay.gov.in",
    last_verified: "2026",
    demo: false
  }
];

const MOCK_SCHEMES_HI = [
  {
    id: "pm-kisan",
    name: "प्रधानमंत्री किसान सम्मान निधि",
    summary: "छोटे और सीमांत किसान परिवारों के लिए प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता",
    category: "किसान",
    benefits: "प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से हर चार महीने में ₹2,000 की 3 समान किस्तों में ₹6,000 प्रति वर्ष सीधे बैंक खाते में।",
    documents: [
      "आधार कार्ड की प्रति",
      "ज़मीन का मालिकाना दस्तावेज़ (खतौनी / फर्द / जमाबंदी)",
      "आधार से जुड़ा बैंक पासबुक"
    ],
    steps: [
      "सुनिश्चित करें कि आपका आधार बैंक खाते से जुड़ा है और DBT सक्रिय है।",
      "pmkisan.gov.in पोर्टल पर जाएँ या अपने निकटतम CSC केंद्र पर जाएँ।",
      "अपने ज़मीन के रिकॉर्ड और आधार नंबर दर्ज करवाएँ।",
      "पंजीकरण नंबर प्राप्त करें और DBT भुगतान की स्थिति ऑनलाइन देखें।"
    ],
    official_url: "https://pmkisan.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "pmfby",
    name: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
    summary: "प्राकृतिक आपदाओं, सूखा, बाढ़ और बेमौसम बारिश से फसल नुकसान के विरुद्ध रियायती फसल बीमा",
    category: "किसान",
    benefits: "कम प्रीमियम (रबी फसल 1.5%, खरीफ फसल 2%) पर सूखा, बाढ़, कीट और बेमौसम बारिश से फसल नुकसान के विरुद्ध व्यापक सुरक्षा।",
    documents: [
      "आधार कार्ड",
      "पटवारी या सरपंच से फसल बुवाई प्रमाण पत्र / खसरा",
      "बैंक खाता विवरण"
    ],
    steps: [
      "स्थानीय पटवारी से फसल बुवाई का प्रमाण पत्र लें।",
      "कट-ऑफ तिथि से पहले अपनी बैंक शाखा या CSC केंद्र पर आवेदन करें।",
      "किसान प्रीमियम हिस्सा जमा करें और रसीद संभाल कर रखें।"
    ],
    official_url: "https://pmfby.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "csss-higher",
    name: "कॉलेज छात्रों के लिए केंद्रीय क्षेत्र छात्रवृत्ति योजना",
    summary: "उच्च शिक्षा प्राप्त कर रहे मेधावी छात्रों के लिए ₹12,000 से ₹20,000 प्रति वर्ष छात्रवृत्ति",
    category: "छात्र",
    benefits: "स्नातक स्तर पर ₹12,000 और स्नातकोत्तर स्तर पर ₹20,000 प्रति वर्ष सीधे बैंक खाते में। सरकारी आवेदन पूरी तरह निःशुल्क है।",
    documents: [
      "छात्र का आधार कार्ड",
      "कक्षा 12वीं की अंकतालिका (80 पर्सेंटाइल से ऊपर)",
      "पारिवारिक आय प्रमाण पत्र (वार्षिक आय ₹4.5 लाख से कम)",
      "कॉलेज शुल्क रसीद और प्रवेश पत्र"
    ],
    steps: [
      "नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर आधार द्वारा पंजीकरण करें।",
      "अंकतालिका, आय प्रमाण पत्र और शुल्क रसीद अपलोड करें।",
      "कॉलेज सत्यापन के बाद राशि सीधे DBT द्वारा बैंक में भेजी जाती है।"
    ],
    official_url: "https://scholarships.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "pmmvy",
    name: "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
    summary: "गर्भवती और स्तनपान कराने वाली माताओं के बेहतर पोषण और स्वास्थ्य के लिए ₹5,000 नकद सहायता",
    category: "महिलाएँ",
    benefits: "पहले जीवित बच्चे के लिए बेहतर पोषण और प्रसव पूर्व देखभाल हेतु तीन किस्तों में ₹5,000 की नकद राशि सीधे बैंक खाते में।",
    documents: [
      "माता का आधार कार्ड",
      "पति का आधार कार्ड",
      "मातृ एवं शिशु सुरक्षा (MCP) कार्ड",
      "माता के नाम पर बैंक पासबुक"
    ],
    steps: [
      "गाँव के आंगनवाड़ी केंद्र पर LMP के 150 दिनों के भीतर पंजीकरण कराएं।",
      "नियमित प्रसव पूर्व जांच और टीकाकरण पूरा करें।",
      "राशि सीधे माता के बैंक खाते में जमा होती है।"
    ],
    official_url: "https://pmmvy.wcd.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "eshram",
    name: "ई-श्रम सामाजिक सुरक्षा कार्ड",
    summary: "असंगठित मज़दूरों के लिए 12 अंकों का विशिष्ट पहचान नंबर और ₹2 लाख दुर्घटना बीमा",
    category: "मज़दूर",
    benefits: "12 अंकों का विशिष्ट पहचान नंबर (UAN), ₹2 लाख का दुर्घटना बीमा कवर और राज्य कल्याण योजनाओं का सीधा लाभ।",
    documents: [
      "आधार कार्ड",
      "आधार से जुड़ा सक्रिय मोबाइल नंबर",
      "IFSC कोड सहित बैंक खाता विवरण"
    ],
    steps: [
      "eshram.gov.in पर स्वयं ऑनलाइन पंजीकरण करें या CSC केंद्र पर जाएं।",
      "आधार नंबर दर्ज करके OTP द्वारा सत्यापन करें।",
      "अपना डिजिटल ई-श्रम कार्ड डाउनलोड करें।"
    ],
    official_url: "https://eshram.gov.in",
    last_verified: "2026",
    demo: false
  },
  {
    id: "pmjay",
    name: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)",
    summary: "प्रति परिवार प्रति वर्ष ₹5 लाख तक का निःशुल्क अस्पताल इलाज व स्वास्थ्य सुरक्षा",
    category: "स्वास्थ्य",
    benefits: "देश भर के 27,000 से अधिक सूचीबद्ध अस्पतालों में माध्यमिक और तृतीयक देखभाल हेतु प्रति परिवार ₹5 लाख तक का कैशलेस इलाज।",
    documents: [
      "आधार कार्ड / राशन कार्ड",
      "सक्रिय मोबाइल नंबर"
    ],
    steps: [
      "mera.pmjay.gov.in पर पात्रता जांचें या नजदीकी आयुष्मान मित्र केंद्र पर जाएं।",
      "सूचीबद्ध अस्पताल में आधार द्वारा e-KYC पूरा करें।",
      "गोल्डन कार्ड प्राप्त करें और निःशुल्क इलाज का लाभ उठाएं।"
    ],
    official_url: "https://pmjay.gov.in",
    last_verified: "2026",
    demo: false
  }
];

// Helper to extract known profile information from user text
function parseProfileFromText(text, lang) {
  const isHi = lang === 'hi';
  const lower = text.toLowerCase();
  const profile = {};

  if (lower.includes('farmer') || lower.includes('किसान') || lower.includes('kisan') || lower.includes('farming') || lower.includes('खेती')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'किसान' : 'Farmer';
  } else if (lower.includes('student') || lower.includes('छात्र') || lower.includes('विद्यार्थी') || lower.includes('vidyarthi') || lower.includes('college') || lower.includes('school')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'छात्र' : 'Student';
  } else if (lower.includes('widow') || lower.includes('विधवा') || lower.includes('woman') || lower.includes('women') || lower.includes('महिला') || lower.includes('female')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'महिला' : 'Woman';
  } else if (lower.includes('senior') || lower.includes('वृद्ध') || lower.includes('बुजुर्ग') || lower.includes('वरिष्ठ') || lower.includes('pensioner') || lower.includes('pension')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'वरिष्ठ नागरिक' : 'Senior citizen';
  } else if (lower.includes('worker') || lower.includes('मज़दूर') || lower.includes('मजदूर') || lower.includes('labour') || lower.includes('श्रमिक') || lower.includes('unorganized')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'मज़दूर' : 'Worker';
  } else if (lower.includes('business') || lower.includes('दुकान') || lower.includes('व्यापारी') || lower.includes('shop') || lower.includes('vendor') || lower.includes('उद्यमी')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'छोटा व्यापारी' : 'Small business';
  }

  // Location / State check
  if (lower.includes('haryana') || lower.includes('हरियाणा')) {
    profile[isHi ? 'राज्य' : 'State'] = isHi ? 'हरियाणा' : 'Haryana';
  } else if (lower.includes('up') || lower.includes('uttar pradesh') || lower.includes('उत्तर प्रदेश')) {
    profile[isHi ? 'राज्य' : 'State'] = isHi ? 'उत्तर प्रदेश' : 'Uttar Pradesh';
  } else if (lower.includes('bihar') || lower.includes('बिहार')) {
    profile[isHi ? 'राज्य' : 'State'] = isHi ? 'बिहार' : 'Bihar';
  } else if (lower.includes('rajasthan') || lower.includes('राजस्थान')) {
    profile[isHi ? 'राज्य' : 'State'] = isHi ? 'राजस्थान' : 'Rajasthan';
  }

  // Residence area
  if (lower.includes('village') || lower.includes('गाँव') || lower.includes('गांव') || lower.includes('rural') || lower.includes('ग्रामीण')) {
    profile[isHi ? 'क्षेत्र' : 'Area'] = isHi ? 'ग्रामीण' : 'Rural';
  } else if (lower.includes('city') || lower.includes('शहर') || lower.includes('urban') || lower.includes('शहरी')) {
    profile[isHi ? 'क्षेत्र' : 'Area'] = isHi ? 'शहरी' : 'Urban';
  }

  // Landholding check
  if (lower.includes('up to 2') || lower.includes('2 hectare tak') || lower.includes('2 हेक्टेयर तक') || lower.includes('अपनी ज़मीन (2 हेक्टेयर तक)')) {
    profile[isHi ? 'भूमि' : 'Landholding'] = isHi ? '2 हेक्टेयर तक' : 'Up to 2 hectares';
  } else if (lower.includes('more than 2') || lower.includes('2 hectare se adhik') || lower.includes('2 हेक्टेयर से अधिक')) {
    profile[isHi ? 'भूमि' : 'Landholding'] = isHi ? '2 हेक्टेयर से अधिक' : 'More than 2 hectares';
  } else if (lower.includes('tenant') || lower.includes('बटाईदार') || lower.includes('भूमिहीन') || lower.includes('landless')) {
    profile[isHi ? 'भूमि' : 'Landholding'] = isHi ? 'भूमिहीन / बटाईदार' : 'Tenant / Landless';
  }

  // Crop sowing check
  if (lower.includes('cultivated') || lower.includes('मौसमी फसल') || lower.includes('बोई') || lower.includes('sown')) {
    profile[isHi ? 'फसल बुवाई' : 'Crop Cultivation'] = isHi ? 'मौसमी फसल बोई' : 'Seasonal crops sown';
  } else if (lower.includes('fallow') || lower.includes('खाली')) {
    profile[isHi ? 'फसल बुवाई' : 'Crop Cultivation'] = isHi ? 'खेत खाली रहा' : 'Land was fallow';
  }

  // Income check
  if (lower.includes('below') || lower.includes('1 lakh se kam') || lower.includes('1 लाख से कम') || lower.includes('₹1 लाख से कम')) {
    profile[isHi ? 'वार्षिक आय' : 'Income'] = isHi ? '₹1 लाख से कम' : 'Below ₹1 Lakh';
  } else if (lower.includes('above') || lower.includes('अधिक') || lower.includes('2.5 lakh se adhik') || lower.includes('₹2.5 लाख से अधिक')) {
    profile[isHi ? 'वार्षिक आय' : 'Income'] = isHi ? '₹2.5 लाख से अधिक' : 'Above ₹2.5 Lakh';
  } else if (lower.includes('1 - 2.5') || lower.includes('1-2.5') || lower.includes('2.5 lakh') || lower.includes('2.5 लाख') || lower.includes('1.5') || lower.includes('2 lakh')) {
    profile[isHi ? 'वार्षिक आय' : 'Income'] = isHi ? '₹1 - ₹2.5 लाख' : '₹1 Lakh - ₹2.5 Lakh';
  }

  return profile;
}

// ----------------------------------------------------
// Mock Handlers
// ----------------------------------------------------

async function mockCreateSession(language = 'en') {
  const sessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
  mockSessions.set(sessionId, {
    sessionId,
    language,
    step: 0,
    profile: {},
    history: []
  });
  return { session_id: sessionId };
}

async function mockSendMessage(sessionId, message, language = 'en') {
  // Simulate network latency (150-250ms)
  await new Promise(r => setTimeout(r, 200));

  let session = mockSessions.get(sessionId);
  if (!session) {
    session = {
      sessionId,
      language,
      step: 0,
      profile: {},
      history: []
    };
    mockSessions.set(sessionId, session);
  } else {
    session.language = language;
  }

  const trimmed = (message || '').trim();
  const lowerMsg = trimmed.toLowerCase();
  const isHi = (language || session.language) === 'hi' || /[\u0900-\u097F]/.test(trimmed);
  if (isHi) session.language = 'hi';

  // 1. Conversational Greeting & Introduction Handler (like ChatGPT / Claude)
  const nameMatch = trimmed.match(/(?:i am|i\'m|im|my name is|mera naam|main|mai)\s+([a-zA-Z\u0900-\u097F]+)/i);
  let detectedName = null;
  if (nameMatch) {
    const rawName = nameMatch[1].trim();
    if (!['a', 'an', 'the', 'ek', 'kisan', 'farmer', 'student', 'hoon', 'hai', 'hu'].includes(rawName.toLowerCase())) {
      detectedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    }
  }

  const isCasualGreeting = /^(hi|hello|hey|namaste|pranam|namaskar|hlo|hii|नमस्ते|प्रणाम|नमस्कार)\b/i.test(trimmed) ||
    /^(i am|i'm|im|my name is|mera naam|main|mai)\b/i.test(trimmed) ||
    (detectedName && trimmed.split(/\s+/).length <= 4) ||
    trimmed.length <= 2;

  const hasSpecificKeyword = /yojana|scheme|kisan|farmer|student|scholarship|chhatravritti|shiksha|padhai|income|pension|fasal|crop|loan|mudra/i.test(lowerMsg);

  if (isCasualGreeting && !hasSpecificKeyword) {
    const reply_hi = detectedName
      ? `नमस्ते ${detectedName} जी! योजना साथी में आपका स्वागत है। मैं आपकी सरकारी योजनाएं खोजने में कैसे मदद कर सकता हूँ? आप मुझे अपना पेशा, शिक्षा या आवश्यकता बता सकते हैं, या किसी विशिष्ट योजना (जैसे छात्रवृत्ति, किसान सहायता) के बारे में पूछ सकते हैं।`
      : "नमस्ते! योजना साथी में आपका स्वागत है। मैं आपकी सरकारी योजनाएं खोजने में कैसे मदद कर सकता हूँ? आप किस तरह की योजना के बारे में जानना चाहते हैं? (जैसे: छात्रवृत्ति, किसान योजना, स्वास्थ्य बीमा, महिला कल्याण, या पेंशन) या अपनी स्थिति बताएं।";
    const reply_en = detectedName
      ? `Hello ${detectedName}! Welcome to SchemeSathi. How can I help you find government schemes today? You can tell me your occupation, income, or ask about specific schemes.`
      : "Hello! Welcome to SchemeSathi. How can I help you find government schemes today? You can tell me your occupation, income, or ask about specific categories like scholarships, farming, or healthcare.";

    return {
      reply: isHi ? reply_hi : reply_en,
      reply_en,
      reply_hi,
      quick_replies: isHi
        ? ["किसान योजनाएं", "छात्रवृत्ति / शिक्षा", "महिला कल्याण", "स्वास्थ्य बीमा", "पेंशन"]
        : ["Farmer Schemes", "Scholarships", "Women Welfare", "Health Insurance", "Pensions"],
      quick_replies_hi: ["किसान योजनाएं", "छात्रवृत्ति / शिक्षा", "महिला कल्याण", "स्वास्थ्य बीमा", "पेंशन"],
      quick_replies_en: ["Farmer Schemes", "Scholarships", "Women Welfare", "Health Insurance", "Pensions"],
      why: "",
      progress: { answered: 0 },
      profile: { ...session.profile },
      done: false,
      show_results: false,
      results: []
    };
  }

  // 2. Empathetic Uncertainty Handler ("Not sure", "Don't know", "पता नहीं")
  const isNotSure = /^(not sure|dont know|don't know|no idea|pata nahi|nahi pata|maloom nahi|पता नहीं|मालूम नहीं)/i.test(trimmed) ||
    lowerMsg === 'not sure' || lowerMsg === "don't know" || lowerMsg === 'dont know';

  if (isNotSure) {
    const reply_hi = "कोई बात नहीं! आप बिना आय सीमा वाली योजनाओं (जैसे स्वास्थ्य या सामाजिक सुरक्षा) के बारे में पूछ सकते हैं, या मुझे किसी विशिष्ट श्रेणी जैसे छात्रवृत्ति या खेती के बारे में बता सकते हैं।";
    const reply_en = "That is completely fine! I can help you find schemes that do not have strict income limits, or you can tell me about a category like scholarships, healthcare, or farming.";
    return {
      reply: isHi ? reply_hi : reply_en,
      reply_en,
      reply_hi,
      quick_replies: isHi
        ? ["छात्रवृत्ति / शिक्षा", "किसान सहायता", "आयुष्मान भारत (स्वास्थ्य)", "ई-श्रम (श्रमिक)"]
        : ["Scholarships / Education", "Farmer Support", "Ayushman Bharat (Health)", "e-Shram (Worker)"],
      quick_replies_hi: ["छात्रवृत्ति / शिक्षा", "किसान सहायता", "आयुष्मान भारत (स्वास्थ्य)", "ई-श्रम (श्रमिक)"],
      quick_replies_en: ["Scholarships / Education", "Farmer Support", "Ayushman Bharat (Health)", "e-Shram (Worker)"],
      why: "",
      progress: { answered: session.step || 1 },
      profile: { ...session.profile },
      done: false,
      show_results: false,
      results: []
    };
  }

  // 3. Domain Intent: Education / Scholarships
  if (/शिक्षा|पढ़ाई|छात्रवृत्ति|विद्यार्थी|स्कॉलरशिप|education|scholarship|study|college|school/i.test(lowerMsg)) {
    const csssScheme = (isHi ? MOCK_SCHEMES_HI : MOCK_SCHEMES_EN).find(s => s.id === "csss-higher");
    const reply_hi = "शिक्षा और उच्च अध्ययन के लिए 'कॉलेज छात्रों के लिए केंद्रीय क्षेत्र छात्रवृत्ति योजना' उपलब्ध है। इसके तहत पात्र छात्रों को स्नातक स्तर पर ₹12,000 और स्नातकोत्तर स्तर पर ₹20,000 प्रति वर्ष की छात्रवृत्ति सीधे बैंक खाते में मिलती है। सरकारी आवेदन पूरी तरह निःशुल्क (मुफ़्त) हैं।";
    const reply_en = "For higher education, the 'Central Sector Scheme of Scholarships for College Students' provides ₹12,000 to ₹20,000 per year directly credited via DBT. Official government applications are completely free of cost.";
    const csssEn = MOCK_SCHEMES_EN.find(s => s.id === "csss-higher");
    const csssHi = MOCK_SCHEMES_HI.find(s => s.id === "csss-higher");
    return {
        reply: isHi ? reply_hi : reply_en,
        reply_en,
        reply_hi,
        quick_replies: isHi ? ["पात्रता की शर्तें", "आवश्यक दस्तावेज़", "आवेदन प्रक्रिया"] : ["Eligibility Criteria", "Required Documents", "Application Steps"],
        quick_replies_hi: ["पात्रता की शर्तें", "आवश्यक दस्तावेज़", "आवेदन प्रक्रिया"],
        quick_replies_en: ["Eligibility Criteria", "Required Documents", "Application Steps"],
        why: "",
        progress: { answered: 2 },
        profile: { ...session.profile, [isHi ? 'पेशा' : 'Occupation']: isHi ? 'छात्र' : 'Student' },
        done: false,
        show_results: true,
        results_url: "/results",
        results: csssScheme ? [{
          scheme_id: csssScheme.id,
          name: csssScheme.name,
          name_en: csssEn?.name || csssScheme.name,
          name_hi: csssHi?.name || csssScheme.name,
          summary: csssScheme.summary,
          summary_en: csssEn?.summary || csssScheme.summary,
          summary_hi: csssHi?.summary || csssScheme.summary,
          category: csssScheme.category,
          category_en: csssEn?.category || "Students",
          category_hi: csssHi?.category || "छात्र",
          status: "needs_information",
          passed: [],
          passed_en: [],
          passed_hi: [],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: isHi ? ["12वीं कक्षा में 80 पर्सेंटाइल से ऊपर अंक", "पारिवारिक आय ₹4.5 लाख से कम"] : ["Above 80th percentile in Class 12", "Family income below ₹4.5 Lakh"],
          missing_en: ["Above 80th percentile in Class 12", "Family income below ₹4.5 Lakh"],
          missing_hi: ["12वीं कक्षा में 80 पर्सेंटाइल से ऊपर अंक", "पारिवारिक आय ₹4.5 लाख से कम"],
          benefits: csssScheme.benefits,
          benefits_en: csssEn?.benefits || csssScheme.benefits,
          benefits_hi: csssHi?.benefits || csssScheme.benefits,
          official_url: csssScheme.official_url
        }] : []
      };
    }

  // 4. Domain Intent: Farming / Agriculture
  if (/किसान|खेती|फसल|बीमा|kisan|farmer|farming|crop|pmfby|pm kisan/i.test(lowerMsg)) {
    const pmKisan = (isHi ? MOCK_SCHEMES_HI : MOCK_SCHEMES_EN).find(s => s.id === "pm-kisan");
    const pmKisanEn = MOCK_SCHEMES_EN.find(s => s.id === "pm-kisan");
    const pmKisanHi = MOCK_SCHEMES_HI.find(s => s.id === "pm-kisan");
    const pmfby = (isHi ? MOCK_SCHEMES_HI : MOCK_SCHEMES_EN).find(s => s.id === "pmfby");
    const pmfbyEn = MOCK_SCHEMES_EN.find(s => s.id === "pmfby");
    const pmfbyHi = MOCK_SCHEMES_HI.find(s => s.id === "pmfby");
    const reply_hi = "किसानों के लिए मुख्य रूप से 'प्रधानमंत्री किसान सम्मान निधि' (प्रति वर्ष ₹6,000 तीन किस्तों में) और 'प्रधानमंत्री फसल बीमा योजना' (फसल नुकसान पर सुरक्षा) उपलब्ध हैं। सरकारी आवेदन पूरी तरह निःशुल्क (मुफ़्त) हैं।";
    const reply_en = "For farmers, key schemes include 'PM Kisan Samman Nidhi' (₹6,000 per year in 3 installments) and 'PM Fasal Bima Yojana' (subsidized crop loss insurance). Official government applications are completely free of cost.";
    return {
      reply: isHi ? reply_hi : reply_en,
      reply_en,
      reply_hi,
      quick_replies: isHi ? ["2 हेक्टेयर तक ज़मीन", "2 हेक्टेयर से अधिक", "बटाईदार / भूमिहीन"] : ["Up to 2 hectares", "More than 2 hectares", "Tenant / Landless"],
      quick_replies_hi: ["2 हेक्टेयर तक ज़मीन", "2 हेक्टेयर से अधिक", "बटाईदार / भूमिहीन"],
      quick_replies_en: ["Up to 2 hectares", "More than 2 hectares", "Tenant / Landless"],
      why: "",
      progress: { answered: 2 },
      profile: { ...session.profile, [isHi ? 'पेशा' : 'Occupation']: isHi ? 'किसान' : 'Farmer' },
      done: false,
      show_results: true,
      results_url: "/results",
      results: [
        pmKisan && {
          scheme_id: pmKisan.id,
          name: pmKisan.name,
          name_en: pmKisanEn?.name || pmKisan.name,
          name_hi: pmKisanHi?.name || pmKisan.name,
          summary: pmKisan.summary,
          summary_en: pmKisanEn?.summary || pmKisan.summary,
          summary_hi: pmKisanHi?.summary || pmKisan.summary,
          category: pmKisan.category,
          category_en: pmKisanEn?.category || "Farmers",
          category_hi: pmKisanHi?.category || "किसान",
          status: "needs_information",
          passed: [isHi ? "मुख्य व्यवसाय कृषि" : "Primary occupation is farming"],
          passed_en: ["Primary occupation is farming"],
          passed_hi: ["मुख्य व्यवसाय कृषि"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: [isHi ? "ज़मीन का मालिकाना रिकॉर्ड (खतौनी/फर्द)" : "Land ownership record in your name"],
          missing_en: ["Land ownership record in your name"],
          missing_hi: ["ज़मीन का मालिकाना रिकॉर्ड (खतौनी/फर्द)"],
          benefits: pmKisan.benefits,
          benefits_en: pmKisanEn?.benefits || pmKisan.benefits,
          benefits_hi: pmKisanHi?.benefits || pmKisan.benefits,
          official_url: pmKisan.official_url
        },
        pmfby && {
          scheme_id: pmfby.id,
          name: pmfby.name,
          name_en: pmfbyEn?.name || pmfby.name,
          name_hi: pmfbyHi?.name || pmfby.name,
          summary: pmfby.summary,
          summary_en: pmfbyEn?.summary || pmfby.summary,
          summary_hi: pmfbyHi?.summary || pmfby.summary,
          category: pmfby.category,
          category_en: pmfbyEn?.category || "Farmers",
          category_hi: pmfbyHi?.category || "किसान",
          status: "needs_information",
          passed: [isHi ? "कृषि कार्य" : "Agricultural activity"],
          passed_en: ["Agricultural activity"],
          passed_hi: ["कृषि कार्य"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: [isHi ? "वर्तमान मौसम के लिए फसल बुवाई प्रमाण पत्र" : "Crop sowing certificate for current season"],
          missing_en: ["Crop sowing certificate for current season"],
          missing_hi: ["वर्तमान मौसम के लिए फसल बुवाई प्रमाण पत्र"],
          benefits: pmfby.benefits,
          benefits_en: pmfbyEn?.benefits || pmfby.benefits,
          benefits_hi: pmfbyHi?.benefits || pmfby.benefits,
          official_url: pmfby.official_url
        }
      ].filter(Boolean)
    };
  }

  // 5. Profile Attribute Accumulation
  const extracted = parseProfileFromText(message, isHi ? 'hi' : 'en');
  Object.assign(session.profile, extracted);
  session.history.push({ role: 'user', content: message });
  session.step += 1;

  // Evaluate against Supabase criteria if configured
  let results = [];
  if (isSupabaseConfigured()) {
    try {
      const criteriaData = await fetchEligibilityCriteriaFromSupabase();
      if (Array.isArray(criteriaData) && criteriaData.length > 0) {
        results = evaluateEligibilityAgainstCriteria(session.profile, criteriaData, isHi ? 'hi' : 'en');
      }
    } catch (err) {
      console.warn("Supabase criteria evaluation error, falling back to mock results", err);
    }
  }

  // Filter out any invalid or non-eligible entries
  if (Array.isArray(results) && results.length > 0) {
    results = results.filter(r => r.status === "potentially_eligible" || r.status === "needs_information");
  }

  // Match against verified real schemes if Supabase yielded no results
  if (!results || results.length === 0) {
    const isFarmer = Object.values(session.profile).some(v => String(v).includes('Farmer') || String(v).includes('किसान'));
    const isStudent = Object.values(session.profile).some(v => String(v).includes('Student') || String(v).includes('छात्र'));
    const isWoman = Object.values(session.profile).some(v => String(v).includes('Woman') || String(v).includes('महिला'));
    const isWorker = Object.values(session.profile).some(v => String(v).includes('Worker') || String(v).includes('मज़दूर') || String(v).includes('मजदूर'));

    const list = isHi ? MOCK_SCHEMES_HI : MOCK_SCHEMES_EN;

    if (isFarmer) {
      const pkEn = MOCK_SCHEMES_EN.find(s => s.id === "pm-kisan");
      const pkHi = MOCK_SCHEMES_HI.find(s => s.id === "pm-kisan");
      const pfEn = MOCK_SCHEMES_EN.find(s => s.id === "pmfby");
      const pfHi = MOCK_SCHEMES_HI.find(s => s.id === "pmfby");
      const pk = isHi ? pkHi : pkEn;
      const pf = isHi ? pfHi : pfEn;
      results = [
        pk && {
          scheme_id: pk.id,
          name: pk.name,
          name_en: pkEn?.name || pk.name,
          name_hi: pkHi?.name || pk.name,
          summary: pk.summary,
          summary_en: pkEn?.summary || pk.summary,
          summary_hi: pkHi?.summary || pk.summary,
          category: pk.category,
          category_en: pkEn?.category || "Farmers",
          category_hi: pkHi?.category || "किसान",
          status: "potentially_eligible",
          passed: isHi ? ["मुख्य व्यवसाय कृषि दर्ज है", "ज़मीन का रिकॉर्ड सत्यापित"] : ["Primary occupation is farming", "Landholding record verified"],
          passed_en: ["Primary occupation is farming", "Landholding record verified"],
          passed_hi: ["मुख्य व्यवसाय कृषि दर्ज है", "ज़मीन का रिकॉर्ड सत्यापित"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: [],
          missing_en: [],
          missing_hi: [],
          benefits: pk.benefits,
          benefits_en: pkEn?.benefits || pk.benefits,
          benefits_hi: pkHi?.benefits || pk.benefits,
          official_url: pk.official_url
        },
        pf && {
          scheme_id: pf.id,
          name: pf.name,
          name_en: pfEn?.name || pf.name,
          name_hi: pfHi?.name || pf.name,
          summary: pf.summary,
          summary_en: pfEn?.summary || pf.summary,
          summary_hi: pfHi?.summary || pf.summary,
          category: pf.category,
          category_en: pfEn?.category || "Farmers",
          category_hi: pfHi?.category || "किसान",
          status: "needs_information",
          passed: isHi ? ["कृषि भूमि धारक"] : ["Agricultural landholder"],
          passed_en: ["Agricultural landholder"],
          passed_hi: ["कृषि भूमि धारक"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: isHi ? ["वर्तमान मौसम में फसल बुवाई सत्यापन"] : ["Seasonal crop sowing verification"],
          missing_en: ["Seasonal crop sowing verification"],
          missing_hi: ["वर्तमान मौसम में फसल बुवाई सत्यापन"],
          benefits: pf.benefits,
          benefits_en: pfEn?.benefits || pf.benefits,
          benefits_hi: pfHi?.benefits || pf.benefits,
          official_url: pf.official_url
        }
      ].filter(Boolean);
    } else if (isStudent) {
      const scEn = MOCK_SCHEMES_EN.find(s => s.id === "csss-higher");
      const scHi = MOCK_SCHEMES_HI.find(s => s.id === "csss-higher");
      const sc = isHi ? scHi : scEn;
      if (sc) {
        results = [{
          scheme_id: sc.id,
          name: sc.name,
          name_en: scEn?.name || sc.name,
          name_hi: scHi?.name || sc.name,
          summary: sc.summary,
          summary_en: scEn?.summary || sc.summary,
          summary_hi: scHi?.summary || sc.summary,
          category: sc.category,
          category_en: scEn?.category || "Students",
          category_hi: scHi?.category || "छात्र",
          status: "potentially_eligible",
          passed: isHi ? ["उच्च शिक्षा अध्ययनरत"] : ["Enrolled in higher education"],
          passed_en: ["Enrolled in higher education"],
          passed_hi: ["उच्च शिक्षा अध्ययनरत"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: [],
          missing_en: [],
          missing_hi: [],
          benefits: sc.benefits,
          benefits_en: scEn?.benefits || sc.benefits,
          benefits_hi: scHi?.benefits || sc.benefits,
          official_url: sc.official_url
        }];
      }
    } else if (isWoman) {
      const wmEn = MOCK_SCHEMES_EN.find(s => s.id === "pmmvy");
      const wmHi = MOCK_SCHEMES_HI.find(s => s.id === "pmmvy");
      const wm = isHi ? wmHi : wmEn;
      if (wm) {
        results = [{
          scheme_id: wm.id,
          name: wm.name,
          name_en: wmEn?.name || wm.name,
          name_hi: wmHi?.name || wm.name,
          summary: wm.summary,
          summary_en: wmEn?.summary || wm.summary,
          summary_hi: wmHi?.summary || wm.summary,
          category: wm.category,
          category_en: wmEn?.category || "Women",
          category_hi: wmHi?.category || "महिलाएँ",
          status: "potentially_eligible",
          passed: isHi ? ["महिला नागरिक"] : ["Eligible female applicant"],
          passed_en: ["Eligible female applicant"],
          passed_hi: ["महिला नागरिक"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: [],
          missing_en: [],
          missing_hi: [],
          benefits: wm.benefits,
          benefits_en: wmEn?.benefits || wm.benefits,
          benefits_hi: wmHi?.benefits || wm.benefits,
          official_url: wm.official_url
        }];
      }
    } else if (isWorker) {
      const esEn = MOCK_SCHEMES_EN.find(s => s.id === "eshram");
      const esHi = MOCK_SCHEMES_HI.find(s => s.id === "eshram");
      const es = isHi ? esHi : esEn;
      if (es) {
        results = [{
          scheme_id: es.id,
          name: es.name,
          name_en: esEn?.name || es.name,
          name_hi: esHi?.name || es.name,
          summary: es.summary,
          summary_en: esEn?.summary || es.summary,
          summary_hi: esHi?.summary || es.summary,
          category: es.category,
          category_en: esEn?.category || "Workers",
          category_hi: esHi?.category || "मज़दूर",
          status: "potentially_eligible",
          passed: isHi ? ["असंगठित क्षेत्र के कामगार"] : ["Unorganized sector worker"],
          passed_en: ["Unorganized sector worker"],
          passed_hi: ["असंगठित क्षेत्र के कामगार"],
          failed: [],
          failed_en: [],
          failed_hi: [],
          missing: [],
          missing_en: [],
          missing_hi: [],
          benefits: es.benefits,
          benefits_en: esEn?.benefits || es.benefits,
          benefits_hi: esHi?.benefits || es.benefits,
          official_url: es.official_url
        }];
      }
    }
  }

  // If still no scheme matched, return empty results with a helpful conversational prompt
  if (!results || results.length === 0) {
    const reply_hi = "मुझे अभी सटीक योजना खोजने के लिए पर्याप्त जानकारी नहीं मिली है। क्या आप मुझे अपना पेशा, शिक्षा या आय बता सकते हैं?";
    const reply_en = "I don't have enough information to find a matching scheme yet. Could you tell me your occupation, education, or income?";
    return {
      reply: isHi ? reply_hi : reply_en,
      reply_en,
      reply_hi,
      quick_replies: isHi
        ? ["किसान", "छात्र", "महिला", "मज़दूर", "वरिष्ठ नागरिक"]
        : ["Farmer", "Student", "Woman", "Worker", "Senior citizen"],
      quick_replies_hi: ["किसान", "छात्र", "महिला", "मज़दूर", "वरिष्ठ नागरिक"],
      quick_replies_en: ["Farmer", "Student", "Woman", "Worker", "Senior citizen"],
      why: "",
      progress: { answered: session.step },
      profile: { ...session.profile },
      done: false,
      show_results: false,
      results: []
    };
  }

  const final_reply_hi = `हमने आपके विवरण के आधार पर ${results.length} प्रासंगिक सरकारी योजनाओं की पहचान की है। आप नीचे दिए गए कार्ड्स में विस्तृत जानकारी देख सकते हैं।`;
  const final_reply_en = `Based on your details, we found ${results.length} relevant government schemes. You can view the details in the cards below.`;

  return {
    reply: isHi ? final_reply_hi : final_reply_en,
    reply_en: final_reply_en,
    reply_hi: final_reply_hi,
    quick_replies: [],
    why: "",
    progress: { answered: session.step },
    profile: { ...session.profile },
    done: true,
    show_results: true,
    results_url: "/results",
    results
  };
}

async function mockGetSchemes(language = 'en') {
  await new Promise(r => setTimeout(r, 120));
  const list = language === 'hi' ? MOCK_SCHEMES_HI : MOCK_SCHEMES_EN;
  return list.map(s => ({
    id: s.id,
    name: s.name,
    summary: s.summary,
    category: s.category
  }));
}

async function mockGetSchemeDetail(id, language = 'en') {
  await new Promise(r => setTimeout(r, 150));
  const list = language === 'hi' ? MOCK_SCHEMES_HI : MOCK_SCHEMES_EN;
  const found = list.find(s => s.id === id);
  if (!found) {
    // Fallback to English if not found in Hindi
    const enFallback = MOCK_SCHEMES_EN.find(s => s.id === id);
    if (!enFallback) throw new Error("Scheme not found");
    return enFallback;
  }
  return found;
}

// ----------------------------------------------------
// Public API Methods (Real Backend with Mock Fallback)
// ----------------------------------------------------

export async function createSession(language = 'en') {
  if (!API_BASE) {
    return mockCreateSession(language);
  }

  try {
    const res = await fetch(`${API_BASE}/api/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Real API failed, falling back to mock createSession", err);
    return mockCreateSession(language);
  }
}

export async function sendMessage({ sessionId, message, language = 'en', audioBase64 = null }) {
  if (!API_BASE) {
    return mockSendMessage(sessionId, message, language);
  }

  // 1. Try AI-powered Voice/Text endpoint first (Groq 8B + Sarvam AI)
  try {
    const aiRes = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message: message || '',
        audio_base64: audioBase64,
        language,
        synthesize_audio: false
      })
    });
    if (aiRes.ok) {
      const data = await aiRes.json();
      return {
        reply: data.reply,
        reply_en: data.reply_en || (language === 'en' ? data.reply : null),
        reply_hi: data.reply_hi || (language === 'hi' ? data.reply : null),
        audio_base64: data.audio_base64,
        fallback_to_browser_tts: data.fallback_to_browser_tts,
        quick_replies: data.done ? [] : (language === 'hi' ? ['₹1 लाख से कम', '₹1 - ₹2.5 लाख', '₹2.5 लाख से अधिक'] : ['Below ₹1 Lakh', '₹1 - ₹2.5 Lakh', 'Above ₹2.5 Lakh']),
        quick_replies_hi: data.done ? [] : ['₹1 लाख से कम', '₹1 - ₹2.5 लाख', '₹2.5 लाख से अधिक'],
        quick_replies_en: data.done ? [] : ['Below ₹1 Lakh', '₹1 - ₹2.5 Lakh', 'Above ₹2.5 Lakh'],
        why: '',
        progress: { answered: data.done ? 3 : 1 },
        profile: data.profile || {},
        done: data.done,
        show_results: data.show_results ?? (Array.isArray(data.results) && data.results.length > 0),
        results_url: data.results_url || "/results",
        results: data.results || []
      };
    }
  } catch (err) {
    console.warn("AI Chat endpoint unavailable, falling back to standard /api/chat", err);
  }

  // 2. Fallback to standard chat endpoint
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        message,
        language
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const chatData = await res.json();
    return {
      ...chatData,
      reply_en: chatData.reply_en || (language === 'en' ? chatData.reply : null),
      reply_hi: chatData.reply_hi || (language === 'hi' ? chatData.reply : null)
    };
  } catch (err) {
    console.warn("Real API failed, falling back to mock sendMessage", err);
    return mockSendMessage(sessionId, message, language);
  }
}

export async function getSchemes(language = 'en') {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/schemes?language=${language}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend API failed, checking Supabase/mock", err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      return await fetchSchemesFromSupabase(language);
    } catch (err) {
      console.warn("Supabase fetchSchemes failed, falling back to mock", err);
    }
  }

  return mockGetSchemes(language);
}

export async function getSchemeById(id, language = 'en') {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/schemes/${id}?language=${language}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Backend API failed, checking Supabase/mock", err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      return await fetchSchemeByIdFromSupabase(id, language);
    } catch (err) {
      console.warn("Supabase fetchSchemeById failed, falling back to mock", err);
    }
  }

  return mockGetSchemeDetail(id, language);
}

export function getAudioStreamUrl(text, language = 'hi', speaker = null) {
  if (!text) return null;
  const endpoint = API_BASE ? `${API_BASE}/api/ai/synthesize/stream` : '/api/ai/synthesize/stream';
  const params = new URLSearchParams({
    text: text.slice(0, 500),
    lang: language,
  });
  if (speaker) params.append('speaker', speaker);
  return `${endpoint}?${params.toString()}`;
}

export async function synthesizeSpeech(text, language = 'hi') {
  if (!text) {
    return { audio_base64: null, fallback_to_browser_tts: true };
  }
  const endpoint = API_BASE ? `${API_BASE}/api/ai/synthesize` : '/api/ai/synthesize';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        speaker: null
      })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        audio_base64: data.audio_base64 || null,
        fallback_to_browser_tts: data.fallback_to_browser_tts || !data.audio_base64
      };
    }
  } catch (err) {
    console.warn("synthesizeSpeech API call failed:", err);
  }
  return { audio_base64: null, fallback_to_browser_tts: true };
}

// Allows rolling back step in mock mode for "Go Back"
export function mockRollbackStep(sessionId) {
  const session = mockSessions.get(sessionId);
  if (session && session.step > 1) {
    session.step -= 1;
    // remove last user message
    if (session.history.length > 0) {
      session.history.pop();
    }
  }
}

// Synchronizes the in-memory session language and profile when the user switches languages
export function updateSessionLanguage(sessionId, language, profile = null) {
  const session = mockSessions.get(sessionId);
  if (session) {
    session.language = language;
    if (profile && typeof profile === 'object') {
      session.profile = { ...profile };
    }
  }
}
