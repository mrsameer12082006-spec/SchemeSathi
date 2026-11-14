import React, { useState, useEffect } from 'react';
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
    { key: 'Housing', label: t.categoryHousing },
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
    <div className="w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 space-y-8">
      {/* Title & Status Tag */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-ink dark:text-mist">
          {t.browseTitle}
        </h1>

        {hasLiveSupabaseData ? (
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold border border-emerald-300 dark:border-emerald-700/60 select-none">
            {lang === 'hi' ? '✓ 30 सत्यापित सरकारी योजनाएँ (Supabase)' : '✓ 30 Verified Government Schemes (Supabase)'}
          </div>
        ) : (
          <div className="inline-flex items-center px-3 py-1 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border border-amber-300 dark:border-amber-700/60 select-none">
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
              className={`chip text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-ink text-white dark:bg-mist dark:text-ink font-bold border-transparent'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
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
          <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-ink/60 dark:text-mist/60">{t.loading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="card flex flex-col justify-between gap-4 p-5 hover:border-saffron/80 transition-all shadow-sm"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-ink dark:text-mist">
                  {scheme.name}
                </h3>
                <p className="text-sm text-ink/80 dark:text-mist/80 line-clamp-3 leading-relaxed">
                  {scheme.summary}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="btn-ghost w-full font-bold text-sm"
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Assistant Callout Card */}
      <div className="card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-line dark:border-nightline">
        <p className="text-base sm:text-lg font-bold text-ink dark:text-mist text-center sm:text-left">
          {t.notSureFitTitle}
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary w-full sm:w-auto font-bold px-6 py-2.5"
        >
          {t.askAssistant}
        </button>
      </div>
    </div>
  );
}

export default Schemes;
