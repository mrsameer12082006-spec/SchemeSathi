import React from 'react';
import ResultCard from '../components/ResultCard';
import Chips from '../components/Chips';
import { coreStrings } from '../i18n';
import { extraStrings } from '../i18n.extra';

export function Results({
  lang = 'en',
  results = [],
  profile = {},
  onHowToApply,
  onAnswerMore,
  onStartAgain
}) {
  const tCore = coreStrings[lang] || coreStrings.en;
  const tExtra = extraStrings[lang] || extraStrings.en;

  // Ordering schemes:
  // 1. potentially_eligible / eligible
  // 2. needs_information
  // 3. not_eligible
  const rank = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'potentially_eligible' || s === 'eligible') return 1;
    if (s === 'needs_information') return 2;
    return 3;
  };

  const sortedResults = [...results].sort((a, b) => rank(a.status) - rank(b.status));

  // Count summaries
  const eligibleCount = results.filter(r => {
    const s = (r.status || '').toLowerCase();
    return s === 'potentially_eligible' || s === 'eligible';
  }).length;

  const needsInfoCount = results.filter(r => {
    const s = (r.status || '').toLowerCase();
    return s === 'needs_information';
  }).length;

  const notEligibleCount = results.filter(r => {
    const s = (r.status || '').toLowerCase();
    return s === 'not_eligible';
  }).length;

  // Build summary tags
  const summaryTags = [];
  if (eligibleCount > 0) {
    summaryTags.push(`${eligibleCount} · ${tCore.mayBeEligible}`);
  }
  if (needsInfoCount > 0) {
    const detailLabel = needsInfoCount === 1 ? tCore.needNDetail.replace('{n}', '1') : tCore.needNDetails.replace('{n}', String(needsInfoCount));
    summaryTags.push(`${needsInfoCount} · ${detailLabel}`);
  }
  if (notEligibleCount > 0) {
    summaryTags.push(`${notEligibleCount} · ${tCore.notEligible}`);
  }

  // Profile chips
  const profileChips = Object.entries(profile).map(([, val]) => `${val}`);


  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
          {tCore.resultsTitle}
        </h1>
        <p className="text-base sm:text-lg font-medium text-ink/80 dark:text-mist/80">
          {tCore.checkedSchemes.replace('{n}', String(results.length))}
        </p>

        {/* Summary tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {summaryTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-white dark:bg-nightcard border border-line dark:border-nightline text-ink dark:text-mist shadow-none select-none"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* "What I understood" line */}
      {profileChips.length > 0 && (
        <section className="p-4 rounded-2xl bg-white dark:bg-nightcard border border-line dark:border-nightline space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-mist/60">
            {tCore.understood}
          </p>
          <Chips items={profileChips} variant="display" ariaLabel={tCore.understood} />
        </section>
      )}

      {/* Result Cards List */}
      <section className="space-y-4" aria-label="Schemes eligibility list">
        {sortedResults.map((result) => (
          <ResultCard
            key={result.scheme_id}
            result={result}
            lang={lang}
            onHowToApply={onHowToApply}
            onAnswerMore={onAnswerMore}
          />
        ))}
      </section>

      {/* Bottom Actions: Start Again */}
      <section className="flex items-center justify-center pt-4 border-t border-line dark:border-nightline">
        <button
          type="button"
          onClick={onStartAgain}
          className="btn-ghost font-bold text-ink dark:text-mist px-6 py-3 w-full sm:w-auto"
        >
          {tCore.startAgain}
        </button>
      </section>

      {/* Footer guidance note */}
      <p className="text-center text-xs text-ink/60 dark:text-mist/60 pt-2">
        {tCore.guidance}
      </p>
    </div>
  );
}

export default Results;
