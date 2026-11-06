import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, ExternalLink, Clock, FileCheck, Layers } from 'lucide-react';
import AudioButton from '../components/common/AudioButton';
import TouchButton from '../components/common/TouchButton';
import { VERIFIED_SCHEMES } from '../data/schemesData';

export default function Home({ onStart, onBrowse, language }) {
  const [isIntroSpeaking, setIsIntroSpeaking] = useState(false);

  const audioIntro = language === 'hi'
    ? 'नमस्ते! यह योजना साथी मंच है। आप बिना किसी फॉर्म या लॉगिन के सिर्फ तीन चार आसान सवालों के जवाब देकर अपनी सरकारी योजना पात्रता जांच सकते हैं। आवाज सुनने के लिए किसी भी सवाल पर बने लाउडस्पीकर बटन को दबाएं।'
    : 'Welcome to SchemeSathi. Discover verified government welfare schemes you qualify for by answering just three or four simple questions. No forms or login required. Tap any speaker button to listen to questions in your language.';

  return (
    <div className="space-y-10 sm:space-y-12">
      
      {/* ───────────────────────────────────────────────────────────
          1. HERO SECTION (Functional Minimalism with Tactile CTA)
          ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative background accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 space-y-6 sm:space-y-8 max-w-4xl">
          
          {/* Trust verification pill */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#004B87] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#004B87]" />
            <span>{language === 'hi' ? '3 मुख्य योजनाएं सत्यापित' : '3 Central Schemes Verified'}</span>
            <span className="text-blue-300">|</span>
            <span className="text-slate-600 font-mono text-[11px]">{language === 'hi' ? 'सत्यापन: 1 Nov 2026' : 'Verified: 1 Nov 2026'}</span>
          </div>

          {/* Hero Headline & Value Proposition */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] font-hindi">
              {language === 'hi' ? (
                <>
                  सरकारी योजनाओं की सही जानकारी, <br />
                  <span className="text-[#004B87] underline decoration-blue-200 underline-offset-8">
                    अब एक-एक आसान सवाल पूछकर।
                  </span>
                </>
              ) : (
                <>
                  Find Government Schemes You Qualify For— <br />
                  <span className="text-[#004B87] underline decoration-blue-200 underline-offset-8">
                    One Simple Question at a Time.
                  </span>
                </>
              )}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
              {language === 'hi'
                ? 'कोई कठिन सरकारी दस्तावेज नहीं, कोई लम्बा फॉर्म नहीं। हम आपसे एक समय में सिर्फ एक सवाल पूछते हैं — आप छूकर या बोलकर जवाब दे सकते हैं।'
                : 'No bureaucratic jargon, no multi-page forms, no login needed. We guide you step-by-step with voice and text, matching your profile against official government eligibility rules.'}
            </p>
          </div>

          {/* Interactive Bhashini Audio Assistant Bar */}
          <div className={`border rounded-2xl p-4 sm:p-5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isIntroSpeaking
              ? 'bg-blue-50/90 border-[#004B87] ring-2 ring-blue-200'
              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
          }`}>
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#004B87] flex items-center justify-center font-bold text-lg shrink-0">
                🔊
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm sm:text-base block">
                  {language === 'hi' ? 'बोलकर समझें (Bhashini AI Audio):' : 'Audio Guide via Bhashini TTS:'}
                </span>
                <p className={`text-xs sm:text-sm ${isIntroSpeaking ? 'text-[#004B87] font-semibold' : 'text-slate-600'}`}>
                  {isIntroSpeaking
                    ? (language === 'hi' ? '» "नमस्ते! यह योजना साथी मंच है..."' : '» "Welcome to SchemeSathi..."')
                    : (language === 'hi' ? 'पढ़ने में कठिनाई हो तो पूरा संदेश सुनकर समझें।' : 'Listen to how SchemeSathi checks your eligibility.')}
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              <AudioButton
                textToSpeak={audioIntro}
                language={language}
                onPlayingChange={setIsIntroSpeaking}
                size="default"
              />
            </div>
          </div>

          {/* Action CTAs Row */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              {/* Dominant Primary CTA */}
              <button
                type="button"
                onClick={onStart}
                className="group min-h-[54px] px-8 py-3.5 rounded-2xl bg-[#004B87] hover:bg-[#002D54] text-white font-extrabold text-lg sm:text-xl shadow-cta hover:shadow-cta-hover transition-all duration-200 flex items-center justify-center gap-3 active:scale-98 focus:outline-hidden focus:ring-4 focus:ring-blue-300"
              >
                <span>👉</span>
                <span>{language === 'hi' ? 'पात्रता जांच शुरू करें' : 'Start Eligibility Check'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Secondary Browse CTA */}
              <TouchButton onClick={onBrowse} variant="secondary" className="min-h-[54px] text-base font-bold">
                <Layers className="w-5 h-5 text-slate-600" />
                <span>{language === 'hi' ? '3 मुख्य योजनाएं देखें' : 'Browse All Schemes'}</span>
              </TouchButton>
            </div>

            {/* Micro-caption directly underneath */}
            <p className="text-xs text-slate-500 font-medium flex items-center gap-2 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'hi' ? '⏱️ केवल 1 मिनट · 4 आसान सवाल · कोई दस्तावेज़ अपलोड नहीं' : '⏱️ Takes 1 min · 4 simple questions · Zero document upload'}</span>
            </p>
          </div>

          {/* Privacy Guarantee Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'गोपनीयता की पक्की गारंटी: आधार नंबर या बैंक खाता नंबर कभी नहीं पूछा जाता।'
                  : 'Privacy guaranteed: No Aadhaar or bank account numbers collected.'}
              </span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">CS002 Community Project · 100% Free</span>
          </div>

        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────
          2. 3 VERIFIED SCHEMES: METRIC-FIRST BENTO GRID
          ─────────────────────────────────────────────────────────── */}
      <section className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'hi' ? 'आज जांची जाने वाली 3 मुख्य योजनाएं' : '3 Verified Schemes Evaluated Today'}
              </h2>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {language === 'hi'
                ? 'सरकारी पोर्टलों से सत्यापित नियम। किसी अनुमान या AI की मनगढ़ंत जानकारी के बिना।'
                : 'Deterministic eligibility rules verified against official ministry portals.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-900 border border-green-300 px-3 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span>{language === 'hi' ? '100% आधिकारिक नियम' : '100% Official Rules'}</span>
          </div>
        </div>

        {/* 3-Tile Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {VERIFIED_SCHEMES.map((scheme, idx) => {
            // Colors per card for instant visual scanning
            const colors = [
              { border: 'hover:border-green-400', badgeBg: 'bg-green-100 text-green-900 border-green-200', statColor: 'text-green-800' },
              { border: 'hover:border-amber-400', badgeBg: 'bg-amber-100 text-amber-950 border-amber-200', statColor: 'text-amber-800' },
              { border: 'hover:border-blue-400', badgeBg: 'bg-blue-100 text-[#004B87] border-blue-200', statColor: 'text-[#004B87]' },
            ][idx % 3];

            return (
              <div
                key={scheme.id}
                className={`bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-200 flex flex-col justify-between group ${colors.border} hover:shadow-card-hover`}
              >
                
                {/* Top: Category Tag + Audio Pronunciation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${colors.badgeBg}`}>
                      {scheme.tag}
                    </span>
                    <AudioButton
                      textToSpeak={`${scheme.name}। ${scheme.benefitSummary}`}
                      language={language}
                      size="icon"
                    />
                  </div>

                  {/* METRIC-FIRST HIERARCHY: Oversized Benefit Stat Header */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      {language === 'hi' ? 'सरकारी आर्थिक लाभ:' : 'Government Financial Benefit:'}
                    </span>
                    <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${colors.statColor} metric-highlight`}>
                      {scheme.highlightAmount}
                    </div>
                    <span className="text-xs text-slate-600 font-medium block">
                      {language === 'hi' ? scheme.highlightFrequency : scheme.englishHighlightFrequency}
                    </span>
                  </div>

                  {/* Scheme Title & Plain-Language Summary */}
                  <div className="space-y-2 pt-1">
                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl group-hover:text-[#004B87] transition-colors leading-snug">
                      {language === 'hi' ? scheme.name : scheme.englishName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {language === 'hi' ? scheme.benefitSummary : scheme.englishBenefitSummary}
                    </p>
                  </div>
                </div>

                {/* Bottom: Clean 1px Visual Trust Divider */}
                <div className="pt-4 mt-5 border-t border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-medium truncate max-w-[170px]" title={scheme.ministry}>
                      {language === 'hi' ? scheme.ministry : scheme.englishMinistry}
                    </span>
                    <span className="inline-flex items-center gap-1 text-green-700 font-bold shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                      <span>{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#004B87] hover:text-[#002D54] font-bold inline-flex items-center gap-1 hover:underline text-xs"
                    >
                      <span>{scheme.officialUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-[11px] font-mono text-slate-400">
                      {scheme.lastVerified}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>


      {/* ───────────────────────────────────────────────────────────
          3. HOW IT WORKS: 3-STEP TRANSPARENCY BENTO ROW
          ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#004B87] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {language === 'hi' ? 'पारदर्शी प्रक्रिया' : 'Transparent Workflow'}
          </span>
          <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-900">
            {language === 'hi' ? 'यह कैसे काम करता है?' : 'How SchemeSathi Works'}
          </h3>
          <p className="text-sm text-slate-600">
            {language === 'hi' ? '3 सरल चरणों में जानिए अपनी पात्रता' : '3 simple steps to find schemes you qualify for'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#004B87] font-black flex items-center justify-center text-lg shadow-2xs">
              1
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">
              {language === 'hi' ? '1-1 सवाल का जवाब दें' : 'Answer One Question at a Time'}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'hi'
                ? 'बोलकर या छूकर आसान सवालों के जवाब दें। एक समय पर सिर्फ 1 सवाल स्क्रीन पर आता है ताकि कोई भ्रम न हो।'
                : 'Focus on one question per screen with large touch targets and instant voice playback support.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#004B87] font-black flex items-center justify-center text-lg shadow-2xs">
              2
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">
              {language === 'hi' ? 'समीक्षा व नियम मिलान' : 'Review & Deterministic Rules'}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'hi'
                ? 'अपने दिए जवाबों की जांच करें। हमारा पारदर्शी नियम इंजन हर सरकारी शर्त का सटीक मिलान करेगा (AI अनुमान नहीं लगाएगा)।'
                : 'Confirm your answers. Our rule engine verifies exact government criteria without generative guessing.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#004B87] font-black flex items-center justify-center text-lg shadow-2xs">
              3
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">
              {language === 'hi' ? 'कागजात सूची व CSC पर्ची' : 'Document Checklist & CSC Slip'}
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {language === 'hi'
                ? 'पात्रता मिलते ही जरूरी कागजात की सूची पाएं और 1-क्लिक में जन सेवा केंद्र (CSC) के लिए पर्ची प्रिंट या WhatsApp करें।'
                : 'Generate a clean 1-page slip with matched rules and required documents to take directly to your local CSC kiosk.'}
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
