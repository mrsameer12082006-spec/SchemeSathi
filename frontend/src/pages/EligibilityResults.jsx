import React, { useState } from 'react';
import { ArrowLeft, Edit3, CheckCircle2 } from 'lucide-react';
import ResultCard from '../components/results/ResultCard';

export default function EligibilityResults({
  results,
  answers,
  onEditAnswers,
  onOpenDetails,
  onPrintSlip,
  language
}) {
  const [filter, setFilter] = useState('all');

  const eligibleCount = results.filter(r => r.status === 'potentially_eligible').length;
  const filteredResults = results.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto animate-fade-in">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#F2F2F4] border border-[#E4E4E7] px-3.5 py-1 rounded-full text-xs font-mono text-zinc-600 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block shrink-0" />
            <span className="font-medium text-zinc-800 font-sans">
              {language === 'hi' ? 'सत्यापित नियम मिलान पूर्ण' : 'Rule Match Complete'}
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-500 font-mono text-[11px]">
              {eligibleCount} / {results.length} MATCHED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#141417] font-hindi">
            {language === 'hi' ? 'आपकी योजना पात्रता रिपोर्ट' : 'Your Eligibility Report'}
          </h2>
          <p className="text-sm text-zinc-500">
            {language === 'hi'
              ? `कुल 3 योजनाओं में से आप ${eligibleCount} योजनाओं के लिए संभावित रूप से पात्र पाए गए हैं।`
              : `You are potentially eligible for ${eligibleCount} out of 3 evaluated schemes.`}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditAnswers}
          className="text-xs font-medium text-zinc-700 hover:text-[#141417] px-4 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'उत्तर बदलें' : 'Edit Answers'}</span>
        </button>
      </div>

      {/* Filter Tabs in Segmented Recessed Well */}
      <div className="flex items-center gap-1 bg-[#F2F2F4] border border-[#E4E4E7] p-1 rounded-lg w-fit shadow-2xs text-xs font-medium">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            filter === 'all'
              ? 'bg-[#141417] text-white shadow-2xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          {language === 'hi' ? `सभी योजनाएं (${results.length})` : `All Schemes (${results.length})`}
        </button>

        <button
          type="button"
          onClick={() => setFilter('potentially_eligible')}
          className={`px-3 py-1.5 rounded-md transition-all ${
            filter === 'potentially_eligible'
              ? 'bg-[#141417] text-white shadow-2xs font-semibold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          {language === 'hi' ? `संभावित पात्र (${eligibleCount})` : `Eligible (${eligibleCount})`}
        </button>
      </div>

      {/* Scheme Cards Stack */}
      <div className="space-y-6">
        {filteredResults.map(scheme => (
          <ResultCard
            key={scheme.schemeId}
            scheme={scheme}
            language={language}
            onOpenDetails={onOpenDetails}
            onPrintSlip={onPrintSlip}
          />
        ))}
      </div>

    </div>
  );
}
