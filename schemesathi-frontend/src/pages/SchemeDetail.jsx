import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import { getSchemeById } from '../services/api';
import { coreStrings } from '../i18n';
import { extraStrings } from '../i18n.extra';
import { useVoice } from '../hooks/useVoice';

export function SchemeDetail({
  id,
  lang = 'en',
  results = [],
  navigate
}) {
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState({});

  const tCore = coreStrings[lang] || coreStrings.en;
  const tExtra = extraStrings[lang] || extraStrings.en;

  const { speak } = useVoice({ lang });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getSchemeById(id, lang)
      .then((data) => {
        if (isMounted) {
          setScheme(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load scheme:", err);
        if (isMounted) {
          setError(tExtra.notFound);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, lang]);

  const toggleDoc = (index) => {
    setCheckedDocs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleListenSteps = () => {
    if (!scheme?.steps) return;
    const textToRead = scheme.steps.map((s, i) => `${i + 1}. ${s}`).join('. ');
    speak(textToRead);
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-semibold text-ink/70 dark:text-mist/70">{tExtra.loading}</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-xl font-bold text-red-600 dark:text-red-400">
          {error || tExtra.notFound}
        </p>
        <button
          type="button"
          onClick={() => navigate('/schemes')}
          className="btn-primary"
        >
          {tExtra.backToSchemes}
        </button>
      </div>
    );
  }

  // Find if this scheme has an active status in results
  const matchingResult = results.find(r => r.scheme_id === scheme.id);
  const status = matchingResult?.status || 'potentially_eligible';

  const documents = scheme.documents || [];
  const checkedCount = documents.filter((_, idx) => checkedDocs[idx]).length;
  const totalCount = documents.length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // Generate WhatsApp Share text
  const shareText = encodeURIComponent(
    `${scheme.name}\n\n` +
    `${tExtra.whatYouGet}:\n${scheme.benefits}\n\n` +
    `${tExtra.documentsToKeep}:\n` +
    documents.map(d => `• ${d}`).join('\n') +
    `\n\n${tExtra.howToApplyHeading}:\n` +
    (scheme.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n') +
    `\n\n${tCore.openOfficial}: ${scheme.official_url}`
  );
  const whatsappUrl = `https://wa.me/?text=${shareText}`;

  return (
    <article className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => {
            if (results && results.length > 0) {
              navigate('/results');
            } else {
              navigate('/schemes');
            }
          }}
          className="text-sm font-semibold text-ink/70 dark:text-mist/70 hover:text-ink dark:hover:text-mist hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span aria-hidden="true">←</span>
          <span>{results && results.length > 0 ? tExtra.backToResults : tExtra.backToSchemes}</span>
        </button>
      </div>

      {/* Demo Warning Banner */}
      {scheme.demo && (
        <div
          role="note"
          className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-center gap-2"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{tExtra.demoSchemeWarning}</span>
        </div>
      )}

      {/* Scheme Title & Status */}
      <header className="space-y-3 pb-4 border-b border-line dark:border-nightline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
            {scheme.name}
          </h1>
          <StatusBadge status={status} lang={lang} />
        </div>
        <p className="text-base text-ink/80 dark:text-mist/80">
          {scheme.summary}
        </p>
      </header>

      {/* What You Get (Benefits) */}
      <section className="card space-y-3">
        <h2 className="text-xl font-bold text-ink dark:text-mist flex items-center gap-2">
          <span>🎁</span> {tExtra.whatYouGet}
        </h2>
        <p className="text-base text-ink/90 dark:text-mist/90 leading-relaxed">
          {scheme.benefits}
        </p>
      </section>

      {/* Documents to keep ready (Interactive Checklist) */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-ink dark:text-mist flex items-center gap-2">
            <span>📋</span> {tExtra.documentsToKeep}
          </h2>
          <span className="text-sm font-bold text-ink/70 dark:text-mist/70">
            {tExtra.readyProgress.replace('{ready}', String(checkedCount)).replace('{total}', String(totalCount))}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-line dark:bg-nightline rounded-full overflow-hidden">
          <div
            className="h-full bg-saffron transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={checkedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label={`${checkedCount} of ${totalCount} documents ready`}
          />
        </div>

        {/* Checklist */}
        <fieldset className="space-y-2.5 pt-1">
          <legend className="sr-only">{tExtra.documentsToKeep}</legend>
          {documents.map((doc, idx) => {
            const isChecked = !!checkedDocs[idx];
            return (
              <label
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl border border-line/60 dark:border-nightline/60 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-paper/40 dark:bg-night/30'
                    : 'bg-white dark:bg-nightcard hover:border-saffron'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDoc(idx)}
                  className="w-5 h-5 mt-0.5 rounded text-saffron focus:ring-saffron cursor-pointer"
                />
                <span
                  className={`text-base select-none leading-snug ${
                    isChecked
                      ? 'line-through text-ink/50 dark:text-mist/50'
                      : 'text-ink dark:text-mist font-medium'
                  }`}
                >
                  {doc}
                </span>
              </label>
            );
          })}
        </fieldset>
      </section>

      {/* How to Apply */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-ink dark:text-mist flex items-center gap-2">
            <span>🚀</span> {tExtra.howToApplyHeading}
          </h2>
          <button
            type="button"
            onClick={handleListenSteps}
            className="btn-ghost text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
            aria-label={tExtra.listenSteps}
          >
            <span aria-hidden="true">🔊</span>
            <span>{tExtra.listenSteps}</span>
          </button>
        </div>

        <ol className="space-y-3 list-none counter-reset">
          {(scheme.steps || []).map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base text-ink dark:text-mist leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-saffron/20 text-ink dark:text-mist font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* CSC Explanation line */}
        <div className="p-3.5 rounded-xl bg-paper/70 dark:bg-night/40 border border-line/60 dark:border-nightline/60 text-xs sm:text-sm text-ink/80 dark:text-mist/80">
          <p className="leading-relaxed">
            <span className="font-bold text-ink dark:text-mist">ℹ️ </span>
            {tExtra.cscExplanation}
          </p>
        </div>
      </section>

      {/* Official Website & WhatsApp Share Actions */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center flex items-center justify-center gap-2 text-base font-bold flex-1"
          >
            <span>{tCore.openOfficial}</span>
            <span aria-hidden="true">↗</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
            </svg>
            <span>{tCore.share}</span>
          </a>
        </div>

        {/* Amber Scam Warning */}
        <div
          role="note"
          className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-start gap-2.5 shadow-sm"
        >
          <span className="text-base select-none leading-none" aria-hidden="true">🛡️</span>
          <p className="leading-snug">{tCore.scam}</p>
        </div>

        {/* Source line */}
        <div className="pt-2 text-xs text-ink/60 dark:text-mist/60 space-y-1">
          <p>
            <span className="font-semibold">{tExtra.lastChecked}: </span>
            {scheme.last_verified || tExtra.lastCheckedDemo}
          </p>
          <p className="truncate">
            <span className="font-semibold">URL: </span>
            <a
              href={scheme.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink dark:hover:text-mist"
            >
              {scheme.official_url}
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}

export default SchemeDetail;
