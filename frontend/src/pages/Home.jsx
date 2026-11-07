import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import AudioButton from '../components/common/AudioButton';
import CountUp from '../components/common/CountUp';

export default function Home({ onStart, onBrowse, language }) {
  const audioIntro = language === 'hi'
    ? 'नमस्ते! योजना साथी में आपका स्वागत है। आप बिना किसी फॉर्म या लॉगिन के केवल चार आसान सवालों के जवाब देकर अपनी सरकारी योजना पात्रता जांच सकते हैं। शुरू करने के लिए नीचे दिए गए बटन को दबाएं।'
    : 'Welcome to SchemeSathi. Discover verified government welfare schemes you qualify for by answering just four simple questions. No forms or login required. Tap the start button below to begin.';

  return (
    <div className="space-y-16 sm:space-y-20 py-4 max-w-5xl mx-auto">
      
      {/* ───────────────────────────────────────────────────────────
          1. HERO SECTION: Mercury / Cal.com Monochrome Focus
          ─────────────────────────────────────────────────────────── */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8 animate-fade-in">
        
        {/* Subtle, Understated Trust Tag with 6px Solid Emerald Dot */}
        <div className="inline-flex items-center gap-2 bg-[#F2F2F4] border border-[#E4E4E7] px-3.5 py-1 rounded-full text-xs font-mono text-zinc-600 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block shrink-0" />
          <span className="font-medium">
            {language === 'hi' ? '3 मुख्य केंद्रीय योजनाएं सत्यापित' : '3 Verified Central Schemes'}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="text-zinc-500 uppercase tracking-wider text-[11px]">
            {language === 'hi' ? 'ऑडिट: Nov 2026' : 'Audit: Nov 2026'}
          </span>
        </div>

        {/* Display Headline: Solid #141417 (No Two-Tone Blue/Black Clichés), 600 SemiBold */}
        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-semibold text-[#141417] leading-[1.32] tracking-[-0.015em] hindi-headline">
          {language === 'hi' ? (
            <>
              सरकारी योजनाओं की सही जानकारी,<br />
              अब एक-एक आसान सवाल में।
            </>
          ) : (
            <>
              Find Government Schemes You Qualify For—<br />
              One Simple Question at a Time.
            </>
          )}
        </h1>

        {/* Calm Plain-Language Subtitle */}
        <p className="text-[#63636E] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto hindi-body">
          {language === 'hi'
            ? 'कोई लंबा फॉर्म नहीं, कोई लॉगिन नहीं। हम आपसे एक समय में सिर्फ एक सवाल पूछते हैं — आप बोलकर या छूकर जवाब दे सकते हैं।'
            : 'No bureaucratic forms, no login needed. Answer simple prompts one by one with voice or tap, verified against official rules.'}
        </p>

        {/* Two Actions on ONE Horizontal Row (Cal.com / 21st.dev Standard) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-[#141417] hover:bg-[#27272D] text-white font-medium text-sm sm:text-base shadow-xs transition-all duration-150 active:scale-[0.985] inline-flex items-center justify-center gap-2.5 focus:outline-hidden"
          >
            <span>{language === 'hi' ? 'पात्रता जांच शुरू करें' : 'Check Your Eligibility'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <AudioButton
            textToSpeak={audioIntro}
            label={language === 'hi' ? 'बोलकर समझें' : 'Audio Guide'}
            language={language}
            className="w-full sm:w-auto"
          />
        </div>

        {/* Quiet Horizontal Metadata Row with 4px Zinc Dots */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium pt-1">
          <span>{language === 'hi' ? '⏱️ केवल 1 मिनट' : '⏱️ 1 minute'}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span>{language === 'hi' ? '4 आसान सवाल' : '4 simple questions'}</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span>{language === 'hi' ? 'कोई दस्तावेज़ अपलोड नहीं' : 'Zero uploads'}</span>
        </div>

        {/* ───────────────────────────────────────────────────────────
            Section 3: पात्रता जांच पूर्वावलोकन (Mercury Double-Bezel Frame)
            ─────────────────────────────────────────────────────────── */}
        <div className="pt-6 max-w-xl mx-auto">
          {/* Recessed Well Bezel Frame: 6px padding */}
          <div className="p-1.5 bg-[#F2F2F4] border border-[#E4E4E7] rounded-2xl shadow-2xs">
            <div className="bg-white rounded-xl border border-zinc-200/70 p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-left space-y-4">
              
              {/* 4-Segment Progress Header (Zero AI Sparkles) */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
                  <span className="font-hindi">
                    {language === 'hi' ? 'लाइव पात्रता पूर्वावलोकन' : 'Live Question Preview'}
                  </span>
                </div>

                {/* 4-Segment Micro Progress Track: [▬][▭][▭][▭] */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" aria-label="Step 1 of 4">
                    <span className="w-4 h-1 rounded-full bg-[#141417]" />
                    <span className="w-4 h-1 rounded-full bg-zinc-200" />
                    <span className="w-4 h-1 rounded-full bg-zinc-200" />
                    <span className="w-4 h-1 rounded-full bg-zinc-200" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-zinc-400">01 / 04</span>
                </div>
              </div>

              {/* Question Headline */}
              <div className="space-y-0.5">
                <div className="font-semibold text-base sm:text-lg text-[#141417] font-hindi leading-snug">
                  {language === 'hi'
                    ? 'क्या आपके या आपके परिवार के नाम पर खेती योग्य भूमि है?'
                    : 'Do you or your family own cultivable agricultural land?'}
                </div>
                <div className="text-xs text-zinc-500 font-medium">
                  {language === 'hi'
                    ? 'Do you or your family own cultivable agricultural land?'
                    : 'Select your landholding status'}
                </div>
              </div>

              {/* Cult UI Keycap Option Rows with Gliding Arrow */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={onStart}
                  className="w-full text-left bg-white hover:bg-[#F4F4F6] border border-zinc-200 hover:border-[#141417] rounded-lg p-3.5 flex items-center justify-between group transition-all duration-150 active:scale-[0.99] focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span className="keycap-badge shrink-0">1</span>
                    <span className="text-sm font-semibold text-[#141417] font-hindi">
                      {language === 'hi' ? 'हाँ, खेती योग्य भूमि है' : 'Yes, have cultivable land'}
                    </span>
                  </div>
                  <span className="text-zinc-400 group-hover:text-[#141417] group-hover:translate-x-1 transition-all duration-150 font-mono text-sm">
                    ➔
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onStart}
                  className="w-full text-left bg-white hover:bg-[#F4F4F6] border border-zinc-200 hover:border-[#141417] rounded-lg p-3.5 flex items-center justify-between group transition-all duration-150 active:scale-[0.99] focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span className="keycap-badge shrink-0">2</span>
                    <span className="text-sm font-semibold text-[#141417] font-hindi">
                      {language === 'hi' ? 'नहीं, भूमि नहीं है' : 'No cultivable land'}
                    </span>
                  </div>
                  <span className="text-zinc-400 group-hover:text-[#141417] group-hover:translate-x-1 transition-all duration-150 font-mono text-sm">
                    ➔
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-zinc-400 text-center font-medium pt-1">
                {language === 'hi'
                  ? 'किसी भी विकल्प पर क्लिक करके तुरंत पूरी 4-सवालों की जांच शुरू करें'
                  : 'Click any option to begin the complete 4-question check'}
              </p>

            </div>
          </div>
        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          4. SYMMETRIC 3-COLUMN SWISS BENTO GRID: Verified Schemes
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#141417] font-hindi">
              {language === 'hi' ? 'आज जांची जाने वाली योजनाएं' : 'Featured Verified Schemes'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टलों से सीधे सत्यापित नियम' : 'Deterministic rules grounded in official central guidelines'}
            </p>
          </div>

          <button
            type="button"
            onClick={onBrowse}
            className="text-xs sm:text-sm font-semibold text-[#141417] hover:underline"
          >
            {language === 'hi' ? 'विस्तार से देखें →' : 'View all →'}
          </button>
        </div>

        {/* Symmetric 3-Column Swiss Layout: Exact Shared Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: PM-KISAN */}
          <div className="tactile-card rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Top Metadata Row */}
              <div className="flex items-center justify-between">
                <span className="bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-zinc-200/60 font-hindi">
                  {language === 'hi' ? 'किसान कल्याण' : 'Farmer Support'}
                </span>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors"
                >
                  <span>pmkisan.gov.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Hero Benefit Figure */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#141417] metric-tabular">
                  <CountUp end={6000} prefix="₹" duration={650} />{' '}
                  <span className="text-xs font-medium text-zinc-400 font-sans">
                    {language === 'hi' ? '/ प्रति वर्ष' : '/ year'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#141417] font-hindi leading-snug">
                  {language === 'hi' ? 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)' : 'PM Kisan Samman Nidhi'}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'खेती योग्य भूमि वाले पात्र किसान परिवारों को हर वर्ष ₹6,000 की सीधी आर्थिक सहायता, ₹2,000 की 3 समान किस्तों में DBT द्वारा।'
                  : 'Direct income support of ₹6,000 per year transferred in 3 equal installments to landholding farmer families.'}
              </p>
            </div>

            {/* Bottom Hairline Divider + Stripe-style Status Chips */}
            <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-sans font-medium">
                  {language === 'hi' ? 'DBT सीधे बैंक खाते में' : 'DBT direct bank transfer'}
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                कृषि एवं किसान कल्याण मंत्रालय
              </div>
            </div>
          </div>

          {/* Card 2: PMAY-G */}
          <div className="tactile-card rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Top Metadata Row */}
              <div className="flex items-center justify-between">
                <span className="bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-zinc-200/60 font-hindi">
                  {language === 'hi' ? 'ग्रामीण आवास' : 'Rural Housing'}
                </span>
                <a
                  href="https://pmayg.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors"
                >
                  <span>pmayg.nic.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Hero Benefit Figure */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#141417] metric-tabular">
                  ₹1.20–1.30{' '}
                  <span className="text-xs font-medium text-zinc-400 font-sans">
                    {language === 'hi' ? 'लाख अनुदान' : 'Lakh Grant'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#141417] font-hindi leading-snug">
                  {language === 'hi' ? 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)' : 'PM Awas Yojana (Gramin)'}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'कच्चे मकानों या बेघर ग्रामीण परिवारों को पक्का मकान निर्माण हेतु ₹1.20 से ₹1.30 लाख की वित्तीय सहायता + 90 दिन मनरेगा मजदूरी।'
                  : 'Grant of ₹1.20 to ₹1.30 Lakh + 90 days MGNREGA wages for building a pucca house for homeless or kutcha households.'}
              </p>
            </div>

            {/* Bottom Hairline Divider + Stripe-style Status Chips */}
            <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-sans font-medium">
                  {language === 'hi' ? 'पक्का मकान + 90 दिन मनरेगा' : 'Pucca House + MGNREGA'}
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                ग्रामीण विकास मंत्रालय
              </div>
            </div>
          </div>

          {/* Card 3: PM-JAY */}
          <div className="tactile-card rounded-xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Top Metadata Row */}
              <div className="flex items-center justify-between">
                <span className="bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-md text-[11px] font-medium border border-zinc-200/60 font-hindi">
                  {language === 'hi' ? 'स्वास्थ्य सुरक्षा' : 'Free Healthcare'}
                </span>
                <a
                  href="https://pmjay.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors"
                >
                  <span>pmjay.gov.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Hero Benefit Figure */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#141417] metric-tabular">
                  <CountUp end={500000} prefix="₹" duration={750} />{' '}
                  <span className="text-xs font-medium text-zinc-400 font-sans">
                    {language === 'hi' ? '/ परिवार / वर्ष' : '/ family / yr'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#141417] font-hindi leading-snug">
                  {language === 'hi' ? 'आयुष्मान भारत (PM-JAY)' : 'Ayushman Bharat PM-JAY'}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'देश भर के 27,000+ अस्पतालों में गंभीर बीमारियों के उपचार हेतु ₹5 लाख तक का पूर्णतः कैशलेस और निशुल्क इलाज।'
                  : 'Cashless hospital treatment up to ₹5 Lakh per family per year in over 27,000 empanelled hospitals across India.'}
              </p>
            </div>

            {/* Bottom Hairline Divider + Stripe-style Status Chips */}
            <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/70 border border-emerald-200/60 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-sans font-medium">
                  {language === 'hi' ? '27,000+ अस्पतालों में कैशलेस' : '27,000+ Cashless Hospitals'}
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                National Health Authority (NHA)
              </div>
            </div>
          </div>

        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          5. HOW IT WORKS: Unified 3-Column Swiss Architectural Container
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-lg sm:text-xl text-[#141417] font-hindi">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500">
            {language === 'hi' ? 'नागरिकों और ग्राम स्तर के संचालकों के लिए 3 चरणों की पारदर्शी प्रक्रिया' : 'A calm, 3-step deterministic process for citizens and kiosk operators'}
          </p>
        </div>

        {/* Single Architectural Container with Swiss Grid Corner Crosshairs */}
        <div className="relative">
          <span className="absolute -top-1.5 -left-1.5 text-zinc-300 font-mono text-xs select-none leading-none z-10" aria-hidden="true">+</span>
          <span className="absolute -top-1.5 -right-1.5 text-zinc-300 font-mono text-xs select-none leading-none z-10" aria-hidden="true">+</span>
          <span className="absolute -bottom-1.5 -left-1.5 text-zinc-300 font-mono text-xs select-none leading-none z-10" aria-hidden="true">+</span>
          <span className="absolute -bottom-1.5 -right-1.5 text-zinc-300 font-mono text-xs select-none leading-none z-10" aria-hidden="true">+</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200 rounded-xl bg-white overflow-hidden shadow-2xs">
          
          {/* Step 1 */}
          <div className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider block">
                01
              </span>
              <h4 className="font-semibold text-[#141417] text-base font-hindi">
                {language === 'hi' ? '1-1 सवाल का जवाब दें' : 'One Question at a Time'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'बोलकर या छूकर आसान सवालों के जवाब दें। कोई भ्रम नहीं, कोई कठिन फॉर्म या दस्तावेज अपलोड नहीं।'
                  : 'Answer simple prompts one by one with voice or tap without complicated bureaucratic jargon.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
              <span>{language === 'hi' ? 'आवाज या स्पर्श इनपुट' : 'Voice or Touch'}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider block">
                02
              </span>
              <h4 className="font-semibold text-[#141417] text-base font-hindi">
                {language === 'hi' ? 'सटीक नियम मिलान' : 'Deterministic Rule Match'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'हमारा नियम इंजन सरकारी राजपत्र की शर्तों का 100% सटीक मिलान करता है, बिना किसी अनुमान या AI भ्रम के।'
                  : 'Exact verification against official government criteria without probabilistic guessing.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-800 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{language === 'hi' ? '100% नियम आधारित' : '100% Rule Verified'}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider block">
                03
              </span>
              <h4 className="font-semibold text-[#141417] text-base font-hindi">
                {language === 'hi' ? 'CSC पर्ची प्राप्त करें' : 'Print Your Kiosk Slip'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'कागजात की सूची वाली 1-पेज पर्ची प्रिंट करें और सीधे अपने नजदीकी जन सेवा केंद्र ले जाएं।'
                  : 'Get a clean 1-page paper slip with matched schemes and required documents.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-zinc-500 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
              <span>{language === 'hi' ? 'कागजात चेकलिस्ट रसीद' : '1-Page Document Slip'}</span>
            </div>
          </div>

        </div>
        </div>
      </section>

    </div>
  );
}
