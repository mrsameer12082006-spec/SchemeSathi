import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-paper/90 dark:bg-night/90 border-b border-line dark:border-nightline transition-colors pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 rounded-xl text-left cursor-pointer focus-visible:ring-saffron"
          aria-label={t.appName + " " + t.navHome}
        >
          <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center font-black text-ink text-lg select-none shadow-sm">
            S
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-ink dark:text-mist">
            {t.appName}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          <button
            onClick={() => handleNav('/')}
            className={`btn px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all ${
              isHomeActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink/80 dark:text-mist/80 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('/schemes')}
            className={`btn px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all ${
              isSchemesActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink/80 dark:text-mist/80 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navSchemes}
          </button>
          <button
            onClick={() => handleNav('/how-it-works')}
            className={`btn px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all ${
              isHowItWorksActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink/80 dark:text-mist/80 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => handleNav('/about')}
            className={`btn px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all ${
              isAboutActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink/80 dark:text-mist/80 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => setShowDevelopers(true)}
            className="btn px-3.5 py-1.5 text-sm font-semibold rounded-xl transition-all text-ink/80 dark:text-mist/80 hover:bg-black/5 dark:hover:bg-white/10"
          >
            Developers
          </button>
        </nav>

        {/* Right Controls: Aa Text Size + Language Switcher + Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Aa Button */}
          <button
            onClick={toggleTextSize}
            aria-pressed={isBigText}
            aria-label={t.textSizeAria}
            title={t.textSizeAria}
            className={`btn px-2.5 py-1 text-sm font-bold border border-line dark:border-nightline rounded-xl transition-all ${
              isBigText
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'bg-white dark:bg-nightcard text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Aa
          </button>

          {/* Language Toggle: हिंदी / EN */}
          <div
            className="flex items-center p-0.5 rounded-xl border border-line dark:border-nightline bg-white dark:bg-nightcard"
            role="group"
            aria-label={t.langToggleAria}
          >
            <button
              onClick={() => switchLanguage('hi')}
              aria-pressed={lang === 'hi'}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                lang === 'hi'
                  ? 'bg-ink text-white dark:bg-mist dark:text-ink shadow-sm'
                  : 'text-ink/70 dark:text-mist/70 hover:text-ink dark:hover:text-mist'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => switchLanguage('en')}
              aria-pressed={lang === 'en'}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                lang === 'en'
                  ? 'bg-ink text-white dark:bg-mist dark:text-ink shadow-sm'
                  : 'text-ink/70 dark:text-mist/70 hover:text-ink dark:hover:text-mist'
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
            className="md:hidden btn p-2 border border-line dark:border-nightline rounded-xl bg-white dark:bg-nightcard text-ink dark:text-mist"
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
          className="md:hidden border-t border-line dark:border-nightline bg-paper dark:bg-night px-4 py-3 flex flex-col gap-2 shadow-lg"
        >
          <button
            onClick={() => handleNav('/')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isHomeActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('/schemes')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isSchemesActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navSchemes}
          </button>
          <button
            onClick={() => handleNav('/how-it-works')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isHowItWorksActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => handleNav('/about')}
            className={`btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl ${
              isAboutActive
                ? 'bg-ink text-white dark:bg-mist dark:text-ink'
                : 'text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            {t.navAbout}
          </button>
          <button
            onClick={() => {
              setShowDevelopers(true);
              setMobileMenuOpen(false);
            }}
            className="btn justify-start text-left w-full px-4 py-2.5 text-base font-semibold rounded-xl text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/10"
          >
            Developers
          </button>
        </nav>
      )}
    </header>
    {showDevelopers && createPortal(
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowDevelopers(false);
        }}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="developers-title"
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-line bg-paper p-5 shadow-2xl dark:border-nightline dark:bg-night sm:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink/60 dark:text-mist/60">The people behind Scheme Sathi</p>
              <h2 id="developers-title" className="font-heading text-2xl font-extrabold text-ink dark:text-mist sm:text-3xl">Meet our developers</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDevelopers(false)}
              aria-label="Close developers panel"
              className="btn flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-xl text-ink hover:bg-black/5 dark:border-nightline dark:bg-nightcard dark:text-mist dark:hover:bg-white/10"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {developers.map((developer) => (
              <article key={developer.email} className="min-w-0 rounded-2xl border border-line bg-white p-4 dark:border-nightline dark:bg-nightcard">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron text-sm font-extrabold text-ink">
                  {developer.name.split(' ').map((part) => part[0]).join('')}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-ink dark:text-mist">{developer.name}</h3>
                <a className="mt-1 block break-words text-sm text-ink/70 hover:text-ink dark:text-mist/70 dark:hover:text-mist" href={`mailto:${developer.email}`}>
                  {developer.email}
                </a>
                <a className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:underline dark:text-mist" href={developer.linkedin} target="_blank" rel="noreferrer">
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
