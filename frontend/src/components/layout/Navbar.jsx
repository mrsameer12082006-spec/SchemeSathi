import React from 'react';
import { User, Store, ZoomIn, ZoomOut, Languages, Landmark } from 'lucide-react';

export default function Navbar({
  currentScreen,
  setScreen,
  language,
  setLanguage,
  mode,
  setMode,
  fontSizeDelta,
  setFontSizeDelta
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-18 flex items-center justify-between gap-3">
        
        {/* Brand Identity */}
        <button
          onClick={() => setScreen('home')}
          className="text-left flex items-center gap-2.5 sm:gap-3 focus:outline-hidden focus:ring-2 focus:ring-[#004B87] rounded-xl p-1 -ml-1 transition-transform active:scale-98"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#004B87] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">SchemeSathi</span>
              <span className="text-[11px] font-bold bg-green-50 text-green-800 border border-green-300 px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                <span>3 {language === 'hi' ? 'योजनाएं सत्यापित' : 'Verified'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden xs:block">
              {language === 'hi' ? 'योजना साथी · AI समझाता है, नियम तय करते हैं' : 'AI explains, deterministic rules decide'}
            </p>
          </div>
        </button>

        {/* Center: Dual Mode Switcher (Citizen vs CSC Operator Kiosk) */}
        <div className="flex items-center bg-slate-100 border border-slate-300/80 rounded-xl p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setMode('citizen')}
            aria-pressed={mode === 'citizen'}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
              mode === 'citizen'
                ? 'bg-[#004B87] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'hi' ? 'नागरिक मोड (Audio)' : 'Citizen (Audio)'}</span>
            <span className="sm:hidden">{language === 'hi' ? 'नागरिक' : 'Citizen'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('operator')}
            aria-pressed={mode === 'operator'}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 min-h-[36px] ${
              mode === 'operator'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{language === 'hi' ? 'CSC ऑपरेटर (Fast)' : 'CSC Kiosk (Fast)'}</span>
            <span className="sm:hidden">{language === 'hi' ? 'ऑपरेटर' : 'Kiosk'}</span>
          </button>
        </div>

        {/* Right Controls: Font Resizer & Bilingual Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Accessible Font Resizer (A- / A / A+) */}
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-0.5 flex text-xs font-bold" aria-label="Font resizer">
            <button
              onClick={() => setFontSizeDelta(-1)}
              className={`px-2 py-1 rounded touch-target flex items-center justify-center transition-colors ${
                fontSizeDelta === -1 ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-white'
              }`}
              title={language === 'hi' ? 'अक्षर छोटे करें' : 'Decrease text size'}
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeDelta(0)}
              className={`px-2.5 py-1 rounded touch-target flex items-center justify-center transition-colors ${
                fontSizeDelta === 0 ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-white'
              }`}
              title={language === 'hi' ? 'सामान्य अक्षर' : 'Standard text size'}
            >
              A
            </button>
            <button
              onClick={() => setFontSizeDelta(1)}
              className={`px-2 py-1 rounded touch-target flex items-center justify-center transition-colors ${
                fontSizeDelta === 1 ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:bg-white'
              }`}
              title={language === 'hi' ? 'अक्षर बड़े करें' : 'Increase text size'}
            >
              A+
            </button>
          </div>

          {/* Bilingual Switcher (हिन्दी / EN) */}
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-0.5 flex text-xs font-bold">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-md touch-target flex items-center justify-center transition-all ${
                language === 'hi'
                  ? 'bg-[#004B87] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-md touch-target flex items-center justify-center transition-all ${
                language === 'en'
                  ? 'bg-[#004B87] text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              EN
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
