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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'सत्यापित नियम मिलान पूर्ण' : 'Audit Complete'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi">
            {language === 'hi' ? 'आपकी योजना पात्रता रिपोर्ट' : 'Your Eligibility Report'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'hi'
              ? `कुल 3 योजनाओं में से आप ${eligibleCount} योजनाओं के लिए संभावित रूप से पात्र पाए गए हैं।`
              : `You are potentially eligible for ${eligibleCount} out of 3 evaluated schemes.`}
          </p>
        </div>

        <button
          type="button"
          onClick={onEditAnswers}
          className="text-xs font-bold text-slate-600 hover:text-[#004B87] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'उत्तर बदलें' : 'Edit Answers'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-[#004B87] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {language === 'hi' ? `सभी योजनाएं (${results.length})` : `All Schemes (${results.length})`}
        </button>

        <button
          type="button"
          onClick={() => setFilter('potentially_eligible')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            filter === 'potentially_eligible'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
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
