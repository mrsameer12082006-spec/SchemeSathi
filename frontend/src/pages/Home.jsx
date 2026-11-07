import React from 'react';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import AudioButton from '../components/common/AudioButton';
import CountUp from '../components/common/CountUp';

export default function Home({ onStart, onBrowse, language }) {
  const audioIntro = language === 'hi'
    ? 'नमस्ते! योजना साथी में आपका स्वागत है। आप बिना किसी फॉर्म या लॉगिन के केवल चार आसान सवालों के जवाब देकर अपनी सरकारी योजना पात्रता जांच सकते हैं। शुरू करने के लिए नीचे दिए गए बटन को दबाएं।'
    : 'Welcome to SchemeSathi. Discover verified government welfare schemes you qualify for by answering just four simple questions. No forms or login required. Tap the start button below to begin.';

  return (
    <div className="space-y-16 sm:space-y-20 py-4 max-w-5xl mx-auto">
      
      {/* ───────────────────────────────────────────────────────────
          1. HERO SECTION: Luminous Civic Trust & Clear Focus
          ─────────────────────────────────────────────────────────── */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8 animate-fade-in">
        
        {/* Luminous Trust Tag with Glowing Emerald Radar Dot */}
        <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200/90 px-4 py-1.5 rounded-full text-xs font-mono text-slate-700 shadow-xs shadow-slate-200/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-800 font-sans">
            {language === 'hi' ? '3 मुख्य केंद्रीय योजनाएं सत्यापित' : '3 Verified Central Schemes'}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-blue-700 font-semibold font-mono text-[11px] bg-blue-50 px-2 py-0.5 rounded-full">
            {language === 'hi' ? 'Nov 2026 ऑडिट' : 'Audit: Nov 2026'}
          </span>
        </div>

        {/* Display Headline: Bold, Dignified, High Contrast */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.24] tracking-tight hindi-headline">
          {language === 'hi' ? (
            <>
              सरकारी योजनाओं की सही जानकारी,<br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
                अब एक-एक आसान सवाल में।
              </span>
            </>
          ) : (
            <>
              Find Government Schemes You Qualify For—<br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
                One Simple Question at a Time.
              </span>
            </>
          )}
        </h1>

        {/* Warm Plain-Language Subtitle */}
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto hindi-body">
          {language === 'hi'
            ? 'कोई लंबा फॉर्म नहीं, कोई लॉगिन नहीं। हम आपसे एक समय में सिर्फ एक सवाल पूछते हैं — आप बोलकर या छूकर जवाब दे सकते हैं।'
            : 'No bureaucratic forms, no login needed. Answer simple prompts one by one with voice or tap, verified against official rules.'}
        </p>

        {/* Two Actions: Luminous Blue CTA + Audio Guide */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl btn-primary-glow font-semibold text-sm sm:text-base inline-flex items-center justify-center gap-2.5 active:scale-[0.985] group cursor-pointer"
          >
            <span>{language === 'hi' ? 'पात्रता जांच शुरू करें' : 'Check Your Eligibility'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <AudioButton
            textToSpeak={audioIntro}
            label={language === 'hi' ? 'बोलकर समझें' : 'Audio Guide'}
            language={language}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm sm:text-base border border-slate-200/90 shadow-2xs shadow-slate-200/50"
          />
        </div>

        {/* Impact Proof Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium pt-2">
          <span className="inline-flex items-center gap-1.5 bg-white/90 border border-slate-200/80 px-3 py-1 rounded-full text-slate-700 shadow-2xs">
            <span>⏱️</span>
            <span>{language === 'hi' ? 'केवल 1 मिनट' : '1 minute'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full text-emerald-800 shadow-2xs font-semibold">
            <span>✓</span>
            <span>{language === 'hi' ? '4 सरल सवाल' : '4 simple questions'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full text-blue-800 shadow-2xs font-semibold">
            <span>🛡️</span>
            <span>{language === 'hi' ? 'कोई दस्तावेज अपलोड नहीं' : 'Zero uploads'}</span>
          </span>
        </div>

        {/* ───────────────────────────────────────────────────────────
            Section 2: LIVE QUESTION PREVIEW (Interactive Showcase Card)
            ─────────────────────────────────────────────────────────── */}
        <div className="pt-6 max-w-xl mx-auto">
          <div className="p-1.5 bg-gradient-to-b from-blue-100/70 via-slate-100 to-indigo-100/50 border border-blue-200/70 rounded-2xl shadow-xl shadow-blue-500/5">
            <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-7 shadow-xs text-left space-y-5">
              
              {/* Live Indicator + Step 1 of 4 Pills */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="font-hindi font-bold text-slate-900">
                    {language === 'hi' ? 'लाइव पात्रता जांच पूर्वावलोकन' : 'Live Question Preview'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1" aria-label="Step 1 of 4">
                    <span className="w-5 h-1.5 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50" />
                    <span className="w-5 h-1.5 rounded-full bg-slate-200" />
                    <span className="w-5 h-1.5 rounded-full bg-slate-200" />
                    <span className="w-5 h-1.5 rounded-full bg-slate-200" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded">
                    01 / 04
                  </span>
                </div>
              </div>

              {/* Question Headline */}
              <div className="space-y-1">
                <div className="font-bold text-lg sm:text-xl text-slate-900 font-hindi leading-snug">
                  {language === 'hi'
                    ? 'क्या आपके या आपके परिवार के नाम पर खेती योग्य भूमि है?'
                    : 'Do you or your family own cultivable agricultural land?'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {language === 'hi'
                    ? 'Do you or your family own cultivable agricultural land?'
                    : 'Select your landholding status'}
                </div>
              </div>

              {/* Interactive Options with Vibrant Category Badges */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={onStart}
                  className="w-full text-left bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-500 rounded-xl p-4 flex items-center justify-between group transition-all duration-180 active:scale-[0.99] shadow-2xs hover:shadow-md hover:shadow-emerald-500/10 focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                      🌾
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-950 font-hindi block leading-snug">
                        {language === 'hi' ? 'हाँ, खेती योग्य भूमि है' : 'Yes, have cultivable land'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {language === 'hi' ? 'PM-KISAN ₹6,000 वार्षिक सहायता हेतु योग्य' : 'Eligible for PM-KISAN ₹6,000/yr'}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1.5 transition-all duration-150 font-mono text-base font-bold">
                    ➔
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onStart}
                  className="w-full text-left bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-500 rounded-xl p-4 flex items-center justify-between group transition-all duration-180 active:scale-[0.99] shadow-2xs hover:shadow-md hover:shadow-blue-500/10 focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
                      🏠
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-950 font-hindi block leading-snug">
                        {language === 'hi' ? 'नहीं, भूमि नहीं है' : 'No cultivable land'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {language === 'hi' ? 'PMAY-G ग्रामीण आवास व PM-JAY स्वास्थ्य सुरक्षा जांचें' : 'Check Housing & Health support'}
                      </span>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1.5 transition-all duration-150 font-mono text-base font-bold">
                    ➔
                  </span>
                </button>
              </div>

              <p className="text-xs text-blue-700 bg-blue-50/70 border border-blue-200/60 rounded-lg p-2.5 text-center font-medium">
                {language === 'hi'
                  ? '👆 किसी भी विकल्प पर क्लिक करके 1 मिनट में अपनी पात्रता जांचें'
                  : '👆 Click any option to begin the complete 1-minute check'}
              </p>

            </div>
          </div>
        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          3. FEATURED VERIFIED SCHEMES: Rich Bento Cards with Color Identity
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-hindi">
              {language === 'hi' ? 'आज जांची जाने वाली योजनाएं' : 'Featured Verified Schemes'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टलों से सीधे सत्यापित नियम' : 'Deterministic rules grounded in official central guidelines'}
            </p>
          </div>

          <button
            type="button"
            onClick={onBrowse}
            className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'hi' ? 'विस्तार से देखें' : 'View all'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3-Column Rich Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: PM-KISAN (Harvest Emerald Theme) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              
              {/* Top Accent Bar */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl -mt-6 -mx-6 sm:-mt-7 sm:-mx-7 mb-4" />

              {/* Top Metadata Row */}
              <div className="flex items-center justify-between">
                <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200/80 font-hindi flex items-center gap-1.5">
                  <span>🌾</span>
                  <span>{language === 'hi' ? 'किसान कल्याण' : 'Farmer Support'}</span>
                </span>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-slate-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                >
                  <span>pmkisan.gov.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Hero Benefit Figure */}
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950 metric-tabular">
                  <CountUp end={6000} prefix="₹" duration={650} />{' '}
                  <span className="text-xs font-bold text-emerald-700 font-sans">
                    {language === 'hi' ? '/ प्रति वर्ष' : '/ year'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-hindi leading-snug group-hover:text-emerald-900 transition-colors">
                  {language === 'hi' ? 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)' : 'PM Kisan Samman Nidhi'}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'खेती योग्य भूमि वाले पात्र किसान परिवारों को हर वर्ष ₹6,000 की सीधी आर्थिक सहायता, ₹2,000 की 3 समान किस्तों में DBT द्वारा।'
                  : 'Direct income support of ₹6,000 per year transferred in 3 equal installments to landholding farmer families.'}
              </p>
            </div>

            {/* Bottom Status Chip */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg font-sans font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>
                  {language === 'hi' ? 'DBT सीधे बैंक खाते में' : 'DBT direct bank transfer'}
                </span>
              </div>
              <div className="text-slate-400 text-[10px] pl-0.5">
                कृषि एवं किसान कल्याण मंत्रालय
              </div>
            </div>
          </div>

          {/* Card 2: PMAY-G (Warm Saffron / Amber Theme) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              
              {/* Top Accent Bar */}
              <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl -mt-6 -mx-6 sm:-mt-7 sm:-mx-7 mb-4" />

              {/* Top Metadata Row */}
              <div className="flex items-center justify-between">
                <span className="bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-200/80 font-hindi flex items-center gap-1.5">
                  <span>🏠</span>
                  <span>{language === 'hi' ? 'ग्रामीण आवास' : 'Rural Housing'}</span>
                </span>
                <a
                  href="https://pmayg.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-slate-400 hover:text-amber-800 flex items-center gap-1 transition-colors"
                >
                  <span>pmayg.nic.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Hero Benefit Figure */}
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-950 metric-tabular">
                  ₹1.20–1.30{' '}
                  <span className="text-xs font-bold text-amber-800 font-sans">
                    {language === 'hi' ? 'लाख अनुदान' : 'Lakh Grant'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-hindi leading-snug group-hover:text-amber-950 transition-colors">
                  {language === 'hi' ? 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)' : 'PM Awas Yojana (Gramin)'}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'कच्चे मकानों या बेघर ग्रामीण परिवारों को पक्का मकान निर्माण हेतु ₹1.20 से ₹1.30 लाख की वित्तीय सहायता + 90 दिन मनरेगा मजदूरी।'
                  : 'Grant of ₹1.20 to ₹1.30 Lakh + 90 days MGNREGA wages for building a pucca house for homeless or kutcha households.'}
              </p>
            </div>

            {/* Bottom Status Chip */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-lg font-sans font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                <span>
                  {language === 'hi' ? 'पक्का मकान + 90 दिन मनरेगा' : 'Pucca House + MGNREGA'}
                </span>
              </div>
              <div className="text-slate-400 text-[10px] pl-0.5">
                ग्रामीण विकास मंत्रालय
              </div>
            </div>
          </div>

          {/* Card 3: PM-JAY (Royal Azure / Sapphire Theme) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group">
            <div className="space-y-4">
              
              {/* Top Accent Bar */}
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl -mt-6 -mx-6 sm:-mt-7 sm:-mx-7 mb-4" />

              {/* Top Metadata Row */}
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs font-bold border border-blue-200/80 font-hindi flex items-center gap-1.5">
                  <span>🏥</span>
                  <span>{language === 'hi' ? 'स्वास्थ्य सुरक्षा' : 'Free Healthcare'}</span>
                </span>
                <a
                  href="https://pmjay.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-slate-400 hover:text-blue-700 flex items-center gap-1 transition-colors"
                >
                  <span>pmjay.gov.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Hero Benefit Figure */}
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-950 metric-tabular">
                  <CountUp end={500000} prefix="₹" duration={750} />{' '}
                  <span className="text-xs font-bold text-blue-700 font-sans">
                    {language === 'hi' ? '/ परिवार / वर्ष' : '/ family / yr'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-hindi leading-snug group-hover:text-blue-950 transition-colors">
                  {language === 'hi' ? 'आयुष्मान भारत (PM-JAY)' : 'Ayushman Bharat PM-JAY'}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'देश भर के 27,000+ अस्पतालों में गंभीर बीमारियों के उपचार हेतु ₹5 लाख तक का पूर्णतः कैशलेस और निशुल्क इलाज।'
                  : 'Cashless hospital treatment up to ₹5 Lakh per family per year in over 27,000 empanelled hospitals across India.'}
              </p>
            </div>

            {/* Bottom Status Chip */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-1.5 text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-1.5 rounded-lg font-sans font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>
                  {language === 'hi' ? '27,000+ अस्पतालों में कैशलेस' : '27,000+ Cashless Hospitals'}
                </span>
              </div>
              <div className="text-slate-400 text-[10px] pl-0.5">
                National Health Authority (NHA)
              </div>
            </div>
          </div>

        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          4. HOW IT WORKS: 3-Step Illustrated Flow
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="space-y-0.5">
          <h3 className="font-bold text-lg sm:text-2xl text-slate-900 font-hindi">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' ? 'नागरिकों और ग्राम स्तर के संचालकों के लिए 3 चरणों की पारदर्शी प्रक्रिया' : 'A calm, 3-step deterministic process for citizens and kiosk operators'}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Step 1 */}
          <div className="bg-white border border-blue-200/80 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-lg shadow-xs">
                  💬
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                  चरण 01
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base sm:text-lg font-hindi">
                {language === 'hi' ? '1-1 सवाल का जवाब दें' : 'One Question at a Time'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'बोलकर या छूकर आसान सवालों के जवाब दें। कोई भ्रम नहीं, कोई कठिन फॉर्म या दस्तावेज अपलोड नहीं।'
                  : 'Answer simple prompts one by one with voice or tap without complicated bureaucratic jargon.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-blue-700 pt-3 border-t border-slate-100 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span>{language === 'hi' ? 'आवाज या स्पर्श इनपुट' : 'Voice or Touch'}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-indigo-200/80 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-lg shadow-xs">
                  ⚡
                </div>
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                  चरण 02
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base sm:text-lg font-hindi">
                {language === 'hi' ? 'सटीक नियम मिलान' : 'Deterministic Rule Match'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'हमारा नियम इंजन सरकारी राजपत्र की शर्तों का 100% सटीक मिलान करता है, बिना किसी अनुमान या AI भ्रम के।'
                  : 'Exact verification against official government criteria without probabilistic guessing.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-800 pt-3 border-t border-slate-100 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{language === 'hi' ? '100% नियम आधारित' : '100% Rule Verified'}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-emerald-200/80 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-lg shadow-xs">
                  📄
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                  चरण 03
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base sm:text-lg font-hindi">
                {language === 'hi' ? 'CSC पर्ची प्राप्त करें' : 'Print Your Kiosk Slip'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'कागजात की सूची वाली 1-पेज पर्ची प्रिंट करें और सीधे अपने नजदीकी जन सेवा केंद्र ले जाएं।'
                  : 'Get a clean 1-page paper slip with matched schemes and required documents.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-800 pt-3 border-t border-slate-100 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{language === 'hi' ? 'कागजात चेकलिस्ट रसीद' : '1-Page Document Slip'}</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
