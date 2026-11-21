import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSchemes } from '../services/api';
import { extraStrings } from '../i18n.extra';

export function Schemes({ lang = 'en', navigate }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const t = extraStrings[lang] || extraStrings.en;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getSchemes(lang)
      .then((data) => {
        if (isMounted) {
          setSchemes(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load schemes:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lang]);

  // Categories list
  const categories = [
    { key: 'All', label: t.categoryAll },
    { key: 'Farmers', label: t.categoryFarmers },
    { key: 'Students', label: t.categoryStudents },
    { key: 'Women', label: t.categoryWomen },
    { key: 'Seniors', label: t.categorySeniors || (lang === 'hi' ? 'वरिष्ठ नागरिक' : 'Senior citizens') },
    { key: 'Workers', label: t.categoryWorkers },
    { key: 'Business', label: t.categoryBusiness || (lang === 'hi' ? 'छोटा व्यापारी' : 'Small business') },
  ];

  // Filter schemes
  const filteredSchemes = activeCategory === 'All'
    ? schemes
    : schemes.filter((s) => {
        if (!s.category) return false;
        const normCat = s.category.toLowerCase();
        const normActive = activeCategory.toLowerCase();
        const catKey = categories.find(c => c.key === activeCategory);
        const normLabel = catKey ? catKey.label.toLowerCase() : '';
        const catCode = (s.category_code || '').toLowerCase();

        return normCat.includes(normActive) ||
               normActive.includes(normCat) ||
               (normLabel && (normCat.includes(normLabel) || normLabel.includes(normCat))) ||
               (catCode && catCode.includes(normActive));
      });

  const hasLiveSupabaseData = schemes.some(s => !s.demo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 space-y-8"
    >
      {/* Title & Status Tag */}
      <div className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
          {t.browseTitle}
        </h1>

        {hasLiveSupabaseData ? (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-[#166534] text-xs font-semibold border border-emerald-200 select-none shadow-sm">
            {lang === 'hi' ? '✓ 30 सत्यापित सरकारी योजनाएँ (Supabase)' : '✓ 30 Verified Government Schemes (Supabase)'}
          </div>
        ) : (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200 select-none shadow-sm">
            {t.demoListTag}
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div
        role="group"
        aria-label="Scheme categories"
        className="flex flex-wrap items-center gap-2"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={isActive}
              className={`chip text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#166534] text-white font-medium border-transparent shadow-sm'
                  : 'hover:bg-stone-100 hover:border-stone-300 text-[#1C1B1A]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#166534] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-500">{t.loading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <motion.div
              key={scheme.id}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="card flex flex-col justify-between gap-4 p-5 hover:border-[#166534]/50 transition-all shadow-sm rounded-xl bg-white border border-stone-200"
            >
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#1C1B1A]">
                  {scheme.name}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed font-normal">
                  {scheme.summary}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="btn-ghost w-full font-medium text-sm border border-stone-200 text-[#1C1B1A] hover:bg-stone-50"
                >
                  {t.viewDetails}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom Assistant Callout Card */}
      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-stone-200 rounded-xl bg-white">
        <p className="font-serif text-base sm:text-lg font-bold text-[#1C1B1A] text-center sm:text-left">
          {t.notSureFitTitle}
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary w-full sm:w-auto font-medium px-6 py-2.5"
        >
          {t.askAssistant}
        </button>
      </div>
    </motion.div>
  );
}

export default Schemes;
