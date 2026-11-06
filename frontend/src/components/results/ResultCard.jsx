import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, ExternalLink, Printer, FileText, ArrowRight } from 'lucide-react';
import RuleAuditTrace from './RuleAuditTrace';
import TouchButton from '../common/TouchButton';
import AudioButton from '../common/AudioButton';

export default function ResultCard({
  scheme,
  language,
  onOpenDetails,
  onPrintSlip
}) {
  const isEligible = scheme.status === 'potentially_eligible';
  const isNeedsInfo = scheme.status === 'needs_information';
  const isNotEligible = scheme.status === 'not_eligible';

  const name = language === 'hi' ? scheme.schemeName : scheme.englishName;
  const benefit = language === 'hi' ? scheme.benefitSummary : scheme.englishBenefitSummary;

  const audioSummary = `${name}। ${
    isEligible
      ? 'आप इस योजना के लिए संभावित रूप से पात्र हैं।'
      : isNeedsInfo
      ? `इस योजना के लिए अभी कुछ जानकारी बाकी है।`
      : 'वर्तमान शर्तों के अनुसार आप इस योजना के लिए पात्र नहीं हैं।'
  } सरकारी लाभ: ${scheme.highlightAmount || benefit}`;

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all duration-200 ${
      isEligible
        ? 'border-2 border-green-600 shadow-md ring-1 ring-green-100'
        : isNeedsInfo
        ? 'border-2 border-amber-400'
        : 'border-2 border-slate-200 opacity-80'
    }`}>
      
      {/* ───────────────────────────────────────────────────────────
          Top Badge Row with Audio Button & Verification Dot
          ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          {isEligible && (
            <span className="bg-green-100 text-green-900 border border-green-400 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span>{language === 'hi' ? 'संभावित रूप से पात्र (Eligible)' : 'Potentially Eligible'}</span>
            </span>
          )}

          {isNeedsInfo && (
            <span className="bg-amber-100 text-amber-950 border border-amber-400 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>{language === 'hi' ? `${scheme.missing.length} जानकारी बाकी` : `${scheme.missing.length} More Info Needed`}</span>
            </span>
          )}

          {isNotEligible && (
            <span className="bg-red-100 text-red-900 border border-red-300 text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <XCircle className="w-4 h-4 text-red-700" />
              <span>{language === 'hi' ? 'शर्तें पूरी नहीं (Not Eligible)' : 'Not Eligible'}</span>
            </span>
          )}

          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold">
            {scheme.scope}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AudioButton
            textToSpeak={audioSummary}
            language={language}
            size="sm"
            variant="subtle"
          />

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            सत्यापित: {scheme.lastVerified}
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          Title & Financial Metric Header
          ─────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {name}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {language === 'hi' ? scheme.ministry : scheme.englishMinistry}
          </p>
        </div>

        {/* Oversized Financial Benefit Header */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl" role="img" aria-hidden="true">💰</span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                {language === 'hi' ? 'निश्चित सरकारी आर्थिक लाभ:' : 'Government Financial Benefit:'}
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {scheme.highlightAmount || benefit}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {benefit}
              </p>
            </div>
          </div>

          {isEligible && (
            <span className="bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-center">
              DBT डायरेक्ट ट्रांसफर
            </span>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          Two Columns: Deterministic Rule Trace vs Required Documents
          ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        
        {/* Rule Trace */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🔍</span>
              <span>{language === 'hi' ? 'सत्यापित नियम मिलान:' : 'Rule Verification Trace:'}</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono font-bold">
              {scheme.passed.length} पास / {scheme.failed.length} फेल
            </span>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
            {scheme.passed.map(p => (
              <li key={p.ruleId} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-green-200">
                <span className="text-green-700 font-bold shrink-0 mt-0.5">✓</span>
                <span className="text-green-950 font-medium">{p.description}</span>
              </li>
            ))}
            {scheme.failed.map(f => (
              <li key={f.ruleId} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-red-200 text-red-900">
                <span className="text-red-600 font-bold shrink-0 mt-0.5">✕</span>
                <span className="font-medium">{f.description}</span>
              </li>
            ))}
            {scheme.missing.map(m => (
              <li key={m.ruleId} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-amber-200 text-amber-950">
                <span className="text-amber-700 font-bold shrink-0 mt-0.5">?</span>
                <span className="font-medium">{m.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#004B87]" />
              <span>{language === 'hi' ? 'जरूरी कागजात (Documents):' : 'Required Documents:'}</span>
            </h4>
            <span className="text-xs text-slate-500 font-semibold">{scheme.documents.length} मुख्य दस्तावेज</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
            {scheme.documents.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2.5 bg-white p-2 rounded-lg border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#004B87] mt-1.5 shrink-0" />
                <div>
                  <strong className="block text-slate-900 font-bold">{doc.name}</strong>
                  <span className="text-xs text-slate-500">{doc.note}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Expandable Technical Trace */}
      <RuleAuditTrace scheme={scheme} language={language} />

      {/* ───────────────────────────────────────────────────────────
          Action Footer Row
          ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
        
        <TouchButton
          onClick={() => onOpenDetails(scheme)}
          variant="primary"
          className="text-sm font-bold min-h-[48px]"
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'hi' ? 'आवेदन प्रक्रिया व गाइड देखें' : 'Application Guide & Steps'}</span>
        </TouchButton>

        {isEligible && (
          <TouchButton
            onClick={() => onPrintSlip(scheme)}
            variant="amberAction"
            className="text-sm font-bold min-h-[48px]"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? '🖨️ CSC ऑपरेटर पर्ची प्रिंट करें' : 'Print CSC Kiosk Slip'}</span>
          </TouchButton>
        )}

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm px-4 h-12 rounded-xl flex items-center gap-1.5 transition-colors ml-auto"
        >
          <span>आधिकारिक पोर्टल</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

      </div>

    </div>
  );
}
