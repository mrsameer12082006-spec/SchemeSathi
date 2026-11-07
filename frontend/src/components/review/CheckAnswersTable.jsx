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
      <div className="p-1.5 bg-[#F2F2F4] border border-[#E4E4E7] rounded-2xl shadow-2xs">
        <div className="bg-white rounded-xl border border-zinc-200/70 p-6 sm:p-8 space-y-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          
          {/* Header */}
          <div className="space-y-1.5 border-b border-zinc-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#141417] font-hindi">
              {language === 'hi' ? 'अपने उत्तरों की समीक्षा करें' : 'Check Your Answers'}
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm">
              {language === 'hi'
                ? 'परिणाम देखने से पहले सुनिश्चित करें कि सभी जानकारी सही है।'
                : 'Review your recorded answers before checking eligibility results.'}
            </p>
          </div>

          {/* Clean Review Rows */}
          <div className="divide-y divide-zinc-100">
            {questions.map((q, idx) => {
              const ans = answers[q.field]?.label || (language === 'hi' ? 'अनुपलब्ध' : 'Not answered');
              const title = language === 'hi' ? q.titleHindi : q.titleEnglish;

              return (
                <div key={q.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-zinc-400 font-medium block">
                      {language === 'hi' ? `सवाल ${idx + 1}` : `Question ${idx + 1}`}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-zinc-700 block font-hindi">
                      {title}
                    </span>
                    <span className="text-sm font-semibold text-[#141417] block font-hindi pt-0.5">
                      {ans}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditIndex(idx)}
                    className="text-xs font-medium text-zinc-600 hover:text-[#141417] px-2.5 py-1 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors shrink-0"
                  >
                    {language === 'hi' ? 'बदलें' : 'Change'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onBack}
              className="text-zinc-500 hover:text-[#141417] font-medium text-xs sm:text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'सवालों पर लौटें' : 'Back to questions'}</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-3 rounded-lg bg-[#141417] hover:bg-[#27272D] text-white font-medium text-sm flex items-center gap-2 shadow-xs transition-all active:scale-[0.985]"
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
