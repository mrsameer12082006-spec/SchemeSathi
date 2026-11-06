import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, ExternalLink, CheckCircle } from 'lucide-react';

export default function DisclaimerBanner({ language }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="Legal guidance disclaimer" className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Compact, soft 1-line summary */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-100/90 border border-amber-300/80 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px] shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-800" />
            <span>{language === 'hi' ? 'नागरिक मार्गदर्शन' : 'Guidance Tool'}</span>
          </span>

          <span className="text-slate-700 font-medium hidden sm:inline">
            {language === 'hi'
              ? 'यह एक अनौपचारिक सहायता मंच है। अंतिम पात्रता निर्णय संबंधित सरकारी विभाग द्वारा मान्य होता है।'
              : 'This is an independent guidance tool, not an official government portal. Final decisions rest with respective ministries.'}
          </span>
          <span className="text-slate-700 font-medium sm:hidden">
            {language === 'hi' ? 'सहायता मंच · आधिकारिक पोर्टल नहीं' : 'Guidance tool · Not official'}
          </span>
        </div>

        {/* Right: Expandable Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#004B87] hover:text-[#002D54] font-bold text-[11px] flex items-center gap-1 focus:outline-hidden underline py-0.5"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? (language === 'hi' ? 'कम देखें' : 'Hide details') : (language === 'hi' ? 'विस्तार से जानें' : 'Learn more')}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

      </div>

      {/* Expandable Legal & CS002 Compliance Drawer */}
      {isOpen && (
        <div className="bg-white border-t border-slate-200 px-4 py-3 text-xs text-slate-600 animate-fade-down">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                {language === 'hi' ? '100% निशुल्क व पारदर्शी' : '100% Free & Transparent'}
              </strong>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'यह सेवा पूरी तरह निशुल्क है। योजना साथी किसी भी सरकारी योजना के लिए आवेदन शुल्क या कमीशन नहीं लेता।'
                  : 'This platform is completely free. SchemeSathi never charges application fees or commissions.'}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                {language === 'hi' ? 'शून्य डेटा संग्रह (Zero Data)' : 'Zero PII Collected'}
              </strong>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'हम कभी भी आधार नंबर, बैंक खाता संख्या या व्यक्तिगत पहचान डेटा नहीं मांगते। सभी गणना आपके डिवाइस पर होती है।'
                  : 'We never request Aadhaar or bank account numbers. All logic executes deterministically on your device.'}
              </p>
            </div>

            <div className="space-y-1">
              <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                {language === 'hi' ? 'आधिकारिक स्रोतों से सत्यापित' : 'Ministry Grounded'}
              </strong>
              <p className="leading-relaxed">
                {language === 'hi'
                  ? 'शर्तें सीधे pmkisan.gov.in, pmayg.nic.in एवं pmjay.gov.in के दिशानिर्देशों से सत्यापित की गई हैं।'
                  : 'Rules directly mirror official criteria published on pmkisan.gov.in, pmayg.nic.in, and pmjay.gov.in.'}
              </p>
            </div>

          </div>
        </div>
      )}
    </aside>
  );
}
