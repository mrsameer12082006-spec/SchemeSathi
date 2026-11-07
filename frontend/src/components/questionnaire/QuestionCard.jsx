import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
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
    <div key={question.field} className="animate-question-slide max-w-2xl mx-auto">
      {/* Luminous Outer Well Frame */}
      <div className="p-1.5 bg-gradient-to-b from-blue-100/70 via-slate-100 to-indigo-100/50 border border-blue-200/70 rounded-2xl shadow-xl shadow-blue-500/5">
        <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Question Headline */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug font-hindi">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Clean Tactile Option Cards */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const label = language === 'hi' ? opt.labelHindi : opt.labelEnglish;
              const subLabel = language === 'hi' ? opt.labelEnglish : opt.labelHindi;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectOption(question.field, opt.value, opt.shortText)}
                  className="w-full text-left bg-white hover:bg-blue-50/40 active:bg-blue-100/30 border border-slate-200 hover:border-blue-500 rounded-xl p-4.5 transition-all duration-150 active:scale-[0.99] flex items-center justify-between group shadow-2xs hover:shadow-md hover:shadow-blue-500/10 focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="keycap-badge shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-950 block font-hindi leading-snug">
                        {label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium block">
                        {subLabel}
                      </span>
                    </div>
                  </div>

                  <span className="text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1.5 transition-all duration-150 font-mono text-base font-bold">
                    ➔
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Audio & Voice Controls */}
          <div className="border-t border-slate-100 pt-5 flex flex-wrap items-center justify-between gap-3">
            
            {/* Listen to Question Audio */}
            <button
              type="button"
              onClick={handleToggleQuestionAudio}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg border transition-all duration-150 active:scale-[0.985] cursor-pointer ${
                isPlayingAudio
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-blue-300 shadow-2xs'
              }`}
            >
              <span className="flex items-end gap-[3px] h-3 w-3.5" aria-hidden="true">
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-2 animate-eq-bar-1' : 'bg-slate-400 h-1.5'}`} />
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-3 animate-eq-bar-2' : 'bg-slate-500 h-3'}`} />
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-2.5 animate-eq-bar-3' : 'bg-slate-400 h-2'}`} />
              </span>
              <span>
                {isPlayingAudio
                  ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop')
                  : (language === 'hi' ? 'सवाल सुनें' : 'Listen')}
              </span>
              {isPlayingAudio && <Square className="w-2.5 h-2.5 fill-current ml-0.5" />}
            </button>

            {/* Speak Answer via Voice */}
            <button
              type="button"
              onClick={handleVoiceSimulate}
              disabled={isListening}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-all duration-150 active:scale-[0.985] cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white mic-active'
                  : 'btn-primary-glow shadow-md shadow-blue-500/20'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>
                {isListening
                  ? (language === 'hi' ? 'सुन रहे हैं...' : 'Listening...')
                  : (language === 'hi' ? 'बोलकर जवाब दें' : 'Speak Answer')}
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
