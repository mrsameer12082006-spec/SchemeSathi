import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import QuestionCard from '../components/questionnaire/QuestionCard';
import { QUESTION_REGISTRY } from '../data/schemesData';

export default function GuidedInterview({
  answers,
  setAnswers,
  onComplete,
  language,
  mode = 'citizen',
  initialStep = 0
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const currentQuestion = QUESTION_REGISTRY[currentStep];

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

  // Kiosk high-speed keyboard shortcuts (1, 2, 3...)
  useEffect(() => {
    if (mode !== 'operator' || !currentQuestion) return;

    const handleKeyDown = (e) => {
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= currentQuestion.options.length) {
        const selected = currentQuestion.options[num - 1];
        handleSelectOption(currentQuestion.field, selected.value, selected.shortText);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, mode, currentQuestion]);

  const progressPercent = Math.round(((currentStep + 1) / QUESTION_REGISTRY.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Top Step Counter & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-zinc-700 font-semibold bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 rounded text-[11px]">
              0{currentStep + 1} / 0{QUESTION_REGISTRY.length}
            </span>
            <span className="font-hindi text-zinc-600">
              {language === 'hi'
                ? `सवाल ${currentStep + 1}`
                : `Question ${currentStep + 1}`}
            </span>
            {mode === 'operator' && (
              <span className="keycap-badge text-[10px] h-5 tracking-tight">
                NUMPAD 1-9
              </span>
            )}
          </div>

          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-zinc-600 hover:text-[#141417] flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पिछला सवाल' : 'Back'}</span>
            </button>
          )}
        </div>

        {/* Minimal Hairline Progress Track */}
        <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#141417] h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Single-Focus Question Card */}
      <QuestionCard
        question={currentQuestion}
        onSelectOption={handleSelectOption}
        language={language}
        mode={mode}
      />

    </div>
  );
}
