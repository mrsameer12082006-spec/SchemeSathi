import React from 'react';
import { coreStrings } from '../i18n';

export function StatusBadge({ status, lang = 'en', className = '' }) {
  const t = coreStrings[lang] || coreStrings.en;

  const normalized = (status || '').toLowerCase();

  if (normalized === 'potentially_eligible' || normalized === 'eligible') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-leaf/15 text-leaf border border-leaf/30 dark:bg-leaf/20 dark:text-emerald-400 dark:border-leaf/40 select-none ${className}`}
      >
        <span aria-hidden="true" className="font-extrabold text-sm leading-none">✓</span>
        <span>{t.mayBeEligible}</span>
      </span>
    );
  }

  if (normalized === 'needs_information') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/60 select-none ${className}`}
      >
        <span aria-hidden="true" className="font-extrabold text-sm leading-none">?</span>
        <span>{t.needMoreDetails}</span>
      </span>
    );
  }

  // default / not_eligible
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300 dark:bg-nightline/60 dark:text-gray-300 dark:border-nightline select-none ${className}`}
    >
      <span aria-hidden="true" className="font-extrabold text-sm leading-none">✕</span>
      <span>{t.notEligible}</span>
    </span>
  );
}

export default StatusBadge;
