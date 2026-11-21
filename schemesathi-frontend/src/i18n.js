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
    needMoreDetails: "Need a little more info",
    notEligible: "Not eligible",
    needNDetail: "Need {n} detail",
    needNDetails: "Need {n} details",
    whyHeader: "Why you get this"
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
    needMoreDetails: "थोड़ी और जानकारी चाहिए",
    notEligible: "पात्र नहीं",
    needNDetail: "{n} जानकारी चाहिए",
    needNDetails: "{n} जानकारियाँ चाहिए",
    whyHeader: "आपको क्यों मिलेगा?"
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
  "Urban area": "शहरी क्षेत्र",

  // Scheme Application Steps & Instructions (Zero English in Hindi mode)
  "NSP Online Registration": "एनएसपी ऑनलाइन पंजीकरण",
  "Submit application under Department of Higher Education on NSP.": "नेशनल स्कॉलरशिप पोर्टल (NSP) पर उच्च शिक्षा विभाग के तहत आवेदन जमा करें।",
  "Direct PFMS Disbursement": "सीधे पीएफएमएस (PFMS) द्वारा बैंक खाते में भुगतान",
  "Sanctioned funds transferred directly to Aadhaar-seeded bank account.": "स्वीकृत छात्रवृत्ति राशि सीधे आपके आधार से जुड़े बैंक खाते में अंतरित की जाती है।",
  "NSP Online Registration: Submit application under Department of Higher Education on NSP.": "एनएसपी ऑनलाइन पंजीकरण: नेशनल स्कॉलरशिप पोर्टल (NSP) पर उच्च शिक्षा विभाग के तहत आवेदन जमा करें।",
  "Direct PFMS Disbursement: Sanctioned funds transferred directly to Aadhaar-seeded bank account.": "सीधे पीएफएमएस (PFMS) द्वारा बैंक खाते में भुगतान: स्वीकृत छात्रवृत्ति राशि सीधे आपके आधार से जुड़े बैंक खाते में अंतरित की जाती है।",
  "Apply on NSP": "एनएसपी पर ऑनलाइन आवेदन",
  "Submit application under Central Sector Scheme on scholarships.gov.in.": "scholarships.gov.in पर सेंट्रल सेक्टर स्कीम में आवेदन करें।",
  "College & State Board Verification": "कॉलेज व बोर्ड सत्यापन",
  "College verifies enrollment and 12th board verifies percentile ranking.": "कॉलेज और राज्य शिक्षा बोर्ड द्वारा अंकों की पुष्टि की जाती है।",
  "Apply on NSP: Submit application under Central Sector Scheme on scholarships.gov.in.": "एनएसपी पर ऑनलाइन आवेदन: scholarships.gov.in पर सेंट्रल सेक्टर स्कीम में आवेदन करें।",
  "College & State Board Verification: College verifies enrollment and 12th board verifies percentile ranking.": "कॉलेज व बोर्ड सत्यापन: कॉलेज और राज्य शिक्षा बोर्ड द्वारा अंकों की पुष्टि की जाती है।",
  "Register on National Scholarship Portal (scholarships.gov.in) with Aadhaar.": "नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर आधार द्वारा पंजीकरण करें।",
  "Upload marksheet, family income certificate, and college fee receipt.": "अंकतालिका, आय प्रमाण पत्र और शुल्क रसीद अपलोड करें।",
  "Institute verifies application online and scholarship is disbursed via DBT.": "कॉलेज सत्यापन के बाद राशि सीधे DBT द्वारा बैंक में भेजी जाती है।",

  "Aadhaar & Bank Seeding": "आधार और बैंक सीडिंग",
  "Ensure your bank account has active NPCI Aadhaar seeding for DBT.": "सुनिश्चित करें कि आपके बैंक खाते में DBT के लिए NPCI आधार सीडिंग सक्रिय है।",
  "Online or CSC Registration": "ऑनलाइन या सीएससी पंजीकरण",
  "Register on pmkisan.gov.in under 'New Farmer Registration' or visit nearest CSC center.": "pmkisan.gov.in पर 'न्यू फार्मर रजिस्ट्रेशन' पर जाएं या नजदीकी CSC केंद्र जाएं।",
  "State Revenue Verification": "राजस्व विभाग सत्यापन",
  "Local revenue patwari verifies your land records and sanctions installment payouts.": "स्थानीय पटवारी/राजस्व अधिकारी ज़मीन के रिकॉर्ड की पुष्टि कर किस्त स्वीकृत करते हैं।",
  "Ensure your Aadhaar is linked to your bank account with active DBT.": "सुनिश्चित करें कि आपका आधार बैंक खाते से जुड़ा है और DBT सक्रिय है।",
  "Visit pmkisan.gov.in or your nearby Common Service Centre (CSC).": "pmkisan.gov.in पोर्टल पर जाएँ या अपने निकटतम CSC केंद्र पर जाएँ।",
  "Submit land ownership documents and Aadhaar details.": "अपने ज़मीन के रिकॉर्ड और आधार नंबर दर्ज करवाएँ।",
  "Receive registration number and track DBT payment status online.": "पंजीकरण नंबर प्राप्त करें और DBT भुगतान की स्थिति ऑनलाइन देखें।",

  "Obtain Sowing Certificate": "बुवाई प्रमाण पत्र प्राप्त करें",
  "Get current season crop sowing verification from Patwari or local Panchayat.": "पटवारी या पंचायत से चालू मौसम की फसल बुवाई की गिरदावरी लें।",
  "Submit Application": "आवेदन जमा करें",
  "Apply through PMFBY portal, your bank branch, or CSC before the seasonal cut-off date.": "कट-ऑफ तिथि से पहले पीएमएफबीवाई पोर्टल, बैंक या सीएससी पर आवेदन करें।",
  "Pay Farmer Premium Share": "प्रीमियम अंश जमा करें",
  "Pay the 1.5% - 2% premium share and retain policy receipt.": "1.5% से 2% प्रीमियम जमा कर बीमा पावती रसीद प्राप्त करें।",

  "Fill One-Page KCC Form": "एक पन्ने का केसीसी फॉर्म भरें",
  "Download simple 1-page form from banking portal or collect at any rural branch.": "बैंक शाखा से सरल 1-पेज का केसीसी फॉर्म लें।",
  "Submit Land Record Copy": "ज़मीन के कागज़ात संलग्न करें",
  "Attach latest Khatoni/Jamabandi verified by Patwari.": "पटवारी द्वारा प्रमाणित खतौनी/जमाबंदी साथ लगाएं।",
  "Receive KCC RuPay Card": "केसीसी रूपे कार्ड प्राप्त करें",
  "Bank issues credit limit within 14 days and hands over RuPay debit/ATM card.": "बैंक 14 दिनों में ऋण सीमा स्वीकृत कर एटीएम रूपे कार्ड प्रदान करता है।",

  "Register Pregnancy at Anganwadi": "आंगनवाड़ी में गर्भावस्था पंजीकरण",
  "Register pregnancy at local Anganwadi Centre within 150 days of LMP.": "गाँव के आंगनवाड़ी केंद्र पर LMP के 150 दिनों के भीतर पंजीकरण कराएं।",
  "Complete 1st Antenatal Checkup": "पहली प्रसव पूर्व जांच पूरी करें",
  "Attend mandatory antenatal checkups and child immunization sessions.": "नियमित प्रसव पूर्व जांच और टीकाकरण पूरा करें।",
  "Installment is credited directly into mother's bank account.": "राशि सीधे माता के बैंक खाते में जमा होती है।",

  "Check Family Eligibility": "परिवार की पात्रता जांचें",
  "Visit beneficiary.nha.gov.in or call 14555 to check family name in SECC/PMJAY list.": "beneficiary.nha.gov.in पर या टोल-फ्री 14555 पर अपना नाम चेक करें।",
  "e-KYC Verification": "ई-केवाईसी सत्यापन",
  "Complete Aadhaar OTP or biometric authentication at any empaneled hospital or CSC.": "किसी भी सरकारी अस्पताल या सीएससी पर आधार बायोमेट्रिक ई-केवाईसी कराएं।",
  "Download Ayushman Card": "आयुष्मान कार्ड डाउनलोड करें",
  "Download digital PVC Ayushman Card and present at hospital for cashless admission.": "आयुष्मान कार्ड डाउनलोड करें और इलाज के समय अस्पताल में दिखाएं।",

  "Visit Nearest CSC": "नजदीकी सीएससी केंद्र जाएं",
  "Carry Aadhaar, bank passbook, and land copy to Common Service Centre.": "आधार, पासबुक और खतौनी लेकर सीएससी केंद्र जाएं।",
  "Enroll with Initial Cash Contribution": "प्रारंभिक अंशदान के साथ नामांकन",
  "Pay first month's contribution in cash; VLE completes enrollment.": "पहले महीने का अंशदान नकद जमा करें और फॉर्म सबमिट करें।",
  "Download Kisan Pension Card": "किसान पेंशन कार्ड डाउनलोड करें",
  "Pension card with 12-digit pension number is issued instantly.": "12 अंकों के पेंशन नंबर वाला किसान पेंशन कार्ड तुरंत जारी होता है।",

  // Documents
  "Aadhaar Card": "आधार कार्ड",
  "Aadhaar card": "आधार कार्ड",
  "Aadhaar card copy": "आधार कार्ड की प्रति",
  "Student Aadhaar card": "छात्र का आधार कार्ड",
  "Class 12 Marksheet (Above 80th percentile)": "12वीं बोर्ड अंकतालिका (80 पर्सेंटाइल से ऊपर)",
  "Class 12 board marksheet (above 80th percentile)": "कक्षा 12वीं की अंकतालिका (80 पर्सेंटाइल से ऊपर)",
  "Parental Income Certificate (below ₹4.5 Lakh)": "पारिवारिक आय प्रमाण पत्र (₹4.5 लाख से कम)",
  "Family income certificate (income below ₹4.5 Lakh)": "पारिवारिक आय प्रमाण पत्र (वार्षिक आय ₹4.5 लाख से कम)",
  "College Admission Fee Receipt": "कॉलेज प्रवेश रसीद",
  "College admission slip and fee receipt": "कॉलेज शुल्क रसीद और प्रवेश पत्र",
  "Land Ownership Record (Khatoni/Jamabandi/Fard)": "ज़मीन का मालिकाना दस्तावेज़ (खतौनी/जमाबंदी/फर्द)",
  "Land ownership record (Khatoni / Fard / Jamabandi)": "ज़मीन का मालिकाना दस्तावेज़ (खतौनी / फर्द / जमाबंदी)",
  "Aadhaar-seeded Bank Passbook": "आधार से जुड़ा बैंक पासबुक",
  "Bank passbook copy linked with Aadhaar": "आधार से जुड़ा बैंक पासबुक",
  "Crop sowing certificate from Patwari or Sarpanch / Khasra details": "पटवारी या सरपंच से फसल बुवाई प्रमाण पत्र / खसरा",
  "Bank account details": "बैंक खाता विवरण",
  "Mother's Aadhaar card": "माता का आधार कार्ड",
  "Husband's Aadhaar card": "पति का आधार कार्ड",
  "Mother and Child Protection (MCP) card": "मातृ एवं शिशु सुरक्षा (MCP) कार्ड",
  "Bank passbook in mother's name linked with Aadhaar": "माता के नाम पर बैंक पासबुक"
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

// Specific scheme variants & summaries
HI_TO_EN["केंद्रीय क्षेत्र छात्रवृत्ति योजना"] = "Central Sector Scheme of Scholarships for College Students";
HI_TO_EN["कॉलेज छात्रों के लिए केंद्रीय क्षेत्र छात्रवृत्ति योजना"] = "Central Sector Scheme of Scholarships for College Students";
HI_TO_EN["कॉलेज छात्रों के लिए केंद्रीय छात्रवृत्ति योजना"] = "Central Sector Scheme of Scholarships for College Students";
HI_TO_EN["राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना"] = "National Means-cum-Merit Scholarship Scheme";
HI_TO_EN["राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति"] = "National Means-cum-Merit Scholarship Scheme";
HI_TO_EN["राष्ट्रीय मीन्स-कम-मेरिट छात्रवृत्ति"] = "National Means-cum-Merit Scholarship Scheme";
HI_TO_EN["पीएम यशस्वी छात्रवृत्ति योजना"] = "PM YASASVI Scholarship Scheme";
HI_TO_EN["पोस्ट मैट्रिक छात्रवृत्ति (ओबीसी)"] = "Post-Matric Scholarship for OBC Students";
HI_TO_EN["आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)"] = "Ayushman Bharat - PM-JAY";
HI_TO_EN["आयुष्मान भारत वरिष्ठ नागरिक योजना (70+)"] = "Ayushman Bharat Senior Citizen Scheme (70+)";
HI_TO_EN["किसान क्रेडिट कार्ड (KCC)"] = "Kisan Credit Card (KCC)";
HI_TO_EN["किसान क्रेडिट कार्ड"] = "Kisan Credit Card";
HI_TO_EN["प्रधानमंत्री फसल बीमा योजना"] = "Pradhan Mantri Fasal Bima Yojana (PMFBY)";
HI_TO_EN["प्रधानमंत्री मातृ वंदना योजना"] = "Pradhan Mantri Matru Vandana Yojana (PMMVY)";
HI_TO_EN["पीएम स्वनिधि"] = "PM SVANidhi";
HI_TO_EN["प्रधानमंत्री मुद्रा योजना"] = "Pradhan Mantri Mudra Yojana (PMMY)";
HI_TO_EN["अटल पेंशन योजना"] = "Atal Pension Yojana (APY)";

// Criteria strings in HI_TO_EN
HI_TO_EN["लक्षित श्रेणी/पेशा मेल खाता है"] = "Target occupation/category matches";
HI_TO_EN["पारिवारिक वार्षिक आय के सत्यापन की आवश्यकता है"] = "Household annual income verification needed";
HI_TO_EN["ज़मीन के रकबे (हेक्टेयर) की जानकारी आवश्यक है"] = "Landholding size (in hectares) needed";
HI_TO_EN["ज़मीन के रकबे (हेक्टेयर) की जानकारी की आवश्यकता है"] = "Landholding size details needed";
HI_TO_EN["सरकारी रिकॉर्ड में स्वयं की ज़मीन का मालिकाना हक आवश्यक है"] = "Direct land ownership record required";
HI_TO_EN["बटाईदार/काश्तकार के रूप में आवेदन योग्य"] = "Eligible as tenant/cultivator";
HI_TO_EN["बटाईदार/श्रमिक के रूप में आवेदन योग्य"] = "Eligible as tenant/cultivator";
HI_TO_EN["वरिष्ठ नागरिक (60+ वर्ष) पात्रता"] = "Senior citizen (60+ years) eligibility";
HI_TO_EN["महिला लाभार्थी पात्रता"] = "Eligible female beneficiary";
HI_TO_EN["यह योजना विशेष रूप से महिलाओं के लिए है"] = "Scheme is exclusively for women";
HI_TO_EN["यह योजना केवल महिलाओं के लिए है (महिला लाभार्थी होना आवश्यक है)"] = "Exclusively for female beneficiaries (female applicant required)";
HI_TO_EN["ग्रामीण क्षेत्र के निवासी"] = "Resident of rural area";
HI_TO_EN["शहरी क्षेत्र के निवासी"] = "Resident of urban area";
HI_TO_EN["यह योजना केवल ग्रामीण क्षेत्रों के लिए है"] = "Restricted to rural areas only";
HI_TO_EN["यह योजना केवल शहरी क्षेत्रों के लिए है"] = "Restricted to urban areas only";
HI_TO_EN["वर्तमान मौसम में फसल बुवाई सत्यापित"] = "Seasonal crop cultivation verified";
HI_TO_EN["वर्तमान मौसम के लिए फसल बुवाई सत्यापन की आवश्यकता है"] = "Crop sowing verification needed for current season";
HI_TO_EN["फसल बीमा केवल बुवाई की गई भूमि के लिए लागू होता है"] = "Crop insurance applies only to cultivated land";
HI_TO_EN["कॉलेज के प्रथम 3 वर्षों में ₹12,000 और परास्नातक में ₹20,000 प्रति वर्ष की छात्रवृत्ति।"] = "Scholarship of ₹12,000 per year for first 3 years of college and ₹20,000 per year for post-graduation.";
HI_TO_EN["कॉलेज के प्रथम 3 वर्षों में ₹12,000 प्रति वर्ष और परास्नातक (PG) में ₹20,000 प्रति वर्ष छात्रवृत्ति।"] = "Scholarship of ₹12,000 per year for first 3 years of college and ₹20,000 per year for postgraduate (PG) studies.";
HI_TO_EN["कॉलेज के प्रथम 3 वर्षों में ₹12,000 प्रति वर्ष और परास्नातक (PG) में ₹20,000 प्रति वर्ष छात्रवृत्ति"] = "Scholarship of ₹12,000 per year for first 3 years of college and ₹20,000 per year for postgraduate (PG) studies.";
HI_TO_EN["12वीं बोर्ड में शीर्ष 80 पर्सेंटाइल प्राप्त करने वाले कॉलेज और डिग्री छात्रों को ₹12,000 से ₹20,000 सालाना।"] = "₹12,000 to ₹20,000 per year for top 80th percentile students pursuing graduation and post-graduation.";
HI_TO_EN["12वीं बोर्ड में शीर्ष 80 पर्सेंटाइल प्राप्त करने वाले कॉलेज और डिग्री छात्रों को ₹12,000 से ₹20,000 सालाना"] = "₹12,000 to ₹20,000 per year for top 80th percentile students pursuing graduation and post-graduation.";
HI_TO_EN["उच्च शिक्षा और अध्ययन के लिए पात्र छात्रों को प्रति वर्ष ₹12,000 से ₹20,000 तक की छात्रवृत्ति सहायता।"] = "Financial scholarship support of ₹12,000 to ₹20,000 per year for students pursuing higher education.";
HI_TO_EN["उच्च शिक्षा और अध्ययन के लिए पात्र छात्रों को प्रति वर्ष ₹12,000 से ₹20,000 तक की छात्रवृत्ति सहायता"] = "Financial scholarship support of ₹12,000 to ₹20,000 per year for students pursuing higher education.";
HI_TO_EN["ग्रेजुएशन के पहले 3 वर्षों में ₹12,000 सालाना और पोस्ट ग्रेजुएशन में ₹20,000 सालाना की आर्थिक मदद।"] = "Financial assistance of ₹12,000 per year for first 3 years of graduation and ₹20,000 per year for post-graduation.";
HI_TO_EN["ग्रेजुएशन के पहले 3 वर्षों में ₹12,000 सालाना और पोस्ट ग्रेजुएशन में ₹20,000 सालाना की आर्थिक मदद"] = "Financial assistance of ₹12,000 per year for first 3 years of graduation and ₹20,000 per year for post-graduation.";
HI_TO_EN["10वीं के बाद कॉलेज और उच्च शिक्षा के लिए पूरी शिक्षण शुल्क प्रतिपूर्ति और मासिक खर्च भत्ता।"] = "Complete tuition fee reimbursement and monthly maintenance allowance for post-matric and higher education.";
HI_TO_EN["10वीं के बाद कॉलेज और उच्च शिक्षा के लिए पूरी शिक्षण शुल्क प्रतिपूर्ति और मासिक खर्च भत्ता"] = "Complete tuition fee reimbursement and monthly maintenance allowance for post-matric and higher education.";
HI_TO_EN["कक्षा 11, 12 और कॉलेज/डिग्री कोर्स में अध्ययनरत पिछड़े वर्ग (OBC) के छात्रों को आर्थिक सहायता।"] = "Financial assistance for OBC students studying in Class 11, 12, and college/degree courses.";
HI_TO_EN["कक्षा 11, 12 और कॉलेज/डिग्री कोर्स में अध्ययनरत पिछड़े वर्ग (OBC) के छात्रों को आर्थिक सहायता"] = "Financial assistance for OBC students studying in Class 11, 12, and college/degree courses.";
HI_TO_EN["भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष 3 समान किस्तों में सीधे बैंक खाते में आर्थिक सहायता।"] = "Direct income support of ₹6,000 per year in 3 equal installments to landholding farmer families.";
HI_TO_EN["प्राकृतिक आपदाओं, सूखा, बाढ़ और बेमौसम बारिश से फसल नुकसान के विरुद्ध रियायती फसल बीमा।"] = "Comprehensive subsidized crop loss insurance against drought, floods, and unseasonal rains.";

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

    // Dynamic criteria patterns: English -> Hindi
    const incWithinEn = text.match(/^Household annual income within ₹?([\d,]+) (?:limit|ceiling)$/i);
    if (incWithinEn) {
      return `वार्षिक पारिवारिक आय ₹${incWithinEn[1]} की सीमा के भीतर है`;
    }
    const incExceedEn = text.match(/^Annual income exceeds ₹?([\d,]+) limit$/i);
    if (incExceedEn) {
      return `वार्षिक पारिवारिक आय ₹${incExceedEn[1]} की पात्रता सीमा से अधिक है`;
    }
    const landWithinEn = text.match(/^Agricultural land within ([\d\.]+) (?:ha|hectare) limit$/i);
    if (landWithinEn) {
      return `खेती योग्य भूमि ${landWithinEn[1]} हेक्टेयर सीमा के भीतर है`;
    }
    const landExceedEn = text.match(/^Landholding exceeds ([\d\.]+) (?:ha|hectare) limit$/i);
    if (landExceedEn) {
      return `भूमि ${landExceedEn[1]} हेक्टेयर सीमा से अधिक है`;
    }
    const ageWithinEn = text.match(/^Age (\d+) is within (\d+)-(\d+) years range$/i);
    if (ageWithinEn) {
      return `आयु ${ageWithinEn[1]} वर्ष (${ageWithinEn[2]}-${ageWithinEn[3]} वर्ष सीमा में)`;
    }
    const ageBetweenEn = text.match(/^Age must be between (\d+) and (\d+) years$/i);
    if (ageBetweenEn) {
      return `आयु ${ageBetweenEn[1]} से ${ageBetweenEn[2]} वर्ष के बीच होनी चाहिए`;
    }
    const occMismatchEn = text.match(/^Scheme not applicable for (.+)$/i);
    if (occMismatchEn) {
      return `यह योजना आपके वर्तमान व्यवसाय/पेशा (${occMismatchEn[1]}) के लिए नहीं है`;
    }

    // Fallback bullet & phrase translation for English -> Hindi
    let translated = text
      .replace(/[\u2022\*\-]\s*\*{0,2}(?:Benefit|benefit|Fayda|fayda):\*{0,2}/g, '• **लाभ:**')
      .replace(/[\u2022\*\-]\s*\*{0,2}(?:Condition|condition|Shart|shart):\*{0,2}/g, '• **शर्त:**')
      .replace(/[\u2022\*\-]\s*\*{0,2}(?:Important Note|Important|Note|Dhyan Rakhein|dhyan rakhein):\*{0,2}/g, '• **महत्वपूर्ण:**')
      .replace(/\b(?:Hello|Hi|Hey)\b/gi, 'नमस्ते')
      .replace(/\b(?:Welcome to SchemeSathi)\b/gi, 'योजना साथी में आपका स्वागत है')
      .replace(/\b(?:free of cost|100% free)\b/gi, 'मुफ़्त');

    return translated;
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

  // Dynamic criteria patterns: Hindi -> English
  const incWithinHi = text.match(/^वार्षिक (?:पारिवारिक )?आय ₹?([\d,\.]+(?:\s*लाख)?) की सीमा (?:के भीतर|में) है[।\.\s]*$/i);
  if (incWithinHi) {
    const amt = incWithinHi[1].replace(/लाख/, 'Lakh').trim();
    return `Household annual income within ₹${amt} limit`;
  }
  const incExceedHi = text.match(/^वार्षिक (?:पारिवारिक )?आय ₹?([\d,\.]+(?:\s*लाख)?) की पात्रता सीमा से अधिक है[।\.\s]*$/i);
  if (incExceedHi) {
    const amt = incExceedHi[1].replace(/लाख/, 'Lakh').trim();
    return `Annual income exceeds ₹${amt} limit`;
  }
  const landWithinHi = text.match(/^खेती (?:योग्य )?भूमि ([\d\.]+) हेक्टेयर (?:की )?सीमा (?:के भीतर|में) है[।\.\s]*$/i);
  if (landWithinHi) {
    return `Agricultural land within ${landWithinHi[1]} ha limit`;
  }
  const landExceedHi = text.match(/^भूमि ([\d\.]+) हेक्टेयर सीमा से अधिक है[।\.\s]*$/i);
  if (landExceedHi) {
    return `Landholding exceeds ${landExceedHi[1]} ha limit`;
  }
  const ageWithinHi = text.match(/^आयु (\d+) वर्ष \((\d+)-(\d+) वर्ष सीमा में\)[।\.\s]*$/i);
  if (ageWithinHi) {
    return `Age ${ageWithinHi[1]} is within ${ageWithinHi[2]}-${ageWithinHi[3]} years range`;
  }
  const ageBetweenHi = text.match(/^आयु (\d+) से (\d+) वर्ष के बीच होनी चाहिए[।\.\s]*$/i);
  if (ageBetweenHi) {
    return `Age must be between ${ageBetweenHi[1]} and ${ageBetweenHi[2]} years`;
  }
  const occMismatchHi = text.match(/^यह योजना आपके वर्तमान व्यवसाय\/पेशा \((.+?)\) के लिए नहीं है[।\.\s]*$/i);
  if (occMismatchHi) {
    return `Scheme not applicable for ${occMismatchHi[1]}`;
  }

  // Fallback bullet & phrase translation for Hindi -> English (eliminate any Hinglish words)
  let translated = text
    .replace(/[\u2022\*\-]\s*\*{0,2}(?:फायदा|लाभ|Fayda|fayda):\*{0,2}/g, '• **Benefit:**')
    .replace(/[\u2022\*\-]\s*\*{0,2}(?:ध्यान रखें|महत्वपूर्ण|Dhyan Rakhein|dhyan rakhein):\*{0,2}/g, '• **Important Note:**')
    .replace(/[\u2022\*\-]\s*\*{0,2}(?:शर्त|Shart|shart):\*{0,2}/g, '• **Condition:**')
    .replace(/\b(?:Namaste|namaste|Pranam|pranam)\b/g, 'Hello')
    .replace(/\b(?:Kisan|kisan)\b/g, 'farmer')
    .replace(/\b(?:Kheti|kheti)\b/g, 'farming')
    .replace(/\b(?:Yojana|yojana|yojanaye)\b/g, 'scheme')
    .replace(/\b(?:Dalal|dalal)\b/g, 'middleman')
    .replace(/\b(?:Muft|muft)\b/g, 'free')
    .replace(/\b(?:saalana|saal|salana)\b/g, 'per year')
    .replace(/\b(?:bhai|ji|bhaiyo)\b/g, '');

  return translated;
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
  return results.map(r => {
    const name = isHi 
      ? (r.name_hi || translateText(r.name, 'hi'))
      : (r.name_en || translateText(r.name, 'en'));

    const summary = isHi
      ? (r.summary_hi || translateText(r.summary, 'hi'))
      : (r.summary_en || translateText(r.summary, 'en'));

    const benefits = isHi
      ? (r.benefits_hi || translateText(r.benefits, 'hi'))
      : (r.benefits_en || translateText(r.benefits, 'en'));

    const passedRaw = isHi
      ? (r.passed_hi && r.passed_hi.length ? r.passed_hi : r.passed || [])
      : (r.passed_en && r.passed_en.length ? r.passed_en : r.passed || []);

    const missingRaw = isHi
      ? (r.missing_hi && r.missing_hi.length ? r.missing_hi : r.missing || [])
      : (r.missing_en && r.missing_en.length ? r.missing_en : r.missing || []);

    const failedRaw = isHi
      ? (r.failed_hi && r.failed_hi.length ? r.failed_hi : r.failed || [])
      : (r.failed_en && r.failed_en.length ? r.failed_en : r.failed || []);

    return {
      ...r,
      name,
      summary,
      benefits,
      passed: passedRaw.map(p => translateText(p, targetLang)),
      missing: missingRaw.map(m => translateText(m, targetLang)),
      failed: failedRaw.map(f => translateText(f, targetLang))
    };
  });
}

export function translateStep(step, targetLang) {
  if (!step || typeof step !== 'string') return step;
  const trimmed = step.trim();
  const isHi = targetLang === 'hi';

  if (!isHi) {
    if (HI_TO_EN[trimmed]) return HI_TO_EN[trimmed];
    if (HI_TO_EN[step]) return HI_TO_EN[step];
    const colonIndex = step.indexOf(': ');
    if (colonIndex !== -1) {
      const title = step.slice(0, colonIndex).trim();
      const desc = step.slice(colonIndex + 2).trim();
      const tTitle = HI_TO_EN[title] || translateText(title, 'en');
      const tDesc = HI_TO_EN[desc] || translateText(desc, 'en');
      return `${tTitle}: ${tDesc}`;
    }
    return translateText(step, 'en');
  }

  // targetLang === 'hi'
  if (EN_TO_HI[trimmed]) return EN_TO_HI[trimmed];
  if (EN_TO_HI[step]) return EN_TO_HI[step];

  // Try decomposing "Title: Description"
  const colonIndex = step.indexOf(': ');
  if (colonIndex !== -1) {
    const title = step.slice(0, colonIndex).trim();
    const desc = step.slice(colonIndex + 2).trim();
    const tTitle = EN_TO_HI[title] || translateText(title, 'hi');
    const tDesc = EN_TO_HI[desc] || translateText(desc, 'hi');
    return `${tTitle}: ${tDesc}`;
  }

  return translateText(step, 'hi');
}

export function formatDisplayDate(dateStr, lang = 'en') {
  if (!dateStr || typeof dateStr !== 'string') return dateStr;
  const isHi = lang === 'hi';

  if (isHi) {
    const hindiMonths = {
      'January': 'जनवरी', 'Jan': 'जनवरी',
      'February': 'फ़रवरी', 'Feb': 'फ़रवरी',
      'March': 'मार्च', 'Mar': 'मार्च',
      'April': 'अप्रैल', 'Apr': 'अप्रैल',
      'May': 'मई',
      'June': 'जून', 'Jun': 'जून',
      'July': 'जुलाई', 'Jul': 'जुलाई',
      'August': 'अगस्त', 'Aug': 'अगस्त',
      'September': 'सितम्बर', 'Sep': 'सितम्बर',
      'October': 'अक्टूबर', 'Oct': 'अक्टूबर',
      'November': 'नवम्बर', 'Nov': 'नवम्बर',
      'December': 'दिसम्बर', 'Dec': 'दिसम्बर'
    };

    let result = dateStr;
    let matched = false;
    for (const [enM, hiM] of Object.entries(hindiMonths)) {
      const reg = new RegExp(`\\b${enM}\\b`, 'gi');
      if (reg.test(result)) {
        result = result.replace(reg, hiM);
        matched = true;
      }
    }
    if (matched) return result;

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const hiMonthsList = [
        'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
        'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
      ];
      return `${d.getDate()} ${hiMonthsList[d.getMonth()]} ${d.getFullYear()}`;
    }
  }

  return dateStr;
}

export default coreStrings;
