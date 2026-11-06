import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProgressBar({ currentStep, totalSteps, onBack, language }) {
  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-700">
        <span className="flex items-center gap-2">
          <span className="bg-[#004B87] text-white px-2.5 py-0.5 rounded-full text-xs">
            {currentStep + 1}/{totalSteps}
          </span>
          <span>
            {language === 'hi'
              ? `सवाल ${currentStep + 1} (${totalSteps} में से)`
              : `Question ${currentStep + 1} of ${totalSteps}`}
          </span>
        </span>

        {currentStep > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="text-[#004B87] hover:text-[#002D54] font-bold flex items-center gap-1 min-h-[36px] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'पिछला सवाल (Back)' : 'Previous Question'}</span>
          </button>
        )}
      </div>

      {/* Progress Track */}
      <div
        className="w-full bg-slate-200/90 rounded-full h-3 overflow-hidden shadow-inner p-0.5"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="bg-[#004B87] h-full rounded-full transition-all duration-300 progress-animated"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
