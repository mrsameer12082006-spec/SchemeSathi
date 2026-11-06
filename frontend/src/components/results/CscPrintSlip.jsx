import React, { useState } from 'react';
import { Printer, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function CscPrintSlip({ scheme, userAnswers = {}, onBack, language }) {
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (idx) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const schemeName = scheme ? scheme.schemeName : 'सरकारी योजना';
    const docs = scheme && scheme.documents ? scheme.documents.map((d, i) => `${i + 1}. ${d.name}`).join('%0A') : '';
    const text = encodeURI(
      `🏛️ *योजना साथी (SchemeSathi) नागरिक पर्ची*%0A%0A` +
      `✅ *लक्षित योजना:* ${schemeName}%0A` +
      `💰 *सरकारी लाभ:* ${scheme?.highlightAmount || 'पात्र'}%0A%0A` +
      `📄 *CSC केंद्र ले जाने वाले कागजात:*%0A${docs}%0A%0A` +
      `🌐 पोर्टल: ${scheme?.officialUrl || 'pmkisan.gov.in'}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const slipId = `SS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('hi-IN');

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-slate-500 hover:text-[#004B87] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस जाएं' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#004B87] hover:bg-[#002D54] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पर्ची प्रिंट करें' : 'Print Slip'}</span>
          </button>
        </div>
      </div>

      {/* The Perforated Slip / Boarding Pass */}
      <div className="print-area bg-white border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-900">
        
        {/* Slip Header */}
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              CSC Kiosk / जन सेवा केंद्र सहायता पर्ची
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-hindi">
              योजना साथी नागरिक पर्ची
            </h2>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>#{slipId}</div>
            <div>{currentDate}</div>
          </div>
        </div>

        {/* Matched Scheme Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            लक्षित योजना (Target Scheme):
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-hindi">
            {scheme ? scheme.schemeName : 'PM-KISAN'}
          </h3>
          <div className="text-emerald-800 font-bold text-base">
            {scheme?.highlightAmount || '₹6,000 / वर्ष'}
          </div>
          <div className="text-xs text-slate-500 font-mono pt-1 border-t border-slate-200/60">
            आधिकारिक पोर्टल: {scheme?.officialUrl || 'pmkisan.gov.in'}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            CSC केंद्र ले जाने वाले जरूरी कागजात:
          </span>

          <div className="space-y-2">
            {scheme?.documents?.map((doc, idx) => {
              const isChecked = !!checkedDocs[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleDoc(idx)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-blue-50/70 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 mt-0.5 text-[#004B87] rounded border-slate-300"
                  />
                  <div className="flex-1 text-xs">
                    <strong className="text-slate-900 font-bold block">{doc.name}</strong>
                    <span className="text-slate-500">{doc.note}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Operator Note & Stamp Box */}
        <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
          <div>
            <strong>संचालक महोदय के लिए निर्देश:</strong>
            <p className="mt-1 leading-relaxed text-[11px]">
              कृपया इस नागरिक का ऑनलाइन आवेदन आधिकारिक सरकारी पोर्टल पर दर्ज कर पावती रसीद प्रदान करें।
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-3 text-center bg-slate-50/50 flex flex-col justify-between h-24">
            <span className="font-semibold text-[11px] text-slate-600">
              CSC संचालक मोहर व हस्ताक्षर
            </span>
            <span className="text-[10px] text-slate-400">
              दिनांक: _______________
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
