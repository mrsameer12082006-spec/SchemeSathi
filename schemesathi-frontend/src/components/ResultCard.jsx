import React from 'react';
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
    <div className="card flex flex-col gap-4">
      {/* Top Header: Name and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-line dark:border-nightline">
        <h3 className="text-xl font-bold text-ink dark:text-mist">
          {result.name}
        </h3>
        <StatusBadge status={status} lang={lang} />
      </div>

      {/* One-line clean summary */}
      <p className="text-base text-ink/90 dark:text-mist/90 leading-relaxed font-normal">
        {displaySummary}
      </p>

      {/* Clean key criteria pills if parsed from raw strings */}
      {parsedCriteria.length > 0 && (
        <div className="bg-paper/70 dark:bg-night/50 rounded-xl p-3.5 border border-line/60 dark:border-nightline/60">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-mist/60 block mb-2">
            {lang === 'hi' ? 'मुख्य पात्रता मानदंड' : 'Key Eligibility Criteria'}
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-ink/90 dark:text-mist/90">
            {parsedCriteria.map((crit, idx) => (
              <li key={`crit-${idx}`} className="flex items-center gap-2">
                <span className="text-saffron font-bold text-sm select-none">•</span>
                <span className="font-medium">{crit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* "Why?" list */}
      {hasWhyItems && (
        <div className="bg-paper/70 dark:bg-night/50 rounded-xl p-3.5 border border-line/60 dark:border-nightline/60 flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-mist/60">
            {t.whyHeader}
          </span>
          <ul className="space-y-1.5 text-sm" aria-label={t.whyHeader}>
            {passed.map((item, idx) => (
              <li key={`passed-${idx}`} className="flex items-start gap-2.5 text-ink dark:text-mist">
                <span className="text-leaf font-extrabold text-base leading-none select-none" aria-hidden="true">✓</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
            {missing.map((item, idx) => (
              <li key={`missing-${idx}`} className="flex items-start gap-2.5 text-amber-900 dark:text-amber-200">
                <span className="text-amber-600 font-extrabold text-base leading-none select-none" aria-hidden="true">?</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
            {failed.map((item, idx) => (
              <li key={`failed-${idx}`} className="flex items-start gap-2.5 text-ink/70 dark:text-mist/70">
                <span className="text-gray-400 font-extrabold text-base leading-none select-none" aria-hidden="true">✕</span>
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
            className="btn-primary w-full sm:w-auto"
          >
            {t.howToApply} →
          </button>
        )}

        {isNeedsInfo && (
          <button
            type="button"
            onClick={() => onAnswerMore && onAnswerMore(result.scheme_id)}
            className="btn-ghost w-full sm:w-auto font-bold"
          >
            {t.answerMore} →
          </button>
        )}

        {isNotEligible && null}
      </div>
    </div>
  );
}

export default ResultCard;
