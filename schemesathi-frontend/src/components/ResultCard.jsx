import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { coreStrings } from '../i18n';

export function ResultCard({ result, lang = 'en', onHowToApply, onAnswerMore }) {
  const t = coreStrings[lang] || coreStrings.en;
  const status = (result.status || '').toLowerCase();

  const isEligible = status === 'potentially_eligible' || status === 'eligible';
  const isNeedsInfo = status === 'needs_information';
  const isNotEligible = status === 'not_eligible';

  // 1. Clean Summary and parse raw key criteria if present
  let displaySummary = result.summary || '';
  const parsedCriteria = [];

  if (displaySummary.startsWith('Eligibility Criteria for') || displaySummary.includes('Target Category/Occupation')) {
    // Extract key bullet criteria
    const rawLines = displaySummary.split('\n');
    rawLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-')) {
        let clean = trimmed.replace(/^-\s*/, '');
        clean = clean
          .replace(/^Target Category\/Occupation:\s*/i, 'Category: ')
          .replace(/^Age Range:\s*/i, 'Age: ')
          .replace(/^Income Limit:\s*/i, 'Income: ')
          .replace(/^Landholding Limit:\s*/i, 'Land: ')
          .replace(/^BPL Card Required:\s*No/i, 'BPL Required: No');
        parsedCriteria.push(clean);
      }
    });

    displaySummary = result.benefits || (lang === 'hi'
      ? 'पात्र नागरिकों के लिए सरकारी सहायता व कल्याणकारी योजना।'
      : 'Government welfare and financial assistance for eligible citizens.');
  } else if (displaySummary.startsWith('Scheme:')) {
    const summaryMatch = displaySummary.match(/Summary \((?:English|Hindi)\):\s*(.+)/i);
    if (summaryMatch) {
      displaySummary = summaryMatch[1].trim();
    }
  }

  // 2. Card-Specific "Why / Eligibility" Items
  const passed = result.passed || [];
  const missing = result.missing || [];
  const failed = result.failed || [];

  const hasWhyItems = passed.length > 0 || missing.length > 0 || failed.length > 0;

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="card flex flex-col gap-4 bg-white border border-stone-200/90 shadow-sm rounded-xl"
    >
      {/* Top Header: Name and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-stone-200">
        <h3 className="font-serif text-xl font-bold text-[#1C1B1A]">
          {result.name}
        </h3>
        <StatusBadge status={status} lang={lang} />
      </div>

      {/* One-line clean summary */}
      <p className="text-base text-stone-600 leading-relaxed font-normal">
        {displaySummary}
      </p>

      {/* Clean key criteria pills if parsed from raw strings */}
      {parsedCriteria.length > 0 && (
        <div className="bg-[#F9F8F6] rounded-xl p-3.5 border border-stone-200/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
            {lang === 'hi' ? 'मुख्य पात्रता मानदंड' : 'Key Eligibility Criteria'}
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#1C1B1A]">
            {parsedCriteria.map((crit, idx) => (
              <li key={`crit-${idx}`} className="flex items-center gap-2">
                <span className="text-[#166534] font-bold text-sm select-none">•</span>
                <span className="font-medium">{crit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* "Why?" list */}
      {hasWhyItems && (
        <div className="bg-[#F9F8F6] rounded-xl p-3.5 border border-stone-200/80 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {t.whyHeader}
          </span>
          <ul className="space-y-1.5 text-sm" aria-label={t.whyHeader}>
            {passed.map((item, idx) => (
              <li key={`passed-${idx}`} className="flex items-start gap-2.5 text-[#1C1B1A]">
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
            {missing.map((item, idx) => (
              <li key={`missing-${idx}`} className="flex items-start gap-2.5 text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
            {failed.map((item, idx) => (
              <li key={`failed-${idx}`} className="flex items-start gap-2.5 text-stone-500">
                <XCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action button */}
      <div className="pt-2 flex items-center justify-end">
        {isEligible && (
          <button
            type="button"
            onClick={() => onHowToApply && onHowToApply(result.scheme_id)}
            className="btn-primary w-full sm:w-auto font-medium"
          >
            {t.howToApply} →
          </button>
        )}

        {isNeedsInfo && (
          <button
            type="button"
            onClick={() => onAnswerMore && onAnswerMore(result.scheme_id)}
            className="btn-ghost w-full sm:w-auto font-medium text-[#1C1B1A] border border-stone-300"
          >
            {t.answerMore} →
          </button>
        )}

        {isNotEligible && null}
      </div>
    </motion.div>
  );
}

export default ResultCard;
