import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Pause, Gift, FileText, Send, Info, ShieldCheck, ExternalLink } from 'lucide-react';
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

  const { speak, isSpeaking, cancelSpeech, activePlayingId } = useVoice({ lang });

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
    if (activePlayingId === 'steps') {
      cancelSpeech();
    } else {
      speak(textToRead, { id: 'steps' });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 px-4 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-medium text-stone-500">{tExtra.loading}</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-xl font-medium text-red-600">
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8"
    >
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
          className="text-sm font-medium text-stone-600 hover:text-[#166534] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span aria-hidden="true">←</span>
          <span>{results && results.length > 0 ? tExtra.backToResults : tExtra.backToSchemes}</span>
        </button>
      </div>

      {/* Demo Warning Banner */}
      {scheme.demo && (
        <div
          role="note"
          className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{tExtra.demoSchemeWarning}</span>
        </div>
      )}

      {/* Scheme Title & Status */}
      <header className="space-y-3 pb-4 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
            {scheme.name}
          </h1>
          <StatusBadge status={status} lang={lang} />
        </div>
        <p className="text-base text-stone-600 leading-relaxed font-normal">
          {scheme.summary}
        </p>
      </header>

      {/* What You Get (Benefits) */}
      <section className="card space-y-3 bg-white border border-stone-200/90 shadow-sm rounded-xl">
        <h2 className="font-serif text-xl font-bold text-[#1C1B1A] flex items-center gap-2">
          <Gift className="w-5 h-5 text-[#166534]" aria-hidden="true" />
          <span>{tExtra.whatYouGet}</span>
        </h2>
        <p className="text-base text-stone-700 leading-relaxed font-normal">
          {scheme.benefits}
        </p>
      </section>

      {/* Documents to keep ready (Interactive Checklist) */}
      <section className="card space-y-4 bg-white border border-stone-200/90 shadow-sm rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-xl font-bold text-[#1C1B1A] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#166534]" aria-hidden="true" />
            <span>{tExtra.documentsToKeep}</span>
          </h2>
          <span className="text-sm font-medium text-stone-500">
            {tExtra.readyProgress.replace('{ready}', String(checkedCount)).replace('{total}', String(totalCount))}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
          <div
            className="h-full bg-[#166534] transition-all duration-300 rounded-full"
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
                className={`flex items-start gap-3 p-3 rounded-xl border border-stone-200 cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-stone-50 text-stone-400'
                    : 'bg-white hover:border-[#166534]/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDoc(idx)}
                  className="w-5 h-5 mt-0.5 rounded text-[#166534] focus:ring-[#166534] cursor-pointer accent-[#166534]"
                />
                <span
                  className={`text-base select-none leading-snug ${
                    isChecked
                      ? 'line-through text-stone-400'
                      : 'text-[#1C1B1A] font-normal'
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
      <section className="card space-y-4 bg-white border border-stone-200/90 shadow-sm rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-serif text-xl font-bold text-[#1C1B1A] flex items-center gap-2">
            <Send className="w-5 h-5 text-[#166534]" aria-hidden="true" />
            <span>{tExtra.howToApplyHeading}</span>
          </h2>
          <button
            type="button"
            onClick={handleListenSteps}
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
          </button>
        </div>

        <ol className="space-y-3 list-none counter-reset">
          {(scheme.steps || []).map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base text-stone-700 leading-relaxed font-normal">
              <span className="w-6 h-6 rounded-full bg-[#166534]/10 text-[#166534] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* CSC Explanation line */}
        <div className="p-3.5 rounded-xl bg-[#F9F8F6] border border-stone-200 text-xs sm:text-sm text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
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
          <p className="leading-snug">{tCore.scam}</p>
        </div>

        {/* Source line */}
        <div className="pt-2 text-xs text-stone-500 space-y-1">
          <p>
            <span className="font-medium text-stone-600">{tExtra.lastChecked}: </span>
            {scheme.last_verified || tExtra.lastCheckedDemo}
          </p>
          <p className="truncate">
            <span className="font-medium text-stone-600">URL: </span>
            <a
              href={scheme.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#166534]"
            >
              {scheme.official_url}
            </a>
          </p>
        </div>
      </section>
    </motion.article>
  );
}

export default SchemeDetail;
