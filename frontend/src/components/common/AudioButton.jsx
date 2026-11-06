import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speakAudio, stopAudio } from '../../services/api';

export default function AudioButton({
  textToSpeak,
  label,
  language = 'hi',
  className = ''
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (isPlaying) stopAudio();
    };
  }, [isPlaying]);

  const handleToggle = (e) => {
    e.stopPropagation();

    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakAudio(textToSpeak, language, {
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      });
    }
  };

  if (isPlaying) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 bg-[#004B87] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all animate-fade-in ${className}`}
        title={language === 'hi' ? 'आवाज रोकें' : 'Stop Audio'}
      >
        <span className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 bg-white rounded-full h-1.5 animate-eq-bar-1" />
          <span className="w-0.5 bg-white rounded-full h-3 animate-eq-bar-2" />
          <span className="w-0.5 bg-white rounded-full h-2 animate-eq-bar-3" />
        </span>
        <span>{language === 'hi' ? 'रोकें (Stop)' : 'Stop'}</span>
        <Square className="w-3 h-3 fill-current ml-0.5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:outline-hidden ${className}`}
      title={language === 'hi' ? 'आवाज में सुनें' : 'Listen via Audio'}
    >
      <Volume2 className="w-3.5 h-3.5 text-[#004B87]" />
      <span>{label || (language === 'hi' ? 'सुनें' : 'Listen')}</span>
    </button>
  );
}
