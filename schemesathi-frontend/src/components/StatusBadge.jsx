import React from 'react';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { coreStrings } from '../i18n';

export function StatusBadge({ status, lang = 'en', className = '' }) {
  const t = coreStrings[lang] || coreStrings.en;

  const normalized = (status || '').toLowerCase();

  if (normalized === 'potentially_eligible' || normalized === 'eligible') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#166534] border border-emerald-200 select-none ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0" aria-hidden="true" />
        <span>{t.mayBeEligible}</span>
      </span>
    );
  }

  if (normalized === 'needs_information') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 select-none ${className}`}
      >
        <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" aria-hidden="true" />
        <span>{t.needMoreDetails}</span>
      </span>
    );
  }

  // default / not_eligible
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200 select-none ${className}`}
    >
      <XCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />
      <span>{t.notEligible}</span>
    </span>
  );
}

export default StatusBadge;
