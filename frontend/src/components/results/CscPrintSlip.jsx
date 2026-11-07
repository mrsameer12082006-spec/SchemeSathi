import React, { useState } from 'react';
import { Printer, Share2, ArrowLeft, CheckCircle2, CheckSquare, Square } from 'lucide-react';
import { CivicCrestIcon } from '../common/CivicIcons';

export default function CscPrintSlip({ scheme, userAnswers = {}, onBack }) {
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (idx) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const schemeName = scheme ? (scheme.englishName || scheme.schemeName) : 'Government Welfare Scheme';
    const docs = scheme && scheme.documents ? scheme.documents.map((d, i) => `${i + 1}. ${d.name}`).join('%0A') : '';
    const text = encodeURI(
      `🏛️ *SchemeSathi Citizen Welfare Slip*%0A%0A` +
      `✅ *Target Scheme:* ${schemeName}%0A` +
      `💰 *Government Benefit:* ${scheme?.highlightAmount || 'Eligible'}%0A%0A` +
      `📄 *Documents to take to CSC Kiosk:*%0A${docs}%0A%0A` +
      `🌐 Official Portal: ${scheme?.officialUrl || 'pmkisan.gov.in'}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const slipId = `SS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-zinc-600 hover:text-[#111111] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.985]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.985]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Slip</span>
          </button>
        </div>
      </div>

      {/* Thermal Printer Slot Bar Illusion */}
      <div className="no-print flex justify-center pb-1">
        <div className="w-44 h-1.5 bg-zinc-300 rounded-full opacity-60 shadow-inner" title="CSC Printer Slot" />
      </div>

      {/* The Perforated Boarding Pass Receipt with Slot Emerge Animation */}
      <div className="print-area csc-receipt animate-printer-emerge p-6 sm:p-10 shadow-2xs space-y-6 text-[#111111] bg-white border-2 border-dashed border-zinc-300 rounded-2xl">
        
        {/* Slip Header with Emblem and Slip ID */}
        <div className="border-b border-zinc-200 pb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold shrink-0">
              <CivicCrestIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                CSC VLE KIOSK · GRAM PANCHAYAT SERVICE SLIP
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                SchemeSathi Citizen Slip
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400 space-y-0.5">
            <div className="font-bold text-zinc-700">#{slipId}</div>
            <div>{currentDate}</div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>RULE AUDITED</span>
            </div>
          </div>
        </div>

        {/* Target Scheme Box */}
        <div className="bg-[#F4F3EE] border border-[#E5E3DC] rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              TARGET WELFARE SCHEME:
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Potentially Eligible</span>
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#111111] leading-snug">
            {scheme ? (scheme.englishName || scheme.schemeName) : 'PM Kisan Samman Nidhi'}
          </h3>

          <div className="text-2xl font-extrabold text-[#111111] metric-tabular">
            {scheme?.highlightAmount || '₹6,000 / year'}
          </div>

          <div className="text-xs text-zinc-500 font-mono pt-2 border-t border-zinc-200 flex justify-between">
            <span>Portal: {scheme?.officialUrl || 'pmkisan.gov.in'}</span>
            <span className="text-zinc-600 font-bold">Direct DBT Transfer</span>
          </div>
        </div>

        {/* Interactive Document Checklist with Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono">
              MANDATORY DOCUMENTS CHECKLIST FOR CSC VISIT:
            </span>
            <span className="text-[11px] font-mono text-zinc-400 no-print">
              Check before leaving home
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
                      ? 'bg-zinc-50 border-zinc-400'
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="mt-0.5 text-[#111111] shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#111111]" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <strong className="text-[#111111] font-bold block">{doc.name}</strong>
                    <span className="text-zinc-500">{doc.note}</span>
                  </div>
                  {isChecked && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 shrink-0 no-print">
                      ✓ Ready
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Operator Note & Stamp Box */}
        <div className="border-t border-zinc-200 pt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs text-zinc-500 items-end">
          
          <div className="sm:col-span-8 space-y-1">
            <strong className="text-zinc-800 font-bold">INSTRUCTIONS FOR CSC OPERATOR:</strong>
            <p className="leading-relaxed text-[11px] text-zinc-600">
              Please assist this citizen in filing the official online application on the central portal and provide the acknowledgement slip. Generated via 100% free deterministic eligibility check.
            </p>
            <div className="text-[10px] text-zinc-400 pt-1 font-mono">
              Session Ref: {slipId} · Zero PII Collected
            </div>
          </div>

          <div className="sm:col-span-4 border border-zinc-200 rounded-xl p-3 text-center bg-zinc-50/60 flex flex-col justify-between h-24">
            <span className="font-semibold text-[11px] text-zinc-600">
              CSC Operator Stamp & Sign
            </span>
            <span className="text-[10px] text-zinc-400 border-t border-zinc-200 pt-1 font-mono">
              Date: _______________
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
