import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Sprout,
  Home as HomeIcon,
  ShieldPlus,
  Sliders,
  FileCheck,
  ReceiptText,
  Clock,
  FileText,
  CreditCard,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import CountUp from '../components/common/CountUp';
import { speakAudio, stopAudio } from '../services/api';

export default function Home({ onStart, onBrowse }) {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const audioIntro =
    'Welcome to SchemeSathi. Discover verified government welfare schemes you qualify for by answering just four simple questions. No forms or login required. Click the button below to begin.';

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
      speakAudio(audioIntro, 'en', {
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
        
        {/* Architectural Background Grid & Atmospheric Radial Orbs */}
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
              
              {/* Verified Audit Badge with Solid Check Icon */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#111111] shadow-[0_2px_6px_rgba(12,10,9,0.05),0_0_0_1px_rgba(12,10,9,0.08)]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  3 Verified Central Welfare Schemes
                </span>
                <span className="text-[#D6D3D1]">|</span>
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-[#777169]">
                  GAZETTE AUDIT: 2026
                </span>
              </div>

              {/* Headline (Clean, Bold, Solid — No AI Highlighter Clichés) */}
              <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-extrabold tracking-[-0.035em] leading-[1.14] text-[#111111]">
                Find Government Schemes You Qualify For — One Simple Question at a Time.
              </h1>

              {/* Plain Language Subtitle */}
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#57534E]">
                No bureaucratic forms, no login needed. Answer simple prompts one by one with voice or tap, verified against official central ministry guidelines.
              </p>

              {/* High-Impact Action Row (Nike-Style Pill Buttons) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={onStart}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[#111111] px-7 py-3.5 text-sm sm:text-[15px] font-bold text-white shadow-[0_8px_20px_-4px_rgba(17,17,17,0.3)] transition-all duration-150 hover:bg-[#262626] active:scale-[0.985] focus:outline-hidden"
                >
                  <span className="tracking-tight">Check Your Eligibility</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs transition-transform duration-150 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm sm:text-[15px] font-semibold transition-all duration-150 active:scale-[0.985] focus:outline-hidden ${
                    isAudioPlaying
                      ? 'bg-[#111111] text-white shadow-[0_4px_12px_rgba(17,17,17,0.2)]'
                      : 'bg-white text-[#111111] border border-[#E5E3DC] hover:bg-[#FAF9F6] shadow-xs'
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
                            : 'bg-[#111111]'
                        }`}
                      />
                    ))}
                  </span>
                  <span>{isAudioPlaying ? 'Stop Audio' : 'Audio Guide'}</span>
                </button>
              </div>

              {/* Trust Ledger Strip with Lucide Icons */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5E3DC]">
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase font-bold text-[#777169]">
                    <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>TIME</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-[#0C0A09]">
                    60 Seconds
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase font-bold text-[#777169]">
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>FLOW</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-[#0C0A09]">
                    4 Questions
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase font-bold text-[#777169]">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>PRIVACY</span>
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-[#16A34A]">
                    Zero Uploads
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT 6 COLUMNS: High-Craft Interactive Question Console */}
            <div className="lg:col-span-6">
              
              {/* Double-Bezel Outer Frame with Multi-Layer Elevation Shadow */}
              <div className="rounded-[24px] bg-[#EAE8E1]/90 p-2 shadow-[0_32px_64px_-16px_rgba(12,10,9,0.14),0_8px_20px_-4px_rgba(12,10,9,0.06),0_0_0_1px_rgba(12,10,9,0.08)] backdrop-blur-md">
                
                {/* Top Dark Console Header Bar */}
                <div className="flex items-center justify-between rounded-t-[18px] bg-[#111111] px-5 py-3.5 text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
                    <span className="text-xs font-bold tracking-wider uppercase text-stone-200 font-mono">
                      LIVE ELIGIBILITY SIMULATOR
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
                  
                  {/* Category Tag with Lucide Icon */}
                  <div className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 border border-zinc-200">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Question 1 of 4: Agricultural Landholding</span>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-1">
                    <h2 className="text-lg sm:text-2xl font-bold text-[#0C0A09] leading-snug">
                      Do you or your family own cultivable agricultural land?
                    </h2>
                    <p className="text-xs sm:text-sm text-[#777169]">
                      Select your landholding status to evaluate land-linked central benefits.
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
                          <div className="text-sm sm:text-[15px] font-bold text-[#0C0A09]">
                            Yes, family owns cultivable land
                          </div>
                          <div className="text-xs text-[#777169]">
                            Qualifies for land-linked central income support
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
                          <div className="text-sm sm:text-[15px] font-bold text-[#0C0A09]">
                            No agricultural land owned
                          </div>
                          <div className="text-xs text-[#777169]">
                            Non-landholding household
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
                      <span className="font-bold">LIVE BENEFIT MATRIX</span>
                      <span className="text-[#16A34A] font-bold">
                        {hoveredOption === 2 ? '● 2/3 Schemes Active' : '● 3/3 Schemes Active'}
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
                          {hoveredOption === 2 ? 'Excluded' : '₹6,000/yr'}
                        </div>
                      </div>

                      {/* PMAY-G Chip */}
                      <div className="rounded-lg bg-white px-2.5 py-2 border border-[#E5E3DC] text-xs text-[#141413]">
                        <div className="font-semibold truncate">PMAY-G</div>
                        <div className="font-mono text-[11px] text-amber-700 font-bold">
                          ₹1.30 Lakh
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
          2. FEATURED SCHEMES: Crisp Passbook Cards with Lucide Icons
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0C0A09]">
              Featured Verified Schemes
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Deterministic rules grounded directly in official central ministry guidelines
            </p>
          </div>

          <button
            type="button"
            onClick={onBrowse}
            className="text-xs sm:text-sm font-semibold text-[#0C0A09] hover:underline"
          >
            View all schemes →
          </button>
        </div>

        {/* 3 Crisp Passbook Cards with Lucide Icons (Zero AI Pastel Clichés) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: PM-KISAN (Farmer Support) */}
          <div className="tactile-card rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-300 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 shadow-2xs text-zinc-900 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farmer Support</span>
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
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0C0A09] metric-tabular tracking-tight">
                  <CountUp end={6000} prefix="₹" duration={650} />{' '}
                  <span className="text-xs font-medium text-zinc-500 font-sans">
                    / year
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0C0A09] leading-snug">
                  PM Kisan Samman Nidhi
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Direct income support of ₹6,000 per year transferred in 3 equal installments of ₹2,000 directly via DBT to eligible landholding farmer families.
              </p>
            </div>

            <div className="p-4 sm:p-5 pt-3 border-t border-zinc-100 bg-zinc-50/50 space-y-2 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-2 text-zinc-800 bg-white border border-zinc-200 shadow-2xs px-2.5 py-1 rounded-md text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <span className="font-sans">
                  Direct DBT Bank Transfer
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                Ministry of Agriculture & Farmers Welfare
              </div>
            </div>
          </div>

          {/* Card 2: PMAY-G (Rural Housing) */}
          <div className="tactile-card rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-300 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 shadow-2xs text-zinc-900 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight">
                  <HomeIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Rural Housing</span>
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
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0C0A09] metric-tabular tracking-tight">
                  ₹1.20–1.30{' '}
                  <span className="text-xs font-medium text-zinc-500 font-sans">
                    Lakh Grant
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0C0A09] leading-snug">
                  PM Awas Yojana (Gramin)
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Financial assistance of ₹1.20 to ₹1.30 Lakh for construction of a permanent pucca house + 90 days of dedicated MGNREGA unskilled labour wages.
              </p>
            </div>

            <div className="p-4 sm:p-5 pt-3 border-t border-zinc-100 bg-zinc-50/50 space-y-2 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-2 text-zinc-800 bg-white border border-zinc-200 shadow-2xs px-2.5 py-1 rounded-md text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                <span className="font-sans">
                  Pucca House + 90 Days MGNREGA
                </span>
              </div>
              <div className="text-zinc-400 text-[10px] pl-0.5">
                Ministry of Rural Development
              </div>
            </div>
          </div>

          {/* Card 3: PM-JAY (Free Healthcare) */}
          <div className="tactile-card rounded-2xl overflow-hidden border border-zinc-200 hover:border-zinc-300 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200">
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 shadow-2xs text-zinc-900 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-tight">
                  <ShieldPlus className="w-3.5 h-3.5 text-sky-600" />
                  <span>Free Healthcare</span>
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
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0C0A09] metric-tabular tracking-tight">
                  <CountUp end={500000} prefix="₹" duration={750} />{' '}
                  <span className="text-xs font-medium text-zinc-500 font-sans">
                    / family / year
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0C0A09] leading-snug">
                  Ayushman Bharat PM-JAY
                </h3>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Comprehensive secondary and tertiary care hospitalization coverage up to ₹5 Lakh per family per year, completely cashless across 27,000+ empanelled hospitals.
              </p>
            </div>

            <div className="p-4 sm:p-5 pt-3 border-t border-zinc-100 bg-zinc-50/50 space-y-2 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-2 text-zinc-800 bg-white border border-zinc-200 shadow-2xs px-2.5 py-1 rounded-md text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 shadow-[0_0_6px_rgba(14,165,233,0.5)]" />
                <span className="font-sans">
                  27,000+ Cashless Hospitals
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
          3. HOW IT WORKS: High-Craft Animated 3-Step Pipeline (No Raw Crosshairs)
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h3 className="font-extrabold text-xl sm:text-2xl text-[#111111]">
            How It Works
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500">
            A 3-step deterministic process designed for both individual citizens and CSC kiosk operators
          </p>
        </div>

        {/* 3 Interconnected Step Cards with Smooth Hover Elevation & Clean Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Step 01 */}
          <div className="group rounded-2xl bg-white border border-zinc-200/90 p-6 sm:p-7 space-y-5 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                  01
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60 font-semibold">
                  VOICE / TAP
                </span>
              </div>

              <h4 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-600" />
                <span>One Question at a Time</span>
              </h4>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Answer simple, jargon-free prompts one by one using voice input or touch. No complicated forms or initial document uploads.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                <span>Voice or Touch Input</span>
              </span>
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-1 h-2 bg-zinc-300 rounded-full" />
                <span className="w-1 h-3 bg-zinc-500 rounded-full" />
                <span className="w-1 h-1.5 bg-zinc-300 rounded-full" />
              </span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="group rounded-2xl bg-white border border-zinc-200/90 p-6 sm:p-7 space-y-5 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                  02
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  100% AUDITED
                </span>
              </div>

              <h4 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Rule Match</span>
              </h4>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Instant deterministic verification strictly grounded in official central ministry gazette criteria without guesswork or intermediaries.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-emerald-800">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                <span>Official Policy Grounded</span>
              </span>
              <span className="font-bold text-[11px]">✓ 100% Gazette Rules</span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="group rounded-2xl bg-white border border-zinc-200/90 p-6 sm:p-7 space-y-5 shadow-2xs hover:shadow-lg hover:-translate-y-1 hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                  03
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60 font-semibold">
                  PRINT SLIP
                </span>
              </div>

              <h4 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                <ReceiptText className="w-4 h-4 text-zinc-600" />
                <span>Instant Kiosk Print Slip</span>
              </h4>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Generate a clean 1-page document checklist receipt to take directly to your nearest Common Service Centre (CSC) for physical application.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                <span>Document Checklist Slip</span>
              </span>
              <span className="text-zinc-600 font-bold">#SS-2026</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
