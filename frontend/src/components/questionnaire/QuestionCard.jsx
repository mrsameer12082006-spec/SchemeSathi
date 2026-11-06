import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, ArrowRight, CornerDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import AudioButton from '../common/AudioButton';

export default function QuestionCard({
  question,
  onSelectOption,
  language,
  mode = 'citizen'
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState('');

  const title = language === 'hi' ? question.titleHindi : question.titleEnglish;
  const subtitle = language === 'hi' ? question.titleEnglish : question.titleHindi;
  const audioText = language === 'hi' ? question.audioPromptHindi : question.audioPromptEnglish;
  const helper = language === 'hi' ? question.helperHindi : question.helperEnglish;

  // Keyboard shortcut listener for high-speed operator mode (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      question.options.forEach((opt, idx) => {
        if (e.key === String(idx + 1) || e.key === opt.shortcutKey) {
          e.preventDefault();
          onSelectOption(question.field, opt.value, opt.shortText);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, onSelectOption]);

  const handleVoiceSimulate = () => {
    setIsListening(true);
    setTranscriptPreview(language === 'hi' ? 'आपकी आवाज सुनी जा रही है...' : 'Listening to speech...');

    // Simulate Bhashini regional speech recognition
    setTimeout(() => {
      setTranscriptPreview(language === 'hi' ? 'पहचाना गया: "' + question.options[0].labelHindi + '"' : 'Recognized: "' + question.options[0].labelEnglish + '"');
      setTimeout(() => {
        setIsListening(false);
        setTranscriptPreview('');
        if (question.options.length > 0) {
          onSelectOption(question.field, question.options[0].value, question.options[0].shortText);
        }
      }, 700);
    }, 1800);
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 sm:space-y-8 animate-fade-in relative">
      
      {/* Top Bar: Question Badge, Icon & Dedicated Audio Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
            {question.icon || '🏛️'}
          </span>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#004B87] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block">
              {language === 'hi' ? 'आधिकारिक पात्रता प्रश्न' : 'Eligibility Criteria Query'}
            </span>
            {mode === 'operator' && (
              <span className="ml-2 text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                ⚡ {language === 'hi' ? 'कीबोर्ड: 1 / 2 दबाएं' : 'Keys: 1 / 2'}
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Audio Button for the question */}
        <AudioButton
          textToSpeak={audioText}
          label={language === 'hi' ? '🔊 सवाल सुनें' : '🔊 Listen'}
          language={language}
          size="default"
          variant="subtle"
        />

      </div>

      {/* Main Question Headline & Plain Helper */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug font-hindi">
          {title}
        </h2>
        
        <p className="text-slate-500 text-sm sm:text-base font-medium">
          {subtitle}
        </p>

        {helper && (
          <p className="text-xs sm:text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 inline-block mt-2">
            ℹ️ {helper}
          </p>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────
          OPTIONS LIST: Tactile High-Contrast Cards with Left-Edge 🔊
          ─────────────────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {language === 'hi' ? 'अपना उत्तर चुनें (छूकर या सुनकर):' : 'Select your answer:'}
        </span>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, idx) => {
            const label = language === 'hi' ? opt.labelHindi : opt.labelEnglish;
            const subLabel = language === 'hi' ? opt.labelEnglish : opt.labelHindi;

            return (
              <div
                key={idx}
                className="group flex items-center bg-white hover:bg-blue-50/70 border-2 border-slate-300 hover:border-[#004B87] rounded-2xl p-3 sm:p-4 transition-all duration-150 shadow-2xs hover:shadow-xs focus-within:ring-2 focus-within:ring-[#004B87]"
              >
                {/* 1. Left-Edge Dedicated Audio Button for this specific option */}
                <div className="mr-3 shrink-0">
                  <AudioButton
                    textToSpeak={label}
                    language={language}
                    size="icon"
                    className="hover:scale-105"
                  />
                </div>

                {/* 2. Main Clickable Option Target (Minimum 56px touch target) */}
                <button
                  type="button"
                  onClick={() => onSelectOption(question.field, opt.value, opt.shortText)}
                  className="flex-1 text-left py-2 pr-3 flex items-center justify-between min-h-[52px] focus:outline-hidden"
                >
                  <div className="space-y-0.5">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#004B87] transition-colors block font-hindi leading-snug">
                      {label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium block">
                      {subLabel}
                    </span>
                  </div>

                  {/* Right: Keyboard Shortcut Badge (Operator) or Arrow Pill */}
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {mode === 'operator' && (
                      <kbd className="kbd-badge" title={`Press ${idx + 1} on keyboard`}>
                        {idx + 1}
                      </kbd>
                    )}
                    <span className="w-8 h-8 rounded-full border-2 border-slate-300 group-hover:border-[#004B87] group-hover:bg-[#004B87] group-hover:text-white flex items-center justify-center text-slate-400 font-bold transition-all shrink-0">
                      ➔
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          VOICE INPUT SECTION: Bhashini Voice Assistant
          ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleVoiceSimulate}
            disabled={isListening}
            className={`font-bold text-sm px-6 h-13 rounded-2xl flex items-center gap-2.5 transition-all shadow-sm ${
              isListening
                ? 'bg-red-700 text-white mic-active'
                : 'bg-amber-800 hover:bg-amber-900 text-white active:scale-95'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-5 h-5 animate-pulse text-white" />
                <span>{language === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-white" />
                <span>{language === 'hi' ? 'बोलकर जवाब दें (Speak)' : 'Speak Your Answer'}</span>
              </>
            )}
          </button>

          {isListening && (
            <span className="text-xs font-bold text-red-700 animate-pulse bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
              ● {language === 'hi' ? 'माइक्रोफोन सक्रिय है' : 'Mic Active'}
            </span>
          )}
        </div>

        {/* Transcript or Helper Text */}
        <div className="text-xs text-slate-500 font-medium sm:text-right">
          {transcriptPreview ? (
            <span className="font-bold text-slate-900 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg inline-block">
              {transcriptPreview}
            </span>
          ) : (
            <span>Digital India BHASHINI · {language === 'hi' ? '22 भारतीय भाषाएं समर्थित' : '22 Regional Languages'}</span>
          )}
        </div>

      </div>

    </div>
  );
}
