import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Shield, ShieldCheck, ArrowRight } from 'lucide-react';
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
      startListening(
        (finalTranscript) => {
          if (finalTranscript) {
            setInputText(finalTranscript.trim());
            setInputError('');
          }
        },
        (interimTranscript) => {
          if (interimTranscript) {
            setInputText(interimTranscript.trim());
            setInputError('');
          }
        }
      );
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
          {tCore.lead}
        </p>
      </section>

      {/* Assistant Card Box */}
      <section className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} autoComplete="off" className="card shadow-soft p-4 sm:p-6 flex flex-col gap-4 border border-stone-200/90 rounded-2xl bg-white">
          <label htmlFor="assistant-input" className="sr-only">
            {tCore.lead}
          </label>

          <textarea
            id="assistant-input"
            ref={textareaRef}
            rows={3}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={tCore.placeholder}
            className="w-full text-base sm:text-lg p-3.5 rounded-xl border border-stone-200 bg-[#F9F8F6]/80 text-[#1C1B1A] placeholder:text-stone-400 focus:border-[#166534] focus:bg-white resize-none transition-all"
          />

          {/* Inline Error */}
          {inputError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {inputError}
            </p>
          )}

          {/* Voice Error notice if any */}
          {voiceError && (
            <p role="alert" className="text-xs sm:text-sm text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              {voiceError}
            </p>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleToggleVoice}
              aria-pressed={isListening}
              className={`btn border text-sm font-medium gap-2 ${
                isListening
                  ? 'bg-[#166534] text-white border-[#166534] animate-pulse shadow-sm'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-[#166534]'}`} aria-hidden="true" />
              <span>{isListening ? tCore.listening : tCore.speak}</span>
            </button>

            <button
              type="submit"
              className="btn-primary text-base font-medium px-6 py-2.5"
            >
              {tCore.start}
            </button>
          </div>
        </form>

        {/* Try an Example */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {tCore.tryExample}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {tCore.examples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="chip text-xs sm:text-sm hover:border-[#166534]/40 hover:bg-white transition-all text-stone-700"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Or Tap Who You Are */}
      <section className="relative z-10 w-full max-w-3xl flex flex-col items-center space-y-4">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          {tCore.orTap}
        </h2>
        <WhoTiles lang={lang} onSelect={handleTileSelect} />
      </section>

      {/* Problem Section */}
      <section className="relative z-10 w-full max-w-2xl text-center space-y-2 py-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1B1A]">
          {tExtra.problemHeading}
        </h2>
        <p className="text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
          {tExtra.problemSub}
        </p>
      </section>

      {/* How it Works: 3 Numbered Cards */}
      <section className="relative z-10 w-full max-w-3xl space-y-4">
        <h2 className="text-2xl font-serif font-bold text-center text-[#1C1B1A]">
          {tExtra.howHeading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex flex-col gap-3 p-5 rounded-xl border border-stone-200/80 hover:border-[#166534]/30 hover:shadow-soft transition-all">
            <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center text-sm shadow-xs select-none">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1C1B1A]">
              {tExtra.howStep1Title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              {tExtra.howStep1Desc}
            </p>
          </div>

          <div className="card flex flex-col gap-3 p-5 rounded-xl border border-stone-200/80 hover:border-[#166534]/30 hover:shadow-soft transition-all">
            <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center text-sm shadow-xs select-none">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1C1B1A]">
              {tExtra.howStep2Title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
              {tExtra.howStep2Desc}
            </p>
          </div>

          <div className="card flex flex-col gap-3 p-5 rounded-xl border border-stone-200/80 hover:border-[#166534]/30 hover:shadow-soft transition-all">
            <div className="w-8 h-8 rounded-full bg-[#166534]/10 text-[#166534] font-bold flex items-center justify-center text-sm shadow-xs select-none">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1C1B1A]">
              {tExtra.howStep3Title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed font-normal">
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
          className="btn border border-stone-200 bg-white text-[#1C1B1A] font-medium px-6 py-2.5 rounded-xl hover:bg-stone-50 transition-colors shadow-sm"
        >
          {tExtra.browseAllSchemes}
        </button>
      </section>

      {/* Privacy Dismissible Note (Home only) */}
      {!dismissPrivacyNote && (
        <aside
          role="complementary"
          aria-label="Privacy guarantee"
          className="relative z-10 w-full max-w-xl p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-3 text-sm text-[#1C1B1A]">
            <Shield className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-snug text-stone-700">
              {tExtra.privacyText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDismissPrivacyNote(true)}
            className="btn-ghost text-xs font-semibold px-3 py-1.5 self-end sm:self-auto shrink-0"
          >
            {tExtra.gotIt}
          </button>
        </aside>
      )}
    </motion.div>
  );
}

export default Home;
