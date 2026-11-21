-- ============================================================================
-- SchemeSathi - Complete Supabase Schema & Seed Data
-- 150+ Government Schemes with Eligibility Criteria, Documents & Steps
-- Generated for production deployment
-- ============================================================================

-- ============================================================================
-- PART 1: EXTENSIONS & DDL
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLE: categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- TABLE: schemes
-- ============================================================================
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    summary_en TEXT NOT NULL DEFAULT '',
    summary_hi TEXT NOT NULL DEFAULT '',
    benefits_en TEXT NOT NULL DEFAULT '',
    benefits_hi TEXT NOT NULL DEFAULT '',
    official_url TEXT DEFAULT '',
    nodal_ministry TEXT DEFAULT '',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schemes_code ON schemes(code);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category_id);
CREATE INDEX IF NOT EXISTS idx_schemes_active ON schemes(is_active);

-- ============================================================================
-- TABLE: scheme_eligibility_criteria
-- ============================================================================
CREATE TABLE IF NOT EXISTS scheme_eligibility_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID UNIQUE REFERENCES schemes(id) ON DELETE CASCADE,
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 120,
    max_annual_income NUMERIC,
    max_landholding_hectares NUMERIC,
    allowed_occupations TEXT[] DEFAULT '{}',
    allowed_genders TEXT[] DEFAULT ARRAY['Male','Female','Other'],
    allowed_areas TEXT[] DEFAULT ARRAY['Rural','Urban'],
    caste_categories TEXT[] DEFAULT ARRAY['General','OBC','SC','ST','EWS'],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- TABLE: scheme_documents
-- ============================================================================
CREATE TABLE IF NOT EXISTS scheme_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    document_name_en TEXT NOT NULL,
    document_name_hi TEXT NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_documents_scheme ON scheme_documents(scheme_id);

-- ============================================================================
-- TABLE: scheme_steps
-- ============================================================================
CREATE TABLE IF NOT EXISTS scheme_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    channel TEXT DEFAULT 'Online',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_steps_scheme ON scheme_steps(scheme_id);

-- ============================================================================
-- TABLE: scheme_chunks (for RAG / pgvector search)
-- ============================================================================
CREATE TABLE IF NOT EXISTS scheme_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES schemes(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_type TEXT DEFAULT 'description',
    language TEXT DEFAULT 'en',
    embedding vector(768),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scheme_chunks_scheme ON scheme_chunks(scheme_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_eligibility_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheme_chunks ENABLE ROW LEVEL SECURITY;

-- Public read-only policies (anon role)
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read on schemes" ON schemes FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read on scheme_eligibility_criteria" ON scheme_eligibility_criteria FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read on scheme_documents" ON scheme_documents FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read on scheme_steps" ON scheme_steps FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read on scheme_chunks" ON scheme_chunks FOR SELECT TO anon USING (true);

-- Service role full access policies
CREATE POLICY "Allow service_role full access on categories" ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access on schemes" ON schemes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access on scheme_eligibility_criteria" ON scheme_eligibility_criteria FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access on scheme_documents" ON scheme_documents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access on scheme_steps" ON scheme_steps FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Allow service_role full access on scheme_chunks" ON scheme_chunks FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- FUNCTION: match_schemes (pgvector similarity search)
-- ============================================================================
CREATE OR REPLACE FUNCTION match_schemes(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    code TEXT,
    name_en TEXT,
    name_hi TEXT,
    summary_en TEXT,
    summary_hi TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.code,
        s.name_en,
        s.name_hi,
        s.summary_en,
        s.summary_hi,
        1 - (s.embedding <=> query_embedding) AS similarity
    FROM schemes s
    WHERE s.is_active = true
      AND s.embedding IS NOT NULL
      AND 1 - (s.embedding <=> query_embedding) > match_threshold
    ORDER BY s.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================================================
-- FUNCTION: match_scheme_chunks (RAG chunk similarity search)
-- ============================================================================
CREATE OR REPLACE FUNCTION match_scheme_chunks(
    query_embedding vector(768),
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    scheme_id UUID,
    chunk_text TEXT,
    chunk_type TEXT,
    language TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sc.id,
        sc.scheme_id,
        sc.chunk_text,
        sc.chunk_type,
        sc.language,
        1 - (sc.embedding <=> query_embedding) AS similarity
    FROM scheme_chunks sc
    WHERE sc.embedding IS NOT NULL
      AND 1 - (sc.embedding <=> query_embedding) > match_threshold
    ORDER BY sc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================================================
-- PART 2: SEED DATA - CATEGORIES (8 categories)
-- ============================================================================

INSERT INTO categories (code, name_en, name_hi) VALUES
    ('farmers',  'Agriculture & Farmers',   'कृषि एवं किसान'),
    ('students', 'Education & Scholarships','शिक्षा एवं छात्रवृत्ति'),
    ('women',    'Women & Child Welfare',   'महिला एवं बाल कल्याण'),
    ('seniors',  'Senior Citizens & Pension','वरिष्ठ नागरिक एवं पेंशन'),
    ('workers',  'Workers & Social Security','श्रमिक एवं सामाजिक सुरक्षा'),
    ('business', 'Business & Entrepreneurship','व्यापार एवं उद्यमिता'),
    ('health',   'Health & Medical',        'स्वास्थ्य एवं चिकित्सा'),
    ('housing',  'Housing & Urban Development','आवास एवं शहरी विकास')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- PART 3: SEED DATA - SCHEMES
-- Helper: We use a DO block to capture category IDs, then insert all schemes
-- ============================================================================

DO $$
DECLARE
    cat_farmers  UUID;
    cat_students UUID;
    cat_women    UUID;
    cat_seniors  UUID;
    cat_workers  UUID;
    cat_business UUID;
    cat_health   UUID;
    cat_housing  UUID;
    sid          UUID;
BEGIN
    SELECT id INTO cat_farmers  FROM categories WHERE code = 'farmers';
    SELECT id INTO cat_students FROM categories WHERE code = 'students';
    SELECT id INTO cat_women    FROM categories WHERE code = 'women';
    SELECT id INTO cat_seniors  FROM categories WHERE code = 'seniors';
    SELECT id INTO cat_workers  FROM categories WHERE code = 'workers';
    SELECT id INTO cat_business FROM categories WHERE code = 'business';
    SELECT id INTO cat_health   FROM categories WHERE code = 'health';
    SELECT id INTO cat_housing  FROM categories WHERE code = 'housing';

-- ============================================================================
-- BATCH 1: AGRICULTURE & FARMERS (20 schemes)
-- ============================================================================

-- 1. PM-KISAN
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pm-kisan', 'PM Kisan Samman Nidhi', 'पीएम किसान सम्मान निधि',
    'Direct income support of ₹6,000 per year to small and marginal farmer families.',
    'छोटे और सीमांत किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।',
    '₹6,000 per year in 3 installments of ₹2,000 each, directly credited to bank account via DBT.',
    '₹6,000 प्रति वर्ष, ₹2,000 की 3 किस्तों में, सीधे बैंक खाते में DBT द्वारा।',
    'https://pmkisan.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, 2.0, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Ownership Records (Khatauni/Khasra)', 'भूमि स्वामित्व रिकॉर्ड (खतौनी/खसरा)', true, 2),
    (sid, 'Bank Account Passbook', 'बैंक खाता पासबुक', true, 3),
    (sid, 'Mobile Number linked to Aadhaar', 'आधार से जुड़ा मोबाइल नंबर', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Visit Portal', 'पोर्टल पर जाएं', 'Go to pmkisan.gov.in and click New Farmer Registration.', 'pmkisan.gov.in पर जाएं और नया किसान पंजीकरण पर क्लिक करें।', 'Online'),
    (sid, 2, 'Enter Aadhaar', 'आधार दर्ज करें', 'Enter your Aadhaar number and verify via OTP.', 'अपना आधार नंबर दर्ज करें और OTP से सत्यापित करें।', 'Online'),
    (sid, 3, 'Fill Details', 'विवरण भरें', 'Fill in personal, land, and bank account details.', 'व्यक्तिगत, भूमि और बैंक खाता विवरण भरें।', 'Online'),
    (sid, 4, 'Submit Application', 'आवेदन जमा करें', 'Review and submit. You will receive a registration number.', 'समीक्षा करें और जमा करें। आपको एक पंजीकरण संख्या मिलेगी।', 'Online');

-- 2. PMFBY
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pmfby', 'Pradhan Mantri Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना',
    'Crop insurance scheme providing financial support to farmers in case of crop loss due to natural calamities.',
    'प्राकृतिक आपदाओं से फसल नुकसान की स्थिति में किसानों को वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना।',
    'Premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops. Full claim on crop loss.',
    'प्रीमियम: खरीफ के लिए 2%, रबी के लिए 1.5%, वाणिज्यिक फसलों के लिए 5%। फसल हानि पर पूर्ण दावा।',
    'https://pmfby.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records (Khatauni)', 'भूमि रिकॉर्ड (खतौनी)', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3),
    (sid, 'Sowing Certificate from Patwari', 'पटवारी से बुआई प्रमाण पत्र', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Contact Bank/CSC', 'बैंक/CSC से संपर्क करें', 'Visit your nearest bank branch or Common Service Centre.', 'अपनी नज़दीकी बैंक शाखा या जन सेवा केंद्र पर जाएं।', 'Offline'),
    (sid, 2, 'Fill Proposal Form', 'प्रस्ताव फॉर्म भरें', 'Fill the crop insurance proposal form with crop and land details.', 'फसल और भूमि विवरण के साथ फसल बीमा प्रस्ताव फॉर्म भरें।', 'Offline'),
    (sid, 3, 'Pay Premium', 'प्रीमियम भुगतान करें', 'Pay the subsidized premium amount.', 'सब्सिडी वाली प्रीमियम राशि का भुगतान करें।', 'Offline'),
    (sid, 4, 'Get Policy', 'पॉलिसी प्राप्त करें', 'Receive your insurance policy document and reference number.', 'अपना बीमा पॉलिसी दस्तावेज़ और संदर्भ संख्या प्राप्त करें।', 'Offline');

-- 3. KCC
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('kcc', 'Kisan Credit Card', 'किसान क्रेडिट कार्ड',
    'Provides farmers with affordable credit for agriculture and allied activities at subsidized interest rate.',
    'किसानों को कृषि और संबद्ध गतिविधियों के लिए रियायती ब्याज दर पर किफायती ऋण प्रदान करता है।',
    'Credit limit up to ₹3 lakh at 4% interest (with prompt repayment subvention). Also covers fisheries and animal husbandry.',
    '₹3 लाख तक की क्रेडिट सीमा 4% ब्याज पर (समय पर भुगतान पर छूट सहित)। मत्स्य पालन और पशुपालन भी शामिल।',
    'https://pmkisan.gov.in/KCC.aspx', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 75, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Ownership Documents', 'भूमि स्वामित्व दस्तावेज़', true, 2),
    (sid, 'Passport-size Photographs', 'पासपोर्ट आकार की फोटो', true, 3),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Visit Bank', 'बैंक जाएं', 'Visit your nearest bank branch that offers KCC.', 'अपनी नज़दीकी बैंक शाखा पर जाएं जो KCC प्रदान करती है।', 'Offline'),
    (sid, 2, 'Fill Application', 'आवेदन भरें', 'Fill the KCC application form with land and crop details.', 'भूमि और फसल विवरण के साथ KCC आवेदन पत्र भरें।', 'Offline'),
    (sid, 3, 'Submit Documents', 'दस्तावेज़ जमा करें', 'Submit required documents for verification.', 'सत्यापन के लिए आवश्यक दस्तावेज़ जमा करें।', 'Offline'),
    (sid, 4, 'Receive KCC', 'KCC प्राप्त करें', 'After verification, receive your KCC card and credit limit.', 'सत्यापन के बाद, अपना KCC कार्ड और क्रेडिट सीमा प्राप्त करें।', 'Offline');

-- 4. Soil Health Card
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('soil-health-card', 'Soil Health Card Scheme', 'मृदा स्वास्थ्य कार्ड योजना',
    'Provides soil health cards to farmers with nutrient status and recommendations for appropriate fertilizer dosage.',
    'किसानों को मिट्टी की पोषक स्थिति और उचित उर्वरक खुराक की सिफारिशों के साथ मृदा स्वास्थ्य कार्ड प्रदान करता है।',
    'Free soil testing and health card every 2 years with crop-specific fertilizer recommendations.',
    'हर 2 साल में मुफ्त मिट्टी परीक्षण और फसल-विशिष्ट उर्वरक सिफारिशों के साथ स्वास्थ्य कार्ड।',
    'https://soilhealth.dac.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Mobile Number', 'मोबाइल नंबर', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Contact Agriculture Office', 'कृषि कार्यालय से संपर्क करें', 'Visit your block or district agriculture office.', 'अपने ब्लॉक या जिला कृषि कार्यालय पर जाएं।', 'Offline'),
    (sid, 2, 'Give Soil Sample', 'मिट्टी का नमूना दें', 'Officials will collect soil sample from your field.', 'अधिकारी आपके खेत से मिट्टी का नमूना एकत्र करेंगे।', 'Offline'),
    (sid, 3, 'Receive Card', 'कार्ड प्राप्त करें', 'After testing, receive your soil health card with recommendations.', 'परीक्षण के बाद, सिफारिशों के साथ अपना मृदा स्वास्थ्य कार्ड प्राप्त करें।', 'Offline');

-- 5. PM Krishi Sinchai Yojana (PMKSY)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pmksy', 'PM Krishi Sinchai Yojana', 'पीएम कृषि सिंचाई योजना',
    'Provides subsidy on micro-irrigation systems like drip and sprinkler to improve water use efficiency.',
    'पानी के उपयोग की दक्षता में सुधार के लिए ड्रिप और स्प्रिंकलर जैसी सूक्ष्म सिंचाई प्रणालियों पर सब्सिडी।',
    '55% subsidy for small/marginal farmers and 45% for other farmers on micro-irrigation equipment.',
    'सूक्ष्म सिंचाई उपकरण पर छोटे/सीमांत किसानों के लिए 55% और अन्य किसानों के लिए 45% सब्सिडी।',
    'https://pmksy.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3),
    (sid, 'Quotation from Equipment Supplier', 'उपकरण आपूर्तिकर्ता से कोटेशन', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply Online/Offline', 'ऑनलाइन/ऑफलाइन आवेदन करें', 'Apply through your state agriculture department or pmksy.gov.in.', 'अपने राज्य कृषि विभाग या pmksy.gov.in के माध्यम से आवेदन करें।', 'Online'),
    (sid, 2, 'Get Approval', 'स्वीकृति प्राप्त करें', 'After verification, receive subsidy approval letter.', 'सत्यापन के बाद, सब्सिडी स्वीकृति पत्र प्राप्त करें।', 'Online'),
    (sid, 3, 'Install Equipment', 'उपकरण स्थापित करें', 'Purchase and install the approved irrigation equipment.', 'स्वीकृत सिंचाई उपकरण खरीदें और स्थापित करें।', 'Offline'),
    (sid, 4, 'Claim Subsidy', 'सब्सिडी का दावा करें', 'Submit installation photos and bills to claim subsidy amount.', 'सब्सिडी राशि का दावा करने के लिए स्थापना फोटो और बिल जमा करें।', 'Offline');

-- 6. e-NAM
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('e-nam', 'National Agriculture Market (e-NAM)', 'राष्ट्रीय कृषि बाजार (e-NAM)',
    'Online trading platform for agricultural commodities connecting APMC mandis across India.',
    'कृषि वस्तुओं के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म जो भारत भर की APMC मंडियों को जोड़ता है।',
    'Better price discovery for farmers, transparent bidding, direct payment to bank accounts.',
    'किसानों के लिए बेहतर मूल्य खोज, पारदर्शी बोली, बैंक खातों में सीधा भुगतान।',
    'https://enam.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 2),
    (sid, 'Mobile Number', 'मोबाइल नंबर', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Register on e-NAM', 'e-NAM पर पंजीकरण करें', 'Visit enam.gov.in and register as a farmer.', 'enam.gov.in पर जाएं और किसान के रूप में पंजीकरण करें।', 'Online'),
    (sid, 2, 'List Produce', 'उपज सूचीबद्ध करें', 'List your agricultural produce with quantity and quality details.', 'मात्रा और गुणवत्ता विवरण के साथ अपनी कृषि उपज सूचीबद्ध करें।', 'Online'),
    (sid, 3, 'Accept Best Bid', 'सर्वोत्तम बोली स्वीकार करें', 'Review bids from multiple buyers and accept the best offer.', 'कई खरीदारों की बोलियों की समीक्षा करें और सबसे अच्छा प्रस्ताव स्वीकार करें।', 'Online');

-- 7. PM Kisan Maan Dhan Yojana
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pm-kisan-maandhan', 'PM Kisan Maan Dhan Yojana', 'पीएम किसान मानधन योजना',
    'Pension scheme for small and marginal farmers providing ₹3,000 per month after age 60.',
    'छोटे और सीमांत किसानों के लिए पेंशन योजना जो 60 वर्ष की आयु के बाद ₹3,000 प्रति माह प्रदान करती है।',
    '₹3,000 monthly pension after age 60. Government matches farmer''s contribution equally.',
    '60 वर्ष की आयु के बाद ₹3,000 मासिक पेंशन। सरकार किसान के योगदान के बराबर राशि देती है।',
    'https://maandhan.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 40, NULL, 2.0, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Bank Account/Savings Account Passbook', 'बैंक खाता/बचत खाता पासबुक', true, 2),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Visit CSC', 'CSC पर जाएं', 'Visit nearest Common Service Centre with Aadhaar and bank passbook.', 'आधार और बैंक पासबुक के साथ निकटतम जन सेवा केंद्र पर जाएं।', 'Offline'),
    (sid, 2, 'Enroll', 'नामांकन करें', 'CSC operator will register you on maandhan.in portal.', 'CSC ऑपरेटर आपको maandhan.in पोर्टल पर पंजीकृत करेगा।', 'Offline'),
    (sid, 3, 'Pay Monthly', 'मासिक भुगतान करें', 'Monthly contribution of ₹55-200 (based on age) auto-debited from bank.', '₹55-200 (आयु के आधार पर) मासिक योगदान बैंक से स्वतः कटेगा।', 'Online');

-- 8. Paramparagat Krishi Vikas Yojana (Organic Farming)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pkvy', 'Paramparagat Krishi Vikas Yojana', 'परंपरागत कृषि विकास योजना',
    'Promotes organic farming through cluster approach with financial assistance for certification and inputs.',
    'प्रमाणन और इनपुट के लिए वित्तीय सहायता के साथ क्लस्टर दृष्टिकोण के माध्यम से जैविक खेती को बढ़ावा देता है।',
    '₹50,000 per hectare over 3 years for organic farming inputs, certification, and marketing.',
    '3 वर्षों में जैविक खेती इनपुट, प्रमाणन और विपणन के लिए ₹50,000 प्रति हेक्टेयर।',
    'https://pgsindia-ncof.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Cluster Formation Details', 'क्लस्टर गठन विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Form Cluster', 'क्लस्टर बनाएं', 'Form a group of 50 farmers with 50 acres of land for organic farming.', '50 एकड़ भूमि वाले 50 किसानों का समूह बनाएं।', 'Offline'),
    (sid, 2, 'Apply via Agriculture Dept', 'कृषि विभाग से आवेदन करें', 'Apply through district agriculture officer.', 'जिला कृषि अधिकारी के माध्यम से आवेदन करें।', 'Offline'),
    (sid, 3, 'Get PGS Certification', 'PGS प्रमाणन प्राप्त करें', 'Undergo Participatory Guarantee System organic certification.', 'सहभागी गारंटी प्रणाली जैविक प्रमाणन प्राप्त करें।', 'Offline');

-- 9. Namo Drone Didi (Drone for Agriculture)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('namo-drone-didi', 'Namo Drone Didi', 'नमो ड्रोन दीदी',
    'Provides drones to women Self Help Groups for agricultural services like pesticide spraying.',
    'कीटनाशक छिड़काव जैसी कृषि सेवाओं के लिए महिला स्वयं सहायता समूहों को ड्रोन प्रदान करता है।',
    'Drones provided to 15,000 women SHGs with training, earning potential of ₹1 lakh+ per year.',
    '15,000 महिला SHG को प्रशिक्षण के साथ ड्रोन, प्रति वर्ष ₹1 लाख+ कमाई की संभावना।',
    'https://agriculture.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 55, NULL, NULL, ARRAY['Farmer'], ARRAY['Female'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'SHG Membership Certificate', 'SHG सदस्यता प्रमाण पत्र', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Join SHG', 'SHG से जुड़ें', 'Be part of a women Self Help Group in your area.', 'अपने क्षेत्र के महिला स्वयं सहायता समूह का हिस्सा बनें।', 'Offline'),
    (sid, 2, 'Apply through SHG', 'SHG के माध्यम से आवेदन करें', 'SHG applies through NRLM/state rural livelihood mission.', 'SHG NRLM/राज्य ग्रामीण आजीविका मिशन के माध्यम से आवेदन करता है।', 'Offline'),
    (sid, 3, 'Receive Training', 'प्रशिक्षण प्राप्त करें', 'Selected SHG members receive drone pilot training.', 'चयनित SHG सदस्यों को ड्रोन पायलट प्रशिक्षण मिलता है।', 'Offline');

-- 10. National Mission on Edible Oils (NMEO-Oil Palm)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('nmeo-oil-palm', 'National Mission on Edible Oils - Oil Palm', 'राष्ट्रीय खाद्य तेल मिशन - ऑयल पाम',
    'Promotes oil palm cultivation with financial assistance to increase domestic edible oil production.',
    'घरेलू खाद्य तेल उत्पादन बढ़ाने के लिए वित्तीय सहायता के साथ ऑयल पाम की खेती को बढ़ावा देता है।',
    'Planting material subsidy, maintenance allowance of ₹51,000/ha for 4 years, price assurance.',
    'रोपण सामग्री सब्सिडी, 4 वर्षों के लिए ₹51,000/हेक्टेयर रखरखाव भत्ता, मूल्य आश्वासन।',
    'https://nmeo.dac.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Contact Agriculture Dept', 'कृषि विभाग से संपर्क करें', 'Contact district agriculture office or state horticulture department.', 'जिला कृषि कार्यालय या राज्य बागवानी विभाग से संपर्क करें।', 'Offline'),
    (sid, 2, 'Register for Oil Palm', 'ऑयल पाम के लिए पंजीकरण करें', 'Register for oil palm plantation under NMEO scheme.', 'NMEO योजना के तहत ऑयल पाम रोपण के लिए पंजीकरण करें।', 'Offline'),
    (sid, 3, 'Receive Planting Material', 'रोपण सामग्री प्राप्त करें', 'Receive subsidized seedlings and planting material.', 'सब्सिडी वाले पौधे और रोपण सामग्री प्राप्त करें।', 'Offline');

-- 11. Agriculture Infrastructure Fund (AIF)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('aif', 'Agriculture Infrastructure Fund', 'कृषि अवसंरचना कोष',
    'Credit facility for investment in post-harvest management and community farming assets.',
    'कटाई के बाद प्रबंधन और सामुदायिक कृषि परिसंपत्तियों में निवेश के लिए ऋण सुविधा।',
    'Loans up to ₹2 crore with 3% interest subvention and credit guarantee up to ₹2 crore.',
    '₹2 करोड़ तक का ऋण 3% ब्याज छूट और ₹2 करोड़ तक की क्रेडिट गारंटी के साथ।',
    'https://agriinfra.dac.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Project Report', 'प्रोजेक्ट रिपोर्ट', true, 2),
    (sid, 'Land Documents/Lease Agreement', 'भूमि दस्तावेज़/लीज़ समझौता', true, 3),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Prepare Project Report', 'प्रोजेक्ट रिपोर्ट तैयार करें', 'Prepare Detailed Project Report for agri-infrastructure.', 'कृषि-अवसंरचना के लिए विस्तृत प्रोजेक्ट रिपोर्ट तैयार करें।', 'Offline'),
    (sid, 2, 'Apply on Portal', 'पोर्टल पर आवेदन करें', 'Apply online at agriinfra.dac.gov.in.', 'agriinfra.dac.gov.in पर ऑनलाइन आवेदन करें।', 'Online'),
    (sid, 3, 'Get Loan Sanction', 'ऋण स्वीकृति प्राप्त करें', 'Bank reviews and sanctions loan with interest subvention.', 'बैंक समीक्षा करता है और ब्याज छूट के साथ ऋण स्वीकृत करता है।', 'Offline');

-- 12. Sub-Mission on Agricultural Mechanization (SMAM)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('smam', 'Sub-Mission on Agricultural Mechanization', 'कृषि मशीनीकरण पर उप-मिशन',
    'Subsidies on purchase of agricultural machinery and equipment for farmers.',
    'किसानों के लिए कृषि मशीनरी और उपकरणों की खरीद पर सब्सिडी।',
    '40-50% subsidy on tractors, implements, and farm machinery. Higher for SC/ST/small farmers.',
    'ट्रैक्टर, औजार और कृषि मशीनरी पर 40-50% सब्सिडी। SC/ST/छोटे किसानों के लिए अधिक।',
    'https://agrimachinery.nic.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Caste Certificate (if SC/ST)', 'जाति प्रमाण पत्र (यदि SC/ST)', false, 3),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply Online', 'ऑनलाइन आवेदन करें', 'Register and apply on agrimachinery.nic.in portal.', 'agrimachinery.nic.in पोर्टल पर पंजीकरण करें और आवेदन करें।', 'Online'),
    (sid, 2, 'Selection', 'चयन', 'Application verified and selected by district committee.', 'जिला समिति द्वारा आवेदन सत्यापित और चयनित।', 'Offline'),
    (sid, 3, 'Purchase Machinery', 'मशीनरी खरीदें', 'Purchase approved machinery from authorized dealer.', 'अधिकृत डीलर से स्वीकृत मशीनरी खरीदें।', 'Offline'),
    (sid, 4, 'Receive Subsidy', 'सब्सिडी प्राप्त करें', 'Subsidy amount credited to bank account after verification.', 'सत्यापन के बाद सब्सिडी राशि बैंक खाते में जमा।', 'Offline');

-- 13. National Beekeeping & Honey Mission
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('nbhm', 'National Beekeeping & Honey Mission', 'राष्ट्रीय मधुमक्खी पालन एवं शहद मिशन',
    'Promotes beekeeping for additional income generation with training and equipment support.',
    'प्रशिक्षण और उपकरण सहायता के साथ अतिरिक्त आय उत्पादन के लिए मधुमक्खी पालन को बढ़ावा देता है।',
    'Free training, subsidized bee colonies, equipment, and honey processing units.',
    'मुफ्त प्रशिक्षण, सब्सिडी वाली मधुमक्खी कॉलोनियां, उपकरण, और शहद प्रसंस्करण इकाइयां।',
    'https://nbb.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 2),
    (sid, 'Training Completion Certificate', 'प्रशिक्षण पूर्णता प्रमाण पत्र', false, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Contact NBHM/KVK', 'NBHM/KVK से संपर्क करें', 'Contact National Bee Board or nearest Krishi Vigyan Kendra.', 'राष्ट्रीय मधुमक्खी बोर्ड या निकटतम कृषि विज्ञान केंद्र से संपर्क करें।', 'Offline'),
    (sid, 2, 'Get Training', 'प्रशिक्षण प्राप्त करें', 'Attend free beekeeping training program.', 'मुफ्त मधुमक्खी पालन प्रशिक्षण कार्यक्रम में भाग लें।', 'Offline'),
    (sid, 3, 'Receive Equipment', 'उपकरण प्राप्त करें', 'Receive subsidized bee boxes, colonies and equipment.', 'सब्सिडी वाले मधुमक्खी बक्से, कॉलोनियां और उपकरण प्राप्त करें।', 'Offline');

-- 14. PM Matsya Sampada Yojana (Fisheries)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pmmsy', 'PM Matsya Sampada Yojana', 'पीएम मत्स्य संपदा योजना',
    'Development of fisheries sector with financial assistance for fish farming, infrastructure and marketing.',
    'मत्स्य पालन, बुनियादी ढांचे और विपणन के लिए वित्तीय सहायता के साथ मत्स्य क्षेत्र का विकास।',
    '40-60% subsidy on fish farming units, boats, cold storage, and processing infrastructure.',
    'मछली पालन इकाइयों, नावों, कोल्ड स्टोरेज और प्रसंस्करण बुनियादी ढांचे पर 40-60% सब्सिडी।',
    'https://pmmsy.dof.gov.in', 'Ministry of Fisheries, Animal Husbandry & Dairying', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land/Water Body Ownership/Lease', 'भूमि/जल निकाय स्वामित्व/लीज़', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3),
    (sid, 'Project Proposal', 'प्रोजेक्ट प्रस्ताव', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply Online', 'ऑनलाइन आवेदन करें', 'Apply through state fisheries department or pmmsy.dof.gov.in.', 'राज्य मत्स्य विभाग या pmmsy.dof.gov.in के माध्यम से आवेदन करें।', 'Online'),
    (sid, 2, 'Submit Proposal', 'प्रस्ताव जमा करें', 'Submit project proposal with financial details.', 'वित्तीय विवरण के साथ प्रोजेक्ट प्रस्ताव जमा करें।', 'Online'),
    (sid, 3, 'Get Subsidy', 'सब्सिडी प्राप्त करें', 'After approval, subsidy released to bank account.', 'स्वीकृति के बाद, सब्सिडी बैंक खाते में जारी।', 'Offline');

-- 15. National Livestock Mission
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('nlm', 'National Livestock Mission', 'राष्ट्रीय पशुधन मिशन',
    'Financial assistance for poultry, sheep, goat rearing and livestock development.',
    'मुर्गी पालन, भेड़, बकरी पालन और पशुधन विकास के लिए वित्तीय सहायता।',
    'Subsidy up to 50% on livestock farming units (poultry, goat, sheep, piggery).',
    'पशुधन पालन इकाइयों (मुर्गी, बकरी, भेड़, सुअर) पर 50% तक सब्सिडी।',
    'https://nlm.udyamimitra.in', 'Ministry of Fisheries, Animal Husbandry & Dairying', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 2),
    (sid, 'Land/Shed Availability Proof', 'भूमि/शेड उपलब्धता प्रमाण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply Online', 'ऑनलाइन आवेदन करें', 'Apply on the NLM portal or through state animal husbandry department.', 'NLM पोर्टल या राज्य पशुपालन विभाग के माध्यम से आवेदन करें।', 'Online'),
    (sid, 2, 'Submit Documents', 'दस्तावेज़ जमा करें', 'Submit required documents and project report.', 'आवश्यक दस्तावेज़ और प्रोजेक्ट रिपोर्ट जमा करें।', 'Offline'),
    (sid, 3, 'Receive Subsidy', 'सब्सिडी प्राप्त करें', 'After approval, subsidy released for setting up unit.', 'स्वीकृति के बाद, इकाई स्थापना के लिए सब्सिडी जारी।', 'Offline');

-- 16. National Food Security Mission (NFSM)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('nfsm', 'National Food Security Mission', 'राष्ट्रीय खाद्य सुरक्षा मिशन',
    'Increases production of rice, wheat, pulses, coarse cereals through improved seeds and practices.',
    'बेहतर बीज और तकनीकों के माध्यम से चावल, गेहूं, दालों, मोटे अनाज का उत्पादन बढ़ाता है।',
    'Subsidized certified seeds, integrated nutrient management, and farm mechanization support.',
    'सब्सिडी वाले प्रमाणित बीज, एकीकृत पोषक तत्व प्रबंधन और कृषि मशीनीकरण सहायता।',
    'https://nfsm.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Contact Agriculture Dept', 'कृषि विभाग से संपर्क करें', 'Contact your block agriculture officer for registration.', 'पंजीकरण के लिए अपने ब्लॉक कृषि अधिकारी से संपर्क करें।', 'Offline'),
    (sid, 2, 'Get Subsidized Seeds', 'सब्सिडी वाले बीज प्राप्त करें', 'Receive subsidized high-yield variety seeds for sowing.', 'बुआई के लिए सब्सिडी वाले उच्च-उपज किस्म के बीज प्राप्त करें।', 'Offline'),
    (sid, 3, 'Follow Practices', 'तकनीकों का पालन करें', 'Follow recommended agronomic practices for higher yield.', 'अधिक उपज के लिए अनुशंसित कृषि तकनीकों का पालन करें।', 'Offline');

-- 17. Rashtriya Krishi Vikas Yojana (RKVY)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('rkvy', 'Rashtriya Krishi Vikas Yojana', 'राष्ट्रीय कृषि विकास योजना',
    'Incentivizes states to increase public investment in agriculture and allied sectors.',
    'कृषि और संबद्ध क्षेत्रों में सार्वजनिक निवेश बढ़ाने के लिए राज्यों को प्रोत्साहित करता है।',
    'Flexible funding to states for agriculture development, agri-startups (up to ₹25 lakh grants).',
    'कृषि विकास, एग्री-स्टार्टअप (₹25 लाख तक अनुदान) के लिए राज्यों को लचीला वित्त पोषण।',
    'https://rkvy.nic.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Business Plan/Project Report', 'व्यापार योजना/प्रोजेक्ट रिपोर्ट', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply via State Dept', 'राज्य विभाग से आवेदन करें', 'Apply through state agriculture department or RKVY-RAFTAAR portal.', 'राज्य कृषि विभाग या RKVY-RAFTAAR पोर्टल के माध्यम से आवेदन करें।', 'Online'),
    (sid, 2, 'Submit Plan', 'योजना जमा करें', 'Submit business plan or project proposal for agri-innovation.', 'कृषि-नवाचार के लिए व्यापार योजना या प्रोजेक्ट प्रस्ताव जमा करें।', 'Online'),
    (sid, 3, 'Incubation', 'इनक्यूबेशन', 'Selected agri-startups receive incubation support and funding.', 'चयनित एग्री-स्टार्टअप को इनक्यूबेशन सहायता और फंडिंग मिलती है।', 'Offline');

-- 18. Dairy Entrepreneurship Development Scheme
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('deds', 'Dairy Entrepreneurship Development Scheme', 'डेयरी उद्यमिता विकास योजना',
    'Provides subsidy and loan support for setting up small dairy units and milk processing.',
    'छोटी डेयरी इकाइयों और दूध प्रसंस्करण की स्थापना के लिए सब्सिडी और ऋण सहायता।',
    '25-33% subsidy on dairy units (up to 10 animals), milk processing, and cold chain infrastructure.',
    'डेयरी इकाइयों (10 पशुओं तक), दूध प्रसंस्करण और कोल्ड चेन बुनियादी ढांचे पर 25-33% सब्सिडी।',
    'https://dahd.nic.in', 'Ministry of Fisheries, Animal Husbandry & Dairying', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 2),
    (sid, 'Project Report', 'प्रोजेक्ट रिपोर्ट', true, 3),
    (sid, 'Land/Shed Availability', 'भूमि/शेड उपलब्धता', true, 4);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply at NABARD Bank', 'NABARD बैंक में आवेदन करें', 'Apply at any NABARD-affiliated commercial or cooperative bank.', 'किसी भी NABARD-संबद्ध वाणिज्यिक या सहकारी बैंक में आवेदन करें।', 'Offline'),
    (sid, 2, 'Submit Project Report', 'प्रोजेक्ट रिपोर्ट जमा करें', 'Submit detailed project report for dairy unit setup.', 'डेयरी इकाई स्थापना के लिए विस्तृत प्रोजेक्ट रिपोर्ट जमा करें।', 'Offline'),
    (sid, 3, 'Get Loan + Subsidy', 'ऋण + सब्सिडी प्राप्त करें', 'Bank disburses loan; NABARD releases back-end subsidy.', 'बैंक ऋण देता है; NABARD बैक-एंड सब्सिडी जारी करता है।', 'Offline');

-- 19. National Horticulture Mission
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('nhm', 'National Horticulture Mission', 'राष्ट्रीय बागवानी मिशन',
    'Promotes holistic development of horticulture sector including fruits, vegetables, spices and flowers.',
    'फल, सब्जियां, मसाले और फूलों सहित बागवानी क्षेत्र के समग्र विकास को बढ़ावा देता है।',
    'Subsidy for planting material, drip irrigation, protected cultivation (polyhouse/shadenet), and cold storage.',
    'रोपण सामग्री, ड्रिप सिंचाई, संरक्षित खेती (पॉलीहाउस/शेडनेट) और कोल्ड स्टोरेज पर सब्सिडी।',
    'https://nhm.nic.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural','Urban'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Ownership/Lease Documents', 'भूमि स्वामित्व/लीज़ दस्तावेज़', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Apply at Horticulture Dept', 'बागवानी विभाग में आवेदन करें', 'Apply through state horticulture department.', 'राज्य बागवानी विभाग के माध्यम से आवेदन करें।', 'Offline'),
    (sid, 2, 'Get Approval', 'स्वीकृति प्राप्त करें', 'Application verified and subsidy approved by district committee.', 'आवेदन सत्यापित और जिला समिति द्वारा सब्सिडी स्वीकृत।', 'Offline'),
    (sid, 3, 'Implement & Claim', 'कार्यान्वयन और दावा करें', 'Set up plantation/polyhouse and submit bills for subsidy reimbursement.', 'बागान/पॉलीहाउस स्थापित करें और सब्सिडी प्रतिपूर्ति के लिए बिल जमा करें।', 'Offline');

-- 20. PM Annadata Aay Sanrakshan Abhiyan (PM-AASHA)
INSERT INTO schemes (code, name_en, name_hi, summary_en, summary_hi, benefits_en, benefits_hi, official_url, nodal_ministry, category_id)
VALUES ('pm-aasha', 'PM Annadata Aay Sanrakshan Abhiyan', 'पीएम अन्नदाता आय संरक्षण अभियान',
    'Ensures MSP to farmers through price support, deficiency payment and procurement operations.',
    'मूल्य समर्थन, कमी भुगतान और खरीद संचालन के माध्यम से किसानों को MSP सुनिश्चित करता है।',
    'Government procures at MSP if market price falls below. Covers pulses, oilseeds and copra.',
    'यदि बाजार मूल्य MSP से नीचे गिरता है तो सरकार MSP पर खरीद करती है। दालें, तिलहन और कोपरा शामिल।',
    'https://farmer.gov.in', 'Ministry of Agriculture & Farmers Welfare', cat_farmers)
RETURNING id INTO sid;
INSERT INTO scheme_eligibility_criteria (scheme_id, min_age, max_age, max_annual_income, max_landholding_hectares, allowed_occupations, allowed_genders, allowed_areas, caste_categories)
VALUES (sid, 18, 120, NULL, NULL, ARRAY['Farmer'], ARRAY['Male','Female','Other'], ARRAY['Rural'], ARRAY['General','OBC','SC','ST','EWS']);
INSERT INTO scheme_documents (scheme_id, document_name_en, document_name_hi, is_mandatory, display_order) VALUES
    (sid, 'Aadhaar Card', 'आधार कार्ड', true, 1),
    (sid, 'Land Records', 'भूमि रिकॉर्ड', true, 2),
    (sid, 'Bank Account Details', 'बैंक खाता विवरण', true, 3);
INSERT INTO scheme_steps (scheme_id, step_number, title_en, title_hi, description_en, description_hi, channel) VALUES
    (sid, 1, 'Register on Portal', 'पोर्टल पर पंजीकरण करें', 'Register on state procurement portal during MSP procurement season.', 'MSP खरीद सीज़न के दौरान राज्य खरीद पोर्टल पर पंजीकरण करें।', 'Online'),
    (sid, 2, 'Bring Produce to Mandi', 'उपज मंडी में लाएं', 'Bring your produce to designated APMC mandi for procurement.', 'खरीद के लिए अपनी उपज निर्धारित APMC मंडी में लाएं।', 'Offline'),
    (sid, 3, 'Receive MSP Payment', 'MSP भुगतान प्राप्त करें', 'After quality check, MSP amount credited to bank account.', 'गुणवत्ता जांच के बाद, MSP राशि बैंक खाते में जमा।', 'Offline');

