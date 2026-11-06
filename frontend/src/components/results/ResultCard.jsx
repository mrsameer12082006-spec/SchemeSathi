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

  const topAccent = isEligible
    ? 'border-t-4 border-t-emerald-600 border-emerald-200 shadow-sm'
    : isNeedsInfo
    ? 'border-t-4 border-t-amber-500 border-amber-200 shadow-sm'
    : 'border-t-4 border-t-slate-300 border-slate-200 opacity-80';

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 space-y-6 transition-all tactile-card hairline-border ${topAccent}`}>
      
      {/* Top Status & Verification Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          {isEligible && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? 'संभावित रूप से पात्र' : 'Potentially Eligible'}</span>
            </span>
          )}

          {isNeedsInfo && (
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'hi' ? '1 जानकारी बाकी' : 'Needs Information'}</span>
            </span>
          )}

          {isNotEligible && (
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
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
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-hindi leading-snug">
          {name}
        </h3>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'hi' ? 'सरकारी लाभ:' : 'Government Benefit:'}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 metric-tabular">
              {scheme.highlightAmount || benefit}
            </div>
          </div>
          <div className="text-xs text-slate-500 max-w-sm hindi-body">
            {benefit}
          </div>
        </div>
      </div>

      {/* Two Clean Columns: Rules Evaluated vs Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
        
        {/* Rules */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
          <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
            {language === 'hi' ? 'नियम सत्यापन:' : 'Verified Rules:'}
          </strong>
          <ul className="space-y-1.5 text-slate-700 hindi-body">
            {scheme.passed.map(p => (
              <li key={p.ruleId} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{p.description}</span>
              </li>
            ))}
            {scheme.failed.map(f => (
              <li key={f.ruleId} className="flex items-start gap-2 text-slate-500">
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
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
          <strong className="text-slate-900 font-bold block text-xs uppercase tracking-wider">
            {language === 'hi' ? 'आवश्यक कागजात:' : 'Required Documents:'}
          </strong>
          <ul className="space-y-1.5 text-slate-700 hindi-body">
            {scheme.documents.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0" />
                <span><strong>{doc.name}</strong> - {doc.note}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Expandable Technical Audit Trace for Evaluators */}
      <RuleAuditTrace scheme={scheme} language={language} />

      {/* Clean 2-Action Footer Row */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {isEligible && (
            <button
              type="button"
              onClick={() => onPrintSlip(scheme)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#002D54] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs spring-press"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'hi' ? 'CSC पर्ची देखें व प्रिंट करें' : 'Print CSC Slip'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenDetails(scheme)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 spring-press"
          >
            <span>{language === 'hi' ? 'आवेदन चरण देखें' : 'Application Guide'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-[#004B87] flex items-center gap-1 font-mono transition-colors"
        >
          <span>{scheme.officialUrl.replace('https://', '')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
}
