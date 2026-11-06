import React, { useState } from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { speakAudio, stopAudio } from '../../services/api';

export default function QuestionCard({
  question,
  onSelectOption,
  language,
  mode = 'citizen'
}) {
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const title = language === 'hi' ? question.titleHindi : question.titleEnglish;
  const subtitle = language === 'hi' ? question.titleEnglish : question.titleHindi;
  const audioText = language === 'hi' ? question.audioPromptHindi : question.audioPromptEnglish;

  const handleVoiceSimulate = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      if (question.options.length > 0) {
        onSelectOption(question.field, question.options[0].value, question.options[0].shortText);
      }
    }, 1800);
  };

  const handleToggleQuestionAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakAudio(audioText, language, {
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  return (
    <div 
      key={question.field}
      className="bg-white hairline-border rounded-3xl p-6 sm:p-10 shadow-card space-y-8 animate-question-slide max-w-2xl mx-auto"
    >
      
      {/* Question Headline (Display Heading with tight tracking) */}
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug display-heading">
          {title}
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Clean Tactile Option Cards (Linear/Wise Spring Press, Zero Nested Buttons) */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const label = language === 'hi' ? opt.labelHindi : opt.labelEnglish;
          const subLabel = language === 'hi' ? opt.labelEnglish : opt.labelHindi;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(question.field, opt.value, opt.shortText)}
              className="w-full text-left bg-white hover:bg-blue-50/50 active:bg-blue-100/60 border border-slate-200 hover:border-[#004B87] rounded-2xl p-4 sm:p-5 tactile-card flex items-center justify-between group focus:outline-hidden focus:border-[#004B87]"
            >
              <div className="space-y-0.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#004B87] transition-colors block hindi-body leading-snug">
                  {label}
                </span>
                <span className="text-xs text-slate-400 font-medium block">
                  {subLabel}
                </span>
              </div>

              {/* Minimal indicator with Kiosk shortcut support */}
              <div className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-[#004B87] group-hover:bg-[#004B87] group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 transition-colors">
                {mode === 'operator' ? (
                  <span className="font-mono">[{idx + 1}]</span>
                ) : (
                  '➔'
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Audio & Voice Controls */}
      <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-3">
        
        {/* Listen to Question Audio */}
        <button
          type="button"
          onClick={handleToggleQuestionAudio}
          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full spring-press ${
            isPlayingAudio
              ? 'bg-[#004B87] text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Volume2 className="w-4 h-4 text-[#004B87]" />
          <span>{isPlayingAudio ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop') : (language === 'hi' ? 'सवाल सुनें' : 'Listen')}</span>
        </button>

        {/* Speak Answer via Voice */}
        <button
          type="button"
          onClick={handleVoiceSimulate}
          disabled={isListening}
          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full spring-press ${
            isListening
              ? 'bg-red-600 text-white mic-active'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>
            {isListening
              ? (language === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
              : (language === 'hi' ? 'बोलकर जवाब दें' : 'Speak Answer')}
          </span>
        </button>

      </div>

    </div>
  );
}
