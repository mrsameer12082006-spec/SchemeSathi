import React, { useState } from 'react';
import { Filter, CheckCircle2, AlertCircle, XCircle, Printer, Edit3, Volume2 } from 'lucide-react';
import ResultCard from '../components/results/ResultCard';
import TouchButton from '../components/common/TouchButton';
import AudioButton from '../components/common/AudioButton';

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
  const needsInfoCount = results.filter(r => r.status === 'needs_information').length;
  const notEligibleCount = results.filter(r => r.status === 'not_eligible').length;

  const filteredResults = results.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const topEligible = results.find(r => r.status === 'potentially_eligible') || results[0];

  const audioSummary = language === 'hi'
    ? `आपकी पात्रता रिपोर्ट तैयार है। कुल तीन योजनाओं में से, आप ${eligibleCount} योजनाओं के लिए संभावित रूप से पात्र पाए गए हैं।`
    : `Your eligibility report is ready. Out of three evaluated central schemes, you are potentially eligible for ${eligibleCount} schemes.`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* ───────────────────────────────────────────────────────────
          Top Summary & Actions Header Card
          ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#004B87] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                {language === 'hi' ? 'सत्यापित नियम इंजन रिपोर्ट' : 'Deterministic Audit Report'}
              </span>
              <AudioButton
                textToSpeak={audioSummary}
                language={language}
                size="sm"
                variant="subtle"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-hindi">
              {language === 'hi' ? 'आपकी सरकारी योजना पात्रता रिपोर्ट' : 'Your Scheme Eligibility Report'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <TouchButton onClick={onEditAnswers} variant="secondary" className="min-h-[44px] text-xs sm:text-sm py-2 px-4">
              <Edit3 className="w-4 h-4" />
              <span>{language === 'hi' ? 'जवाब बदलें' : 'Edit Answers'}</span>
            </TouchButton>

            {eligibleCount > 0 && (
              <TouchButton onClick={() => onPrintSlip(topEligible)} variant="primary" className="min-h-[44px] text-xs sm:text-sm py-2 px-5">
                <Printer className="w-4 h-4" />
                <span>{language === 'hi' ? 'CSC पर्ची प्रिंट करें' : 'Print CSC Slip'}</span>
              </TouchButton>
            )}
          </div>
        </div>

        {/* Evaluated Facts Pill Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-wrap items-center gap-2">
          <strong className="text-slate-900 font-bold">
            {language === 'hi' ? 'जांचे गए तथ्य:' : 'Evaluated Facts:'}
          </strong>
          {answers['has_cultivable_land'] && (
            <span className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg">
              जमीन: <strong className="text-slate-900">{answers['has_cultivable_land'].label}</strong>
            </span>
          )}
          {answers['is_income_tax_payer'] && (
            <span className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg">
              आयकर: <strong className="text-slate-900">{answers['is_income_tax_payer'].label}</strong>
            </span>
          )}
          {answers['is_govt_employee_or_pensioner'] && (
            <span className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg">
              सरकारी सेवा: <strong className="text-slate-900">{answers['is_govt_employee_or_pensioner'].label}</strong>
            </span>
          )}
          {answers['house_type'] && (
            <span className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg">
              मकान: <strong className="text-slate-900">{answers['house_type'].label}</strong>
            </span>
          )}
        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────
          Filter Tabs with Visual Counters
          ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center gap-2 ${
            filter === 'all'
              ? 'bg-[#004B87] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }`}
        >
          <span>{language === 'hi' ? 'सभी 3 योजनाएं' : 'All 3 Schemes'}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${filter === 'all' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {results.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('potentially_eligible')}
          className={`px-4 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center gap-2 ${
            filter === 'potentially_eligible'
              ? 'bg-green-700 text-white shadow-xs'
              : 'bg-white text-green-900 hover:bg-green-50 border border-green-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>{language === 'hi' ? 'संभावित पात्र' : 'Potentially Eligible'}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'potentially_eligible' ? 'bg-green-900 text-white' : 'bg-green-100 text-green-800'}`}>
            {eligibleCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('needs_information')}
          className={`px-4 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center gap-2 ${
            filter === 'needs_information'
              ? 'bg-amber-800 text-white shadow-xs'
              : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{language === 'hi' ? 'जानकारी बाकी' : 'Needs Info'}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'needs_information' ? 'bg-amber-950 text-white' : 'bg-amber-100 text-amber-800'}`}>
            {needsInfoCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('not_eligible')}
          className={`px-4 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center gap-2 ${
            filter === 'not_eligible'
              ? 'bg-red-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
          }`}
        >
          <XCircle className="w-4 h-4 text-red-600" />
          <span>{language === 'hi' ? 'शर्तें पूरी नहीं' : 'Not Eligible'}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${filter === 'not_eligible' ? 'bg-red-950 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {notEligibleCount}
          </span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────
          Schemes Results Stack
          ─────────────────────────────────────────────────────────── */}
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
