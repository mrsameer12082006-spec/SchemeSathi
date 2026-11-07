// Verified Scheme Knowledge Base for SchemeSathi MVP (CS002 Community Services)
// All rules are sourced from official ministry portals, verified as of Nov 2026.

export const VERIFIED_SCHEMES = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    englishName: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    englishMinistry: "Ministry of Agriculture & Farmers Welfare",
    scope: "Central Welfare",
    officialUrl: "https://pmkisan.gov.in",
    lastVerified: "2026-11-01",
    highlightAmount: "₹6,000",
    highlightFrequency: "per year (in 3 equal installments)",
    englishHighlightFrequency: "per year (in 3 equal installments)",
    tag: "Farmer Welfare",
    benefitSummary: "Direct financial income support of ₹6,000 per year transferred via Direct Benefit Transfer (DBT) in 3 equal installments of ₹2,000 to eligible landholding farmer families.",
    englishBenefitSummary: "Direct financial income support of ₹6,000 per year transferred via Direct Benefit Transfer (DBT) in 3 equal installments of ₹2,000 to eligible landholding farmer families.",
    rules: [
      {
        id: "RULE_PMKISAN_LAND",
        field: "has_cultivable_land",
        operator: "==",
        value: true,
        description: "Family must own cultivable agricultural land in official revenue records.",
        englishDescription: "Family must own cultivable agricultural land in official revenue records."
      },
      {
        id: "RULE_PMKISAN_TAX_EXCLUSION",
        field: "is_income_tax_payer",
        operator: "==",
        value: false,
        description: "No family member should be an Income Tax payer.",
        englishDescription: "No family member should be an Income Tax payer."
      },
      {
        id: "RULE_PMKISAN_GOVT_EXCLUSION",
        field: "is_govt_employee_or_pensioner",
        operator: "==",
        value: false,
        description: "No government employee or pensioner drawing ₹10,000+ monthly.",
        englishDescription: "No government employee or pensioner drawing ₹10,000+ monthly."
      }
    ],
    documents: [
      {
        name: "Aadhaar Card",
        note: "Name on Aadhaar must match bank passbook records."
      },
      {
        name: "Bank Passbook",
        note: "Account must be Aadhaar-seeded with active DBT."
      },
      {
        name: "Land Revenue Record (Khasra / Khatauni)",
        note: "Certified land title from Patwari or state land revenue portal."
      }
    ],
    applicationSteps: [
      "Visit your nearest Common Service Centre (CSC Kiosk) or open pmkisan.gov.in.",
      "Select 'New Farmer Registration' and choose Rural or Urban Farmer category.",
      "Enter Aadhaar number and registered mobile number for OTP verification.",
      "Submit land survey/Khasra numbers and verified bank account details.",
      "Retain the generated acknowledgement receipt for tracking your DBT status."
    ]
  },
  {
    id: "pm-awas-gramin",
    name: "PM Awas Yojana (Gramin)",
    englishName: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Rural Development",
    englishMinistry: "Ministry of Rural Development",
    scope: "Central + State",
    officialUrl: "https://pmayg.nic.in",
    lastVerified: "2026-11-01",
    highlightAmount: "₹1.20 - ₹1.30 Lakh",
    highlightFrequency: "construction grant + MGNREGA wages",
    englishHighlightFrequency: "construction grant + MGNREGA wages",
    tag: "Housing Grant",
    benefitSummary: "Financial grant of ₹1.20 Lakh (plains) to ₹1.30 Lakh (hilly/difficult areas) for pucca house construction + 90 days of dedicated MGNREGA unskilled labour wages.",
    englishBenefitSummary: "Financial grant of ₹1.20 Lakh (plains) to ₹1.30 Lakh (hilly/difficult areas) for pucca house construction + 90 days of dedicated MGNREGA unskilled labour wages.",
    rules: [
      {
        id: "RULE_PMAY_HOUSE_STATUS",
        field: "house_type",
        operator: "==",
        value: "kutcha",
        description: "Family must not own a pucca house (homeless or living in kutcha dwelling).",
        englishDescription: "Family must not own a pucca house (homeless or living in kutcha dwelling)."
      },
      {
        id: "RULE_PMAY_NO_GOVT_JOB",
        field: "is_govt_employee_or_pensioner",
        operator: "==",
        value: false,
        description: "No family member in regular government employment.",
        englishDescription: "No family member in regular government employment."
      }
    ],
    documents: [
      {
        name: "Aadhaar Card",
        note: "Aadhaar cards of all adult household members."
      },
      {
        name: "Active Bank Account Passbook",
        note: "Financial grant is disbursed directly in 3 staged installments."
      },
      {
        name: "MGNREGA Job Card",
        note: "Required for crediting 90 days unskilled labour wages."
      }
    ],
    applicationSteps: [
      "Contact your Gram Panchayat Secretary or Block Development Officer (BDO).",
      "Verify household inclusion on the official Awaas+ survey list.",
      "Obtain sanction letter following Gram Sabha approval and geo-tagged site verification."
    ]
  },
  {
    id: "pm-jay-ayushman",
    name: "Ayushman Bharat PM-JAY",
    englishName: "Ayushman Bharat PM-JAY",
    ministry: "National Health Authority (NHA)",
    englishMinistry: "National Health Authority (NHA)",
    scope: "Central Welfare",
    officialUrl: "https://pmjay.gov.in",
    lastVerified: "2026-10-28",
    highlightAmount: "₹5,00,000",
    highlightFrequency: "cashless health cover per family / year",
    englishHighlightFrequency: "cashless health cover per family / year",
    tag: "Free Healthcare",
    benefitSummary: "Comprehensive secondary and tertiary care hospitalization coverage up to ₹5 Lakh per family per year, completely cashless across 27,000+ empanelled hospitals nationwide.",
    englishBenefitSummary: "Comprehensive secondary and tertiary care hospitalization coverage up to ₹5 Lakh per family per year, completely cashless across 27,000+ empanelled hospitals nationwide.",
    rules: [
      {
        id: "RULE_PMJAY_SECC",
        field: "is_low_income_or_ration_card",
        operator: "==",
        value: true,
        description: "Identified under SECC-2011 deprivation criteria or priority NFSA ration card.",
        englishDescription: "Identified under SECC-2011 deprivation criteria or priority NFSA ration card."
      },
      {
        id: "RULE_PMJAY_NO_TAX",
        field: "is_income_tax_payer",
        operator: "==",
        value: false,
        description: "Family must not be an income tax paying household.",
        englishDescription: "Family must not be an income tax paying household."
      }
    ],
    documents: [
      {
        name: "Ration Card (NFSA / Priority)",
        note: "To verify household food security and socio-economic category."
      },
      {
        name: "Aadhaar Card",
        note: "For biometric e-KYC and instant Ayushman Card generation."
      }
    ],
    applicationSteps: [
      "Visit any empanelled public or private hospital, or a local CSC Kiosk.",
      "Request the Ayushman Mitra to verify eligibility on mera.pmjay.gov.in.",
      "Complete biometric Aadhaar authentication to receive your printed Ayushman Card."
    ]
  }
];

// Factual One-Question Registry (GOV.UK Pattern + Audio Prompts) - 100% English Only
export const QUESTION_REGISTRY = [
  {
    id: "land",
    field: "has_cultivable_land",
    titleEnglish: "Do you or your family own cultivable agricultural land?",
    title: "Do you or your family own cultivable agricultural land?",
    helperEnglish: "Required to verify eligibility for PM-KISAN agricultural support.",
    audioPromptEnglish: "Do you or your family own cultivable agricultural land? Please choose yes or no.",
    category: "land",
    options: [
      {
        labelEnglish: "Yes, family owns cultivable land",
        value: true,
        shortText: "Yes (Landholder)",
        shortcutKey: "1"
      },
      {
        labelEnglish: "No, we do not own agricultural land",
        value: false,
        shortText: "No (No Land)",
        shortcutKey: "2"
      },
      {
        labelEnglish: "We farm on leased or tenant land",
        value: "tenant",
        shortText: "Tenant Farmer",
        shortcutKey: "3"
      }
    ]
  },
  {
    id: "tax",
    field: "is_income_tax_payer",
    titleEnglish: "Does anyone in your family pay Income Tax?",
    title: "Does anyone in your family pay Income Tax?",
    helperEnglish: "Central welfare benefits are targeted at non-taxpaying households.",
    audioPromptEnglish: "Does anyone in your family pay Income Tax? Select No if you do not pay income tax.",
    category: "tax",
    options: [
      {
        labelEnglish: "No, no one pays income tax",
        value: false,
        shortText: "Non-Taxpayer",
        shortcutKey: "1"
      },
      {
        labelEnglish: "Yes, family member pays income tax",
        value: true,
        shortText: "Taxpayer",
        shortcutKey: "2"
      },
      {
        labelEnglish: "Not sure / Need clarification",
        value: "unknown",
        shortText: "Not Sure",
        shortcutKey: "3"
      }
    ]
  },
  {
    id: "govt_job",
    field: "is_govt_employee_or_pensioner",
    titleEnglish: "Is anyone in a government job or receiving ₹10,000+ monthly pension?",
    title: "Is anyone in a government job or receiving ₹10,000+ monthly pension?",
    helperEnglish: "Exclusion rules apply to active or retired government personnel.",
    audioPromptEnglish: "Is anyone in your family employed in a government job or receiving ten thousand rupees or more monthly pension?",
    category: "employment",
    options: [
      {
        labelEnglish: "No government employee or pensioner",
        value: false,
        shortText: "No Govt Job",
        shortcutKey: "1"
      },
      {
        labelEnglish: "Yes, regular government service or ₹10,000+ pension",
        value: true,
        shortText: "Govt Service",
        shortcutKey: "2"
      },
      {
        labelEnglish: "Not sure / Need clarification",
        value: "unknown",
        shortText: "Not Sure",
        shortcutKey: "3"
      }
    ]
  },
  {
    id: "house",
    field: "house_type",
    titleEnglish: "What type of house does your family currently live in?",
    title: "What type of house does your family currently live in?",
    helperEnglish: "PMAY-G grants are strictly targeted at kutcha houses and homeless households.",
    audioPromptEnglish: "What type of house do you currently live in? Kutcha house, pucca house, or rented?",
    category: "housing",
    options: [
      {
        labelEnglish: "Kutcha house or homeless",
        value: "kutcha",
        shortText: "Kutcha House",
        shortcutKey: "1"
      },
      {
        labelEnglish: "Pucca house (concrete/brick construction)",
        value: "pucca",
        shortText: "Pucca House",
        shortcutKey: "2"
      },
      {
        labelEnglish: "Rented accommodation",
        value: "rented",
        shortText: "Rented",
        shortcutKey: "3"
      }
    ]
  }
];
