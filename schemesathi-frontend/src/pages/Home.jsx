import React, { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Mic, Shield, ShieldCheck, ArrowRight } from 'lucide-react';
=======
>>>>>>> origin/master
import WhoTiles from '../components/WhoTiles';
import Chips from '../components/Chips';
import { coreStrings, translateText } from '../i18n';
import { extraStrings } from '../i18n.extra';
import { useVoice } from '../hooks/useVoice';

export function Home({
  lang,
  navigate,
  onStartChat,
  dismissPrivacyNote,
  setDismissPrivacyNote
}) {
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState('');
  const textareaRef = useRef(null);

  const tCore = coreStrings[lang] || coreStrings.en;
  const tExtra = extraStrings[lang] || extraStrings.en;

  const { isListening, voiceError, startListening, stopListening, clearVoiceError } = useVoice({ lang });

  // If user selected an example chip or typed a standard sentence, sync with language toggle
  useEffect(() => {
    if (inputText) {
      const translated = translateText(inputText, lang);
      if (translated && translated !== inputText) {
        setInputText(translated);
      }
    }
  }, [lang]);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    if (inputError) setInputError('');
  };

  const handleExampleClick = (example) => {
    setInputText(example);
    setInputError('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) {
      setInputError(tCore.emptyError);
      return;
    }
    setInputError('');
    onStartChat(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleToggleVoice = () => {
    clearVoiceError();
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setInputError('');
      });
    }
  };

  const handleTileSelect = (tile) => {
    onStartChat(tile.sentence, { initialChip: tile.label });
  };

  const trustItems = [
    tExtra.trustFree,
    tExtra.trustNoLogin,
    tExtra.trustNoAadhaar,
    tExtra.trustOfficial
  ];

  return (
<<<<<<< HEAD
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center py-6 sm:py-10 px-4 max-w-4xl mx-auto space-y-12 sm:space-y-16"
    >
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center space-y-5 max-w-2xl">
        {/* Verified Government Badge / Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#166534] text-xs sm:text-sm font-medium shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#166534]" aria-hidden="true" />
          <span>{tCore.note}</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1B1A] leading-[1.15] max-w-[18ch] mx-auto text-balance">
          {lang === 'hi' ? (
            <>
              जानिए कौन सी सरकारी योजना आपको <span className="italic text-[#166534]">वास्तव में</span> मिल सकती है
            </>
          ) : (
            <>
              Find Government Schemes You <span className="italic text-[#166534]">Actually</span> Qualify For
            </>
          )}
        </h1>

        {/* Lead paragraph */}
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-xl">
=======
    <div className="w-full flex flex-col items-center py-6 sm:py-10 px-4 max-w-4xl mx-auto space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center space-y-4 max-w-2xl">
        {/* Eyebrow */}
        <p className="text-leaf font-bold text-sm tracking-wide">
          {tCore.note}
        </p>

        {/* H1 Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink dark:text-mist leading-[1.15] max-w-[15ch] mx-auto text-balance">
          {tCore.h1}
        </h1>

        {/* Lead paragraph */}
        <p className="text-base sm:text-lg text-ink/80 dark:text-mist/80 leading-relaxed font-normal">
>>>>>>> origin/master
          {tCore.lead}
        </p>
      </section>

      {/* Assistant Card Box */}
      <section className="w-full max-w-2xl">
<<<<<<< HEAD
        <form onSubmit={handleSubmit} autoComplete="off" className="card shadow-soft p-4 sm:p-6 flex flex-col gap-4 border border-stone-200/90 rounded-2xl bg-white">
=======
        <form onSubmit={handleSubmit} className="card shadow-sm p-4 sm:p-6 flex flex-col gap-4">
>>>>>>> origin/master
          <label htmlFor="assistant-input" className="sr-only">
            {tCore.lead}
          </label>

          <textarea
            id="assistant-input"
            ref={textareaRef}
            rows={3}
<<<<<<< HEAD
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
=======
>>>>>>> origin/master
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={tCore.placeholder}
<<<<<<< HEAD
            className="w-full text-base sm:text-lg p-3.5 rounded-xl border border-stone-200 bg-[#F9F8F6]/80 text-[#1C1B1A] placeholder:text-stone-400 focus:border-[#166534] focus:bg-white resize-none transition-all"
=======
            className="w-full text-base sm:text-lg p-3 rounded-xl border border-line dark:border-nightline bg-paper/40 dark:bg-night/40 text-ink dark:text-mist placeholder:text-ink/40 dark:placeholder:text-mist/40 resize-none transition-colors"
>>>>>>> origin/master
          />

          {/* Inline Error */}
          {inputError && (
<<<<<<< HEAD
            <p role="alert" className="text-sm font-medium text-red-600">
=======
            <p role="alert" className="text-sm font-semibold text-red-600 dark:text-red-400">
>>>>>>> origin/master
              {inputError}
            </p>
          )}

          {/* Voice Error notice if any */}
          {voiceError && (
<<<<<<< HEAD
            <p role="alert" className="text-xs sm:text-sm text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
=======
            <p role="alert" className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800">
>>>>>>> origin/master
              {voiceError}
            </p>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleToggleVoice}
              aria-pressed={isListening}
<<<<<<< HEAD
              className={`btn border text-sm font-medium gap-2 ${
                isListening
                  ? 'bg-[#166534] text-white border-[#166534] animate-pulse shadow-sm'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-[#166534]'}`} aria-hidden="true" />
              <span>{isListening ? tCore.listening : tCore.speak}</span>
=======
              className={`btn border border-line dark:border-nightline text-sm font-semibold gap-2 ${
                isListening
                  ? 'bg-saffron text-ink border-saffron animate-pulse'
                  : 'bg-white dark:bg-nightcard text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-ink' : 'bg-red-500'}`} aria-hidden="true" />
              <span>{isListening ? tCore.listening : `● ${tCore.speak}`}</span>
>>>>>>> origin/master
            </button>

            <button
              type="submit"
<<<<<<< HEAD
              className="btn-primary text-base font-medium px-6 py-2.5"
=======
              className="btn-primary text-base font-bold px-6 py-2.5"
>>>>>>> origin/master
            >
              {tCore.start}
            </button>
          </div>
        </form>

        {/* Try an Example */}
        <div className="mt-5 flex flex-col items-center gap-2">
<<<<<<< HEAD
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
=======
          <span className="text-xs font-semibold text-ink/60 dark:text-mist/60 uppercase tracking-wider">
>>>>>>> origin/master
            {tCore.tryExample}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {tCore.examples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(example)}
<<<<<<< HEAD
                className="chip text-xs sm:text-sm hover:border-[#166534]/40 hover:bg-white transition-all text-stone-700"
=======
                className="chip text-xs sm:text-sm hover:border-saffron hover:bg-white dark:hover:bg-nightcard transition-all"
>>>>>>> origin/master
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Or Tap Who You Are */}
      <section className="relative z-10 w-full max-w-3xl flex flex-col items-center space-y-4">
<<<<<<< HEAD
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
=======
        <h2 className="text-sm font-bold text-ink/70 dark:text-mist/70 uppercase tracking-wider">
>>>>>>> origin/master
          {tCore.orTap}
        </h2>
        <WhoTiles lang={lang} onSelect={handleTileSelect} />
      </section>

      {/* Problem Section */}
      <section className="relative z-10 w-full max-w-2xl text-center space-y-2 py-4">
<<<<<<< HEAD
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1B1A]">
          {tExtra.problemHeading}
        </h2>
        <p className="text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
=======
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-mist">
          {tExtra.problemHeading}
        </h2>
        <p className="text-base text-ink/80 dark:text-mist/80 max-w-xl mx-auto leading-relaxed">
>>>>>>> origin/master
          {tExtra.problemSub}
        </p>
      </section>

      {/* How it Works: 3 Numbered Cards */}
      <section className="relative z-10 w-full max-w-3xl space-y-4">
<<<<<<< HEAD
        <h2 className="text-2xl font-serif font-bold text-center text-[#1C1B1A]">
=======
        <h2 className="text-2xl font-bold text-center text-ink dark:text-mist">
>>>>>>> origin/master
          {tExtra.howHeading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<<<<<<< HEAD
          <div className="card flex flex-col gap-3 p-5 rounded-xl border border-stone-200/80 hover:border-[#166534]/30 hover:shadow-soft transition-all">
            <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center text-sm shadow-xs select-none">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1C1B1A]">
              {tExtra.howStep1Title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
=======
          <div className="card flex flex-col gap-3 p-5">
            <div className="w-8 h-8 rounded-full bg-saffron text-ink font-black flex items-center justify-center text-sm shadow-sm select-none">
              1
            </div>
            <h3 className="font-bold text-lg text-ink dark:text-mist">
              {tExtra.howStep1Title}
            </h3>
            <p className="text-sm text-ink/80 dark:text-mist/80 leading-relaxed">
>>>>>>> origin/master
              {tExtra.howStep1Desc}
            </p>
          </div>

<<<<<<< HEAD
          <div className="card flex flex-col gap-3 p-5 rounded-xl border border-stone-200/80 hover:border-[#166534]/30 hover:shadow-soft transition-all">
            <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center text-sm shadow-xs select-none">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1C1B1A]">
              {tExtra.howStep2Title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
=======
          <div className="card flex flex-col gap-3 p-5">
            <div className="w-8 h-8 rounded-full bg-saffron text-ink font-black flex items-center justify-center text-sm shadow-sm select-none">
              2
            </div>
            <h3 className="font-bold text-lg text-ink dark:text-mist">
              {tExtra.howStep2Title}
            </h3>
            <p className="text-sm text-ink/80 dark:text-mist/80 leading-relaxed">
>>>>>>> origin/master
              {tExtra.howStep2Desc}
            </p>
          </div>

<<<<<<< HEAD
          <div className="card flex flex-col gap-3 p-5 rounded-xl border border-stone-200/80 hover:border-[#166534]/30 hover:shadow-soft transition-all">
            <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center text-sm shadow-xs select-none">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1C1B1A]">
              {tExtra.howStep3Title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
=======
          <div className="card flex flex-col gap-3 p-5">
            <div className="w-8 h-8 rounded-full bg-saffron text-ink font-black flex items-center justify-center text-sm shadow-sm select-none">
              3
            </div>
            <h3 className="font-bold text-lg text-ink dark:text-mist">
              {tExtra.howStep3Title}
            </h3>
            <p className="text-sm text-ink/80 dark:text-mist/80 leading-relaxed">
>>>>>>> origin/master
              {tExtra.howStep3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="relative z-10 w-full flex flex-col items-center gap-6 pt-2">
        <Chips items={trustItems} variant="trust" ariaLabel="Trust guarantees" className="justify-center" />

        <button
          type="button"
          onClick={() => navigate('/schemes')}
<<<<<<< HEAD
          className="btn border border-stone-200 bg-white text-[#1C1B1A] font-medium px-6 py-2.5 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
=======
          className="btn border border-line dark:border-nightline bg-white dark:bg-nightcard text-ink dark:text-mist font-semibold px-6 py-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
>>>>>>> origin/master
        >
          {tExtra.browseAllSchemes}
        </button>
      </section>

      {/* Privacy Dismissible Note (Home only) */}
      {!dismissPrivacyNote && (
        <aside
          role="complementary"
          aria-label="Privacy guarantee"
<<<<<<< HEAD
          className="relative z-10 w-full max-w-xl p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-3 text-sm text-[#1C1B1A]">
            <Shield className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-snug text-stone-700">
=======
          className="relative z-10 w-full max-w-xl p-4 rounded-2xl border border-line dark:border-nightline bg-white/90 dark:bg-nightcard/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-3 text-sm text-ink/90 dark:text-mist/90">
            <span className="text-leaf text-lg leading-none" aria-hidden="true">🔒</span>
            <p className="leading-snug">
>>>>>>> origin/master
              {tExtra.privacyText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissPrivacyNote(true)}
<<<<<<< HEAD
            className="btn-ghost text-xs font-semibold px-3 py-1.5 self-end sm:self-auto shrink-0"
=======
            className="btn-ghost text-xs font-bold px-3 py-1.5 self-end sm:self-auto shrink-0"
>>>>>>> origin/master
          >
            {tExtra.gotIt}
          </button>
        </aside>
      )}
<<<<<<< HEAD
    </motion.div>
=======
    </div>
>>>>>>> origin/master
  );
}

export default Home;
