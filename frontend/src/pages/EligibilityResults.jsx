import React, { useState } from 'react';
import { Edit3, CheckCircle2 } from 'lucide-react';
import ResultCard from '../components/results/ResultCard';

export default function EligibilityResults({
  results,
  answers,
  onEditAnswers,
  onOpenDetails,
  onPrintSlip
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
            <span className="font-bold text-zinc-800 font-sans">
              Rule Match Complete
            </span>
            <span className="text-zinc-300">·</span>
            <span className="text-zinc-500 font-mono text-[11px] font-bold">
              {eligibleCount} / {results.length} SCHEMES MATCHED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Your Scheme Eligibility Report
          </h2>
          <p className="text-sm text-zinc-500">
            {eligibleCount > 0
              ? `You qualify for ${eligibleCount} out of ${results.length} central welfare schemes based on your recorded criteria.`
              : `Review the rule criteria below for each scheme to see which conditions were not met.`}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditAnswers}
          className="text-xs font-semibold text-zinc-700 hover:text-[#111111] px-4 py-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-2xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Answers</span>
        </button>
      </div>

      {/* Filter Tabs in Segmented Recessed Well */}
      <div className="flex items-center gap-1.5 bg-[#F2F2F4] border border-[#E4E4E7] p-1.5 rounded-xl w-fit shadow-2xs text-xs font-semibold">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-[#111111] text-white shadow-2xs font-bold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          All Schemes ({results.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('potentially_eligible')}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === 'potentially_eligible'
              ? 'bg-[#111111] text-white shadow-2xs font-bold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Eligible ({eligibleCount})
        </button>
      </div>

      {/* Scheme Cards Stack */}
      <div className="space-y-6">
        {filteredResults.map(scheme => (
          <ResultCard
            key={scheme.schemeId}
            scheme={scheme}
            onOpenDetails={onOpenDetails}
            onPrintSlip={onPrintSlip}
          />
        ))}
      </div>

    </div>
  );
}
