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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-card space-y-6 max-w-2xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-100 pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi">
          {language === 'hi' ? 'अपने उत्तरों की समीक्षा करें' : 'Check Your Answers'}
        </h2>
        <p className="text-slate-500 text-sm">
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
            <div key={q.id} className="py-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs text-slate-400 font-medium block">
                  {language === 'hi' ? `सवाल ${idx + 1}` : `Question ${idx + 1}`}
                </span>
                <span className="text-sm font-semibold text-slate-800 block font-hindi">
                  {title}
                </span>
                <span className="text-sm font-bold text-[#004B87] block font-hindi pt-0.5">
                  {ans}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onEditIndex(idx)}
                className="text-xs font-bold text-slate-500 hover:text-[#004B87] px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#004B87] transition-colors shrink-0"
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
          className="text-slate-500 hover:text-slate-800 font-semibold text-sm flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'सवालों पर लौटें' : 'Back to questions'}</span>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="min-h-[48px] px-8 py-3 rounded-2xl bg-[#004B87] hover:bg-[#002D54] text-white font-extrabold text-base flex items-center gap-2 shadow-cta hover:shadow-cta-hover transition-all active:scale-[0.98]"
        >
          <span>{language === 'hi' ? 'पात्रता परिणाम देखें' : 'View Results'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
