import React, { useState } from 'react';
import { ArrowLeft, Printer, ExternalLink, FileText } from 'lucide-react';
import CscPrintSlip from '../components/results/CscPrintSlip';

export default function SchemeGuide({
  scheme,
  userAnswers,
  onBack
}) {
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showSlipOnly, setShowSlipOnly] = useState(false);

  if (!scheme) {
    return (
      <div className="tactile-card p-8 rounded-xl text-center space-y-4 max-w-xl mx-auto border border-zinc-200">
        <p className="text-zinc-600 font-medium">No scheme selected.</p>
        <button onClick={onBack} className="px-5 py-2.5 bg-[#111111] hover:bg-[#262626] text-white rounded-full text-sm font-bold">
          Go back
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
          className="text-xs font-semibold text-zinc-500 hover:text-[#111111] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSlipOnly(true)}
          className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.985]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>View CSC Slip</span>
        </button>
      </div>

      {/* Main Guide Card */}
      <div className="tactile-card rounded-2xl p-6 sm:p-10 space-y-8 border border-zinc-200 shadow-2xs">
        
        {/* Header */}
        <div className="border-b border-zinc-100 pb-5 space-y-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block font-bold">
            {scheme.englishMinistry || scheme.ministry}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            {scheme.englishName || scheme.schemeName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {scheme.englishBenefitSummary || scheme.benefitSummary}
          </p>
        </div>

        {/* 2-Column: Checklist vs Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Step 1: Documents */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#111111] text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-700" />
              <span>1. Required Documents Checklist</span>
            </h3>

            <div className="space-y-2">
              {scheme.documents.map((doc, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    checkedDocs[idx]
                      ? 'bg-zinc-50 border-zinc-400'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedDocs[idx]}
                    onChange={() => toggleDoc(idx)}
                    className="w-4 h-4 mt-0.5 text-[#111111] rounded border-zinc-300 focus:ring-0"
                  />
                  <div className="text-xs">
                    <strong className="text-zinc-900 font-bold block">{doc.name}</strong>
                    <span className="text-zinc-500">{doc.note}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Application Process */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#111111] text-base">
              2. How to Apply
            </h3>

            <ol className="space-y-2.5 text-xs sm:text-sm text-zinc-700">
              {scheme.applicationSteps.map((step, idx) => (
                <li key={idx} className="flex gap-3 bg-zinc-50/80 p-3.5 rounded-xl border border-zinc-200/60 items-center">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-200 font-mono text-xs font-bold text-[#111111] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>

        {/* Official Portal Link */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-medium">Official Ministry Portal:</span>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#111111] font-mono font-bold flex items-center gap-1 hover:underline"
          >
            <span>{scheme.officialUrl}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
