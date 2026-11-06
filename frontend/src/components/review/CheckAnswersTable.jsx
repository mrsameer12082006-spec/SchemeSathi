import React from 'react';
import { ArrowLeft, CheckCircle2, Edit3, Volume2 } from 'lucide-react';
import TouchButton from '../common/TouchButton';
import AudioButton from '../common/AudioButton';

export default function CheckAnswersTable({
  questions,
  answers,
  onEditIndex,
  onConfirm,
  onBack,
  language
}) {
  const audioSummary = language === 'hi'
    ? 'अपने दर्ज किए गए उत्तरों की समीक्षा करें। यदि सब सही है, तो परिणाम देखने के लिए नीचे दिए गए बटन को दबाएं।'
    : 'Please review your recorded answers. If everything is correct, tap the button below to view your eligibility results.';

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-black text-[#004B87] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {language === 'hi' ? 'समीक्षा चरण (Review Step)' : 'Review Step'}
          </span>
          <AudioButton
            textToSpeak={audioSummary}
            language={language}
            size="sm"
            variant="subtle"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-hindi">
          {language === 'hi' ? 'अपने जवाबों की जांच करें' : 'Check Your Answers'}
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {language === 'hi'
            ? 'परिणाम देखने से पहले सुनिश्चित करें कि सभी जानकारी सही है। यदि किसी जवाब में सुधार करना हो तो "बदलें" पर क्लिक करें।'
            : 'Review your recorded answers before running eligibility evaluation. Click "Change" to modify any response.'}
        </p>
      </div>

      {/* Answers Rows Stack */}
      <div className="divide-y divide-slate-200 border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
        {questions.map((q, idx) => {
          const ans = answers[q.field]?.label || (language === 'hi' ? 'अनुपलब्ध (Not answered)' : 'Not answered');
          const title = language === 'hi' ? q.titleHindi : q.titleEnglish;

          return (
            <div key={q.id} className="p-4 sm:p-5 hover:bg-slate-50 flex items-center justify-between gap-4 text-sm transition-colors">
              <div className="space-y-1 max-w-xl">
                <span className="text-xs text-slate-500 font-extrabold block">
                  {language === 'hi' ? `सवाल ${idx + 1}` : `Question ${idx + 1}`}
                </span>
                <span className="text-slate-900 font-bold block text-sm sm:text-base font-hindi">
                  {title}
                </span>
                <div className="inline-block bg-blue-50 text-[#004B87] border border-blue-200 font-black text-sm sm:text-base px-3 py-1 rounded-lg mt-1">
                  {ans}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onEditIndex(idx)}
                className="text-[#004B87] hover:text-[#002D54] font-extrabold text-xs sm:text-sm shrink-0 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-[#004B87] hover:bg-white transition-all flex items-center gap-1.5 min-h-[44px]"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बदलें' : 'Change'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-600 hover:text-slate-900 font-bold text-sm min-h-[48px] flex items-center gap-1.5 px-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'सवालों पर वापस जाएं' : 'Back to Questions'}</span>
        </button>

        <TouchButton onClick={onConfirm} variant="primary" className="text-base sm:text-lg px-8 min-h-[52px]">
          <CheckCircle2 className="w-5 h-5" />
          <span>{language === 'hi' ? 'पात्रता परिणाम देखें' : 'View Eligibility Results'}</span>
        </TouchButton>
      </div>

    </div>
  );
}
