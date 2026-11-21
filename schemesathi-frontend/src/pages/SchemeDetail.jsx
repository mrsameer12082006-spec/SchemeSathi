import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Volume2, Pause, Gift, FileText, Send, Info, ShieldCheck, ExternalLink } from 'lucide-react';
=======
>>>>>>> origin/master
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

<<<<<<< HEAD
  const { speak, isSpeaking, cancelSpeech, activePlayingId } = useVoice({ lang });
=======
  const { speak } = useVoice({ lang });
>>>>>>> origin/master

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
<<<<<<< HEAD
    if (activePlayingId === 'steps') {
      cancelSpeech();
    } else {
      speak(textToRead, { id: 'steps' });
    }
=======
    speak(textToRead);
>>>>>>> origin/master
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 flex flex-col items-center justify-center gap-4">
<<<<<<< HEAD
        <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-medium text-stone-500">{tExtra.loading}</p>
=======
        <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-semibold text-ink/70 dark:text-mist/70">{tExtra.loading}</p>
>>>>>>> origin/master
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
<<<<<<< HEAD
        <p className="text-xl font-medium text-red-600">
=======
        <p className="text-xl font-bold text-red-600 dark:text-red-400">
>>>>>>> origin/master
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

<<<<<<< HEAD
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8"
    >
=======

  return (
    <article className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8">
>>>>>>> origin/master
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
<<<<<<< HEAD
          className="text-sm font-medium text-stone-600 hover:text-[#166534] hover:underline flex items-center gap-1.5 cursor-pointer"
=======
          className="text-sm font-semibold text-ink/70 dark:text-mist/70 hover:text-ink dark:hover:text-mist hover:underline flex items-center gap-1.5 cursor-pointer"
>>>>>>> origin/master
        >
          <span aria-hidden="true">←</span>
          <span>{results && results.length > 0 ? tExtra.backToResults : tExtra.backToSchemes}</span>
        </button>
      </div>

      {/* Demo Warning Banner */}
      {scheme.demo && (
        <div
          role="note"
<<<<<<< HEAD
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-center gap-2 shadow-sm"
=======
          className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-center gap-2"
>>>>>>> origin/master
        >
          <span aria-hidden="true">⚠️</span>
          <span>{tExtra.demoSchemeWarning}</span>
        </div>
      )}

      {/* Scheme Title & Status */}
<<<<<<< HEAD
      <header className="space-y-3 pb-4 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
=======
      <header className="space-y-3 pb-4 border-b border-line dark:border-nightline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
>>>>>>> origin/master
            {scheme.name}
          </h1>
          <StatusBadge status={status} lang={lang} />
        </div>
<<<<<<< HEAD
        <p className="text-base text-stone-600 leading-relaxed font-normal">
=======
        <p className="text-base text-ink/80 dark:text-mist/80">
>>>>>>> origin/master
          {scheme.summary}
        </p>
      </header>

      {/* What You Get (Benefits) */}
<<<<<<< HEAD
      <section className="card space-y-3 bg-white border border-stone-200/90 shadow-sm rounded-xl">
        <h2 className="font-serif text-xl font-bold text-[#1C1B1A] flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#166534]" aria-hidden="true" />
          <span>{tExtra.whatYouGet}</span>
        </h2>
        <p className="text-base text-stone-700 leading-relaxed font-normal">
=======
      <section className="card space-y-3">
        <h2 className="text-xl font-bold text-ink dark:text-mist flex items-center gap-2">
          <span>🎁</span> {tExtra.whatYouGet}
        </h2>
        <p className="text-base text-ink/90 dark:text-mist/90 leading-relaxed">
>>>>>>> origin/master
          {scheme.benefits}
        </p>
      </section>

      {/* Documents to keep ready (Interactive Checklist) */}
<<<<<<< HEAD
      <section className="card space-y-4 bg-white border border-stone-200/90 shadow-sm rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-xl font-bold text-[#1C1B1A] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#166534]" aria-hidden="true" />
            <span>{tExtra.documentsToKeep}</span>
          </h2>
          <span className="text-sm font-medium text-stone-500">
=======
      <section className="card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-ink dark:text-mist flex items-center gap-2">
            <span>📋</span> {tExtra.documentsToKeep}
          </h2>
          <span className="text-sm font-bold text-ink/70 dark:text-mist/70">
>>>>>>> origin/master
            {tExtra.readyProgress.replace('{ready}', String(checkedCount)).replace('{total}', String(totalCount))}
          </span>
        </div>

        {/* Progress bar */}
<<<<<<< HEAD
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
          <div
            className="h-full bg-[#166534] transition-all duration-300 rounded-full"
=======
        <div className="w-full h-2 bg-line dark:bg-nightline rounded-full overflow-hidden">
          <div
            className="h-full bg-saffron transition-all duration-300 rounded-full"
>>>>>>> origin/master
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
<<<<<<< HEAD
                className={`flex items-start gap-3 p-3 rounded-xl border border-stone-200 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-stone-50 text-stone-400'
                    : 'bg-white hover:border-[#166534]/50'
=======
                className={`flex items-start gap-3 p-3 rounded-xl border border-line/60 dark:border-nightline/60 cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-paper/40 dark:bg-night/30'
                    : 'bg-white dark:bg-nightcard hover:border-saffron'
>>>>>>> origin/master
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDoc(idx)}
<<<<<<< HEAD
                  className="w-5 h-5 mt-0.5 rounded text-[#166534] focus:ring-[#166534] cursor-pointer accent-[#166534]"
=======
                  className="w-5 h-5 mt-0.5 rounded text-saffron focus:ring-saffron cursor-pointer"
>>>>>>> origin/master
                />
                <span
                  className={`text-base select-none leading-snug ${
                    isChecked
<<<<<<< HEAD
                      ? 'line-through text-stone-400'
                      : 'text-[#1C1B1A] font-normal'
=======
                      ? 'line-through text-ink/50 dark:text-mist/50'
                      : 'text-ink dark:text-mist font-medium'
>>>>>>> origin/master
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
<<<<<<< HEAD
      <section className="card space-y-4 bg-white border border-stone-200/90 shadow-sm rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-xl font-bold text-[#1C1B1A] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#166534]" aria-hidden="true" />
            <span>{tExtra.howToApplyHeading}</span>
=======
      <section className="card space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-ink dark:text-mist flex items-center gap-2">
            <span>🚀</span> {tExtra.howToApplyHeading}
>>>>>>> origin/master
          </h2>
          <button
            type="button"
            onClick={handleListenSteps}
<<<<<<< HEAD
            className={`text-xs font-semibold px-3 py-1.5 flex items-center gap-1.5 rounded-lg transition-colors cursor-pointer ${
              activePlayingId === 'steps'
                ? 'bg-[#166534] text-white shadow-sm'
                : 'btn-ghost'
            }`}
            aria-label={activePlayingId === 'steps' ? (lang === 'hi' ? 'रोकें' : 'Stop') : tExtra.listenSteps}
          >
            {activePlayingId === 'steps' ? <Pause className="w-3.5 h-3.5 text-inherit" aria-hidden="true" /> : <Volume2 className="w-3.5 h-3.5 text-inherit" aria-hidden="true" />}
            <span>{activePlayingId === 'steps' ? (lang === 'hi' ? 'रोकें' : 'Stop') : tExtra.listenSteps}</span>
            {activePlayingId === 'steps' && (
              <span className="flex items-center gap-0.5 ml-1" aria-hidden="true">
                <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </span>
            )}
=======
            className="btn-ghost text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
            aria-label={tExtra.listenSteps}
          >
            <span aria-hidden="true">🔊</span>
            <span>{tExtra.listenSteps}</span>
>>>>>>> origin/master
          </button>
        </div>

        <ol className="space-y-3 list-none counter-reset">
          {(scheme.steps || []).map((step, idx) => (
<<<<<<< HEAD
            <li key={idx} className="flex items-start gap-3 text-base text-stone-700 leading-relaxed font-normal">
              <span className="w-6 h-6 rounded-full bg-[#166534]/10 text-[#166534] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
=======
            <li key={idx} className="flex items-start gap-3 text-base text-ink dark:text-mist leading-relaxed">
              <span className="w-6 h-6 rounded-full bg-saffron/20 text-ink dark:text-mist font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
>>>>>>> origin/master
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* CSC Explanation line */}
<<<<<<< HEAD
        <div className="p-3.5 rounded-xl bg-[#F9F8F6] border border-stone-200 text-xs sm:text-sm text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
=======
        <div className="p-3.5 rounded-xl bg-paper/70 dark:bg-night/40 border border-line/60 dark:border-nightline/60 text-xs sm:text-sm text-ink/80 dark:text-mist/80">
          <p className="leading-relaxed">
            <span className="font-bold text-ink dark:text-mist">ℹ️ </span>
>>>>>>> origin/master
            {tExtra.cscExplanation}
          </p>
        </div>
      </section>

      {/* Official Website Action */}
      <section className="space-y-4">
        <div>
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
<<<<<<< HEAD
            className="btn-primary text-center flex items-center justify-center gap-2 text-base font-medium w-full"
          >
            <span>{tCore.openOfficial}</span>
            <ExternalLink className="w-4 h-4 text-inherit" aria-hidden="true" />
          </a>
        </div>

        {/* Scam Warning */}
        <div
          role="note"
          className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-start gap-2.5 shadow-sm"
        >
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
=======
            className="btn-primary text-center flex items-center justify-center gap-2 text-base font-bold w-full"
          >
            <span>{tCore.openOfficial}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Amber Scam Warning */}
        <div
          role="note"
          className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-sm font-semibold flex items-start gap-2.5 shadow-sm"
        >
          <span className="text-base select-none leading-none" aria-hidden="true">🛡️</span>
>>>>>>> origin/master
          <p className="leading-snug">{tCore.scam}</p>
        </div>

        {/* Source line */}
<<<<<<< HEAD
        <div className="pt-2 text-xs text-stone-500 space-y-1">
          <p>
            <span className="font-medium text-stone-600">{tExtra.lastChecked}: </span>
            {scheme.last_verified || tExtra.lastCheckedDemo}
          </p>
          <p className="truncate">
            <span className="font-medium text-stone-600">URL: </span>
=======
        <div className="pt-2 text-xs text-ink/60 dark:text-mist/60 space-y-1">
          <p>
            <span className="font-semibold">{tExtra.lastChecked}: </span>
            {scheme.last_verified || tExtra.lastCheckedDemo}
          </p>
          <p className="truncate">
            <span className="font-semibold">URL: </span>
>>>>>>> origin/master
            <a
              href={scheme.official_url}
              target="_blank"
              rel="noopener noreferrer"
<<<<<<< HEAD
              className="underline hover:text-[#166534]"
=======
              className="underline hover:text-ink dark:hover:text-mist"
>>>>>>> origin/master
            >
              {scheme.official_url}
            </a>
          </p>
        </div>
      </section>
<<<<<<< HEAD
    </motion.article>
=======
    </article>
>>>>>>> origin/master
  );
}

export default SchemeDetail;
