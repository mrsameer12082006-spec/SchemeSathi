import React from 'react';
import { Landmark } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-[#004B87] text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight font-hindi">
                योजना साथी
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                SchemeSathi
              </span>
            </div>
          </div>
        </button>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mode Pill: Citizen vs Kiosk */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex text-xs font-semibold">
            <button
              onClick={() => setMode('citizen')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                mode === 'citizen'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'नागरिक' : 'Citizen'}
            </button>
            <button
              onClick={() => setMode('operator')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                mode === 'operator'
                  ? 'bg-[#004B87] text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'hi' ? 'CSC केंद्र' : 'Kiosk'}
            </button>
          </div>

          {/* Accessible Font Resizer (A- / A / A+) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold" aria-label="Text sizing">
            <button
              onClick={() => setFontSizeDelta(-1)}
              className={`px-2 py-1 rounded transition-colors ${fontSizeDelta === -1 ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="अक्षर छोटे करें"
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeDelta(0)}
              className={`px-2 py-1 rounded transition-colors ${fontSizeDelta === 0 ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="सामान्य आकार"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeDelta(1)}
              className={`px-2 py-1 rounded transition-colors ${fontSizeDelta === 1 ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="अक्षर बड़े करें"
            >
              A+
            </button>
          </div>

          {/* Language Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex text-xs font-semibold">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1.5 rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
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
