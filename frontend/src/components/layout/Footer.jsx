import React from 'react';
import { Landmark, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

export default function Footer({ language }) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-16 border-t border-slate-800 text-sm">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Col 1: Mission & Architecture */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#004B87] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span>SchemeSathi (योजना साथी)</span>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed font-hindi">
            {language === 'hi'
              ? 'CS002 Community Services Project. एक पारदर्शी नागरिक मंच जो AI भाषा समझ और नियम-आधारित इंजन के मेल से वंचित परिवारों को सरकारी योजनाओं से जोड़ता है।'
              : 'CS002 Community Engagement Project. A transparent civic platform pairing audio-first NLP with deterministic rule evaluation to connect underserved households to verified welfare schemes.'}
          </p>

          <div className="text-xs text-green-400 font-bold flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>{language === 'hi' ? 'AI समझाता है, नियम पात्रता तय करते हैं।' : 'AI explains, deterministic rules decide eligibility.'}</span>
          </div>
        </div>

        {/* Col 2: SDG Badges */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            {language === 'hi' ? 'सतत विकास लक्ष्य (UN SDG Alignment)' : 'UN SDG Alignment'}
          </h4>
          
          <div className="space-y-2 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-red-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                1
              </span>
              <div>
                <strong className="text-white block font-medium">SDG 1: गरीबी उन्मूलन</strong>
                <span className="text-slate-400 text-[11px]">No Poverty · सामाजिक सुरक्षा कवरेज</span>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-pink-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                10
              </span>
              <div>
                <strong className="text-white block font-medium">SDG 10: असमानता में कमी</strong>
                <span className="text-slate-400 text-[11px]">Reduced Inequalities · अंतिम व्यक्ति तक लाभ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Verified Sources & Digital India BHASHINI */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider">
            {language === 'hi' ? 'सत्यापित सरकारी स्रोत (Official Portals)' : 'Verified Official Portals'}
          </h4>

          <ul className="text-xs text-slate-400 space-y-2 font-mono">
            <li>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <span>pmkisan.gov.in</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <span className="text-slate-500 font-sans text-[11px]">(कृषि मंत्रालय)</span>
              </a>
            </li>
            <li>
              <a href="https://pmayg.nic.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <span>pmayg.nic.in</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <span className="text-slate-500 font-sans text-[11px]">(ग्रामीण विकास)</span>
              </a>
            </li>
            <li>
              <a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <span>pmjay.gov.in</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
                <span className="text-slate-500 font-sans text-[11px]">(राष्ट्रीय स्वास्थ्य प्राधिकरण)</span>
              </a>
            </li>
          </ul>

          <div className="pt-2 text-[11px] text-slate-400 font-sans border-t border-slate-800">
            आवाज सहायता: Digital India BHASHINI AI स्टैक दिशानिर्देशों के अनुरूप।
          </div>
        </div>

      </div>

      {/* Bottom Legal Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 pt-8 mt-8 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 SchemeSathi Project Team · CS002 SOP Compliant · Real-User Civic Tech Validation.</p>
        <p className="flex items-center gap-1">
          <span>जनहित में समर्पित नागरिक सेवा</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
        </p>
      </div>
    </footer>
  );
}
