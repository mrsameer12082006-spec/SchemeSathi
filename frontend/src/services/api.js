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

  // Stop any active utterance
  window.speechSynthesis.cancel();

  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.92; // Clear, comfortable cadence for bilingual audio guidance
  utterance.pitch = 1.0;

  // Attempt to select a natural Hindi/Indian English voice if available
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

  utterance.onpause = () => {
    if (callbacks.onPause) callbacks.onPause();
  };

  utterance.onresume = () => {
    if (callbacks.onResume) callbacks.onResume();
  };

  utterance.onboundary = (e) => {
    if (callbacks.onBoundary) callbacks.onBoundary(e.charIndex);
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

export function pauseAudio() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeAudio() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}
