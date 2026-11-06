import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, RotateCcw } from 'lucide-react';
import { speakAudio, stopAudio } from '../../services/api';

export default function AudioButton({
  textToSpeak,
  label,
  language = 'hi',
  size = 'default', // 'sm' | 'default' | 'lg' | 'icon'
  variant = 'solid', // 'solid' | 'subtle' | 'ghost'
  className = '',
  onPlayingChange
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isPlaying) {
        stopAudio();
      }
    };
  }, [isPlaying]);

  const handleToggle = (e) => {
    e.stopPropagation();

    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      setIsPaused(false);
      if (onPlayingChange) onPlayingChange(false);
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      if (onPlayingChange) onPlayingChange(true);

      speakAudio(textToSpeak, language, {
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
          if (onPlayingChange) onPlayingChange(true);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          if (onPlayingChange) onPlayingChange(false);
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
          if (onPlayingChange) onPlayingChange(false);
        }
      });
    }
  };

  const handleReplay = (e) => {
    e.stopPropagation();
    stopAudio();
    setIsPlaying(true);
    speakAudio(textToSpeak, language, {
      onEnd: () => {
        setIsPlaying(false);
        if (onPlayingChange) onPlayingChange(false);
      },
      onError: () => {
        setIsPlaying(false);
        if (onPlayingChange) onPlayingChange(false);
      }
    });
  };

  // Icon only button (e.g. For question option rows)
  if (size === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={language === 'hi' ? 'यह विकल्प सुनें' : 'Listen to option'}
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
          isPlaying
            ? 'bg-[#004B87] text-white ring-2 ring-blue-300'
            : 'bg-blue-50 text-[#004B87] hover:bg-blue-100 border border-blue-200'
        } ${className}`}
        title={language === 'hi' ? 'आवाज में सुनें' : 'Listen via Audio'}
      >
        {isPlaying ? (
          <span className="flex items-center gap-0.5 h-3.5 px-1">
            <span className="w-0.5 bg-white rounded-full h-2 animate-eq-bar-1" />
            <span className="w-0.5 bg-white rounded-full h-3.5 animate-eq-bar-2" />
            <span className="w-0.5 bg-white rounded-full h-2.5 animate-eq-bar-3" />
          </span>
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  // Active playing pill with 3-bar equalizer and controls
  if (isPlaying) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-[#004B87] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs animate-fade-in ${className}`}>
        {/* Animated 3-bar Equalizer */}
        <span className="flex items-end gap-0.5 h-3.5 mr-1" aria-hidden="true">
          <span className="w-1 bg-white rounded-full h-2 animate-eq-bar-1" />
          <span className="w-1 bg-white rounded-full h-3.5 animate-eq-bar-2" />
          <span className="w-1 bg-white rounded-full h-2.5 animate-eq-bar-3" />
        </span>

        <span>{language === 'hi' ? 'आवाज चल रही है...' : 'Speaking...'}</span>

        {/* Pause/Stop Button */}
        <button
          type="button"
          onClick={handleToggle}
          className="ml-1 p-1 hover:bg-[#003865] rounded-full transition-colors"
          title={language === 'hi' ? 'रोकें (Stop)' : 'Stop Audio'}
          aria-label="Stop Audio"
        >
          <Pause className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Replay Button */}
        <button
          type="button"
          onClick={handleReplay}
          className="p-1 hover:bg-[#003865] rounded-full transition-colors"
          title={language === 'hi' ? 'दोबारा सुनें (Replay)' : 'Replay Audio'}
          aria-label="Replay Audio"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Default / Inactive State
  const variantStyles = {
    solid: 'bg-[#004B87] hover:bg-[#002D54] text-white shadow-xs',
    subtle: 'bg-blue-50 hover:bg-blue-100 text-[#004B87] border border-blue-200',
    ghost: 'hover:bg-slate-100 text-slate-700'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 rounded-md min-h-[36px]',
    default: 'text-xs sm:text-sm px-3.5 py-2 rounded-lg min-h-[40px]',
    lg: 'text-base px-5 py-2.5 rounded-xl min-h-[48px]'
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 font-bold transition-all focus:outline-hidden focus:ring-2 focus:ring-[#004B87] focus:ring-offset-1 active:scale-95 ${variantStyles[variant] || variantStyles.solid} ${sizeStyles[size] || sizeStyles.default} ${className}`}
      title={language === 'hi' ? 'आवाज में सुनें (Listen)' : 'Listen via Audio'}
    >
      <Volume2 className="w-4 h-4 shrink-0" />
      <span>{label || (language === 'hi' ? '🔊 आवाज में सुनें' : '🔊 Listen')}</span>
    </button>
  );
}
