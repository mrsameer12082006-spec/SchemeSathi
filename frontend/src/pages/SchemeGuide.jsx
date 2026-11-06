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
      <div className="bg-white p-8 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-slate-200">
        <p className="text-slate-600 font-medium">कोई योजना चयनित नहीं है।</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-[#004B87] text-white rounded-xl text-sm font-bold">वापस जाएं</button>
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
          className="text-xs font-bold text-slate-500 hover:text-[#004B87] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस परिणामों पर जाएं' : 'Back to Results'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSlipOnly(true)}
          className="px-4 py-2 rounded-xl bg-[#004B87] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'CSC पर्ची देखें' : 'View CSC Slip'}</span>
        </button>
      </div>

      {/* Main Guide Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-5 space-y-2">
          <span className="text-xs font-bold text-[#004B87] uppercase tracking-wider block">
            {scheme.ministry}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi">
            {scheme.schemeName}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {scheme.benefitSummary}
          </p>
        </div>

        {/* 2-Column: Checklist vs Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Step 1: Documents */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#004B87]" />
              <span>{language === 'hi' ? '1. अपने कागजात तैयार करें' : '1. Required Documents'}</span>
            </h3>

            <div className="space-y-2">
              {scheme.documents.map((doc, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    checkedDocs[idx]
                      ? 'bg-blue-50/70 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[idx]}
                    onChange={() => toggleDoc(idx)}
                    className="w-4 h-4 mt-0.5 text-[#004B87] rounded border-slate-300"
                  />
                  <div className="text-xs">
                    <strong className="text-slate-900 font-bold block">{doc.name}</strong>
                    <span className="text-slate-500">{doc.note}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Application Process */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base">
              {language === 'hi' ? '2. आवेदन कैसे करें' : '2. How to Apply'}
            </h3>

            <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
              {scheme.applicationSteps.map((step, idx) => (
                <li key={idx} className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  <span className="w-5 h-5 rounded-full bg-[#004B87] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Official Portal Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">आधिकारिक सरकारी पोर्टल:</span>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#004B87] font-bold flex items-center gap-1 hover:underline"
          >
            <span>{scheme.officialUrl}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
