import { useState, useEffect, useRef, useCallback } from 'react';
import { synthesizeSpeech, getAudioStreamUrl } from '../services/api';

/**
 * Hook for Voice progressive enhancement:
 * - Speech-to-Text: Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * - Text-to-Speech: Sarvam AI Bulbul neural companion voice (via backend /api/ai/synthesize)
 *   with graceful fallback to tuned window.speechSynthesis (calm, grounded pitch & pace).
 */
export function useVoice({ lang = 'en' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePlayingId, setActivePlayingId] = useState(null);
  const [voiceError, setVoiceError] = useState(null);

  const recognitionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const speechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  // Check SpeechRecognition browser support
  const isSpeechToTextSupported = typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const isTextToSpeechSupported = typeof window !== 'undefined' &&
    (!!window.speechSynthesis || typeof Audio !== 'undefined');

  // Cancel any ongoing speech or audio playback
  const cancelSpeech = useCallback(() => {
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      audioPlayerRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    setIsSpeaking(false);
    setActivePlayingId(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      cancelSpeech();
    };
  }, [cancelSpeech]);

/**
 * Deduplicate repeated phrases or echo artifacts often produced by ASR engines
 * when silence detection or multiple speech recognition events fire.
 */
function dedupeSpokenText(text) {
  if (!text || typeof text !== 'string') return '';
  const cleaned = text.trim();
  const words = cleaned.split(/\s+/);

  // 1. Exact halving repeat: "I am a student I am a student"
  if (words.length >= 2 && words.length % 2 === 0) {
    const half = words.length / 2;
    const firstHalf = words.slice(0, half).join(' ');
    const secondHalf = words.slice(half).join(' ');
    if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
      return firstHalf;
    }
  }

  // 2. Immediate repeated phrase chunks: "X Y Z X Y Z"
  for (let n = Math.floor(words.length / 2); n >= 2; n--) {
    const first = words.slice(0, n).join(' ');
    const second = words.slice(n, n * 2).join(' ');
    if (first.toLowerCase() === second.toLowerCase() && n * 2 === words.length) {
      return first;
    }
  }

  return cleaned;
}

  // Start speech recognition
  const startListening = useCallback((onResultCallback) => {
    setVoiceError(null);
    cancelSpeech();

    if (!isSpeechToTextSupported) {
      const msg = lang === 'hi'
        ? "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है। आप लिखकर जवाब दे सकते हैं।"
        : "Voice input isn't available in this browser. You can type instead.";
      setVoiceError(msg);
      return;
    }

    // Abort and detach any existing recognition instance to prevent duplicate listeners
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Guard flag: guarantees only ONE callback dispatch per listening session
      let hasDispatched = false;
      let latestTranscript = '';

      const dispatchResult = (rawTranscript) => {
        if (hasDispatched) return;
        const clean = dedupeSpokenText(rawTranscript);
        if (!clean) return;
        hasDispatched = true;

        // Clean up recognizer immediately upon valid transcript
        if (recognitionRef.current === recognition) {
          try {
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;
            recognition.stop();
          } catch {
            // ignore
          }
          recognitionRef.current = null;
        }

        setIsListening(false);

        if (onResultCallback) {
          onResultCallback(clean);
        }
      };

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        let accumulated = '';
        let isFinal = false;

        // Accumulate transcript across results
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item && item[0] && item[0].transcript) {
            accumulated += item[0].transcript + ' ';
            if (item.isFinal) isFinal = true;
          }
        }

        accumulated = accumulated.trim();
        if (accumulated) {
          latestTranscript = accumulated;
        }

        // Single-utterance dispatch when final or non-continuous
        if (latestTranscript && (isFinal || !recognition.continuous)) {
          dispatchResult(latestTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceError(
            lang === 'hi'
              ? "माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया लिखकर प्रयास करें।"
              : "Microphone permission was denied. You can type instead."
          );
        } else if (event.error !== 'no-speech') {
          setVoiceError(
            lang === 'hi'
              ? "आवाज़ नहीं पहचानी जा सकी। कृपया लिखकर प्रयास करें।"
              : "Could not capture speech. Please try typing instead."
          );
        }

        // If recognizer had captured words before error, deliver once
        if (!hasDispatched && latestTranscript) {
          dispatchResult(latestTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }
        // Fallback: if speech stopped naturally and wasn't dispatched yet
        if (!hasDispatched && latestTranscript) {
          dispatchResult(latestTranscript);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition failed to start", err);
      setIsListening(false);
      setVoiceError(
        lang === 'hi'
          ? "माइक्रोफ़ोन शुरू नहीं हो सका। कृपया लिखकर प्रयास करें।"
          : "Could not start microphone. You can type instead."
      );
    }
  }, [cancelSpeech, isSpeechToTextSupported, lang, speechLang]);

  // Stop listening manually
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Helper: play base64 audio via HTML5 Audio
  const playAudioBase64 = useCallback((base64Data, id = null) => {
    return new Promise((resolve) => {
      try {
        cancelSpeech();

        const audio = new Audio("data:audio/wav;base64," + base64Data);
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setActivePlayingId(id || 'current');
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setActivePlayingId(null);
          audioPlayerRef.current = null;
          resolve(true);
        };

        audio.onerror = (e) => {
          console.warn("HTML5 audio playback error:", e);
          setIsSpeaking(false);
          setActivePlayingId(null);
          audioPlayerRef.current = null;
          resolve(false);
        };

        audio.onpause = () => {
          if (audioPlayerRef.current === audio && audio.currentTime < audio.duration) {
            setIsSpeaking(false);
            setActivePlayingId(null);
          }
        };

        audio.play().catch((playErr) => {
          console.warn("Audio play prevented:", playErr);
          setIsSpeaking(false);
          setActivePlayingId(null);
          resolve(false);
        });
      } catch (err) {
        console.warn("Error creating Audio element:", err);
        setIsSpeaking(false);
        setActivePlayingId(null);
        resolve(false);
      }
    });
  }, [cancelSpeech]);

  // Helper: play streaming audio via HTML5 Audio with instant start (<300ms)
  const playAudioStream = useCallback((streamUrl, id = null) => {
    return new Promise((resolve) => {
      try {
        cancelSpeech();

        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = streamUrl;
        audioPlayerRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setActivePlayingId(id || 'current');
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setActivePlayingId(null);
          audioPlayerRef.current = null;
          resolve(true);
        };

        audio.onerror = (e) => {
          console.warn("Audio stream playback error:", e);
          setIsSpeaking(false);
          setActivePlayingId(null);
          audioPlayerRef.current = null;
          resolve(false);
        };

        audio.onpause = () => {
          if (audioPlayerRef.current === audio && audio.currentTime < (audio.duration || 999)) {
            setIsSpeaking(false);
            setActivePlayingId(null);
          }
        };

        audio.play().catch((playErr) => {
          console.warn("Audio stream play prevented:", playErr);
          setIsSpeaking(false);
          setActivePlayingId(null);
          resolve(false);
        });
      } catch (err) {
        console.warn("Error creating stream Audio element:", err);
        setIsSpeaking(false);
        setActivePlayingId(null);
        resolve(false);
      }
    });
  }, [cancelSpeech]);

  // Fallback: browser speech synthesis with grounded, calm pitch & pace
  const speakBrowserFallback = useCallback((text, id = null) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
      setIsSpeaking(false);
      setActivePlayingId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/<[^>]+>/g, '').replace(/[*_#]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = speechLang;

      // Natural, grounded acoustic parameters:
      // Lower pitch (0.9) to eliminate shrill/squeaky robotic artifacts.
      // Slower rate (0.92) for respectful, clear conversational tempo.
      utterance.pitch = 0.9;
      utterance.rate = 0.92;

      // Match natural Indian voice if installed
      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(v => v.lang === speechLang || (v.lang && v.lang.startsWith(lang)));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setActivePlayingId(id || 'current');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setActivePlayingId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setActivePlayingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Browser SpeechSynthesis error:", err);
      setIsSpeaking(false);
      setActivePlayingId(null);
    }
  }, [lang, speechLang]);

  // Main speak method: Sarvam AI Bulbul neural voice (streaming) first, browser fallback second
  const speak = useCallback(async (text, { audioBase64 = null, id = null } = {}) => {
    if (!text && !audioBase64) return;

    // If already playing this item, clicking again acts as toggle/stop
    if (activePlayingId && id && activePlayingId === id) {
      cancelSpeech();
      return;
    }

    // Stop current audio before playing new
    cancelSpeech();

    // 1. If audio base64 is already supplied (e.g. from backend response), play it directly
    if (audioBase64) {
      const success = await playAudioBase64(audioBase64, id);
      if (success) return audioBase64;
    }

    // 2. Stream neural companion speech via HTTP streaming for instantaneous playback (<400ms)
    try {
      const streamUrl = getAudioStreamUrl(text, lang);
      if (streamUrl) {
        const streamSuccess = await playAudioStream(streamUrl, id);
        if (streamSuccess) return null;
      }
    } catch (streamErr) {
      console.warn("Audio streaming failed, trying REST synthesis:", streamErr);
    }

    // 3. Fallback: Fetch neural speech from Sarvam Bulbul REST endpoint
    try {
      const synth = await synthesizeSpeech(text, lang);
      if (synth && synth.audio_base64 && !synth.fallback_to_browser_tts) {
        const success = await playAudioBase64(synth.audio_base64, id);
        if (success) return synth.audio_base64;
      }
    } catch (err) {
      console.warn("Sarvam speech synthesis request failed, using browser fallback:", err);
    }

    // 4. Fallback to tuned browser speech synthesis
    speakBrowserFallback(text, id);
    return null;
  }, [activePlayingId, cancelSpeech, playAudioBase64, playAudioStream, speakBrowserFallback, lang]);

  return {
    isListening,
    isSpeaking,
    activePlayingId,
    voiceError,
    isSpeechToTextSupported,
    isTextToSpeechSupported,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    clearVoiceError: () => setVoiceError(null)
  };
}

export default useVoice;
