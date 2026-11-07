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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-medium text-zinc-500 hover:text-[#141417] flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}</span>
          </button>

          <h2 className="text-2xl sm:text-3xl font-semibold text-[#141417] font-hindi tracking-tight">
            {language === 'hi' ? 'सत्यापित केंद्रीय सरकारी योजनाएं' : 'Verified Central Welfare Schemes'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            {language === 'hi' ? 'भारत सरकार के आधिकारिक पोर्टलों से सत्यापित नियम' : 'Official eligibility rules grounded in ministry guidelines'}
          </p>
        </div>

        {/* Quick Check CTA */}
        <button
          type="button"
          onClick={onStartCheck}
          className="px-5 py-2.5 rounded-xl btn-primary-glow font-semibold text-xs sm:text-sm flex items-center gap-2 active:scale-[0.985] self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <span>{language === 'hi' ? 'अपनी पात्रता जांचें' : 'Check Eligibility'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        
        {/* Search Input with Razor-Sharp Border & Keycap Indicator */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'योजना का नाम, मंत्रालय या लाभ खोजें...' : 'Search by scheme name, ministry, or benefit...'}
            className="w-full bg-white border border-zinc-200 rounded-lg pl-11 pr-12 py-3 text-sm text-[#141417] placeholder:text-zinc-400 focus:outline-hidden focus:border-[#141417] shadow-2xs font-hindi"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="keycap-badge">/</span>
          </div>
        </div>

        {/* Category Segmented Recessed Well */}
        <div className="flex items-center gap-1 bg-[#F2F2F4] border border-[#E4E4E7] p-1 rounded-lg w-fit max-w-full overflow-x-auto shadow-2xs text-xs font-medium">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#141417] text-white shadow-2xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {language === 'hi' ? cat.labelHindi : cat.labelEnglish}
            </button>
          ))}
        </div>

      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredSchemes.map(scheme => {
          const isKisan = scheme.id.includes('kisan');
          const isAwas = scheme.id.includes('awas');
          const isJay = scheme.id.includes('jay');

          const accentBar = isKisan
            ? 'from-emerald-500 to-teal-500'
            : isAwas
            ? 'from-amber-500 to-orange-500'
            : 'from-blue-600 to-indigo-600';

          const tagBadge = isKisan
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isAwas
            ? 'bg-amber-50 text-amber-900 border-amber-200'
            : 'bg-blue-50 text-blue-900 border-blue-200';

          return (
            <div
              key={scheme.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Top Colored Accent Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${accentBar} rounded-t-2xl -mt-5 -mx-5 sm:-mt-6 sm:-mx-6 mb-3`} />

                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] border ${tagBadge}`}>
                    {scheme.tag || scheme.scope}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {scheme.lastVerified}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 metric-tabular">
                    {scheme.highlightAmount}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base font-hindi leading-snug group-hover:text-blue-900 transition-colors">
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
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'कागजात व आवेदन देखें' : 'View details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-slate-800 font-mono flex items-center gap-1"
                >
                  <span>{scheme.officialUrl.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
