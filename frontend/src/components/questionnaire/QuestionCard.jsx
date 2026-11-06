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
    // Simulate Bhashini ASR listening window
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-card space-y-8 animate-fade-in max-w-2xl mx-auto">
      
      {/* Question Headline */}
      <div className="space-y-2 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug font-hindi">
          {title}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Clean, Tactile Option Cards (56px min height, zero nested buttons) */}
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          const label = language === 'hi' ? opt.labelHindi : opt.labelEnglish;
          const subLabel = language === 'hi' ? opt.labelEnglish : opt.labelHindi;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(question.field, opt.value, opt.shortText)}
              className="w-full text-left bg-white hover:bg-blue-50/60 active:bg-blue-100/60 border-2 border-slate-200 hover:border-[#004B87] rounded-2xl p-4 sm:p-5 transition-all flex items-center justify-between group active:scale-[0.99] focus:outline-hidden focus:border-[#004B87]"
            >
              <div className="space-y-0.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#004B87] transition-colors block font-hindi leading-snug">
                  {label}
                </span>
                <span className="text-xs text-slate-400 font-medium block">
                  {subLabel}
                </span>
              </div>

              {/* Minimal bullet or shortcut indicator */}
              <div className="w-8 h-8 rounded-full border-2 border-slate-200 group-hover:border-[#004B87] group-hover:bg-[#004B87] group-hover:text-white flex items-center justify-center text-xs font-bold text-slate-400 shrink-0 transition-colors">
                {mode === 'operator' ? (idx + 1) : '➔'}
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
          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full transition-all ${
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
          className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full transition-all ${
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
