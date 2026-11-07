import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import CountUp from '../components/common/CountUp';
import { speakAudio, stopAudio } from '../services/api';

export default function Home({ onStart, onBrowse, language }) {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioIntro = language === 'hi'
    ? 'नमस्ते! योजना साथी में आपका स्वागत है। आप बिना किसी फॉर्म या लॉगिन के केवल चार आसान सवालों के जवाब देकर अपनी सरकारी योजना पात्रता जांच सकते हैं। शुरू करने के लिए नीचे दिए गए बटन को दबाएं।'
    : 'Welcome to SchemeSathi. Discover verified government welfare schemes you qualify for by answering just four simple questions. No forms or login required. Tap the start button below to begin.';

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      stopAudio();
      setIsAudioPlaying(false);
    } else {
      setIsAudioPlaying(true);
      speakAudio(audioIntro, language, {
        onStart: () => setIsAudioPlaying(true),
        onEnd: () => setIsAudioPlaying(false),
        onError: () => setIsAudioPlaying(false)
      });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      
      {/* ───────────────────────────────────────────────────────────
          1. ASYMMETRIC 2-COLUMN HERO & INTERACTIVE CONSOLE
          ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F7F6F2] text-[#0C0A09] border-y border-[#E5E3DC] -mx-4 sm:-mx-6 lg:-mx-8">
        
        {/* 1. Architectural Background Grid & Atmospheric Radial Orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#E5E3DC_1px,transparent_1px),linear-gradient(to_bottom,#E5E3DC_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_40%,transparent_100%)] opacity-45"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[6%] top-[8%] h-[440px] w-[440px] rounded-full bg-gradient-to-tr from-[#A7E5D3]/50 via-[#F4C5A8]/40 to-[#A8C8E8]/40 blur-3xl -z-0"
        />

        {/* Main Framed Container with Vertical Architectural Rails */}
        <div className="relative mx-auto max-w-7xl border-x border-[#E5E3DC] px-5 sm:px-8 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:gap-12 lg:grid-cols-12">
            
            {/* LEFT 6 COLUMNS: Editorial Pitch & Tactile Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Verified Audit Badge with Live Specular Ping Dot */}
              <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-[#292524] shadow-[0_2px_6px_rgba(12,10,9,0.05),0_0_0_1px_rgba(12,10,9,0.08)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]"></span>
                </span>
                <span className="font-hindi font-semibold text-zinc-800">
                  {language === 'hi' ? '3 मुख्य केंद्रीय योजनाएं सत्यापित' : '3 Verified Central Schemes'}
                </span>
                <span className="text-[#D6D3D1]">|</span>
                <span className="font-mono text-[11px] tracking-wider text-[#777169]">
                  {language === 'hi' ? 'ऑडिट: NOV 2026' : 'AUDIT: NOV 2026'}
                </span>
              </div>

              {/* Headline with Warm Mint Highlight Accent */}
              <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-semibold tracking-[-0.025em] leading-[1.2] text-[#0C0A09] font-hindi">
                {language === 'hi' ? (
                  <>
                    सरकारी योजनाओं की सही जानकारी,{' '}
                    <span className="relative inline-block whitespace-nowrap">
                      <span className="relative z-10">अब एक-एक आसान सवाल में।</span>
                      <span className="absolute bottom-1.5 left-0 -z-0 h-3 w-full bg-[#A7E5D3]/60 rounded-xs" />
                    </span>
                  </>
                ) : (
                  <>
                    Find Government Schemes You Qualify For—{' '}
                    <span className="relative inline-block">
                      <span className="relative z-10">One Simple Question at a Time.</span>
                      <span className="absolute bottom-1.5 left-0 -z-0 h-3 w-full bg-[#A7E5D3]/60 rounded-xs" />
                    </span>
                  </>
                )}
              </h1>

              {/* Plain Language Subtitle */}
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#57534E] font-hindi">
                {language === 'hi'
                  ? 'कोई लंबा फॉर्म नहीं, कोई लॉगिन नहीं। हम आपसे एक समय में सिर्फ एक सवाल पूछते हैं — आप बोलकर या छूकर तुरंत अपनी पात्रता और आवश्यक कागजात की पर्ची प्राप्त कर सकते हैं।'
                  : 'No bureaucratic forms, no login needed. Answer simple prompts one by one with voice or tap, verified against official rules.'}
              </p>

              {/* Tactile Action Row */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={onStart}
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-[#141413] px-6 py-3.5 text-sm sm:text-[15px] font-medium text-white shadow-[0_10px_20px_-5px_rgba(12,10,9,0.25),0_2px_0_0_#000000,inset_0_1px_0_0_rgba(255,255,255,0.18)] transition-all duration-150 hover:bg-[#292524] active:translate-y-[1px] focus:outline-hidden"
                >
                  <span className="font-hindi font-semibold">
                    {language === 'hi' ? 'पात्रता जांच शुरू करें' : 'Check Your Eligibility'}
                  </span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-xs transition-transform duration-150 group-hover:translate-x-0.5">
                    →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`inline-flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm sm:text-[15px] font-medium transition-all duration-150 active:translate-y-[1px] focus:outline-hidden ${
                    isAudioPlaying
                      ? 'bg-[#141413] text-white shadow-[0_4px_12px_rgba(12,10,9,0.15),0_2px_0_0_#000000]'
                      : 'bg-white text-[#141413] shadow-[0_4px_12px_rgba(12,10,9,0.05),0_2px_0_0_#E5E3DC,0_0_0_1px_#E5E3DC] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {/* Live Equalizer Bars */}
                  <span className="flex items-end gap-[2.5px] h-4" aria-hidden="true">
                    {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h * 100}%` }}
                        className={`w-[2.5px] rounded-full transition-all duration-200 ${
                          isAudioPlaying
                            ? 'bg-[#22C55E] animate-pulse'
                            : 'bg-[#141413]'
                        }`}
                      />
                    ))}
                  </span>
                  <span className="font-hindi font-medium">
                    {isAudioPlaying
                      ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop Audio')
                      : (language === 'hi' ? 'बोलकर समझें' : 'Audio Guide')}
                  </span>
                  <span className="rounded bg-[#F0EFED] px-1.5 py-0.5 font-mono text-[10px] text-[#777169]">
                    HI / EN
                  </span>
                </button>
              </div>

              {/* Trust Ledger Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E3DC]">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#777169]">
                    {language === 'hi' ? 'समय (TIME)' : 'TIME'}
                  </div>
                  <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#0C0A09]">
                    {language === 'hi' ? '⏱️ केवल 60 सेकंड' : '⏱️ 60 Seconds'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#777169]">
                    {language === 'hi' ? 'प्रक्रिया (FLOW)' : 'FLOW'}
                  </div>
                  <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#0C0A09]">
                    {language === 'hi' ? '4 आसान सवाल' : '4 Questions'}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#777169]">
                    {language === 'hi' ? 'गोपनीयता (PRIVACY)' : 'PRIVACY'}
                  </div>
                  <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#16A34A]">
                    {language === 'hi' ? '✓ कोई दस्तावेज़ नहीं' : '✓ Zero Uploads'}
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT 6 COLUMNS: High-Craft Interactive Question Console */}
            <div className="lg:col-span-6">
              
              {/* Double-Bezel Outer Frame with Multi-Layer Elevation Shadow */}
              <div className="rounded-[24px] bg-[#EAE8E1]/90 p-2 shadow-[0_32px_64px_-16px_rgba(12,10,9,0.14),0_8px_20px_-4px_rgba(12,10,9,0.06),0_0_0_1px_rgba(12,10,9,0.08)] backdrop-blur-md">
                
                {/* Top Dark Console Header Bar */}
                <div className="flex items-center justify-between rounded-t-[18px] bg-[#141413] px-5 py-3.5 text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
                    <span className="text-xs font-medium tracking-wide text-stone-200">
                      {language === 'hi'
                        ? 'लाइव पात्रता पूर्वावलोकन · INTERACTIVE CONSOLE'
                        : 'LIVE ELIGIBILITY PREVIEW · INTERACTIVE'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1" aria-label="Step 1 of 4">
                      <span className="h-1.5 w-6 rounded-full bg-[#22C55E]" />
                      <span className="h-1.5 w-4 rounded-full bg-white/20" />
                      <span className="h-1.5 w-4 rounded-full bg-white/20" />
                      <span className="h-1.5 w-4 rounded-full bg-white/20" />
                    </div>
                    <span className="ml-1 font-mono text-xs text-stone-400 font-bold">
                      01 / 04
                    </span>
                  </div>
                </div>

                {/* Inner Crisp Surface Card */}
                <div className="rounded-b-[18px] bg-white p-5 sm:p-7 border-x border-b border-white space-y-4">
                  
                  {/* Category Tag */}
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200/60 font-hindi">
                    <span>🌾</span>
                    <span>
                      {language === 'hi'
                        ? 'सवाल 1: भूमि एवं कृषि स्थिति (Land Ownership)'
                        : 'Question 1: Agricultural Landholding'}
                    </span>
                  </div>

                  {/* Bilingual Question Prompt */}
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-2xl font-semibold text-[#0C0A09] leading-snug font-hindi">
                      {language === 'hi'
                        ? 'क्या आपके या आपके परिवार के नाम पर खेती योग्य भूमि है?'
                        : 'Do you or your family own cultivable agricultural land?'}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#777169]">
                      {language === 'hi'
                        ? 'Do you or your family own cultivable agricultural land?'
                        : 'Select your landholding status'}
                    </p>
                  </div>

                  {/* Tactile Keycap Option Rows */}
                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      onClick={onStart}
                      onMouseEnter={() => setHoveredOption(1)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className="group flex w-full items-center justify-between rounded-xl bg-[#FAF9F6] p-3.5 sm:p-4 text-left shadow-[0_2px_0_0_#E5E3DC,0_0_0_1px_#E5E3DC] transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-50/40 hover:shadow-[0_4px_12px_rgba(22,163,74,0.12),0_2px_0_0_#16A34A,0_0_0_1px_#16A34A] active:translate-y-[1px] focus:outline-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-mono text-xs font-bold text-[#141413] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_#D6D3D1] group-hover:bg-[#16A34A] group-hover:text-white group-hover:shadow-none transition-colors shrink-0">
                          1
                        </span>
                        <div>
                          <div className="text-sm sm:text-[15px] font-semibold text-[#0C0A09] font-hindi">
                            {language === 'hi' ? 'हाँ, खेती योग्य भूमि है' : 'Yes, family owns cultivable land'}
                          </div>
                          <div className="text-xs text-[#777169]">
                            {language === 'hi' ? 'Yes, family owns agricultural land' : 'Qualifies for land-linked benefits'}
                          </div>
                        </div>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#777169] shadow-2xs group-hover:bg-[#16A34A] group-hover:text-white group-hover:translate-x-0.5 transition-all font-mono text-sm">
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={onStart}
                      onMouseEnter={() => setHoveredOption(2)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className="group flex w-full items-center justify-between rounded-xl bg-[#FAF9F6] p-3.5 sm:p-4 text-left shadow-[0_2px_0_0_#E5E3DC,0_0_0_1px_#E5E3DC] transition-all duration-150 hover:-translate-y-0.5 hover:bg-stone-100/80 hover:shadow-[0_4px_12px_rgba(12,10,9,0.08),0_2px_0_0_#141413,0_0_0_1px_#141413] active:translate-y-[1px] focus:outline-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-mono text-xs font-bold text-[#141413] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_#D6D3D1] group-hover:bg-[#141413] group-hover:text-white group-hover:shadow-none transition-colors shrink-0">
                          2
                        </span>
                        <div>
                          <div className="text-sm sm:text-[15px] font-semibold text-[#0C0A09] font-hindi">
                            {language === 'hi' ? 'नहीं, भूमि नहीं है' : 'No, do not own land'}
                          </div>
                          <div className="text-xs text-[#777169]">
                            {language === 'hi' ? 'No agricultural land owned' : 'Non-landholding household'}
                          </div>
                        </div>
                      </div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#777169] shadow-2xs group-hover:bg-[#141413] group-hover:text-white group-hover:translate-x-0.5 transition-all font-mono text-sm">
                        →
                      </span>
                    </button>
                  </div>

                  {/* Live Scheme Match Dock (Dynamic Rule Reaction) */}
                  <div className="rounded-xl bg-[#F4F3EE] p-3 sm:p-3.5 border border-[#E5E3DC]">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#777169] mb-2">
                      <span className="font-semibold">
                        {language === 'hi' ? 'लाइव नियम मिलान (LIVE RULE ENGINE)' : 'LIVE RULE EVALUATION'}
                      </span>
                      <span className="text-[#16A34A] font-bold">
                        {hoveredOption === 2
                          ? (language === 'hi' ? '● 2/3 योजनाएं सक्रिय' : '● 2/3 Schemes Active')
                          : (language === 'hi' ? '● 3/3 योजनाएं सक्रिय' : '● 3/3 Schemes Active')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* PM-KISAN Chip */}
                      <div
                        className={`rounded-lg px-2.5 py-2 border text-xs transition-all ${
                          hoveredOption === 1
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs'
                            : hoveredOption === 2
                            ? 'bg-stone-100 border-stone-200 text-stone-400 opacity-50'
                            : 'bg-white border-[#E5E3DC] text-[#141413]'
                        }`}
                      >
                        <div className="font-semibold truncate">PM-KISAN</div>
                        <div className="font-mono text-[11px] text-[#16A34A] font-bold">
                          {hoveredOption === 2 ? 'अपात्र' : '₹6,000/वर्ष'}
                        </div>
                      </div>

                      {/* PMAY-G Chip */}
                      <div className="rounded-lg bg-white px-2.5 py-2 border border-[#E5E3DC] text-xs text-[#141413]">
                        <div className="font-semibold truncate">PMAY-G</div>
                        <div className="font-mono text-[11px] text-amber-700 font-bold">
                          ₹1.30 लाख
                        </div>
                      </div>

                      {/* PM-JAY Chip */}
                      <div className="rounded-lg bg-white px-2.5 py-2 border border-[#E5E3DC] text-xs text-[#141413]">
                        <div className="font-semibold truncate">PM-JAY</div>
                        <div className="font-mono text-[11px] text-sky-700 font-bold">
                          ₹5,00,000
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────
          2. FEATURED SCHEMES: 3 Tinted Passbook Cards
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0C0A09] font-hindi">
              {language === 'hi' ? 'आज जांची जाने वाली योजनाएं' : 'Featured Verified Schemes'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              {language === 'hi' ? 'आधिकारिक सरकारी पोर्टलों से सीधे सत्यापित नियम' : 'Deterministic rules grounded in official central guidelines'}
            </p>
          </div>

          <button
            type="button"
            onClick={onBrowse}
            className="text-xs sm:text-sm font-semibold text-[#0C0A09] hover:underline"
          >
            {language === 'hi' ? 'विस्तार से देखें →' : 'View all →'}
          </button>
        </div>

        {/* 3 Tinted Passbook Cards with Color-Coded Header Bands */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: PM-KISAN (Mint / Emerald) */}
          <div className="tactile-card rounded-2xl overflow-hidden border border-emerald-200/80 flex flex-col justify-between shadow-[0_8px_24px_-8px_rgba(22,163,74,0.08)]">
            <div className="bg-gradient-to-b from-emerald-50/90 via-emerald-50/30 to-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100/80 text-emerald-900 border border-emerald-300/60 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-hindi">
                  {language === 'hi' ? '🌾 किसान कल्याण' : '🌾 Farmer Support'}
                </span>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-zinc-400 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                >
                  <span>pmkisan.gov.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-[#0C0A09] metric-tabular tracking-tight">
                  <CountUp end={6000} prefix="₹" duration={650} />{' '}
                  <span className="text-xs font-medium text-zinc-500 font-sans">
                    {language === 'hi' ? '/ प्रति वर्ष' : '/ year'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#0C0A09] font-hindi leading-snug">
                  {language === 'hi' ? 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)' : 'PM Kisan Samman Nidhi'}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'खेती योग्य भूमि वाले पात्र किसान परिवारों को हर वर्ष ₹6,000 की सीधी आर्थिक सहायता, ₹2,000 की 3 समान किस्तों में DBT द्वारा।'
                  : 'Direct income support of ₹6,000 per year transferred in 3 equal installments to landholding farmer families.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 pt-3 border-t border-emerald-100/70 bg-white space-y-1.5 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-sans font-medium">
                  {language === 'hi' ? 'DBT सीधे बैंक खाते में हस्तांतरण' : 'Direct DBT Bank Transfer'}
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                कृषि एवं किसान कल्याण मंत्रालय
              </div>
            </div>
          </div>

          {/* Card 2: PMAY-G (Amber / Terracotta) */}
          <div className="tactile-card rounded-2xl overflow-hidden border border-amber-200/80 flex flex-col justify-between shadow-[0_8px_24px_-8px_rgba(217,119,6,0.08)]">
            <div className="bg-gradient-to-b from-amber-50/90 via-amber-50/30 to-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100/80 text-amber-900 border border-amber-300/60 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-hindi">
                  {language === 'hi' ? '🏠 ग्रामीण आवास' : '🏠 Rural Housing'}
                </span>
                <a
                  href="https://pmayg.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-zinc-400 hover:text-amber-800 flex items-center gap-1 transition-colors"
                >
                  <span>pmayg.nic.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-[#0C0A09] metric-tabular tracking-tight">
                  ₹1.20–1.30{' '}
                  <span className="text-xs font-medium text-zinc-500 font-sans">
                    {language === 'hi' ? 'लाख अनुदान' : 'Lakh Grant'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#0C0A09] font-hindi leading-snug">
                  {language === 'hi' ? 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)' : 'PM Awas Yojana (Gramin)'}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'कच्चे मकानों या बेघर ग्रामीण परिवारों को पक्का मकान निर्माण हेतु ₹1.20 से ₹1.30 लाख की वित्तीय सहायता + 90 दिन मनरेगा मजदूरी।'
                  : 'Grant of ₹1.20 to ₹1.30 Lakh + 90 days MGNREGA wages for building a pucca house for homeless or kutcha households.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 pt-3 border-t border-amber-100/70 bg-white space-y-1.5 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                <span className="font-sans font-medium">
                  {language === 'hi' ? 'पक्का मकान + 90 दिन मनरेगा मजदूरी' : 'Pucca House + 90 Days MGNREGA'}
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                ग्रामीण विकास मंत्रालय
              </div>
            </div>
          </div>

          {/* Card 3: PM-JAY (Sky / Indigo) */}
          <div className="tactile-card rounded-2xl overflow-hidden border border-sky-200/80 flex flex-col justify-between shadow-[0_8px_24px_-8px_rgba(2,132,199,0.08)]">
            <div className="bg-gradient-to-b from-sky-50/90 via-sky-50/30 to-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-sky-100/80 text-sky-900 border border-sky-300/60 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-hindi">
                  {language === 'hi' ? '🏥 स्वास्थ्य सुरक्षा' : '🏥 Free Healthcare'}
                </span>
                <a
                  href="https://pmjay.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-zinc-400 hover:text-sky-800 flex items-center gap-1 transition-colors"
                >
                  <span>pmjay.gov.in</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold text-[#0C0A09] metric-tabular tracking-tight">
                  <CountUp end={500000} prefix="₹" duration={750} />{' '}
                  <span className="text-xs font-medium text-zinc-500 font-sans">
                    {language === 'hi' ? '/ परिवार / वर्ष' : '/ family / yr'}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#0C0A09] font-hindi leading-snug">
                  {language === 'hi' ? 'आयुष्मान भारत (PM-JAY)' : 'Ayushman Bharat PM-JAY'}
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                {language === 'hi'
                  ? 'देश भर के 27,000+ अस्पतालों में गंभीर बीमारियों के उपचार हेतु ₹5 लाख तक का पूर्णतः कैशलेस और निशुल्क इलाज।'
                  : 'Cashless hospital treatment up to ₹5 Lakh per family per year in over 27,000 empanelled hospitals across India.'}
              </p>
            </div>

            <div className="p-4 sm:p-5 pt-3 border-t border-sky-100/70 bg-white space-y-1.5 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 text-sky-900 bg-sky-50 border border-sky-200 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                <span className="font-sans font-medium">
                  {language === 'hi' ? '27,000+ अस्पतालों में कैशलेस' : '27,000+ Empanelled Hospitals'}
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
          3. HOW IT WORKS: Unified Swiss Architectural Container with Visual Artifacts
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-0.5">
          <h3 className="font-semibold text-lg sm:text-xl text-[#0C0A09] font-hindi">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500">
            {language === 'hi'
              ? 'नागरिकों और ग्राम स्तर के संचालकों के लिए 3 चरणों की पारदर्शी प्रक्रिया'
              : 'A calm, 3-step deterministic process for citizens and kiosk operators'}
          </p>
        </div>

        {/* Single Architectural Container with Clean Dividers & Corner Crosshairs */}
        <div className="relative">
          <span className="absolute -top-2 -left-2 text-zinc-400 font-mono text-sm select-none leading-none z-10" aria-hidden="true">+</span>
          <span className="absolute -top-2 -right-2 text-zinc-400 font-mono text-sm select-none leading-none z-10" aria-hidden="true">+</span>
          <span className="absolute -bottom-2 -left-2 text-zinc-400 font-mono text-sm select-none leading-none z-10" aria-hidden="true">+</span>
          <span className="absolute -bottom-2 -right-2 text-zinc-400 font-mono text-sm select-none leading-none z-10" aria-hidden="true">+</span>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
            
            {/* Step 1 */}
            <div className="p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">
                    01
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60">
                    VOICE / TAP
                  </span>
                </div>
                <h4 className="font-semibold text-[#0C0A09] text-base font-hindi">
                  {language === 'hi' ? '1-1 सवाल का जवाब दें' : 'One Question at a Time'}
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'बोलकर या छूकर आसान सवालों के जवाब दें। कोई भ्रम नहीं, कोई कठिन फॉर्म या दस्तावेज अपलोड नहीं।'
                    : 'Answer simple prompts one by one with voice or tap without complicated bureaucratic jargon.'}
                </p>
              </div>

              {/* Visual Artifact 1: Voice Wave Micro-Preview */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                  <span>{language === 'hi' ? 'आवाज या स्पर्श इनपुट' : 'Voice or Touch'}</span>
                </span>
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-1 h-2 bg-zinc-300 rounded-full" />
                  <span className="w-1 h-3 bg-zinc-400 rounded-full" />
                  <span className="w-1 h-1.5 bg-zinc-300 rounded-full" />
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-600 tracking-wider">
                    02
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    100% AUDITED
                  </span>
                </div>
                <h4 className="font-semibold text-[#0C0A09] text-base font-hindi">
                  {language === 'hi' ? 'सटीक नियम मिलान' : 'Deterministic Rule Match'}
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'हमारा नियम इंजन सरकारी राजपत्र की शर्तों का 100% सटीक मिलान करता है, बिना किसी अनुमान या AI भ्रम के।'
                    : 'Exact verification against official government criteria without probabilistic guessing.'}
                </p>
              </div>

              {/* Visual Artifact 2: Rule Engine Check */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-emerald-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  <span>{language === 'hi' ? '100% नियम आधारित' : '100% Rule Verified'}</span>
                </span>
                <span className="font-bold">✓ 0% AI Hallucination</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">
                    03
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60">
                    PRINT SLIP
                  </span>
                </div>
                <h4 className="font-semibold text-[#0C0A09] text-base font-hindi">
                  {language === 'hi' ? 'CSC पर्ची प्राप्त करें' : 'Print Your Kiosk Slip'}
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed hindi-body">
                  {language === 'hi'
                    ? 'कागजात की सूची वाली 1-पेज पर्ची प्रिंट करें और सीधे अपने नजदीकी जन सेवा केंद्र ले जाएं।'
                    : 'Get a clean 1-page paper slip with matched schemes and required documents.'}
                </p>
              </div>

              {/* Visual Artifact 3: Thermal Slip Reference */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                  <span>{language === 'hi' ? 'कागजात चेकलिस्ट रसीद' : '1-Page Document Slip'}</span>
                </span>
                <span className="text-zinc-400 font-bold">#SS-2026</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
