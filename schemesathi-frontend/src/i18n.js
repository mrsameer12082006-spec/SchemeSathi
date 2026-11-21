// Core translations for SchemeSathi (starter set + chat & results core)

export const coreStrings = {
  en: {
    note: "Free. No login. Works in Hindi and English.",
    h1: "Find the government schemes you may get",
    lead: "Tell us about yourself in your own words, or tap who you are. We'll check the rules and show what you may qualify for, what to carry, and how to apply.",
    placeholder: "I'm a farmer from Haryana, family income about 1.5 lakh",
    emptyError: "Write a line about yourself first.",
    start: "Check my schemes",
    speak: "Speak instead",
    listening: "Listening...",
    tryExample: "Try an example",
    examples: [
      "I'm a farmer from Haryana",
      "I'm a student, family income under 2 lakh",
      "I'm a widow aged 55, living in a village"
    ],
    orTap: "Or tap who you are",
    who: ["Farmer", "Student", "Woman", "Senior citizen", "Worker", "Small business"],
    whoSentences: [
      "I'm a farmer",
      "I'm a student",
      "I'm a woman",
      "I'm a senior citizen",
      "I'm a worker",
      "I'm a small business owner"
    ],
    understood: "What I understood",
    whyAsk: "Why we ask",
    notSure: "Not sure",
    back: "Go back",
    listen: "Listen",
    stopListening: "Stop",
    typeHere: "Type here",
    send: "Send",
    questionProgress: "Question",
    resultsTitle: "Your results",
    checkedSchemes: "We checked {n} schemes",
    howToApply: "How to apply",
    answerMore: "Answer 1 question",
    startAgain: "Start again",
    openOfficial: "Open official website",
    scam: "Never pay anyone to apply. Official applications are free.",
    guidance: "Results are guidance. The final decision is the department's.",
    mayBeEligible: "May be eligible",
<<<<<<< HEAD
    needMoreDetails: "Need a little more info",
    notEligible: "Not eligible",
    needNDetail: "Need {n} detail",
    needNDetails: "Need {n} details",
    whyHeader: "Why you get this"
=======
    needMoreDetails: "Need more details",
    notEligible: "Not eligible",
    needNDetail: "Need {n} detail",
    needNDetails: "Need {n} details",
    whyHeader: "Why?"
>>>>>>> origin/master
  },
  hi: {
    note: "मुफ़्त। लॉगिन नहीं। हिंदी और अंग्रेज़ी में।",
    h1: "जानिए कौन सी सरकारी योजना आपको मिल सकती है",
    lead: "अपने बारे में अपने शब्दों में बताइए, या नीचे टैप कीजिए। हम नियमों की जाँच करके बताएंगे कि आपको क्या मिल सकता है, कौन से कागज़ चाहिए, और आवेदन कैसे करना है।",
    placeholder: "मैं हरियाणा से किसान हूँ, परिवार की आय लगभग 1.5 लाख है",
    emptyError: "पहले अपने बारे में एक लाइन लिखिए।",
    start: "मेरी योजनाएँ देखें",
    speak: "बोलकर बताइए",
    listening: "सुन रहे हैं...",
    tryExample: "उदाहरण आज़माएँ",
    examples: [
      "मैं हरियाणा से एक किसान हूँ",
      "मैं छात्र हूँ, परिवार की आय 2 लाख से कम है",
      "मैं 55 वर्ष की विधवा महिला हूँ, गाँव में रहती हूँ"
    ],
    orTap: "या टैप कीजिए कि आप कौन हैं",
    who: ["किसान", "छात्र", "महिला", "वरिष्ठ नागरिक", "मज़दूर", "छोटा व्यापारी"],
    whoSentences: [
      "मैं किसान हूँ",
      "मैं छात्र हूँ",
      "मैं महिला हूँ",
      "मैं वरिष्ठ नागरिक हूँ",
      "मैं मज़दूर हूँ",
      "मैं छोटा व्यापारी हूँ"
    ],
    understood: "मैंने क्या समझा",
    whyAsk: "हम क्यों पूछ रहे हैं",
    notSure: "पता नहीं",
    back: "पिछला सवाल",
    listen: "सुनें",
    stopListening: "रोकें",
    typeHere: "यहाँ लिखिए",
    send: "भेजें",
    questionProgress: "सवाल",
    resultsTitle: "आपके नतीजे",
    checkedSchemes: "हमने {n} योजनाओं की जाँच की",
    howToApply: "आवेदन कैसे करें",
    answerMore: "1 सवाल का जवाब दें",
    startAgain: "फिर से शुरू करें",
    openOfficial: "सरकारी वेबसाइट खोलें",
    scam: "आवेदन के लिए किसी को पैसे न दें। सरकारी आवेदन मुफ़्त हैं।",
    guidance: "नतीजे सिर्फ़ मार्गदर्शन हैं। अंतिम फ़ैसला विभाग का होगा।",
    mayBeEligible: "पात्र हो सकते हैं",
<<<<<<< HEAD
    needMoreDetails: "थोड़ी और जानकारी चाहिए",
    notEligible: "पात्र नहीं",
    needNDetail: "{n} जानकारी चाहिए",
    needNDetails: "{n} जानकारियाँ चाहिए",
    whyHeader: "आपको क्यों मिलेगा?"
=======
    needMoreDetails: "और जानकारी चाहिए",
    notEligible: "पात्र नहीं",
    needNDetail: "{n} जानकारी चाहिए",
    needNDetails: "{n} जानकारियाँ चाहिए",
    whyHeader: "कारण"
>>>>>>> origin/master
  }
};

// Comprehensive bidirectional translation map for live conversational synchronization
const EN_TO_HI = {
  // Tile sentences
  "I'm a farmer": "मैं किसान हूँ",
  "I'm a student": "मैं छात्र हूँ",
  "I'm a woman": "मैं महिला हूँ",
  "I'm a senior citizen": "मैं वरिष्ठ नागरिक हूँ",
  "I'm a worker": "मैं मज़दूर हूँ",
  "I'm a small business owner": "मैं छोटा व्यापारी हूँ",
  "I'm a farmer from Haryana": "मैं हरियाणा से एक किसान हूँ",
  "I'm a student, family income under 2 lakh": "मैं छात्र हूँ, परिवार की आय 2 लाख से कम है",
  "I'm a widow aged 55, living in a village": "मैं 55 वर्ष की विधवा महिला हूँ, गाँव में रहती हूँ",
  "I'm a farmer from Haryana, family income about 1.5 lakh": "मैं हरियाणा से किसान हूँ, परिवार की आय लगभग 1.5 लाख है",

  // Profile keys & values
  "Occupation": "पेशा",
  "Farmer": "किसान",
  "Student": "छात्र",
  "Woman": "महिला",
  "Senior citizen": "वरिष्ठ नागरिक",
  "Worker": "मज़दूर",
  "Small business": "छोटा व्यापारी",
  "Landholding": "भूमि",
  "Up to 2 hectares": "2 हेक्टेयर तक",
  "More than 2 hectares": "2 हेक्टेयर से अधिक",
  "Tenant / Landless": "भूमिहीन / बटाईदार",
  "Tenant farmer / Landless": "बटाईदार / भूमिहीन",
  "Area": "क्षेत्र",
  "Rural": "ग्रामीण",
  "Urban": "शहरी",
  "Annual Income": "वार्षिक आय",
  "Income": "वार्षिक आय",
  "Under 2 Lakh": "2 लाख से कम",
  "1.5 Lakh": "1.5 लाख",
  "Below ₹1 Lakh": "₹1 लाख से कम",
  "₹1 - ₹2.5 Lakh": "₹1 - ₹2.5 लाख",
  "₹1 Lakh - ₹2.5 Lakh": "₹1 लाख - ₹2.5 लाख",
  "Above ₹2.5 Lakh": "₹2.5 लाख से अधिक",
  "Education": "शिक्षा",
  "Class 9 - 10": "कक्षा 9 - 10",
  "Class 11 - 12 / College": "कक्षा 11 - 12 / कॉलेज",
  "College": "कॉलेज",
  "Higher Studies": "उच्च शिक्षा",
  "Graduation / Higher Studies": "स्नातक / उच्च शिक्षा",
  "State": "राज्य",
  "Haryana": "हरियाणा",
  "Uttar Pradesh": "उत्तर प्रदेश",
  "Bihar": "बिहार",
  "Rajasthan": "राजस्थान",

  // Questions
  "Do you own cultivable agricultural land, or do you work as a tenant farmer / laborer?": "क्या आपके पास अपनी खेती की ज़मीन है या आप बटाईदार/भूमिहीन मज़दूर हैं?",
  "Which level of education are you currently enrolled in?": "आप वर्तमान में किस कक्षा या पाठ्यक्रम में पढ़ाई कर रहे हैं?",
  "What is your primary area of residence?": "आप मुख्य रूप से किस क्षेत्र में रहते हैं?",
  "What is your approximate total household annual income?": "आपके पूरे परिवार की अनुमानित वार्षिक आय कितनी है?",
  "Thank you. We have completed checking your details against scheme rules.": "धन्यवाद। हमने आपके सभी उत्तरों की जाँच कर ली है।",

  // Whys
  "Most farmer support schemes require verified landholding records in your name.": "अधिकांश किसान योजनाओं में आपके नाम पर ज़मीन के रिकॉर्ड की आवश्यकता होती है।",
  "Scholarship schemes differ between school, college, and post-matric courses.": "छात्रवृत्ति योजनाएँ स्कूल, कॉलेज और उच्च शिक्षा के स्तर पर निर्भर करती हैं।",
  "Some social welfare schemes are specific to rural areas while others are urban.": "कुछ कल्याणकारी योजनाएँ केवल ग्रामीण और कुछ केवल शहरी क्षेत्रों के लिए हैं।",
  "Government schemes use income thresholds to ensure benefits reach low-income families.": "सरकारी योजनाएँ आय सीमा तय करती हैं ताकि लाभ सही परिवारों तक पहुँचे।",

  // Quick replies
  "Own land (up to 2 hectares)": "अपनी ज़मीन (2 हेक्टेयर तक)",
  "Own land (more than 2 hectares)": "अपनी ज़मीन (2 हेक्टेयर से अधिक)",
  "Tenant farmer / Landless": "बटाईदार / भूमिहीन",
  "Class 9 - 10": "कक्षा 9 - 10",
  "Class 11 - 12 / College": "कक्षा 11 - 12 / कॉलेज",
  "Graduation / Higher Studies": "स्नातक / उच्च शिक्षा",
  "Rural (Village / Gram Panchayat)": "ग्रामीण (गाँव / ग्राम पंचायत)",
  "Urban (Town / City)": "शहरी (कस्बा / शहर)",
  "Not sure": "पता नहीं",

<<<<<<< HEAD
=======
  // Scheme results (Demo)
  "Scheme A (demo)": "योजना A (डेमो)",
  "Yearly support for small farmers": "छोटे और सीमांत किसान परिवारों के लिए वार्षिक आय सहायता",
  "Landholding within 2 hectares limit": "खेती योग्य भूमि 2 हेक्टेयर सीमा के भीतर है",
  "Primary occupation is farming": "मुख्य व्यवसाय कृषि दर्ज है",
  "Scheme B (demo)": "योजना B (डेमो)",
  "Crop insurance support": "प्राकृतिक आपदाओं के विरुद्ध रियायती फसल बीमा सहायता",
  "Engaged in seasonal crop cultivation": "मौसमी फसल खेती में संलग्न",
  "Need crop sowing verification for current season": "वर्तमान मौसम के लिए फसल बुवाई सत्यापन की आवश्यकता है",

>>>>>>> origin/master
  // All 30 Schemes
  "PM Kisan Samman Nidhi": "प्रधानमंत्री किसान सम्मान निधि",
  "Pradhan Mantri Fasal Bima Yojana (PMFBY)": "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
  "Pradhan Mantri Fasal Bima Yojana": "प्रधानमंत्री फसल बीमा योजना",
  "Kisan Credit Card (KCC)": "किसान क्रेडिट कार्ड (KCC)",
  "PM Krishi Sinchayee Yojana (Per Drop More Crop)": "प्रधानमंत्री कृषि सिंचाई योजना",
  "PM Kisan Maandhan Yojana": "प्रधानमंत्री किसान मान-धन योजना",
  "Pre-Matric Scholarship for Minorities": "अल्पसंख्यकों के लिए प्री-मैट्रिक छात्रवृत्ति",
  "Post-Matric Scholarship for SC Students": "अनुसूचित जाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
  "National Means-cum-Merit Scholarship": "राष्ट्रीय मीन्स-कम-मेरिट छात्रवृत्ति",
  "Central Sector Scheme of Scholarship for College Students": "कॉलेज छात्रों के लिए केंद्रीय छात्रवृत्ति योजना",
  "Pragati Scholarship for Girl Students (Technical)": "बालिकाओं के लिए प्रगति छात्रवृत्ति (तकनीकी)",
  "Pradhan Mantri Matru Vandana Yojana (PMMVY)": "प्रधानमंत्री मातृ वंदना योजना (PMMVY)",
  "Sukanya Samriddhi Yojana": "सुकन्या समृद्धि योजना",
  "Lakhpati Didi Scheme": "लखपति दीदी योजना",
  "Mahila Coir Yojana": "महिला कॉयर योजना",
  "Working Women Hostel Scheme": "कामकाजी महिला छात्रावास योजना",
  "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)": "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना",
  "Pradhan Mantri Vaya Vandana Yojana": "प्रधानमंत्री वय वंदना योजना",
  "Rashtriya Vayoshri Yojana": "राष्ट्रीय वयोश्री योजना",
  "Varishtha Pension Bima Yojana": "वरिष्ठ पेंशन बीमा योजना",
  "Senior Citizens Welfare Fund Support": "वरिष्ठ नागरिक कल्याण निधि सहायता",
  "e-Shram Universal Card & Social Security": "ई-श्रम सार्वभौमिक कार्ड और सामाजिक सुरक्षा",
  "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)": "प्रधानमंत्री श्रम योगी मान-धन (PM-SYM)",
  "Pradhan Mantri Suraksha Bima Yojana (PMSBY)": "प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)",
  "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)": "प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY)",
  "Atal Pension Yojana (APY)": "अटल पेंशन योजना (APY)",
  "PM SVANidhi (Micro-credit for Street Vendors)": "पीएम स्वनिधि (स्ट्रीट वेंडरों के लिए सूक्ष्म ऋण)",
  "Pradhan Mantri Mudra Yojana (PMMY)": "प्रधानमंत्री मुद्रा योजना (PMMY)",
  "Prime Minister Employment Generation Programme (PMEGP)": "प्रधानमंत्री रोजगार सृजन कार्यक्रम (PMEGP)",
  "Stand-Up India Scheme": "स्टैंड-अप इंडिया योजना",
  "Credit Guarantee Scheme for Micro and Small Enterprises": "सूक्ष्म और लघु उद्यमों के लिए क्रेडिट गारंटी योजना",

  // Criteria strings
  "Crop sowing verification needed for current season": "वर्तमान मौसम के लिए फसल बुवाई सत्यापन की आवश्यकता है",
  "Landholding size details needed": "ज़मीन के रकबे (हेक्टेयर) की जानकारी की आवश्यकता है",
  "Annual family income verification needed": "पारिवारिक वार्षिक आय के सत्यापन की आवश्यकता है",
  "Residence area (rural or urban) verification needed": "निवासी क्षेत्र (ग्रामीण या शहरी) की पुष्टि आवश्यक है",
  "Target occupation/category matches": "लक्षित श्रेणी/पेशा मेल खाता है",
  "Seasonal crop cultivation verified": "वर्तमान मौसम में फसल बुवाई सत्यापित",
  "Direct land ownership record required": "सरकारी रिकॉर्ड में स्वयं की ज़मीन का मालिकाना हक आवश्यक है",
  "Eligible as tenant/cultivator": "बटाईदार/श्रमिक के रूप में आवेदन योग्य",
  "Resident of rural area": "ग्रामीण क्षेत्र के निवासी",
  "Resident of urban area": "शहरी क्षेत्र के निवासी",
  "Eligible female beneficiary": "महिला लाभार्थी पात्रता",

  // Quick reply options for follow-ups
  "Yes, cultivated seasonal crops": "हाँ, मौसमी फसल बोई है",
  "No, land was fallow": "नहीं, खेत खाली रहा",
  "Yes, I meet this condition": "हाँ, मैं यह शर्त पूरी करता/करती हूँ",
  "No, does not apply": "नहीं, यह लागू नहीं होता",
  "Rural area": "ग्रामीण क्षेत्र",
  "Urban area": "शहरी क्षेत्र"
};

// Inverted map for Hindi to English
const HI_TO_EN = {};
for (const [en, hi] of Object.entries(EN_TO_HI)) {
  HI_TO_EN[hi] = en;
}

// Additional variants for seamless Hindi to English lookup
HI_TO_EN["मैं हरियाणा से किसान हूँ"] = "I'm a farmer from Haryana";
HI_TO_EN["मैं हरियाणा से एक किसान हूँ"] = "I'm a farmer from Haryana";
HI_TO_EN["फसल बीमा सुरक्षा सहायता"] = "Crop insurance support";
HI_TO_EN["वार्षिक आय"] = "Income";
HI_TO_EN["पेशा"] = "Occupation";

export function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();

  if (targetLang === 'hi') {
    if (EN_TO_HI[trimmed]) return EN_TO_HI[trimmed];
    if (EN_TO_HI[text]) return EN_TO_HI[text];

    // Dynamic pattern: "For <Scheme>: Did you sow crops in the current agricultural season?"
    const cropMatch = text.match(/^For (.+?): Did you sow crops in the current agricultural season\??$/i);
    if (cropMatch) {
      const schemeName = cropMatch[1].trim();
      const hiScheme = EN_TO_HI[schemeName] || schemeName;
      return `${hiScheme} के लिए: क्या आपने वर्तमान कृषि मौसम में फसल की बुवाई की है?`;
    }

    // Dynamic pattern: "For <Scheme>: How much agricultural land do you own or cultivate?"
    const landMatch = text.match(/^For (.+?): How much agricultural land do you own or cultivate\??$/i);
    if (landMatch) {
      const schemeName = landMatch[1].trim();
      const hiScheme = EN_TO_HI[schemeName] || schemeName;
      return `${hiScheme} के लिए: आपके पास कितनी खेती की ज़मीन है?`;
    }

    // Dynamic pattern: "For <Scheme>: What is your approximate household annual income?"
    const incMatch = text.match(/^For (.+?): What is your approximate household annual income\??$/i);
    if (incMatch) {
      const schemeName = incMatch[1].trim();
      const hiScheme = EN_TO_HI[schemeName] || schemeName;
      return `${hiScheme} के लिए: आपके परिवार की कुल अनुमानित वार्षिक आय कितनी है?`;
    }

    // Dynamic pattern: "This question is needed to verify your eligibility for <Scheme>."
    const whyMatch = text.match(/^This question is needed to verify your eligibility for (.+?)\.?$/i);
    if (whyMatch) {
      const schemeName = whyMatch[1].trim();
      const hiScheme = EN_TO_HI[schemeName] || schemeName;
      return `यह प्रश्न ${hiScheme} के लिए आपकी पात्रता की पुष्टि करने हेतु आवश्यक है।`;
    }

    return text;
  }

  // targetLang === 'en'
  if (HI_TO_EN[trimmed]) return HI_TO_EN[trimmed];
  if (HI_TO_EN[text]) return HI_TO_EN[text];

  const cropMatchHi = text.match(/^(.+?) के लिए: क्या आपने वर्तमान कृषि मौसम में फसल की बुवाई की है\??$/);
  if (cropMatchHi) {
    const schemeHi = cropMatchHi[1].trim();
    const enScheme = HI_TO_EN[schemeHi] || schemeHi;
    return `For ${enScheme}: Did you sow crops in the current agricultural season?`;
  }

  const whyMatchHi = text.match(/^यह प्रश्न (.+?) के लिए आपकी पात्रता की पुष्टि करने हेतु आवश्यक है।?$/);
  if (whyMatchHi) {
    const schemeHi = whyMatchHi[1].trim();
    const enScheme = HI_TO_EN[schemeHi] || schemeHi;
    return `This question is needed to verify your eligibility for ${enScheme}.`;
  }

  return text;
}

export function translateProfile(profile, targetLang) {
  if (!profile || typeof profile !== 'object') return profile;
  const translated = {};
  for (const [k, v] of Object.entries(profile)) {
    const newKey = translateText(k, targetLang);
    const newVal = translateText(v, targetLang);
    translated[newKey] = newVal;
  }
  return translated;
}

export function translateResults(results, targetLang) {
  if (!Array.isArray(results)) return results;
  const isHi = targetLang === 'hi';
  return results.map(r => ({
    ...r,
    name: isHi ? (r.name_hi || translateText(r.name, 'hi')) : (r.name_en || translateText(r.name, 'en')),
    summary: isHi ? (r.summary_hi || translateText(r.summary, 'hi')) : (r.summary_en || translateText(r.summary, 'en')),
    passed: (r.passed || []).map(p => translateText(p, targetLang)),
    missing: (r.missing || []).map(m => translateText(m, targetLang)),
    failed: (r.failed || []).map(f => translateText(f, targetLang))
  }));
}

export default coreStrings;
