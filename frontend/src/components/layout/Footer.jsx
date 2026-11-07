import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer({ language }) {
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 mt-16 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Mission */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-semibold text-[#141417] text-sm font-hindi">
            योजना साथी (SchemeSathi)
          </div>
          <p className="text-zinc-500 max-w-sm">
            {language === 'hi'
              ? 'वंचित व ग्रामीण परिवारों को सही सरकारी कल्याणकारी योजनाओं से जोड़ने का निशुल्क नागरिक प्रयास।'
              : 'Independent public service assisting underserved citizens in discovering government schemes.'}
          </p>
        </div>

        {/* Verified Official Portals */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-600 font-mono text-[11px]">
          <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#141417] flex items-center gap-1 hover:underline transition-colors">
            <span>pmkisan.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-zinc-300">·</span>
          <a href="https://pmayg.nic.in" target="_blank" rel="noreferrer" className="hover:text-[#141417] flex items-center gap-1 hover:underline transition-colors">
            <span>pmayg.nic.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-zinc-300">·</span>
          <a href="https://pmjay.gov.in" target="_blank" rel="noreferrer" className="hover:text-[#141417] flex items-center gap-1 hover:underline transition-colors">
            <span>pmjay.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 mt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
        <div>© 2026 SchemeSathi Team · CS002 Community Project · 100% निशुल्क</div>
        <div className="font-mono text-[10px]">Zero PII · No Aadhaar or Bank Account Required</div>
      </div>
    </footer>
  );
}
