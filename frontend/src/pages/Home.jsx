import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';
import AudioButton from '../components/common/AudioButton';
import CountUp from '../components/common/CountUp';
import { VERIFIED_SCHEMES } from '../data/schemesData';

export default function Home({ onStart, onBrowse, language }) {
  const audioIntro = language === 'hi'
    ? 'नमस्ते! योजना साथी में आपका स्वागत है। आप बिना किसी फॉर्म या लॉगिन के केवल चार आसान सवालों के जवाब देकर अपनी सरकारी योजना पात्रता जांच सकते हैं। शुरू करने के लिए नीचे दिए गए नीले बटन को दबाएं।'
    : 'Welcome to SchemeSathi. Discover verified government welfare schemes you qualify for by answering just four simple questions. No forms or login required. Tap the start button below to begin.';

  return (
    <div className="space-y-12 sm:space-y-16 py-4">
      
      {/* ───────────────────────────────────────────────────────────
          1. HERO SECTION: Radical Clarity, Negative Space & Focus
          ─────────────────────────────────────────────────────────── */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4 sm:pt-8 animate-fade-in">
        
        {/* Subtle trust tag with Live Pulsing Emerald Dot */}
        <div className="inline-flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <ShieldCheck className="w-4 h-4 text-[#004B87]" />
          <span>{language === 'hi' ? '3 मुख्य केंद्रीय योजनाएं सत्यापित' : '3 Verified Central Schemes'}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 font-mono text-[11px]">{language === 'hi' ? 'ऑडिट: Nov 2026' : 'Audit: Nov 2026'}</span>
        </div>

        {/* Display Headline (Tight Tracking + Apple Display Hierarchy) */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] display-heading">
          {language === 'hi' ? (
            <>
              सरकारी योजनाओं की सही जानकारी, <br />
              <span className="text-[#004B87]">अब एक-एक आसान सवाल में।</span>
            </>
          ) : (
            <>
              Find Government Schemes You Qualify For— <br />
              <span className="text-[#004B87]">One Simple Question at a Time.</span>
            </>
          )}
        </h1>

        {/* Calm Plain-Language Subtitle */}
        <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto hindi-body">
          {language === 'hi'
            ? 'कोई लंबा फॉर्म नहीं, कोई लॉगिन नहीं। हम आपसे एक समय में सिर्फ एक सवाल पूछते हैं — आप बोलकर या छूकर जवाब दे सकते हैं।'
            : 'No bureaucratic forms, no login needed. Answer simple prompts one by one with voice or tap, verified against official rules.'}
        </p>

        {/* Dominant Primary Action CTA with Spring Press */}
        <div className="pt-2 space-y-3">
          <button
            type="button"
            onClick={onStart}
            className="group min-h-[56px] px-8 py-4 rounded-2xl bg-[#004B87] hover:bg-[#002D54] text-white font-extrabold text-lg sm:text-xl shadow-cta hover:shadow-cta-hover spring-press inline-flex items-center justify-center gap-3 focus:outline-hidden focus:ring-4 focus:ring-blue-100"
          >
            <span>{language === 'hi' ? 'पात्रता जांच शुरू करें' : 'Check Your Eligibility'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <p className="text-xs text-slate-400 font-medium">
            {language === 'hi' ? '⏱️ केवल 1 मिनट · 4 आसान सवाल · कोई दस्तावेज़ अपलोड नहीं' : '⏱️ Takes 1 minute · 4 simple questions · Zero document uploads'}
          </p>
        </div>

        {/* Ambient Audio Pill */}
        <div className="pt-1 flex justify-center">
          <AudioButton
            textToSpeak={audioIntro}
            label={language === 'hi' ? 'बोलकर समझें (Audio Guide)' : 'Audio Guide'}
            language={language}
          />
        </div>

        {/* Live 1-Click Interactive Question Preview Card */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="bg-gradient-to-b from-blue-50/70 to-white hairline-border rounded-2xl p-5 text-left space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-[#004B87]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पात्रता जांच पूर्वावलोकन' : 'Live Question Preview'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">1 / 4 सवाल</span>
            </div>

            <div className="font-bold text-slate-900 text-sm sm:text-base font-hindi leading-snug">
              {language === 'hi'
                ? 'क्या आपके या आपके परिवार के नाम पर खेती योग्य भूमि है?'
                : 'Do you or your family own cultivable agricultural land?'}
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={onStart}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#004B87] hover:bg-blue-50/50 text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-between group transition-all spring-press"
              >
                <span>{language === 'hi' ? 'हाँ, जमीन है' : 'Yes, have land'}</span>
                <span className="text-slate-400 group-hover:text-[#004B87] transition-colors">➔</span>
              </button>
              <button
                type="button"
                onClick={onStart}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-[#004B87] hover:bg-blue-50/50 text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-between group transition-all spring-press"
              >
                <span>{language === 'hi' ? 'नहीं, जमीन नहीं है' : 'No land'}</span>
                <span className="text-slate-400 group-hover:text-[#004B87] transition-colors">➔</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              {language === 'hi' ? 'किसी भी विकल्प को दबाकर तुरंत जांच शुरू करें' : 'Tap any option to start full instant check'}
            </p>
          </div>
        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          2. THE CLEAN BENTO GRID: 3 Verified Schemes (Linear/Wise)
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-hindi">
              {language === 'hi' ? 'आज जांची जाने वाली योजनाएं' : 'Featured Verified Schemes'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टलों से सीधे सत्यापित नियम' : 'Eligibility rules verified against official ministry portals'}
            </p>
          </div>

          <button
            type="button"
            onClick={onBrowse}
            className="text-xs sm:text-sm font-bold text-[#004B87] hover:underline"
          >
            {language === 'hi' ? 'विस्तार से देखें →' : 'View all →'}
          </button>
        </div>

        {/* 2 + 1 Asymmetric Bento Layout with distinct top-border accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Card 1: PM-KISAN (Emerald Accent) */}
          <div className="bg-white hairline-border border-t-4 border-t-emerald-600 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card hover:shadow-card-hover tactile-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  {language === 'hi' ? 'किसान कल्याण' : 'Farmer Support'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">pmkisan.gov.in</span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 metric-tabular">
                  <CountUp end={6000} prefix="₹" duration={700} /> <span className="text-base sm:text-lg font-semibold text-slate-400">/ वर्ष</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-hindi">
                  {language === 'hi' ? 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)' : 'PM Kisan Samman Nidhi'}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'खेती योग्य भूमि वाले पात्र किसान परिवारों को हर वर्ष ₹6,000 की सीधी आर्थिक सहायता (₹2,000 की 3 समान किस्तों में DBT द्वारा)।'
                  : 'Direct income support of ₹6,000 per year transferred in 3 equal installments to landholding farmer families.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
              कृषि एवं किसान कल्याण मंत्रालय · DBT सीधे बैंक खाते में
            </div>
          </div>

          {/* Card 2: PMAY-G (Amber Accent) */}
          <div className="bg-white hairline-border border-t-4 border-t-amber-500 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card hover:shadow-card-hover tactile-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  {language === 'hi' ? 'ग्रामीण आवास' : 'Rural Housing'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">pmayg.nic.in</span>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 metric-tabular">
                  ₹1.20 – ₹1.30 <span className="text-base sm:text-lg font-semibold text-slate-400">लाख</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-hindi">
                  {language === 'hi' ? 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)' : 'PM Awas Yojana (Gramin)'}
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'कच्चे मकानों या बेघर ग्रामीण परिवारों को पक्का मकान निर्माण हेतु ₹1.20 से ₹1.30 लाख की वित्तीय सहायता + 90 दिन मनरेगा मजदूरी।'
                  : 'Grant of ₹1.20 to ₹1.30 Lakh + 90 days MGNREGA wages for building a pucca house for homeless or kutcha households.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
              ग्रामीण विकास मंत्रालय · केंद्र + राज्य संयुक्त
            </div>
          </div>

          {/* Wide Anchor Card: Ayushman Bharat (Civic Navy Accent) */}
          <div className="md:col-span-2 bg-white hairline-border border-t-4 border-t-[#004B87] rounded-3xl p-6 sm:p-8 space-y-5 shadow-card hover:shadow-card-hover tactile-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {language === 'hi' ? 'मुफ्त स्वास्थ्य सुरक्षा' : 'Free Healthcare'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">pmjay.gov.in</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 metric-tabular">
                  <CountUp end={500000} prefix="₹" duration={800} /> <span className="text-base sm:text-lg font-semibold text-slate-400">/ प्रति परिवार प्रति वर्ष</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-hindi">
                  {language === 'hi' ? 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (PM-JAY)' : 'Ayushman Bharat PM-JAY'}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'देश भर के 27,000 से अधिक सूचीबद्ध सरकारी और निजी अस्पतालों में गंभीर बीमारियों के लिए ₹5 लाख तक का पूरी तरह कैशलेस और मुफ्त इलाज।'
                    : 'Cashless hospital treatment up to ₹5 Lakh per family per year in over 27,000 empanelled hospitals across India.'}
                </p>
              </div>

              {/* Audited criteria pill list with verified badges */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'पात्रता आधार (सत्यापित शर्तें):' : 'Audited Criteria:'}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200/70 px-2.5 py-1.5 rounded-lg font-medium shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{language === 'hi' ? 'SECC 2011 सामाजिक-आर्थिक वंचित परिवार' : 'SECC 2011 deprived families'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200/70 px-2.5 py-1.5 rounded-lg font-medium shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{language === 'hi' ? 'सक्रिय राशन कार्ड (NFSA) धारक' : 'Active Ration Card (NFSA) holders'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200/70 px-2.5 py-1.5 rounded-lg font-medium shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{language === 'hi' ? 'परिवार में कोई आयकर दाता नहीं' : 'No income taxpayer in family'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
              स्वास्थ्य एवं परिवार कल्याण मंत्रालय / National Health Authority (NHA)
            </div>
          </div>

        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          3. HOW IT WORKS: 3 Modular Cards + Animated Pipeline Beam
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6 pt-2">
        <div className="text-center space-y-1">
          <h3 className="font-bold text-xl sm:text-2xl text-slate-900 font-hindi">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' ? 'नागरिकों और ग्राम स्तर के संचालकों के लिए 3 चरणों की पारदर्शी प्रक्रिया' : '3-step transparent pipeline for citizens and kiosk operators'}
          </p>
        </div>

        {/* Structured 3 Cards with Animated Connecting Beam */}
        <div className="relative">
          
          {/* Horizontal Animated Beam Connector (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-0.5 bg-slate-200 overflow-hidden z-0" aria-hidden="true">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-[#004B87] to-transparent animate-beam-travel" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            
            {/* Step 1 */}
            <div className="bg-white hairline-border rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover tactile-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#004B87] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-lg font-hindi">
                  {language === 'hi' ? '1-1 सवाल का जवाब दें' : 'One Question at a Time'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'बोलकर या छूकर आसान सवालों के जवाब दें। कोई भ्रम नहीं, कोई कठिन फॉर्म या दस्तावेज नहीं।'
                    : 'Answer simple prompts with voice or tap without complicated bureaucratic jargon.'}
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#004B87] font-semibold pt-2 border-t border-slate-100">
                ● {language === 'hi' ? 'आवाज या स्पर्श इनपुट' : 'Voice / Touch Input'}
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white hairline-border rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover tactile-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#004B87] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-lg font-hindi">
                  {language === 'hi' ? 'सटीक नियम मिलान' : 'Deterministic Rule Match'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'हमारा नियम इंजन सरकारी राजपत्र की शर्तों का 100% सटीक मिलान करता है, बिना किसी अनुमान के।'
                    : 'Exact verification against official government criteria without probabilistic guessing.'}
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold pt-2 border-t border-slate-100">
                ✓ {language === 'hi' ? '100% नियम आधारित' : '100% Rule Audited'}
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white hairline-border rounded-3xl p-6 sm:p-7 shadow-card hover:shadow-card-hover tactile-card space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#004B87] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-lg font-hindi">
                  {language === 'hi' ? 'CSC पर्ची प्राप्त करें' : 'Print Your Kiosk Slip'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'कागजात की सूची वाली 1-पेज पर्ची प्रिंट करें और सीधे अपने नजदीकी जन सेवा केंद्र ले जाएं।'
                    : 'Get a clean 1-page paper slip with matched schemes and required documents.'}
                </p>
              </div>
              <div className="text-[11px] font-mono text-amber-700 font-semibold pt-2 border-t border-slate-100">
                📄 {language === 'hi' ? 'कागजात चेकलिस्ट रसीद' : 'Doc Checklist Slip'}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
