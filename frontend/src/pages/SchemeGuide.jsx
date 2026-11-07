import React, { useState } from 'react';
import { ArrowLeft, Printer, ExternalLink, FileText } from 'lucide-react';
import CscPrintSlip from '../components/results/CscPrintSlip';

export default function SchemeGuide({
  scheme,
  userAnswers,
  onBack,
  language
}) {
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showSlipOnly, setShowSlipOnly] = useState(false);

  if (!scheme) {
    return (
      <div className="tactile-card p-8 rounded-xl text-center space-y-4 max-w-xl mx-auto border border-zinc-200">
        <p className="text-zinc-600 font-medium">कोई योजना चयनित नहीं है।</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-[#141417] hover:bg-[#27272D] text-white rounded-lg text-sm font-medium">
          {language === 'hi' ? 'वापस जाएं' : 'Go back'}
        </button>
      </div>
    );
  }

  if (showSlipOnly) {
    return (
      <CscPrintSlip
        scheme={scheme}
        userAnswers={userAnswers}
        onBack={() => setShowSlipOnly(false)}
        language={language}
      />
    );
  }

  const toggleDoc = (idx) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto animate-fade-in">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium text-zinc-500 hover:text-[#141417] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस परिणामों पर जाएं' : 'Back to Results'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSlipOnly(true)}
          className="px-4 py-2 rounded-lg bg-[#141417] hover:bg-[#27272D] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.985]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'CSC पर्ची देखें' : 'View CSC Slip'}</span>
        </button>
      </div>

      {/* Main Guide Card */}
      <div className="tactile-card rounded-xl p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-zinc-100 pb-5 space-y-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-medium">
            {scheme.ministry}
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#141417] font-hindi">
            {scheme.schemeName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed hindi-body">
            {scheme.benefitSummary}
          </p>
        </div>

        {/* 2-Column: Checklist vs Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Step 1: Documents */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#141417] text-base flex items-center gap-2 font-hindi">
              <FileText className="w-4 h-4 text-zinc-700" />
              <span>{language === 'hi' ? '1. अपने कागजात तैयार करें' : '1. Required Documents'}</span>
            </h3>

            <div className="space-y-2">
              {scheme.documents.map((doc, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    checkedDocs[idx]
                      ? 'bg-zinc-50 border-zinc-300'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[idx]}
                    onChange={() => toggleDoc(idx)}
                    className="w-4 h-4 mt-0.5 text-[#141417] rounded border-zinc-300 focus:ring-0"
                  />
                  <div className="text-xs">
                    <strong className="text-zinc-900 font-semibold block font-hindi">{doc.name}</strong>
                    <span className="text-zinc-500">{doc.note}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Application Process */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#141417] text-base font-hindi">
              {language === 'hi' ? '2. आवेदन कैसे करें' : '2. How to Apply'}
            </h3>

            <ol className="space-y-2.5 text-xs sm:text-sm text-zinc-700">
              {scheme.applicationSteps.map((step, idx) => (
                <li key={idx} className="flex gap-3 bg-zinc-50/80 p-3 rounded-lg border border-zinc-200/60 items-center">
                  <span className="keycap-badge shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed hindi-body">{step}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Official Portal Link */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">आधिकारिक सरकारी पोर्टल:</span>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#141417] font-mono font-medium flex items-center gap-1 hover:underline"
          >
            <span>{scheme.officialUrl}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
