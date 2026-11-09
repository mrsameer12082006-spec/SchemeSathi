import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for Voice progressive enhancement:
 * - Speech-to-Text: Web Speech API (SpeechRecognition / webkitSpeechRecognition)
 * - Text-to-Speech: window.speechSynthesis
 * Gracefully degrades if the browser does not support it.
 */
export function useVoice({ lang = 'en' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  const recognitionRef = useRef(null);
  const speechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  // Check SpeechRecognition browser support
  const isSpeechToTextSupported = typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const isTextToSpeechSupported = typeof window !== 'undefined' &&
    !!window.speechSynthesis;

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
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Cancel any ongoing speech
  const cancelSpeech = useCallback(() => {
    if (isTextToSpeechSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isTextToSpeechSupported]);

  // Start speech recognition
  const startListening = useCallback((onResultCallback) => {
    setVoiceError(null);

    // Cancel text-to-speech if speaking
    cancelSpeech();

    if (!isSpeechToTextSupported) {
      const msg = lang === 'hi'
        ? "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है। आप लिखकर जवाब दे सकते हैं।"
        : "Voice input isn't available in this browser. You can type instead.";
      setVoiceError(msg);
      return;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.lang = speechLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        setIsListening(false);
        if (transcript && onResultCallback) {
          onResultCallback(transcript);
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
      };

      recognition.onend = () => {
        setIsListening(false);
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
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  // Text-to-speech read aloud
  const speak = useCallback((text) => {
    if (!isTextToSpeechSupported || !text) return;

    try {
      // Cancel any speech in progress before starting new speech
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = speechLang;

      // Attempt to pick a matching localized voice
      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(v => v.lang === speechLang || v.lang.startsWith(lang));
      if (matchVoice) {
        utterance.voice = matchVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Text-to-speech error:", err);
      setIsSpeaking(false);
    }
  }, [isTextToSpeechSupported, lang, speechLang]);

  return {
    isListening,
    isSpeaking,
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
