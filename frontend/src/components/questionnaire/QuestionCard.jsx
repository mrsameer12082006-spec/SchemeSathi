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
      {/* Mercury Recessed Well Outer Frame */}
      <div className="p-1.5 bg-[#F2F2F4] border border-[#E4E4E7] rounded-2xl shadow-2xs">
        <div className="bg-white rounded-xl border border-zinc-200/70 p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-6">
          
          {/* Question Headline (Solid #141417, 600 SemiBold) */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#141417] leading-snug font-hindi">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Clean Tactile Option Cards (Cult UI Keycaps + Gliding Arrow) */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const label = language === 'hi' ? opt.labelHindi : opt.labelEnglish;
              const subLabel = language === 'hi' ? opt.labelEnglish : opt.labelHindi;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectOption(question.field, opt.value, opt.shortText)}
                  className="w-full text-left bg-white hover:bg-[#F4F4F6] active:bg-[#ECECED] border border-zinc-200 hover:border-[#141417] rounded-lg p-4 transition-all duration-150 active:scale-[0.99] flex items-center justify-between group focus:outline-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-sm sm:text-base font-semibold text-[#141417] block font-hindi leading-snug">
                        {label}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium block">
                        {subLabel}
                      </span>
                    </div>
                  </div>

                  <span className="text-zinc-400 group-hover:text-[#141417] group-hover:translate-x-1 transition-all duration-150 font-mono text-sm">
                    ➔
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Audio & Voice Controls: Cal.com / Mercury Buttons */}
          <div className="border-t border-zinc-100 pt-5 flex flex-wrap items-center justify-between gap-3">
            
            {/* Listen to Question Audio */}
            <button
              type="button"
              onClick={handleToggleQuestionAudio}
              className={`inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg border transition-all duration-150 active:scale-[0.985] ${
                isPlayingAudio
                  ? 'bg-[#141417] text-white border-[#141417] shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-end gap-[3px] h-3 w-3.5" aria-hidden="true">
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-2 animate-eq-bar-1' : 'bg-zinc-400 h-1.5'}`} />
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-3 animate-eq-bar-2' : 'bg-zinc-500 h-3'}`} />
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-2.5 animate-eq-bar-3' : 'bg-zinc-400 h-2'}`} />
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
              className={`inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all duration-150 active:scale-[0.985] ${
                isListening
                  ? 'bg-red-600 text-white mic-active'
                  : 'bg-[#141417] hover:bg-[#27272D] text-white shadow-xs'
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
