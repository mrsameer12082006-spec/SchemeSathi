// SchemeSathi API Service & Local Deterministic Rule Engine
// Implements the exact REST contract specified in Section 8 of the Architecture Blueprint.

import { VERIFIED_SCHEMES } from '../data/schemesData';

/**
 * Evaluates user profile against verified schemes deterministically.
 * Rules strictly follow official government criteria.
 */
export function evaluateEligibilityLocally(userProfile = {}) {
  const results = VERIFIED_SCHEMES.map(scheme => {
    const passed = [];
    const failed = [];
    const missing = [];

    scheme.rules.forEach(rule => {
      const userValue = userProfile[rule.field];

      if (userValue === undefined || userValue === 'unknown' || userValue === null) {
        missing.push({
          ruleId: rule.id,
          field: rule.field,
          description: rule.description,
          englishDescription: rule.englishDescription
        });
      } else {
        let isPass = false;
        if (rule.operator === '==') {
          isPass = (userValue === rule.value);
        } else if (rule.operator === '>=') {
          isPass = (Number(userValue) >= Number(rule.value));
        } else if (rule.operator === '<=') {
          isPass = (Number(userValue) <= Number(rule.value));
        }

        if (isPass) {
          passed.push({
            ruleId: rule.id,
            field: rule.field,
            description: rule.description,
            englishDescription: rule.englishDescription
          });
        } else {
          failed.push({
            ruleId: rule.id,
            field: rule.field,
            description: rule.description,
            englishDescription: rule.englishDescription,
            actual: userValue,
            expected: rule.value
          });
        }
      }
    });

    let status = 'potentially_eligible';
    if (failed.length > 0) {
      status = 'not_eligible';
    } else if (missing.length > 0) {
      status = 'needs_information';
    }

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      englishName: scheme.englishName,
      ministry: scheme.ministry,
      englishMinistry: scheme.englishMinistry,
      scope: scheme.scope,
      benefitSummary: scheme.benefitSummary,
      englishBenefitSummary: scheme.englishBenefitSummary,
      highlightAmount: scheme.highlightAmount,
      highlightFrequency: scheme.highlightFrequency,
      officialUrl: scheme.officialUrl,
      lastVerified: scheme.lastVerified,
      documents: scheme.documents,
      applicationSteps: scheme.applicationSteps,
      status, // 'potentially_eligible' | 'needs_information' | 'not_eligible'
      passed,
      failed,
      missing
    };
  });

  return results;
}

/**
 * Text-to-Speech (TTS) engine with full playback lifecycle callbacks
 * Supports BHASHINI standards and Web Speech API fallback.
 */
let currentUtterance = null;

export function speakAudio(text, lang = 'hi', callbacks = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (callbacks.onError) callbacks.onError(new Error('Speech synthesis unsupported'));
    return;
  }

  window.speechSynthesis.cancel();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const targetLang = lang === 'hi' ? 'hi' : 'en-IN';
    const preferredVoice = voices.find(v => v.lang.startsWith(targetLang) && !v.name.includes('Google')) ||
                           voices.find(v => v.lang.startsWith(targetLang)) ||
                           voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  utterance.onstart = () => {
    if (callbacks.onStart) callbacks.onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (callbacks.onEnd) callbacks.onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (callbacks.onError) callbacks.onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopAudio() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

/**
 * Web Audio API Success Chime (Tez / Google Pay inspired)
 * Generates an affirmative, harmonic two-tone chime without external audio files.
 */
export function playSuccessChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Note 1: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.28);

    // Note 2: E5 (659.25 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.1);
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.42);
  } catch (e) {
    // AudioContext blocked by user agent policy or unsupported
  }
}
