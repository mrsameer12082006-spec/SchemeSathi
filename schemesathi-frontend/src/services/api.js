// API client for SchemeSathi
// All network calls live in this one file.
// If VITE_API_URL is empty, uses the built-in mock so the UI runs entirely standalone.

const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

// In-memory mock sessions storage
const mockSessions = new Map();

// Built-in mock schemes list
const MOCK_SCHEMES_EN = [
  {
    id: "scheme-a",
    name: "Scheme A (demo)",
    summary: "Yearly support for small farmers",
    category: "Farmers",
    benefits: "₹6,000 per year transferred directly to your bank account in 3 equal installments of ₹2,000 every four months through Direct Benefit Transfer (DBT).",
    documents: [
      "Aadhaar card copy",
      "Land ownership paper (Khatoni / Fard / Jamabandi)",
      "Bank passbook copy linked with Aadhaar"
    ],
    steps: [
      "Check that your Aadhaar is linked to your bank account with active DBT.",
      "Visit the official registration portal or your nearby CSC (Common Service Centre).",
      "Submit your land record details and Aadhaar number.",
      "Receive an application registration number and track status online."
    ],
    official_url: "https://example.gov.in/demo-scheme-a",
    last_verified: null, // will display 'demo'
    demo: true
  },
  {
    id: "scheme-b",
    name: "Scheme B (demo)",
    summary: "Crop insurance support",
    category: "Farmers",
    benefits: "Comprehensive crop loss protection against drought, flood, pests and post-harvest unseasonal rain with low premium rates (1.5% to 2%).",
    documents: [
      "Aadhaar card copy",
      "Land possession certificate / Sowing certificate from Patwari or Sarpanch",
      "Bank account details"
    ],
    steps: [
      "Obtain a crop sowing certificate from your local village revenue officer.",
      "Apply through your bank branch or the nearest Common Service Centre before cut-off date.",
      "Pay the small farmer premium share and collect the acknowledgement receipt."
    ],
    official_url: "https://example.gov.in/demo-scheme-b",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-c",
    name: "Scheme C (demo)",
    summary: "Housing support",
    category: "Housing",
    benefits: "Direct financial assistance of ₹1.20 Lakh in plains (₹1.30 Lakh in hilly areas) for constructing a safe pucca house with toilet and clean cooking gas.",
    documents: [
      "Aadhaar card of all adult family members",
      "MGNREGA job card number (if held)",
      "Bank account details linked to Aadhaar",
      "Current land or kutcha house photo"
    ],
    steps: [
      "Verify that your name is included in the Gram Sabha priority housing list.",
      "Local Panchayat Secretary inspects your existing house.",
      "First installment is released upon geo-tagged foundation photograph."
    ],
    official_url: "https://example.gov.in/demo-scheme-c",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-d",
    name: "Scheme D (demo)",
    summary: "Post-matric student scholarship support",
    category: "Students",
    benefits: "Full reimbursement of compulsory non-refundable tuition fees plus a monthly maintenance allowance for post-secondary education.",
    documents: [
      "Student Aadhaar card",
      "Previous class marksheet",
      "Income certificate from Tehsildar",
      "College fee receipt and admission slip"
    ],
    steps: [
      "Register on the state scholarship portal with Aadhaar.",
      "Upload marksheet, income certificate, and fee receipt.",
      "College verifies the application and forwards to district welfare officer."
    ],
    official_url: "https://example.gov.in/demo-scheme-d",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-e",
    name: "Scheme E (demo)",
    summary: "Maternity and nutrition support",
    category: "Women",
    benefits: "Cash incentive of ₹5,000 in three stages to pregnant and lactating mothers for improved health and nutrition.",
    documents: [
      "Mother's Aadhaar card",
      "Husband's Aadhaar card",
      "Mother and Child Protection (MCP) card",
      "Bank passbook in mother's name"
    ],
    steps: [
      "Register pregnancy at the local Anganwadi Centre within 150 days of LMP.",
      "Attend mandatory antenatal checkups and immunization sessions.",
      "Amount is deposited directly into mother's bank account."
    ],
    official_url: "https://example.gov.in/demo-scheme-e",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-f",
    name: "Scheme F (demo)",
    summary: "Unorganized worker social security support",
    category: "Workers",
    benefits: "Universal social security number with ₹2 Lakh accidental death cover and access to state worker welfare funds.",
    documents: [
      "Aadhaar card",
      "Active mobile number linked with Aadhaar",
      "Bank account number with IFSC"
    ],
    steps: [
      "Self-register online or visit any CSC centre.",
      "Enter Aadhaar and verify with OTP.",
      "Download your digital worker card with 12-digit number."
    ],
    official_url: "https://example.gov.in/demo-scheme-f",
    last_verified: null,
    demo: true
  }
];

const MOCK_SCHEMES_HI = [
  {
    id: "scheme-a",
    name: "योजना A (डेमो)",
    summary: "छोटे किसानों के लिए वार्षिक सहायता",
    category: "किसान",
    benefits: "हर चार महीने में ₹2,000 की 3 समान किस्तों में ₹6,000 प्रति वर्ष सीधे आपके बैंक खाते में DBT (प्रत्यक्ष लाभ अंतरण) द्वारा भेजे जाते हैं।",
    documents: [
      "आधार कार्ड की प्रति",
      "ज़मीन का मालिकाना दस्तावेज़ (खतौनी / फर्द / जमाबंदी)",
      "आधार से जुड़ा बैंक पासबुक"
    ],
    steps: [
      "सुनिश्चित करें कि आपका आधार बैंक खाते से जुड़ा है और DBT सक्रिय है।",
      "आधिकारिक पोर्टल पर जाएँ या अपने निकटतम CSC (ग्राहक सेवा केंद्र) पर जाएँ।",
      "अपने ज़मीन के रिकॉर्ड और आधार नंबर दर्ज करवाएँ।",
      "आवेदन रसीद प्राप्त करें और स्थिति की ऑनलाइन जाँच करें।"
    ],
    official_url: "https://example.gov.in/demo-scheme-a",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-b",
    name: "योजना B (डेमो)",
    summary: "फसल बीमा सुरक्षा सहायता",
    category: "किसान",
    benefits: "कम प्रीमियम (1.5% से 2%) पर सूखा, बाढ़, कीट और बेमौसम बारिश से फसल नुकसान के विरुद्ध व्यापक सुरक्षा।",
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
    official_url: "https://example.gov.in/demo-scheme-b",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-c",
    name: "योजना C (डेमो)",
    summary: "आवास निर्माण सहायता",
    category: "आवास",
    benefits: "शौचालय युक्त पक्का मकान बनाने के लिए ₹1.20 लाख (पहाड़ी क्षेत्रों में ₹1.30 लाख) की सीधी आर्थिक मदद।",
    documents: [
      "परिवार के सभी वयस्क सदस्यों का आधार कार्ड",
      "मनरेगा जॉब कार्ड नंबर (यदि उपलब्ध हो)",
      "आधार से जुड़ा बैंक खाता",
      "वर्तमान कच्चे मकान या ज़मीन की फोटो"
    ],
    steps: [
      "जाँच करें कि आपका नाम ग्राम सभा की प्राथमिकता सूची में है या नहीं।",
      "पंचायत सचिव द्वारा वर्तमान कच्चे मकान का भौतिक सत्यापन किया जाता है।",
      "नींव निर्माण की जियो-टैग फोटो के बाद पहली किस्त बैंक खाते में आती है।"
    ],
    official_url: "https://example.gov.in/demo-scheme-c",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-d",
    name: "योजना D (डेमो)",
    summary: "पोस्ट-मैट्रिक छात्रवृत्ति सहायता",
    category: "छात्र",
    benefits: "उच्च शिक्षा के लिए अनिवार्य गैर-वापसी योग्य शिक्षण शुल्क की पूरी प्रतिपूर्ति और मासिक रखरखाव भत्ता।",
    documents: [
      "छात्र का आधार कार्ड",
      "पिछली कक्षा की अंकतालिका",
      "तहसीलदार द्वारा जारी आय प्रमाण पत्र",
      "कॉलेज शुल्क रसीद और प्रवेश पत्र"
    ],
    steps: [
      "छात्रवृत्ति पोर्टल पर आधार द्वारा पंजीकरण करें।",
      "अंकतालिका, आय प्रमाण पत्र और शुल्क रसीद अपलोड करें।",
      "कॉलेज द्वारा सत्यापन के बाद ज़िला कल्याण अधिकारी द्वारा राशि स्वीकृत की जाती है।"
    ],
    official_url: "https://example.gov.in/demo-scheme-d",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-e",
    name: "योजना E (डेमो)",
    summary: "मातृत्व एवं पोषण सहायता",
    category: "महिलाएँ",
    benefits: "गर्भवती और स्तनपान कराने वाली माताओं के बेहतर पोषण और स्वास्थ्य के लिए तीन चरणों में ₹5,000 की नकद सहायता।",
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
    official_url: "https://example.gov.in/demo-scheme-e",
    last_verified: null,
    demo: true
  },
  {
    id: "scheme-f",
    name: "योजना F (डेमो)",
    summary: "असंगठित मज़दूर सामाजिक सुरक्षा कार्ड",
    category: "मज़दूर",
    benefits: "12 अंकों का विशिष्ट पहचान नंबर, ₹2 लाख का दुर्घटना बीमा कवर और राज्य कल्याण योजनाओं का सीधा लाभ।",
    documents: [
      "आधार कार्ड",
      "आधार से जुड़ा सक्रिय मोबाइल नंबर",
      "IFSC कोड सहित बैंक खाता विवरण"
    ],
    steps: [
      "ऑनलाइन स्वयं पंजीकरण करें या किसी भी CSC केंद्र पर जाएं।",
      "आधार नंबर दर्ज करके OTP द्वारा सत्यापन करें।",
      "अपना डिजिटल ई-श्रम कार्ड डाउनलोड करें।"
    ],
    official_url: "https://example.gov.in/demo-scheme-f",
    last_verified: null,
    demo: true
  }
];

// Helper to extract known profile information from user text
function parseProfileFromText(text, lang) {
  const isHi = lang === 'hi';
  const lower = text.toLowerCase();
  const profile = {};

  if (lower.includes('farmer') || lower.includes('किसान') || lower.includes('kisan') || lower.includes('farming') || lower.includes('खेती')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'किसान' : 'Farmer';
  } else if (lower.includes('student') || lower.includes('छात्र') || lower.includes('vidyarthi') || lower.includes('college') || lower.includes('school')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'छात्र' : 'Student';
  } else if (lower.includes('widow') || lower.includes('विधवा') || lower.includes('woman') || lower.includes('महिला')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'महिला' : 'Woman';
  } else if (lower.includes('senior') || lower.includes('वृद्ध') || lower.includes('बुजुर्ग') || lower.includes('वरिष्ठ')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'वरिष्ठ नागरिक' : 'Senior citizen';
  } else if (lower.includes('worker') || lower.includes('मज़दूर') || lower.includes('मजदूर') || lower.includes('labour')) {
    profile[isHi ? 'पेशा' : 'Occupation'] = isHi ? 'मज़दूर' : 'Worker';
  } else if (lower.includes('business') || lower.includes('दुकान') || lower.includes('व्यापारी') || lower.includes('shop')) {
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
  } else if (lower.includes('village') || lower.includes('गाँव') || lower.includes('rural')) {
    profile[isHi ? 'क्षेत्र' : 'Area'] = isHi ? 'ग्रामीण' : 'Rural';
  }

  // Income check
  if (lower.includes('1.5') || lower.includes('1.5 lakh') || lower.includes('1.5 लाख')) {
    profile[isHi ? 'वार्षिक आय' : 'Income'] = isHi ? '1.5 लाख' : '1.5 Lakh';
  } else if (lower.includes('2 lakh') || lower.includes('2 लाख')) {
    profile[isHi ? 'वार्षिक आय' : 'Income'] = isHi ? '2 लाख से कम' : 'Under 2 Lakh';
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
  // Simulate network latency (250-400ms)
  await new Promise(r => setTimeout(r, 320));

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
    // Keep session language synchronized with request
    session.language = language;
  }

  const isHi = (language || session.language) === 'hi';
  const extracted = parseProfileFromText(message, isHi ? 'hi' : 'en');
  Object.assign(session.profile, extracted);

  session.history.push({ role: 'user', content: message });
  session.step += 1;

  // Question 1
  if (session.step === 1) {
    const isFarmer = Object.values(session.profile).some(v => String(v).includes('Farmer') || String(v).includes('किसान'));
    const isStudent = Object.values(session.profile).some(v => String(v).includes('Student') || String(v).includes('छात्र'));

    if (isFarmer) {
      return {
        reply: isHi
          ? "क्या आपके पास अपनी खेती की ज़मीन है या आप बटाईदार/भूमिहीन मज़दूर हैं?"
          : "Do you own cultivable agricultural land, or do you work as a tenant farmer / laborer?",
        quick_replies: isHi
          ? ["अपनी ज़मीन (2 हेक्टेयर तक)", "अपनी ज़मीन (2 हेक्टेयर से अधिक)", "बटाईदार / भूमिहीन"]
          : ["Own land (up to 2 hectares)", "Own land (more than 2 hectares)", "Tenant farmer / Landless"],
        why: isHi
          ? "अधिकांश किसान योजनाओं में आपके नाम पर ज़मीन के रिकॉर्ड की आवश्यकता होती है।"
          : "Most farmer support schemes require verified landholding records in your name.",
        progress: { answered: 1, total: 3 },
        profile: { ...session.profile },
        done: false,
        results: []
      };
    } else if (isStudent) {
      return {
        reply: isHi
          ? "आप वर्तमान में किस कक्षा या पाठ्यक्रम में पढ़ाई कर रहे हैं?"
          : "Which level of education are you currently enrolled in?",
        quick_replies: isHi
          ? ["कक्षा 9 - 10", "कक्षा 11 - 12 / कॉलेज", "स्नातक / उच्च शिक्षा"]
          : ["Class 9 - 10", "Class 11 - 12 / College", "Graduation / Higher Studies"],
        why: isHi
          ? "छात्रवृत्ति योजनाएँ स्कूल, कॉलेज और उच्च शिक्षा के स्तर पर निर्भर करती हैं।"
          : "Scholarship schemes differ between school, college, and post-matric courses.",
        progress: { answered: 1, total: 3 },
        profile: { ...session.profile },
        done: false,
        results: []
      };
    } else {
      return {
        reply: isHi
          ? "आप मुख्य रूप से किस क्षेत्र में रहते हैं?"
          : "What is your primary area of residence?",
        quick_replies: isHi
          ? ["ग्रामीण (गाँव / ग्राम पंचायत)", "शहरी (कस्बा / शहर)"]
          : ["Rural (Village / Gram Panchayat)", "Urban (Town / City)"],
        why: isHi
          ? "कुछ कल्याणकारी योजनाएँ केवल ग्रामीण और कुछ केवल शहरी क्षेत्रों के लिए हैं।"
          : "Some social welfare schemes are specific to rural areas while others are urban.",
        progress: { answered: 1, total: 3 },
        profile: { ...session.profile },
        done: false,
        results: []
      };
    }
  }

  // Question 2
  if (session.step === 2) {
    // Add answer detail to profile if chip selected
    if (message.includes('more than 2') || message.includes('2 हेक्टेयर से अधिक')) {
      session.profile[isHi ? 'भूमि' : 'Landholding'] = isHi ? '2 हेक्टेयर से अधिक' : 'More than 2 hectares';
    } else if (message.includes('Tenant') || message.includes('बटाईदार')) {
      session.profile[isHi ? 'भूमि' : 'Landholding'] = isHi ? 'भूमिहीन / बटाईदार' : 'Tenant / Landless';
    } else if (message.includes('2 hectare') || message.includes('2 हेक्टेयर')) {
      session.profile[isHi ? 'भूमि' : 'Landholding'] = isHi ? '2 हेक्टेयर तक' : 'Up to 2 hectares';
    } else if (message.includes('Urban') || message.includes('शहरी')) {
      session.profile[isHi ? 'क्षेत्र' : 'Area'] = isHi ? 'शहरी' : 'Urban';
    } else if (message.includes('Rural') || message.includes('ग्रामीण')) {
      session.profile[isHi ? 'क्षेत्र' : 'Area'] = isHi ? 'ग्रामीण' : 'Rural';
    } else if (message.includes('College') || message.includes('कॉलेज')) {
      session.profile[isHi ? 'शिक्षा' : 'Education'] = isHi ? 'कॉलेज' : 'College';
    } else if (message.includes('Class 9') || message.includes('कक्षा 9')) {
      session.profile[isHi ? 'शिक्षा' : 'Education'] = isHi ? 'कक्षा 9 - 10' : 'Class 9 - 10';
    } else if (message.includes('Higher') || message.includes('उच्च शिक्षा') || message.includes('स्नातक')) {
      session.profile[isHi ? 'शिक्षा' : 'Education'] = isHi ? 'उच्च शिक्षा' : 'Higher Studies';
    }

    return {
      reply: isHi
        ? "आपके पूरे परिवार की अनुमानित वार्षिक आय कितनी है?"
        : "What is your approximate total household annual income?",
      quick_replies: isHi
        ? ["₹1 लाख से कम", "₹1 लाख - ₹2.5 लाख", "₹2.5 लाख से अधिक"]
        : ["Below ₹1 Lakh", "₹1 Lakh - ₹2.5 Lakh", "Above ₹2.5 Lakh"],
      why: isHi
        ? "सरकारी योजनाएँ आय सीमा तय करती हैं ताकि लाभ सही परिवारों तक पहुँचे।"
        : "Government schemes use income thresholds to ensure benefits reach low-income families.",
      progress: { answered: 2, total: 3 },
      profile: { ...session.profile },
      done: false,
      results: []
    };
  }

  // Step 3 -> Done: true
  if (message.includes('Below') || message.includes('कम')) {
    session.profile[isHi ? 'वार्षिक आय' : 'Annual Income'] = isHi ? '₹1 लाख से कम' : 'Below ₹1 Lakh';
  } else if (message.includes('Above') || message.includes('अधिक')) {
    session.profile[isHi ? 'वार्षिक आय' : 'Annual Income'] = isHi ? '₹2.5 लाख से अधिक' : 'Above ₹2.5 Lakh';
  } else if (message.includes('1 Lakh') || message.includes('1 लाख') || message.includes('2.5')) {
    session.profile[isHi ? 'वार्षिक आय' : 'Annual Income'] = isHi ? '₹1 - ₹2.5 लाख' : '₹1 - ₹2.5 Lakh';
  }

  const results = isHi
    ? [
        {
          scheme_id: "scheme-a",
          name: "योजना A (डेमो)",
          summary: "छोटे और सीमांत किसान परिवारों के लिए वार्षिक आय सहायता",
          status: "potentially_eligible",
          passed: [
            "खेती योग्य भूमि 2 हेक्टेयर सीमा के भीतर है",
            "मुख्य व्यवसाय कृषि दर्ज है"
          ],
          failed: [],
          missing: []
        },
        {
          scheme_id: "scheme-b",
          name: "योजना B (डेमो)",
          summary: "प्राकृतिक आपदाओं के विरुद्ध रियायती फसल बीमा सहायता",
          status: "needs_information",
          passed: [
            "मौसमी फसल खेती में संलग्न"
          ],
          failed: [],
          missing: [
            "वर्तमान मौसम के लिए फसल बुवाई सत्यापन की आवश्यकता है"
          ]
        },
        {
          scheme_id: "scheme-c",
          name: "योजना C (डेमो)",
          summary: "ग्रामीण पक्के मकान निर्माण के लिए वित्तीय सहायता",
          status: "not_eligible",
          passed: [],
          failed: [
            "सत्यापित सरकारी रिकॉर्ड में पहले से पक्का मकान दर्ज है"
          ],
          missing: []
        }
      ]
    : [
        {
          scheme_id: "scheme-a",
          name: "Scheme A (demo)",
          summary: "Yearly support for small farmers",
          status: "potentially_eligible",
          passed: [
            "Landholding within 2 hectares limit",
            "Primary occupation is farming"
          ],
          failed: [],
          missing: []
        },
        {
          scheme_id: "scheme-b",
          name: "Scheme B (demo)",
          summary: "Crop insurance support",
          status: "needs_information",
          passed: [
            "Engaged in seasonal crop cultivation"
          ],
          failed: [],
          missing: [
            "Need crop sowing verification for current season"
          ]
        },
        {
          scheme_id: "scheme-c",
          name: "Scheme C (demo)",
          summary: "Housing support",
          status: "not_eligible",
          passed: [],
          failed: [
            "Already registered with an active pucca housing record"
          ],
          missing: []
        }
      ];

  return {
    reply: isHi ? "धन्यवाद। हमने आपके सभी उत्तरों की जाँच कर ली है।" : "Thank you. We have completed checking your details against scheme rules.",
    quick_replies: [],
    why: "",
    progress: { answered: 3, total: 3 },
    profile: { ...session.profile },
    done: true,
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

export async function sendMessage({ sessionId, message, language = 'en' }) {
  if (!API_BASE) {
    return mockSendMessage(sessionId, message, language);
  }

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
    return await res.json();
  } catch (err) {
    console.warn("Real API failed, falling back to mock sendMessage", err);
    return mockSendMessage(sessionId, message, language);
  }
}

export async function getSchemes(language = 'en') {
  if (!API_BASE) {
    return mockGetSchemes(language);
  }

  try {
    const res = await fetch(`${API_BASE}/api/schemes?language=${language}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Real API failed, falling back to mock getSchemes", err);
    return mockGetSchemes(language);
  }
}

export async function getSchemeById(id, language = 'en') {
  if (!API_BASE) {
    return mockGetSchemeDetail(id, language);
  }

  try {
    const res = await fetch(`${API_BASE}/api/schemes/${id}?language=${language}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Real API failed, falling back to mock getSchemeById", err);
    return mockGetSchemeDetail(id, language);
  }
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
