import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CheckAnswersTable({
  questions,
  answers,
  onEditIndex,
  onConfirm,
  onBack
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-2 bg-[#F2F2F4] border border-[#E4E4E7] rounded-2xl shadow-2xs">
        <div className="bg-white rounded-xl border border-zinc-200/80 p-6 sm:p-8 space-y-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          
          {/* Header */}
          <div className="space-y-1.5 border-b border-zinc-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
              Review Your Answers
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm">
              Confirm your responses before running the deterministic scheme evaluation.
            </p>
          </div>

          {/* Clean Review Rows */}
          <div className="divide-y divide-zinc-100">
            {questions.map((q, idx) => {
              const ans = answers[q.field]?.label || 'Not answered';
              const title = q.titleEnglish || q.title;

              return (
                <div key={q.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-zinc-400 font-semibold block uppercase">
                      Question 0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-zinc-700 block">
                      {title}
                    </span>
                    <span className="text-sm font-bold text-[#111111] block pt-0.5">
                      {ans}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEditIndex(idx)}
                    className="text-xs font-semibold text-zinc-700 hover:text-[#111111] px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors shrink-0"
                  >
                    Change
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
              className="text-zinc-600 hover:text-[#111111] font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to questions</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="px-6 py-3 rounded-full bg-[#111111] hover:bg-[#262626] text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-all active:scale-[0.985]"
            >
              <span>View Eligibility Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
