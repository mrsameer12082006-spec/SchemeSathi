// Verified Scheme Knowledge Base for SchemeSathi MVP (CS002 Community Services)
// All rules are sourced from official ministry portals, verified as of Nov 2026.

export const VERIFIED_SCHEMES = [
  {
    id: "pm-kisan",
    name: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
    englishName: "PM Kisan Samman Nidhi",
    ministry: "कृषि एवं किसान कल्याण मंत्रालय",
    englishMinistry: "Ministry of Agriculture & Farmers Welfare",
    scope: "Central",
    officialUrl: "https://pmkisan.gov.in",
    lastVerified: "2026-11-01",
    highlightAmount: "₹6,000",
    highlightFrequency: "प्रति वर्ष (3 समान किस्तों में)",
    englishHighlightFrequency: "per year (in 3 equal installments)",
    tag: "किसान कल्याण (Farmer Welfare)",
    benefitSummary: "हर वर्ष ₹6,000 की सीधी वित्तीय सहायता सीधे बैंक खाते में (₹2,000 की 3 समान किस्तों में DBT के माध्यम से)।",
    englishBenefitSummary: "Direct financial support of ₹6,000 per year transferred via DBT in 3 equal installments of ₹2,000.",
    rules: [
      {
        id: "RULE_PMKISAN_LAND",
        field: "has_cultivable_land",
        operator: "==",
        value: true,
        description: "परिवार के नाम पर खेती योग्य जमीन का सरकारी रिकॉर्ड होना चाहिए।",
        englishDescription: "Family must own cultivable agricultural land in official revenue records."
      },
      {
        id: "RULE_PMKISAN_TAX_EXCLUSION",
        field: "is_income_tax_payer",
        operator: "==",
        value: false,
        description: "परिवार में कोई सदस्य आयकर (Income Tax) दाता नहीं होना चाहिए।",
        englishDescription: "No family member should be an Income Tax payer."
      },
      {
        id: "RULE_PMKISAN_GOVT_EXCLUSION",
        field: "is_govt_employee_or_pensioner",
        operator: "==",
        value: false,
        description: "परिवार में कोई सेवारत/सेवानिवृत्त सरकारी कर्मचारी या ₹10,000+ पेंशनभोगी नहीं होना चाहिए।",
        englishDescription: "No government employee or pensioner drawing ₹10,000+ monthly."
      }
    ],
    documents: [
      {
        name: "आधार कार्ड (Aadhaar Card)",
        note: "आधार में नाम बैंक पासबुक से मेल खाना चाहिए।"
      },
      {
        name: "बैंक पासबुक (Bank Passbook)",
        note: "खाते में आधार और DBT (Direct Benefit Transfer) लिंक होना अनिवार्य है।"
      },
      {
        name: "जमीन की नकल / खतौनी (Land Jamabandi / Fard)",
        note: "पटवारी या राज्य भूलेख पोर्टल से प्रमाणित खसरा-खतौनी संख्या।"
      }
    ],
    applicationSteps: [
      "नजदीकी जन सेवा केंद्र (CSC Kiosk) जाएं या pmkisan.gov.in पोर्टल खोलें।",
      "'New Farmer Registration' विकल्प चुनें और ग्रामीण/शहरी किसान प्रकार चुनें।",
      "अपना आधार नंबर और मोबाइल नंबर दर्ज कर OTP सत्यापित करें।",
      "जमीन का खसरा/खतौनी नंबर और बैंक विवरण दर्ज कर सबमिट करें।",
      "आवेदन के बाद मिलने वाली पावती रसीद (Acknowledgement Receipt) संभाल कर रखें।"
    ]
  },
  {
    id: "pm-awas-gramin",
    name: "प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)",
    englishName: "PM Awas Yojana (Gramin)",
    ministry: "ग्रामीण विकास मंत्रालय",
    englishMinistry: "Ministry of Rural Development",
    scope: "Central + State",
    officialUrl: "https://pmayg.nic.in",
    lastVerified: "2026-11-01",
    highlightAmount: "₹1.20 - ₹1.30 लाख",
    highlightFrequency: "मकान निर्माण अनुदान + मनरेगा मजदूरी",
    englishHighlightFrequency: "construction grant + MGNREGA wages",
    tag: "आवास सहायता (Housing Grant)",
    benefitSummary: "मैदानी क्षेत्रों में ₹1.20 लाख तथा पहाड़ी क्षेत्रों में ₹1.30 लाख की पक्का मकान निर्माण सहायता + 90 दिनों की मनरेगा अकुशल मजदूरी।",
    englishBenefitSummary: "Financial grant of ₹1.20 Lakh (plains) / ₹1.30 Lakh (hills) + 90 days MGNREGA wages for pucca house.",
    rules: [
      {
        id: "RULE_PMAY_HOUSE_STATUS",
        field: "house_type",
        operator: "==",
        value: "kutcha",
        description: "परिवार के पास कोई पक्का मकान नहीं होना चाहिए (कच्चा मकान या बेघर)।",
        englishDescription: "Family must not own a pucca house (homeless or kutcha house)."
      },
      {
        id: "RULE_PMAY_NO_GOVT_JOB",
        field: "is_govt_employee_or_pensioner",
        operator: "==",
        value: false,
        description: "परिवार का कोई सदस्य नियमित सरकारी नौकरी में नहीं होना चाहिए।",
        englishDescription: "No family member in regular government service."
      }
    ],
    documents: [
      {
        name: "आधार कार्ड (Aadhaar Card)",
        note: "परिवार के सभी वयस्क सदस्यों का आधार।"
      },
      {
        name: "सक्रिय बैंक खाता पासबुक",
        note: "सहायता राशि सीधे 3 किस्तों में बैंक में आती है।"
      },
      {
        name: "जॉब कार्ड (MGNREGA Job Card)",
        note: "90 दिनों की अकुशल मजदूरी भुगतान हेतु।"
      }
    ],
    applicationSteps: [
      "ग्राम पंचायत या ब्लॉक विकास कार्यालय (BDO) में आवास सहायिका से संपर्क करें।",
      "आवास+ (Awaas+) सर्वेक्षण सूची में अपना नाम सत्यापित करवाएं।",
      "ग्राम सभा द्वारा पात्रता अनुमोदन के बाद स्वीकृति पत्र प्राप्त करें।"
    ]
  },
  {
    id: "pm-jay-ayushman",
    name: "आयुष्मान भारत (PM-JAY)",
    englishName: "Ayushman Bharat PM-JAY",
    ministry: "स्वास्थ्य एवं परिवार कल्याण मंत्रालय / NHA",
    englishMinistry: "National Health Authority",
    scope: "Central",
    officialUrl: "https://pmjay.gov.in",
    lastVerified: "2026-10-28",
    highlightAmount: "₹5,00,000",
    highlightFrequency: "प्रति परिवार मुफ्त इलाज प्रति वर्ष",
    englishHighlightFrequency: "cashless health cover per family/year",
    tag: "स्वास्थ्य सुरक्षा (Free Healthcare)",
    benefitSummary: "प्रति परिवार प्रति वर्ष ₹5 लाख तक का देश भर के 27,000+ सूचीबद्ध सरकारी व निजी अस्पतालों में पूरी तरह मुफ्त कैशलेस इलाज।",
    englishBenefitSummary: "Cashless secondary and tertiary hospital treatment up to ₹5 Lakh per family per year in empanelled hospitals.",
    rules: [
      {
        id: "RULE_PMJAY_SECC",
        field: "is_low_income_or_ration_card",
        operator: "==",
        value: true,
        description: "SECC-2011 वंचित श्रेणी या राज्य खाद्य सुरक्षा (NFSA) राशन कार्ड धारक।",
        englishDescription: "Eligible under SECC-2011 deprived criteria or priority ration card."
      },
      {
        id: "RULE_PMJAY_NO_TAX",
        field: "is_income_tax_payer",
        operator: "==",
        value: false,
        description: "परिवार आयकर दाता नहीं होना चाहिए।",
        englishDescription: "Family must not be income tax payers."
      }
    ],
    documents: [
      {
        name: "राशन कार्ड (Ration Card)",
        note: "खाद्य सुरक्षा सूची में नाम जांचने हेतु।"
      },
      {
        name: "आधार कार्ड (Aadhaar Card)",
        note: "बायोमेट्रिक प्रमाणीकरण व गोल्डन कार्ड जारी करने हेतु।"
      }
    ],
    applicationSteps: [
      "नजदीकी सूचीबद्ध सरकारी अस्पताल या CSC केंद्र जाएं।",
      "आयुष्मान मित्र से अपनी पात्रता (mera.pmjay.gov.in) जांचवाएं।",
      "आधार सत्यापन करवाकर 'आयुष्मान कार्ड' (गोल्डन कार्ड) प्राप्त करें।"
    ]
  }
];

// Factual One-Question Registry (GOV.UK Pattern + Audio Prompts)
export const QUESTION_REGISTRY = [
  {
    id: "land",
    field: "has_cultivable_land",
    titleHindi: "क्या आपके या आपके परिवार के नाम पर खेती योग्य जमीन है?",
    titleEnglish: "Do you or your family own cultivable agricultural land?",
    helperHindi: "यह जानकारी पीएम किसान योजना की बुनियादी पात्रता जांचने के लिए जरूरी है।",
    helperEnglish: "Required to verify eligibility for PM-KISAN agricultural support.",
    audioPromptHindi: "क्या आपके या आपके परिवार के नाम पर खेती योग्य जमीन है? नीचे दिए गए विकल्प में से हाँ या नहीं चुनें।",
    audioPromptEnglish: "Do you or your family own cultivable agricultural land? Please choose yes or no.",
    category: "land",
    options: [
      {
        labelHindi: "हाँ, जमीन मेरे या परिवार के नाम पर है",
        labelEnglish: "Yes, land is owned in family's name",
        value: true,
        shortText: "हाँ (Yes, Landholder)",
        shortcutKey: "1"
      },
      {
        labelHindi: "नहीं, हमारे पास खेती की जमीन नहीं है",
        labelEnglish: "No, we do not own agricultural land",
        value: false,
        shortText: "नहीं (No Land)",
        shortcutKey: "2"
      },
      {
        labelHindi: "हम पट्टे/बटाई पर खेती करते हैं",
        labelEnglish: "We farm on leased/tenant land",
        value: "tenant",
        shortText: "पट्टेदार (Tenant)",
        shortcutKey: "3"
      }
    ]
  },
  {
    id: "tax",
    field: "is_income_tax_payer",
    titleHindi: "क्या आपके परिवार में कोई सदस्य आयकर (Income Tax) भरता है?",
    titleEnglish: "Does anyone in your family pay Income Tax?",
    helperHindi: "सरकारी कल्याणकारी योजनाएं आयकर दाताओं के परिवारों के लिए लागू नहीं होती हैं।",
    helperEnglish: "Income-tax paying families are excluded under official central guidelines.",
    audioPromptHindi: "क्या आपके परिवार में कोई सदस्य इनकम टैक्स या आयकर भरता है? अगर नहीं भरते तो नहीं चुनें।",
    audioPromptEnglish: "Does anyone in your family pay Income Tax? Select No if you do not pay income tax.",
    category: "tax",
    options: [
      {
        labelHindi: "नहीं, कोई इनकम टैक्स नहीं भरता",
        labelEnglish: "No, no one pays income tax",
        value: false,
        shortText: "नहीं भरते (Non-Taxpayer)",
        shortcutKey: "1"
      },
      {
        labelHindi: "हाँ, परिवार में कोई आयकर भरता है",
        labelEnglish: "Yes, someone pays income tax",
        value: true,
        shortText: "हाँ, भरते हैं (Taxpayer)",
        shortcutKey: "2"
      },
      {
        labelHindi: "मुझे पक्का नहीं पता (Not Sure)",
        labelEnglish: "Not sure / Don't know",
        value: "unknown",
        shortText: "पक्का नहीं पता (Not Sure)",
        shortcutKey: "3"
      }
    ]
  },
  {
    id: "govt_job",
    field: "is_govt_employee_or_pensioner",
    titleHindi: "क्या परिवार में कोई सरकारी नौकरी में है या ₹10,000+ पेंशन पाता है?",
    titleEnglish: "Is anyone in a government job or receiving ₹10,000+ monthly pension?",
    helperHindi: "सेवारत या सेवानिवृत्त नियमित सरकारी कर्मचारियों के परिवारों पर बहिष्करण नियम लागू होता है।",
    helperEnglish: "Central exclusion applies to active/retired govt servants or pensioners with ₹10k+/mo.",
    audioPromptHindi: "क्या आपके परिवार में कोई सरकारी नौकरी में है या दस हजार रुपये से अधिक मासिक पेंशन पाता है?",
    audioPromptEnglish: "Is anyone in your family employed in a government job or receiving ten thousand rupees or more monthly pension?",
    category: "employment",
    options: [
      {
        labelHindi: "नहीं, कोई सरकारी कर्मचारी या पेंशनर नहीं है",
        labelEnglish: "No government employee or pensioner",
        value: false,
        shortText: "नहीं (No Govt Job)",
        shortcutKey: "1"
      },
      {
        labelHindi: "हाँ, सरकारी नौकरी या ₹10,000+ पेंशन है",
        labelEnglish: "Yes, government service or pension",
        value: true,
        shortText: "हाँ (Govt Service)",
        shortcutKey: "2"
      },
      {
        labelHindi: "मुझे पक्का नहीं पता (Not Sure)",
        labelEnglish: "Not sure / Don't know",
        value: "unknown",
        shortText: "पक्का नहीं पता (Not Sure)",
        shortcutKey: "3"
      }
    ]
  },
  {
    id: "house",
    field: "house_type",
    titleHindi: "वर्तमान में आपका मकान कैसा है?",
    titleEnglish: "What type of house do you currently live in?",
    helperHindi: "प्रधानमंत्री आवास योजना (ग्रामीण) केवल कच्चे मकानों या बेघर परिवारों के लिए स्वीकृत होती है।",
    helperEnglish: "PMAY-G grants are strictly targeted at kutcha houses and homeless households.",
    audioPromptHindi: "वर्तमान में आपका मकान कैसा है? कच्चा मकान है या पक्का मकान?",
    audioPromptEnglish: "What type of house do you currently live in? Kutcha, pucca, or rented?",
    category: "housing",
    options: [
      {
        labelHindi: "कच्चा मकान या बेघर (Kutcha / Homeless)",
        labelEnglish: "Kutcha house or homeless",
        value: "kutcha",
        shortText: "कच्चा मकान (Kutcha)",
        shortcutKey: "1"
      },
      {
        labelHindi: "पक्का मकान (Pucca House)",
        labelEnglish: "Pucca house (concrete/brick)",
        value: "pucca",
        shortText: "पक्का मकान (Pucca)",
        shortcutKey: "2"
      },
      {
        labelHindi: "किराये का मकान (Rented)",
        labelEnglish: "Rented accommodation",
        value: "rented",
        shortText: "किराये पर (Rented)",
        shortcutKey: "3"
      }
    ]
  }
];
