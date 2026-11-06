import React, { useState } from 'react';
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
  const progressPercent = Math.round(((currentStep + 1) / QUESTION_REGISTRY.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Top Step Counter & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            {language === 'hi'
              ? `सवाल ${currentStep + 1} / ${QUESTION_REGISTRY.length}`
              : `Question ${currentStep + 1} of ${QUESTION_REGISTRY.length}`}
          </span>

          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-[#004B87] hover:underline flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पिछला सवाल' : 'Back'}</span>
            </button>
          )}
        </div>

        {/* 1px sleek progress track */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#004B87] h-full rounded-full transition-all duration-300"
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
