import React, { useState, useEffect } from 'react';
import { Square } from 'lucide-react';
import { speakAudio, stopAudio } from '../../services/api';

export default function AudioButton({
  textToSpeak,
  label,
  language = 'hi',
  className = '',
  compact = false
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

  // 4 Micro-Bars Equalizer: calm at rest, oscillating when playing
  const EqualizerIcon = ({ active }) => (
    <span className="flex items-end gap-[3px] h-3.5 w-4 shrink-0" aria-hidden="true">
      <span className={`w-[2.5px] rounded-full transition-all duration-200 ${
        active ? 'bg-white h-2.5 animate-eq-bar-1' : 'bg-zinc-400 h-2'
      }`} />
      <span className={`w-[2.5px] rounded-full transition-all duration-200 ${
        active ? 'bg-white h-3.5 animate-eq-bar-2' : 'bg-zinc-500 h-3.5'
      }`} />
      <span className={`w-[2.5px] rounded-full transition-all duration-200 ${
        active ? 'bg-white h-2 animate-eq-bar-3' : 'bg-zinc-400 h-2'
      }`} />
      <span className={`w-[2.5px] rounded-full transition-all duration-200 ${
        active ? 'bg-white h-3 animate-eq-bar-4' : 'bg-zinc-500 h-2.5'
      }`} />
    </span>
  );

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-150 active:scale-[0.985] ${
          isPlaying
            ? 'bg-[#141417] text-white border-[#141417] shadow-xs'
            : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
        } ${className}`}
        title={isPlaying ? (language === 'hi' ? 'रोकें' : 'Stop') : (language === 'hi' ? 'सुनें' : 'Listen')}
      >
        <EqualizerIcon active={isPlaying} />
        <span>
          {isPlaying
            ? (language === 'hi' ? 'रोकें' : 'Stop')
            : (label || (language === 'hi' ? 'सुनें' : 'Listen'))}
        </span>
        {isPlaying && <Square className="w-2.5 h-2.5 fill-current ml-0.5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center gap-2.5 rounded-lg px-5 py-3.5 text-sm font-medium border transition-all duration-150 active:scale-[0.985] shadow-2xs ${
        isPlaying
          ? 'bg-[#141417] text-white border-[#141417]'
          : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300'
      } ${className}`}
      title={isPlaying ? (language === 'hi' ? 'आवाज रोकें' : 'Stop Audio') : (language === 'hi' ? 'आवाज में सुनें' : 'Listen via Audio')}
    >
      <EqualizerIcon active={isPlaying} />
      <span>
        {isPlaying
          ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop Audio')
          : (label || (language === 'hi' ? 'बोलकर समझें' : 'Audio Guide'))}
      </span>
      {isPlaying && <Square className="w-3 h-3 fill-current ml-0.5" />}
    </button>
  );
}
