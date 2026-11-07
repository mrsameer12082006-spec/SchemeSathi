import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, ExternalLink, Printer, ArrowRight } from 'lucide-react';
import RuleAuditTrace from './RuleAuditTrace';

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

  const accentGradient = isEligible
    ? 'from-emerald-500 to-teal-500'
    : isNeedsInfo
    ? 'from-amber-500 to-orange-500'
    : 'from-slate-300 to-slate-400';

  const benefitBoxBg = isEligible
    ? 'bg-emerald-50/60 border-emerald-200/80'
    : isNeedsInfo
    ? 'bg-amber-50/60 border-amber-200/80'
    : 'bg-slate-50 border-slate-200';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 transition-all shadow-sm hover:shadow-xl">
      
      {/* Top Accent Bar */}
      <div className={`h-1.5 bg-gradient-to-r ${accentGradient} rounded-t-2xl -mt-6 -mx-6 sm:-mt-7 sm:-mx-7 mb-4`} />
      
      {/* Top Status & Verification Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          {isEligible && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>{language === 'hi' ? 'संभावित रूप से पात्र' : 'Potentially Eligible'}</span>
            </span>
          )}

          {isNeedsInfo && (
            <span className="bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
              <span>{language === 'hi' ? '1 जानकारी बाकी' : 'Needs Information'}</span>
            </span>
          )}

          {isNotEligible && (
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
              <span>{language === 'hi' ? 'शर्तें पूरी नहीं' : 'Not Eligible'}</span>
            </span>
          )}

          <span className="text-xs text-slate-400 font-medium">
            {scheme.scope}
          </span>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          सत्यापित: {scheme.lastVerified}
        </span>
      </div>

      {/* Scheme Title & Benefit Stat */}
      <div className="space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-hindi leading-snug">
          {name}
        </h3>

        <div className={`border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${benefitBoxBg}`}>
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'hi' ? 'सरकारी लाभ:' : 'Government Benefit:'}
            </span>
            <div className={`text-2xl sm:text-3xl font-extrabold mt-0.5 metric-tabular ${isEligible ? 'text-emerald-950' : 'text-slate-900'}`}>
              {scheme.highlightAmount || benefit}
            </div>
          </div>
          <div className="text-xs text-slate-700 max-w-sm hindi-body">
            {benefit}
          </div>
        </div>
      </div>

      {/* Two Clean Columns: Rules Evaluated vs Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        
        {/* Rules */}
        <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-lg p-4 space-y-2">
          <strong className="text-zinc-800 font-semibold block text-xs uppercase tracking-wider font-mono">
            {language === 'hi' ? 'नियम सत्यापन:' : 'Verified Rules:'}
          </strong>
          <ul className="space-y-1.5 text-zinc-700 hindi-body">
            {scheme.passed.map(p => (
              <li key={p.ruleId} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{p.description}</span>
              </li>
            ))}
            {scheme.failed.map(f => (
              <li key={f.ruleId} className="flex items-start gap-2 text-zinc-400">
                <span className="text-red-500 font-bold">✕</span>
                <span>{f.description}</span>
              </li>
            ))}
            {scheme.missing.map(m => (
              <li key={m.ruleId} className="flex items-start gap-2 text-amber-700">
                <span className="font-bold">?</span>
                <span>{m.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents */}
        <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-lg p-4 space-y-2">
          <strong className="text-zinc-800 font-semibold block text-xs uppercase tracking-wider font-mono">
            {language === 'hi' ? 'आवश्यक कागजात:' : 'Required Documents:'}
          </strong>
          <ul className="space-y-1.5 text-zinc-700 hindi-body">
            {scheme.documents.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                <span><strong className="text-zinc-900">{doc.name}</strong> - {doc.note}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Expandable Technical Audit Trace for Evaluators */}
      <RuleAuditTrace scheme={scheme} language={language} />

      {/* Clean 2-Action Footer Row */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
        <div className="flex flex-wrap items-center gap-2.5">
          {isEligible && (
            <button
              type="button"
              onClick={() => onPrintSlip(scheme)}
              className="px-5 py-2.5 rounded-xl btn-primary-glow font-bold text-xs sm:text-sm flex items-center gap-2 active:scale-[0.985] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'CSC पर्ची देखें व प्रिंट करें' : 'Print CSC Slip'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(scheme)}
            className="px-4 py-2.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-[0.985]"
          >
            <span>{language === 'hi' ? 'आवेदन चरण देखें' : 'Application Guide'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-zinc-400 hover:text-zinc-800 flex items-center gap-1 font-mono transition-colors"
        >
          <span>{scheme.officialUrl.replace('https://', '')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
}
