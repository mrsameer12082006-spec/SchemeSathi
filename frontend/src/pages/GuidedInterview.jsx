import React, { useState, useMemo } from 'react';
import { CheckCircle2, Clock, Printer, Store, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import ProgressBar from '../components/questionnaire/ProgressBar';
import QuestionCard from '../components/questionnaire/QuestionCard';
import MiniLedger from '../components/questionnaire/MiniLedger';
import { QUESTION_REGISTRY, VERIFIED_SCHEMES } from '../data/schemesData';
import { evaluateEligibilityLocally } from '../services/api';

export default function GuidedInterview({
  answers,
  setAnswers,
  onComplete,
  language,
  mode = 'citizen',
  initialStep = 0
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handleSelectOption = (field, value, shortText) => {
    setAnswers(prev => ({
      ...prev,
      [field]: { value, label: shortText }
    }));

    if (currentStep < QUESTION_REGISTRY.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuestion = QUESTION_REGISTRY[currentStep];

  // Live evaluation for CSC Operator Mode
  const liveResults = useMemo(() => {
    const profile = {};
    Object.keys(answers).forEach(k => {
      profile[k] = answers[k]?.value;
    });
    return evaluateEligibilityLocally(profile);
  }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount >= QUESTION_REGISTRY.length;

  // ─────────────────────────────────────────────────────────────
  // OPERATOR MODE: High-Speed 2-Column Bento Workspace (max-w-6xl)
  // ─────────────────────────────────────────────────────────────
  if (mode === 'operator') {
    return (
      <div className="space-y-6 animate-fade-in">
        
        {/* Operator Toolbar */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg">CSC ऑपरेटर हाई-स्पीड वर्कस्पेस</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Operator Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                कीबोर्ड शॉर्टकट (1, 2, 3) सक्रिय हैं। ग्रामीण नागरिक से पूछें और 20 सेकंड में पर्ची बनाएं।
              </p>
            </div>
          </div>

          {/* Quick Step Jump Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
            {QUESTION_REGISTRY.map((q, idx) => {
              const isFilled = !!answers[q.field];
              const isCurrent = idx === currentStep;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : isFilled
                      ? 'bg-slate-700 text-green-400 hover:bg-slate-600'
                      : 'text-slate-400 hover:bg-slate-700'
                  }`}
                  title={q.titleHindi}
                >
                  Q{idx + 1} {isFilled ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Bento Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Active Question & Fast Toggles */}
          <div className="lg:col-span-7 space-y-5">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={QUESTION_REGISTRY.length}
              onBack={handleBack}
              language={language}
            />

            <QuestionCard
              question={currentQuestion}
              onSelectOption={handleSelectOption}
              language={language}
              mode={mode}
            />

            {/* Quick Answer Review Pill Strip */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                दर्ज किए गए उत्तर (Live Answers):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {QUESTION_REGISTRY.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentStep(i)}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition-colors"
                  >
                    <span className="text-slate-400 block text-[10px] font-mono">Q{i + 1}</span>
                    <strong className="text-slate-900 block truncate">
                      {answers[q.field]?.label || '—'}
                    </strong>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live-Updating Scheme Matches & CSC Slip Preview */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Live Scheme Evaluation Card */}
            <div className="bg-white border-2 border-slate-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse" />
                  <h3 className="font-extrabold text-slate-900 text-base">
                    लाइव पात्रता परिणाम (Real-time)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {answeredCount}/{QUESTION_REGISTRY.length} दर्ज
                </span>
              </div>

              {/* Live Scheme Pills */}
              <div className="space-y-3">
                {liveResults.map(s => {
                  const isEligible = s.status === 'potentially_eligible';
                  const isNeedsInfo = s.status === 'needs_information';
                  const isNotEligible = s.status === 'not_eligible';

                  return (
                    <div
                      key={s.schemeId}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isEligible
                          ? 'bg-green-50/80 border-green-300'
                          : isNeedsInfo
                          ? 'bg-amber-50/80 border-amber-300'
                          : 'bg-red-50/60 border-red-200 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-xs sm:text-sm text-slate-900 block truncate max-w-[180px]">
                          {s.schemeName}
                        </strong>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isEligible
                            ? 'bg-green-200 text-green-900'
                            : isNeedsInfo
                            ? 'bg-amber-200 text-amber-950'
                            : 'bg-red-200 text-red-900'
                        }`}>
                          {isEligible ? '✓ पात्र' : isNeedsInfo ? `? ${s.missing.length} बाकी` : '✕ अपात्र'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                        <span>{s.highlightAmount || 'सहायता'}</span>
                        <span className="font-mono text-slate-500">
                          पास: {s.passed.length} · फेल: {s.failed.length}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complete & View Full Results / Print Slip Action */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#004B87] hover:bg-[#002D54] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                >
                  <span>{isAllAnswered ? '✓ परिणाम व CSC पर्ची बनाएं' : 'समीक्षा पृष्ठ पर जाएं ➔'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Operator Shortcuts Cheat Sheet */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
              <strong className="text-slate-900 font-bold block">कीबोर्ड शॉर्टकट:</strong>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span className="flex items-center gap-1.5"><kbd className="kbd-badge">1</kbd> पहला विकल्प (हाँ)</span>
                <span className="flex items-center gap-1.5"><kbd className="kbd-badge">2</kbd> दूसरा विकल्प (नहीं)</span>
                <span className="flex items-center gap-1.5"><kbd className="kbd-badge">3</kbd> तीसरा विकल्प / Not sure</span>
                <span className="flex items-center gap-1.5"><kbd className="kbd-badge">←</kbd> पिछला सवाल</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CITIZEN MODE: Single-Column Guided View (max-w-3xl)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Progress Bar (GOV.UK Step Indicator) */}
      <ProgressBar
        currentStep={currentStep}
        totalSteps={QUESTION_REGISTRY.length}
        onBack={handleBack}
        language={language}
      />

      {/* Main Focused Question Card */}
      <QuestionCard
        question={currentQuestion}
        onSelectOption={handleSelectOption}
        language={language}
        mode={mode}
      />

      {/* Collapsible Mini Ledger */}
      <MiniLedger
        answers={answers}
        language={language}
        onEditStep={(idx) => setCurrentStep(idx)}
      />

    </div>
  );
}
