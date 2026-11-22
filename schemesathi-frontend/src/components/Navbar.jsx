import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { extraStrings } from '../i18n.extra';

const developers = [
  { name: 'Lakshay Gupta', email: 'garglakshay292@gmail.com', linkedin: 'https://www.linkedin.com/in/lakshay-garg-32380228a/' },
  { name: 'Sameer Mishra', email: 'mrsameer12082006@gmail.com', linkedin: 'https://www.linkedin.com/in/sameer-mishra2006' },
  { name: 'Manik Chauhan', email: 'manik8877010@gmail.com', linkedin: 'https://www.linkedin.com/in/manik-chauhan-5221573b7/' },
  { name: 'Yukti Yadav', email: 'yuktiyadav92122@gmail.com', linkedin: 'https://www.linkedin.com/in/yukti-yadav-038b32380/' },
  { name: 'Prince Punia', email: 'ppunia325@gmail.com', linkedin: 'https://www.linkedin.com/in/prince-punia-5694a3382/' },
];

export function Navbar({ route, navigate, lang, setLang, isBigText, setIsBigText }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDevelopers, setShowDevelopers] = useState(false);
  const t = extraStrings[lang] || extraStrings.en;

  useEffect(() => {
    if (!showDevelopers) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowDevelopers(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showDevelopers]);

  const toggleTextSize = () => {
    const nextState = !isBigText;
    setIsBigText(nextState);
    if (nextState) {
      document.documentElement.classList.add('big');
    } else {
      document.documentElement.classList.remove('big');
    }
  };

  const switchLanguage = (newLang) => {
    setLang(newLang);
    document.documentElement.lang = newLang;
  };

  // "Home" is shown as active for /, /chat, /results and /scheme/* (not /schemes)
  const isHomeActive = route === '/' || route === '/chat' || route === '/results' || route === '/scheme/:id' || route.startsWith('/scheme/');
  const isSchemesActive = route === '/schemes';
  const isHowItWorksActive = route === '/how-it-works';
  const isAboutActive = route === '/about';

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-[#F9F8F6]/85 backdrop-blur-md border-b border-stone-200/50 transition-colors pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 rounded-xl text-left cursor-pointer focus-visible:ring-[#166534] group"
          aria-label={t.appName + " " + t.navHome}
        >
          <div className="w-8 h-8 rounded-lg bg-[#166534] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
            <Building2 size={18} className="text-white" />
          </div>
          <span className="font-serif font-semibold text-xl tracking-tight text-[#1C1B1A]">
            {t.appName}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600" aria-label="Main Navigation">
          <button
            onClick={() => handleNav('/')}
            className={`hover:text-[#1C1B1A] transition-colors cursor-pointer py-1 ${
              isHomeActive ? 'text-[#1C1B1A] font-semibold' : ''
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('/schemes')}
            className={`hover:text-[#1C1B1A] transition-colors cursor-pointer py-1 ${
              isSchemesActive ? 'text-[#1C1B1A] font-semibold' : ''
            }`}
          >
            {t.navSchemes}
          </button>
          <button
            onClick={() => handleNav('/how-it-works')}
            className={`hover:text-[#1C1B1A] transition-colors cursor-pointer py-1 ${
              isHowItWorksActive ? 'text-[#1C1B1A] font-semibold' : ''
            }`}
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => handleNav('/about')}
            className={`hover:text-[#1C1B1A] transition-colors cursor-pointer py-1 ${
              isAboutActive ? 'text-[#1C1B1A] font-semibold' : ''
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => setShowDevelopers(true)}
            className="hover:text-[#1C1B1A] transition-colors cursor-pointer py-1"
          >
            {t.navDevelopers}
          </button>
        </div>

        {/* Right Controls: Check Eligibility CTA + Aa Text Size + Language Switcher + Mobile Menu Button */}
        <div className="flex items-center gap-2.5">
          {/* Check Eligibility Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleNav('/chat')}
            className="hidden sm:inline-flex bg-[#166534] hover:bg-[#14532D] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}
          </motion.button>

          {/* Aa Button */}
          <button
            onClick={toggleTextSize}
            aria-pressed={isBigText}
            aria-label={t.textSizeAria}
            title={t.textSizeAria}
            className={`btn px-2.5 py-1 text-sm font-bold border border-stone-200 rounded-xl transition-all ${
              isBigText
                ? 'bg-[#166534] text-white shadow-sm'
                : 'bg-white text-stone-700 hover:bg-stone-100 shadow-sm'
            }`}
          >
            Aa
          </button>

          {/* Language Toggle: हिंदी / EN */}
          <div
            className="flex items-center p-0.5 rounded-xl border border-stone-200 bg-white shadow-sm"
            role="group"
            aria-label={t.langToggleAria}
          >
            <button
              onClick={() => switchLanguage('hi')}
              aria-pressed={lang === 'hi'}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all min-h-[34px] cursor-pointer ${
                lang === 'hi'
                  ? 'bg-[#166534] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#1C1B1A]'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => switchLanguage('en')}
              aria-pressed={lang === 'en'}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all min-h-[34px] cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#166534] text-white shadow-sm'
                  : 'text-stone-600 hover:text-[#1C1B1A]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={t.menuAria}
            className="md:hidden btn p-2 border border-stone-200 rounded-xl bg-white text-stone-700 shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-stone-200 bg-[#F9F8F6] px-4 py-3 flex flex-col gap-2 shadow-lg"
        >
          <button
            onClick={() => handleNav('/')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isHomeActive
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('/schemes')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isSchemesActive
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            {t.navSchemes}
          </button>
          <button
            onClick={() => handleNav('/how-it-works')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isHowItWorksActive
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => handleNav('/about')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isAboutActive
                ? 'bg-[#166534] text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-200/50'
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => {
              setShowDevelopers(true);
              setMobileMenuOpen(false);
            }}
            className="btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl text-stone-700 hover:bg-stone-200/50"
          >
            {t.navDevelopers}
          </button>
        </nav>
      )}
    </header>
    {showDevelopers && createPortal(
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-none p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowDevelopers(false);
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="developers-title"
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-stone-200 bg-[#F9F8F6] p-5 shadow-2xl sm:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-500">{t.developersSubheading}</p>
              <h2 id="developers-title" className="font-serif text-2xl font-bold text-[#1C1B1A] sm:text-3xl">{t.developersHeading}</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDevelopers(false)}
              aria-label={t.closeDevelopersAria}
              className="btn flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-xl text-[#1C1B1A] hover:bg-stone-100 shadow-sm"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((developer) => (
              <article key={developer.email} className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#166534]/10 text-sm font-bold text-[#166534]">
                  {developer.name.split(' ').map((part) => part[0]).join('')}
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-[#1C1B1A]">{developer.name}</h3>
                <a className="mt-1 block break-words text-sm text-stone-600 hover:text-[#166534]" href={`mailto:${developer.email}`}>
                  {developer.email}
                </a>
                <a className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#166534] hover:underline" href={developer.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>,
      document.body
    )}
    </>
  );
}

export default Navbar;
