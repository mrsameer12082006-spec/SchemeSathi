import React from 'react';
import { ClipboardList, ChevronDown, Edit3 } from 'lucide-react';

export default function MiniLedger({ answers, language, onEditStep }) {
  const answeredKeys = Object.keys(answers);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <details className="group">
        <summary className="cursor-pointer font-bold text-sm text-slate-800 flex items-center justify-between list-none">
          <span className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#004B87]" />
            <span>
              {language === 'hi'
                ? `अब तक दर्ज जानकारी (${answeredKeys.length} जवाब)`
                : `What we know so far (${answeredKeys.length} answered)`}
            </span>
          </span>
          <span className="text-[#004B87] text-xs font-bold flex items-center gap-1 group-open:rotate-180 transition-transform">
            <ChevronDown className="w-4 h-4" />
          </span>
        </summary>

        <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-sm text-slate-700">
          {answeredKeys.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              {language === 'hi' ? 'अभी कोई जवाब दर्ज नहीं हुआ है।' : 'No answers recorded yet.'}
            </p>
          ) : (
            answeredKeys.map((key, idx) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono block">{key}</span>
                  <span className="font-extrabold text-[#004B87] text-sm sm:text-base font-hindi">
                    {answers[key].label}
                  </span>
                </div>
                {onEditStep && (
                  <button
                    type="button"
                    onClick={() => onEditStep(idx)}
                    className="text-xs text-[#004B87] hover:underline font-bold px-3 py-1 rounded-lg border border-slate-200 hover:bg-blue-50 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{language === 'hi' ? 'बदलें' : 'Edit'}</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </details>
    </div>
  );
}
