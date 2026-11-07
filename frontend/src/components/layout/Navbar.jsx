import React from 'react';
import { Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand identity: Dignified Civic Presence */}
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-800 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/25 ring-1 ring-white/30 transition-transform group-hover:scale-105">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight font-hindi">
                योजना साथी
              </span>
              <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full font-semibold hidden sm:inline">
                SchemeSathi
              </span>
            </div>
          </div>
        </button>

        {/* Unified 36px-tall Utility Bar separated by subtle 1px vertical dividers */}
        <div className="flex items-center bg-[#F2F2F4] border border-[#E4E4E7] p-1 rounded-lg h-9 shadow-2xs">
          
          {/* Mode Pill: Citizen vs Kiosk (Framer Motion sliding layoutId tab) */}
          <div role="group" aria-label="Mode" className="relative flex items-center h-full">
            <button
              type="button"
              onClick={() => setMode('citizen')}
              className={`relative z-10 px-2.5 sm:px-3 h-7 flex items-center rounded-md text-xs font-medium transition-colors ${
                mode === 'citizen' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {mode === 'citizen' && (
                <motion.div
                  layoutId="activeModeTab"
                  className="absolute inset-0 bg-[#141417] rounded-md shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {language === 'hi' ? 'नागरिक' : 'Citizen'}
            </button>
            <button
              type="button"
              onClick={() => setMode('operator')}
              className={`relative z-10 px-2.5 sm:px-3 h-7 flex items-center rounded-md text-xs font-medium transition-colors ${
                mode === 'operator' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {mode === 'operator' && (
                <motion.div
                  layoutId="activeModeTab"
                  className="absolute inset-0 bg-[#141417] rounded-md shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {language === 'hi' ? 'CSC केंद्र' : 'Kiosk'}
            </button>
          </div>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-zinc-300 mx-1.5 hidden sm:block" aria-hidden="true" />

          {/* Font Resizer */}
          <div role="group" aria-label="Text sizing" className="hidden sm:flex items-center h-full">
            <button
              type="button"
              onClick={() => setFontSizeDelta(-1)}
              className={`px-2 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                fontSizeDelta === -1 ? 'bg-white text-[#141417] shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title={language === 'hi' ? 'अक्षर छोटे करें' : 'Smaller text'}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSizeDelta(0)}
              className={`px-2 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                fontSizeDelta === 0 ? 'bg-white text-[#141417] shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title={language === 'hi' ? 'सामान्य आकार' : 'Default text size'}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSizeDelta(1)}
              className={`px-2 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                fontSizeDelta === 1 ? 'bg-white text-[#141417] shadow-2xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title={language === 'hi' ? 'अक्षर बड़े करें' : 'Larger text'}
            >
              A+
            </button>
          </div>

          {/* Divider */}
          <div className="h-4 w-[1px] bg-zinc-300 mx-1.5" aria-hidden="true" />

          {/* Language Switcher */}
          <div role="group" aria-label="Language" className="relative flex items-center h-full">
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`relative z-10 px-2.5 h-7 flex items-center rounded-md text-xs font-medium transition-colors ${
                language === 'hi' ? 'text-white font-hindi font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {language === 'hi' && (
                <motion.div
                  layoutId="activeLangTab"
                  className="absolute inset-0 bg-[#141417] rounded-md shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`relative z-10 px-2.5 h-7 flex items-center rounded-md text-xs font-medium transition-colors ${
                language === 'en' ? 'text-white font-semibold' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {language === 'en' && (
                <motion.div
                  layoutId="activeLangTab"
                  className="absolute inset-0 bg-[#141417] rounded-md shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              EN
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
