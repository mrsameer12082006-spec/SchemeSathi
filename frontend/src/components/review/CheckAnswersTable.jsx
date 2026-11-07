import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CheckAnswersTable({
  questions,
  answers,
  onEditIndex,
  onConfirm,
  onBack,
  language
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-1.5 bg-gradient-to-b from-blue-100/70 via-slate-100 to-indigo-100/50 border border-blue-200/70 rounded-2xl shadow-xl shadow-blue-500/5">
        <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Header */}
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-hindi">
              {language === 'hi' ? 'अपने उत्तरों की समीक्षा करें' : 'Check Your Answers'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              {language === 'hi'
                ? 'परिणाम देखने से पहले सुनिश्चित करें कि सभी जानकारी सही है।'
                : 'Review your recorded answers before checking eligibility results.'}
            </p>
          </div>

          {/* Clean Review Rows */}
          <div className="divide-y divide-slate-100">
            {questions.map((q, idx) => {
              const ans = answers[q.field]?.label || (language === 'hi' ? 'अनुपलब्ध' : 'Not answered');
              const title = language === 'hi' ? q.titleHindi : q.titleEnglish;

              return (
                <div key={q.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-slate-400 font-medium block">
                      {language === 'hi' ? `सवाल ${idx + 1}` : `Question ${idx + 1}`}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 block font-hindi">
                      {title}
                    </span>
                    <span className="text-base font-bold text-slate-900 block font-hindi pt-0.5">
                      {ans}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditIndex(idx)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 transition-colors shrink-0 cursor-pointer"
                  >
                    {language === 'hi' ? 'बदलें' : 'Change'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="text-slate-500 hover:text-slate-900 font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'सवालों पर लौटें' : 'Back to questions'}</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="px-7 py-3.5 rounded-xl btn-primary-glow font-bold text-sm flex items-center gap-2 active:scale-[0.985] cursor-pointer"
            >
              <span>{language === 'hi' ? 'पात्रता परिणाम देखें' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
