import React, { useState } from 'react';
import { Printer, Share2, ArrowLeft, QrCode, CheckCircle2, Landmark, CheckSquare, Square } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-slate-500 hover:text-[#004B87] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस जाएं' : 'Back'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#004B87] hover:bg-[#002D54] text-white font-bold text-xs flex items-center gap-1.5 shadow-cta transition-all active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पर्ची प्रिंट करें' : 'Print Slip'}</span>
          </button>
        </div>
      </div>

      {/* The Perforated Boarding Pass Receipt */}
      <div className="print-area csc-receipt p-6 sm:p-10 shadow-card space-y-6 text-slate-900 bg-white">
        
        {/* Slip Header with Emblem and Slip ID */}
        <div className="border-b border-slate-200 pb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004B87] text-white flex items-center justify-center font-bold shrink-0">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CSC VLE Kiosk · ग्राम स्तरीय सेवा पर्ची
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-hindi tracking-tight">
                योजना साथी नागरिक पर्ची
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 space-y-0.5">
            <div className="font-bold text-slate-700">#{slipId}</div>
            <div>{currentDate}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">● नियम सत्यापित</div>
          </div>
        </div>

        {/* Target Scheme Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              लक्षित सरकारी योजना (Target Scheme):
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>संभावित पात्र</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-hindi leading-snug">
            {scheme ? scheme.schemeName : 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)'}
          </h3>

          <div className="text-emerald-800 font-extrabold text-xl metric-tabular">
            {scheme?.highlightAmount || '₹6,000 / वर्ष'}
          </div>

          <div className="text-xs text-slate-500 font-mono pt-2 border-t border-slate-200/80 flex justify-between">
            <span>पोर्टल: {scheme?.officialUrl || 'pmkisan.gov.in'}</span>
            <span className="text-slate-400">DBT Transfer</span>
          </div>
        </div>

        {/* Interactive Document Checklist with Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              CSC केंद्र ले जाने वाले जरूरी कागजात (Documents Checklist):
            </span>
            <span className="text-[11px] font-mono text-slate-400 no-print">
              घर से निकलने से पहले टिक करें
            </span>
          </div>

          <div className="space-y-2">
            {scheme?.documents?.map((doc, idx) => {
              const isChecked = !!checkedDocs[idx];
              return (
                <label
                  key={idx}
                  onClick={() => toggleDoc(idx)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-blue-50/70 border-blue-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="mt-0.5 text-[#004B87] shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#004B87]" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <strong className="text-slate-900 font-bold block font-hindi">{doc.name}</strong>
                    <span className="text-slate-500">{doc.note}</span>
                  </div>
                  {isChecked && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0 no-print">
                      ✓ तैयार है
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Operator Note & Stamp Box with QR Placeholder */}
        <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs text-slate-500 items-end">
          
          <div className="sm:col-span-8 space-y-1">
            <strong className="text-slate-700">CSC संचालक महोदय के लिए निर्देश:</strong>
            <p className="leading-relaxed text-[11px] text-slate-500">
              कृपया इस नागरिक का ऑनलाइन आवेदन आधिकारिक सरकारी पोर्टल पर दर्ज कर पावती रसीद प्रदान करें। यह सेवा 100% निशुल्क पात्रता जांच के उपरांत जनरेट की गई है।
            </p>
            <div className="text-[10px] text-slate-400 pt-1 font-mono">
              Session Ref: {slipId} · No PII Collected
            </div>
          </div>

          <div className="sm:col-span-4 border border-slate-200 rounded-xl p-3 text-center bg-slate-50/60 flex flex-col justify-between h-24">
            <span className="font-semibold text-[11px] text-slate-600">
              CSC संचालक मोहर व हस्ताक्षर
            </span>
            <span className="text-[10px] text-slate-400 border-t border-slate-200 pt-1 font-mono">
              दिनांक: _______________
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
