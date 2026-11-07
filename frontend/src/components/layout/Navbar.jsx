import React from 'react';
import { motion } from 'framer-motion';
import { CivicCrestIcon } from '../common/CivicIcons';

export default function Navbar({
  currentScreen,
  setScreen,
  mode,
  setMode
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand identity: High-impact Nike/Civic style */}
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <CivicCrestIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg text-[#111111] tracking-tight">
                SchemeSathi
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-zinc-400 hidden sm:inline">
                PUBLIC SERVICE
              </span>
            </div>
          </div>
        </button>

        {/* Clean Segmented Mode Switcher (Citizen vs Kiosk) */}
        <div className="flex items-center bg-[#F2F2F4] border border-[#E4E4E7] p-1 rounded-lg h-9 shadow-2xs">
          <div role="group" aria-label="Mode" className="relative flex items-center h-full">
            <button
              type="button"
              onClick={() => setMode('citizen')}
              className={`relative z-10 px-3 h-7 flex items-center rounded-md text-xs font-semibold transition-colors ${
                mode === 'citizen' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {mode === 'citizen' && (
                <motion.div
                  layoutId="activeModeTab"
                  className="absolute inset-0 bg-[#111111] rounded-md shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setMode('operator')}
              className={`relative z-10 px-3 h-7 flex items-center rounded-md text-xs font-semibold transition-colors ${
                mode === 'operator' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {mode === 'operator' && (
                <motion.div
                  layoutId="activeModeTab"
                  className="absolute inset-0 bg-[#111111] rounded-md shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              CSC Kiosk
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
