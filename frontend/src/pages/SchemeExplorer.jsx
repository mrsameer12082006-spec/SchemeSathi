import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { VERIFIED_SCHEMES } from '../data/schemesData';

export default function SchemeExplorer({ onBack, onStartCheck, onSelectScheme, language }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', labelHindi: 'सभी योजनाएं', labelEnglish: 'All Schemes' },
    { id: 'farmer', labelHindi: '🌾 किसान कल्याण', labelEnglish: '🌾 Farmers' },
    { id: 'housing', labelHindi: '🏠 ग्रामीण आवास', labelEnglish: '🏠 Housing' },
    { id: 'health', labelHindi: '🏥 स्वास्थ्य सुरक्षा', labelEnglish: '🏥 Healthcare' },
  ];

  const filteredSchemes = VERIFIED_SCHEMES.filter(scheme => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.ministry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.benefitSummary.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'farmer') return scheme.id.includes('kisan');
    if (selectedCategory === 'housing') return scheme.id.includes('awas');
    if (selectedCategory === 'health') return scheme.id.includes('jay');

    return true;
  });

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto animate-fade-in">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-[#004B87] flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}</span>
          </button>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-hindi tracking-tight display-heading">
            {language === 'hi' ? 'सत्यापित केंद्रीय सरकारी योजनाएं' : 'Verified Central Welfare Schemes'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'hi' ? 'भारत सरकार के आधिकारिक पोर्टलों से सत्यापित नियम' : 'Official eligibility rules grounded in ministry guidelines'}
          </p>
        </div>

        {/* Quick Check CTA with Spring Press */}
        <button
          type="button"
          onClick={onStartCheck}
          className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#004B87] hover:bg-[#002D54] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-cta hover:shadow-cta-hover spring-press self-start sm:self-auto shrink-0"
        >
          <span>{language === 'hi' ? 'अपनी पात्रता जांचें' : 'Check Eligibility'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        
        {/* Search Input with Linear Style Hairline */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'योजना का नाम, मंत्रालय या लाभ खोजें...' : 'Search by scheme name, ministry, or benefit...'}
            className="w-full bg-white hairline-border rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#004B87] shadow-2xs font-hindi"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl spring-press ${
                selectedCategory === cat.id
                  ? 'bg-[#004B87] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hairline-border'
              }`}
            >
              {language === 'hi' ? cat.labelHindi : cat.labelEnglish}
            </button>
          ))}
        </div>

      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredSchemes.map(scheme => (
          <div
            key={scheme.id}
            className="bg-white hairline-border rounded-3xl p-6 space-y-4 shadow-card hover:shadow-card-hover tactile-card flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#004B87] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  {scheme.tag || scheme.scope}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {scheme.lastVerified}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-extrabold text-slate-900 metric-tabular">
                  {scheme.highlightAmount}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base font-hindi leading-snug">
                  {language === 'hi' ? scheme.name : scheme.englishName}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed hindi-body line-clamp-3">
                {language === 'hi' ? scheme.benefitSummary : scheme.englishBenefitSummary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onSelectScheme(scheme)}
                className="text-xs font-bold text-[#004B87] hover:underline flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'कागजात व आवेदन देखें' : 'View details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-400 hover:text-[#004B87] font-mono flex items-center gap-1"
              >
                <span>{scheme.officialUrl.replace('https://', '')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
