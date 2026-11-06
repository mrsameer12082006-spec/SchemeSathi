import React, { useState } from 'react';
import { Printer, Share2, CheckSquare, Square, ArrowLeft, CheckCircle2, ShieldCheck, Landmark, FileText, QrCode } from 'lucide-react';
import TouchButton from '../common/TouchButton';

export default function CscPrintSlip({ scheme, userAnswers = {}, onBack, language }) {
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (idx) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Share Builder
  const handleShareWhatsApp = () => {
    const schemeName = scheme ? scheme.schemeName : 'योजना साथी सरकारी योजना';
    const docs = scheme && scheme.documents ? scheme.documents.map((d, i) => `${i + 1}. ${d.name}`).join('%0A') : '';
    const text = encodeURI(
      `🏛️ *योजना साथी (SchemeSathi) नागरिक सहायता पर्ची*%0A%0A` +
      `✅ *लक्षित योजना:* ${schemeName}%0A` +
      `💰 *सरकारी लाभ:* ${scheme?.highlightAmount || 'पात्र'}%0A%0A` +
      `📄 *CSC केंद्र ले जाने वाले जरूरी कागजात:*%0A${docs}%0A%0A` +
      `🌐 आधिकारिक पोर्टल: ${scheme?.officialUrl || 'pmkisan.gov.in'}%0A` +
      `_योजना साथी - 100% निशुल्क व पारदर्शी नागरिक सेवा_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const slipId = `SS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const totalDocs = scheme?.documents?.length || 3;
  const readyDocsCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* ───────────────────────────────────────────────────────────
          Top Action Bar (Hidden on Print)
          ─────────────────────────────────────────────────────────── */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-bold text-[#004B87] hover:underline flex items-center gap-1.5 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस परिणाम पृष्ठ पर जाएं' : 'Back to Results'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{language === 'hi' ? '📲 WhatsApp पर भेजें' : 'Share on WhatsApp'}</span>
          </button>

          {/* Solid 1-Click Print Button */}
          <TouchButton onClick={handlePrint} variant="primary" className="min-h-[44px] text-xs sm:text-sm py-2 px-5">
            <Printer className="w-4 h-4" />
            <span>{language === 'hi' ? '🖨️ CSC पर्ची प्रिंट करें' : 'Print CSC Slip'}</span>
          </TouchButton>
        </div>
      </div>


      {/* ───────────────────────────────────────────────────────────
          BOARDING PASS / THERMAL RECEIPT SLIP CARD (Prints cleanly)
          ─────────────────────────────────────────────────────────── */}
      <div className="print-area bg-white border-2 border-dashed border-slate-400 rounded-3xl p-6 sm:p-10 shadow-slip relative space-y-6 text-slate-900 overflow-hidden">
        
        {/* Receipt Header Bar */}
        <div className="border-b-2 border-slate-300 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#004B87] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-xs">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">SchemeSathi</span>
                <span className="bg-blue-100 text-[#004B87] border border-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded">
                  नागरिक सेवा पर्ची
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                जन सेवा केंद्र (CSC / Kiosk / Cyber Cafe) आवेदन सहायता पर्ची
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-600 space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div><strong>पर्ची ID:</strong> <span className="text-[#004B87] font-bold">#{slipId}</span></div>
            <div><strong>दिनांक:</strong> {currentDate}</div>
            <div className="text-[10px] text-green-700 font-bold">● नियम सत्यापित: 1 Nov 2026</div>
          </div>
        </div>

        {/* Notice for Kiosk Operator */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
          <span className="text-lg">🏪</span>
          <div>
            <strong>CSC / VLE संचालक महोदय के लिए निर्देश:</strong>
            <p className="mt-0.5 leading-relaxed">
              इस नागरिक ने योजना साथी पर अपनी प्रारंभिक पात्रता की जांच कर ली है। कृपया नीचे दी गई लक्षित योजना के आधिकारिक पोर्टल पर इनका ऑनलाइन आवेदन दर्ज करें और आवेदन पावती रसीद अवश्य प्रदान करें।
            </p>
          </div>
        </div>

        {/* Target Matched Scheme Box */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              लक्षित सरकारी योजना (Matched Scheme):
            </span>
            <span className="bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
              <span>संभावित रूप से पात्र (Potentially Eligible)</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {scheme ? scheme.schemeName : 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {scheme?.ministry} · {scheme?.scope}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">सरकारी लाभ:</span>
              <span className="text-xl font-extrabold text-green-800">
                {scheme?.highlightAmount || '₹6,000 / वर्ष'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-2 flex flex-wrap justify-between items-center gap-2">
            <span>आधिकारिक पोर्टल: <strong>{scheme?.officialUrl || 'https://pmkisan.gov.in'}</strong></span>
            <span className="font-mono text-slate-400">DBT Direct Transfer Eligible</span>
          </div>
        </div>

        {/* Evaluated Rules Passed */}
        {scheme?.passed && scheme.passed.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              सत्यापित नियम शर्तें (Verified Conditions Passed):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scheme.passed.map(p => (
                <div key={p.ruleId} className="bg-green-50/70 border border-green-200 rounded-xl p-2.5 flex items-start gap-2">
                  <span className="text-green-700 font-bold">✓</span>
                  <span className="text-green-950 font-medium">{p.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            INTERACTIVE DOCUMENT CHECKLIST: Citizen can tick off at home
            ─────────────────────────────────────────────────────────── */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#004B87]" />
              <span>CSC केंद्र ले जाने वाले जरूरी कागजात (Document Checklist):</span>
            </span>
            <span className="text-xs font-bold text-[#004B87] no-print">
              {readyDocsCount}/{totalDocs} तैयार
            </span>
          </div>

          <div className="space-y-2.5">
            {scheme?.documents?.map((doc, idx) => {
              const isChecked = !!checkedDocs[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleDoc(idx)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-blue-50/70 border-blue-300'
                      : 'bg-white border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-[#004B87] shrink-0 no-print">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-[#004B87]" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <strong className="text-sm text-slate-900 block font-hindi">
                      {idx + 1}. {doc.name}
                    </strong>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {doc.note}
                    </p>
                  </div>
                  {isChecked && (
                    <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0 no-print">
                      ✓ तैयार है
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Signature & Stamp Section for CSC Operator */}
        <div className="border-t-2 border-slate-300 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-900 block mb-1">नागरिक स्व-घोषणा:</span>
            <p className="text-[11px] leading-relaxed text-slate-500">
              मैं प्रमाणित करता हूँ कि मेरे द्वारा दी गई जानकारी मेरी जानकारी के अनुसार सत्य है। किसी असत्य जानकारी के लिए मैं स्वयं जिम्मेदार रहूँगा।
            </p>
            <div className="mt-8 border-t border-slate-300 pt-1 text-[11px] font-medium text-slate-400">
              नागरिक के हस्ताक्षर / अंगूठे का निशान
            </div>
          </div>

          <div className="border border-slate-300 rounded-2xl p-4 text-center bg-slate-50 flex flex-col justify-between h-28">
            <span className="font-bold text-slate-800 text-[11px]">
              CSC जन सेवा केंद्र संचालक मोहर व हस्ताक्षर
            </span>
            <span className="text-[10px] text-slate-400 border-t border-slate-200 pt-1">
              आवेदन संख्या: _________________ दिनांक: _________
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
