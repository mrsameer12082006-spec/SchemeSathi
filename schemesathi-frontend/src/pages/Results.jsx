import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8"
    >
      {/* Header */}
      <header className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
          {tCore.resultsTitle}
        </h1>
        <p className="text-base sm:text-lg font-normal text-stone-600">
          {tCore.checkedSchemes.replace('{n}', String(results.length))}
        </p>

        {/* Summary tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {summaryTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white border border-stone-200 text-[#1C1B1A] shadow-sm select-none"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* "What I understood" line */}
      {profileChips.length > 0 && (
        <section className="p-4 rounded-xl bg-white border border-stone-200 space-y-2 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
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
      <section className="flex items-center justify-center pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onStartAgain}
          className="btn-ghost font-medium text-[#1C1B1A] px-6 py-3 w-full sm:w-auto border border-stone-300"
        >
          {tCore.startAgain}
        </button>
      </section>

      {/* Footer guidance note */}
      <p className="text-center text-xs text-stone-500 pt-2">
        {tCore.guidance}
      </p>
    </motion.div>
  );
}

export default Results;
