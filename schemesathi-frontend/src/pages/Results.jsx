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

  // Generate WhatsApp summary text
  const generateWhatsAppShare = () => {
    const lines = [];
    if (lang === 'hi') {
      lines.push("📢 SchemeSathi सरकारी योजना नतीजे:");
      lines.push(`हमने आपके लिए ${results.length} योजनाओं की जाँच की है।`);
      sortedResults.forEach(r => {
        const s = (r.status || '').toLowerCase();
        let statusStr = tCore.notEligible;
        if (s === 'potentially_eligible' || s === 'eligible') statusStr = tCore.mayBeEligible;
        if (s === 'needs_information') statusStr = tCore.needMoreDetails;
        lines.push(`• ${r.name}: ${statusStr}`);
      });
      lines.push("\nमुफ़्त में अपनी योजनाएँ देखें: SchemeSathi");
    } else {
      lines.push("📢 SchemeSathi Government Schemes Results:");
      lines.push(`We checked ${results.length} schemes for you.`);
      sortedResults.forEach(r => {
        const s = (r.status || '').toLowerCase();
        let statusStr = tCore.notEligible;
        if (s === 'potentially_eligible' || s === 'eligible') statusStr = tCore.mayBeEligible;
        if (s === 'needs_information') statusStr = tCore.needMoreDetails;
        lines.push(`• ${r.name}: ${statusStr}`);
      });
      lines.push("\nCheck your government schemes free at SchemeSathi");
    }

    return encodeURIComponent(lines.join("\n"));
  };

  const whatsappUrl = `https://wa.me/?text=${generateWhatsAppShare()}`;

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

      {/* Bottom Actions: Share on WhatsApp & Start Again */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line dark:border-nightline">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] rounded-xl px-5 py-3 w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm"
        >
          {/* WhatsApp icon */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
          </svg>
          <span>{tCore.share}</span>
        </a>

        <button
          type="button"
          onClick={onStartAgain}
          className="btn-ghost font-bold text-ink dark:text-mist px-5 py-3 w-full sm:w-auto"
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
