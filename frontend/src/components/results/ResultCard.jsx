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

  const cardBorder = isEligible
    ? 'border-zinc-200'
    : isNeedsInfo
    ? 'border-zinc-200'
    : 'border-zinc-200/60 opacity-80';

  return (
    <div className={`tactile-card rounded-xl p-6 sm:p-7 space-y-5 transition-all ${cardBorder}`}>
      
      {/* Top Status & Verification Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          {isEligible && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>{language === 'hi' ? 'संभावित रूप से पात्र' : 'Potentially Eligible'}</span>
            </span>
          )}

          {isNeedsInfo && (
            <span className="bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
              <span>{language === 'hi' ? '1 जानकारी बाकी' : 'Needs Information'}</span>
            </span>
          )}

          {isNotEligible && (
            <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
              <span>{language === 'hi' ? 'शर्तें पूरी नहीं' : 'Not Eligible'}</span>
            </span>
          )}

          <span className="text-xs text-zinc-400 font-medium">
            {scheme.scope}
          </span>
        </div>

        <span className="text-[11px] font-mono text-zinc-400">
          सत्यापित: {scheme.lastVerified}
        </span>
      </div>

      {/* Scheme Title & Benefit Stat */}
      <div className="space-y-3">
        <h3 className="text-xl sm:text-2xl font-semibold text-[#141417] font-hindi leading-snug">
          {name}
        </h3>

        <div className="bg-[#F2F2F4] border border-[#E4E4E7] rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider block">
              {language === 'hi' ? 'सरकारी लाभ:' : 'Government Benefit:'}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#141417] mt-0.5 metric-tabular">
              {scheme.highlightAmount || benefit}
            </div>
          </div>
          <div className="text-xs text-zinc-600 max-w-sm hindi-body">
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
              className="px-4 py-2.5 rounded-lg bg-[#141417] hover:bg-[#27272D] text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-[0.985]"
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
