import React, { useState } from 'react';
import { Mic, Square, ArrowRight, Volume2 } from 'lucide-react';
import { speakAudio, stopAudio } from '../../services/api';

export default function QuestionCard({
  question,
  onSelectOption,
  mode = 'citizen'
}) {
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const title = question.titleEnglish || question.title;
  const helper = question.helperEnglish;
  const audioText = question.audioPromptEnglish || title;

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
      speakAudio(audioText, 'en', {
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  return (
    <div key={question.field} className="animate-question-slide max-w-2xl mx-auto">
      {/* Mercury Recessed Well Outer Frame */}
      <div className="p-2 bg-[#F2F2F4] border border-[#E4E4E7] rounded-2xl shadow-2xs">
        <div className="bg-white rounded-xl border border-zinc-200/80 p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-6">
          
          {/* Question Headline */}
          <div className="space-y-1.5 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] leading-snug">
              {title}
            </h2>
            {helper && (
              <p className="text-xs sm:text-sm text-zinc-500">
                {helper}
              </p>
            )}
          </div>

          {/* Clean Tactile Option Cards (Cult UI Keycaps + Gliding Arrow) */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const label = opt.labelEnglish || opt.label;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectOption(question.field, opt.value, opt.shortText)}
                  className="w-full text-left bg-white hover:bg-[#FAF9F6] active:bg-[#F2F2F4] border border-zinc-200 hover:border-[#111111] rounded-xl p-4 transition-all duration-150 active:scale-[0.99] flex items-center justify-between group focus:outline-hidden shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 font-mono text-xs font-bold text-[#111111] border border-zinc-200 group-hover:bg-[#111111] group-hover:text-white transition-colors shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-[#111111] block leading-snug">
                      {label}
                    </span>
                  </div>

                  <span className="text-zinc-400 group-hover:text-[#111111] group-hover:translate-x-1 transition-all duration-150 font-mono text-sm">
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Audio & Voice Controls */}
          <div className="border-t border-zinc-100 pt-5 flex flex-wrap items-center justify-between gap-3">
            
            {/* Listen to Question Audio */}
            <button
              type="button"
              onClick={handleToggleQuestionAudio}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full border transition-all duration-150 active:scale-[0.985] ${
                isPlayingAudio
                  ? 'bg-[#111111] text-white border-[#111111] shadow-xs'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <span className="flex items-end gap-[2.5px] h-3 w-3.5" aria-hidden="true">
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-2 animate-eq-bar-1' : 'bg-zinc-400 h-1.5'}`} />
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-3 animate-eq-bar-2' : 'bg-zinc-500 h-3'}`} />
                <span className={`w-[2px] rounded-full transition-all ${isPlayingAudio ? 'bg-white h-2.5 animate-eq-bar-3' : 'bg-zinc-400 h-2'}`} />
              </span>
              <span>
                {isPlayingAudio ? 'Stop Audio' : 'Audio Guide'}
              </span>
              {isPlayingAudio && <Square className="w-2.5 h-2.5 fill-current ml-0.5" />}
            </button>

            {/* Speak Answer via Voice */}
            <button
              type="button"
              onClick={handleVoiceSimulate}
              disabled={isListening}
              className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-150 active:scale-[0.985] ${
                isListening
                  ? 'bg-red-600 text-white mic-active'
                  : 'bg-[#111111] hover:bg-[#262626] text-white shadow-xs'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>
                {isListening ? 'Listening...' : 'Speak Answer'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
