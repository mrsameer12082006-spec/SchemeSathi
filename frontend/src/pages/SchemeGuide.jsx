import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Printer, ExternalLink, CheckSquare, Square, ShieldCheck } from 'lucide-react';
import TouchButton from '../components/common/TouchButton';
import AudioButton from '../components/common/AudioButton';
import CscPrintSlip from '../components/results/CscPrintSlip';

export default function SchemeGuide({
  scheme,
  userAnswers,
  onBack,
  language
}) {
  const [checkedDocs, setCheckedDocs] = useState({});
  const [showSlipOnly, setShowSlipOnly] = useState(false);

  if (!scheme) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-slate-200">
        <p className="text-slate-600 font-medium">कोई योजना चयनित नहीं है।</p>
        <TouchButton onClick={onBack} variant="primary">वापस जाएं</TouchButton>
      </div>
    );
  }

  if (showSlipOnly) {
    return (
      <CscPrintSlip
        scheme={scheme}
        userAnswers={userAnswers}
        onBack={() => setShowSlipOnly(false)}
        language={language}
      />
    );
  }

  const toggleDoc = (idx) => {
    setCheckedDocs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const readyCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocs = scheme.documents.length;
  const readyPercentage = Math.round((readyCount / totalDocs) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-bold text-[#004B87] hover:underline flex items-center gap-1.5 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस परिणामों पर जाएं' : 'Back to Results'}</span>
        </button>

        <span className="bg-green-100 text-green-900 border border-green-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
          <span>{language === 'hi' ? 'संभावित रूप से पात्र' : 'Potentially Eligible'}</span>
        </span>
      </div>

      {/* Main Guide Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Scheme Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#004B87] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {scheme.ministry} · {scheme.scope}
            </span>
            <AudioButton
              textToSpeak={`${scheme.schemeName}। ${scheme.benefitSummary}। आवश्यक दस्तावेज और आवेदन प्रक्रिया नीचे दी गई है।`}
              language={language}
              size="sm"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug font-hindi">
            {scheme.schemeName}
          </h2>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              निश्चित सरकारी लाभ:
            </span>
            <p className="text-lg sm:text-xl font-extrabold text-green-800 mt-0.5">
              {scheme.highlightAmount || scheme.benefitSummary}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {scheme.benefitSummary}
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Documents Checklist vs Official Source & Slip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Columns: Interactive Documents Checklist & Application Steps */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Interactive Document Checklist */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#004B87]" />
                    <span>{language === 'hi' ? 'चरण 1: अपने कागजात तैयार करें' : 'Step 1: Check Required Documents'}</span>
                  </h3>
                </div>
                <span className="text-xs font-extrabold text-[#004B87] bg-blue-100 px-2.5 py-1 rounded-lg">
                  {readyCount} / {totalDocs} तैयार ({readyPercentage}%)
                </span>
              </div>

              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'नीचे दिए गए डिब्बों पर टिक करके जांचें कि कौन-से कागजात आपके पास हैं। यह सिर्फ आपके फोन में रहता है, कोई डेटा अपलोड नहीं होता।'
                  : 'Check off the documents you have ready. This is stored only in your browser session; zero documents are uploaded.'}
              </p>

              <div className="space-y-3">
                {scheme.documents.map((doc, idx) => {
                  const isChecked = !!checkedDocs[idx];
                  return (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50/80 border-blue-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDoc(idx)}
                        className="w-5 h-5 mt-0.5 text-[#004B87] rounded border-slate-300 focus:ring-0"
                      />
                      <div className="flex-1">
                        <strong className="block text-slate-900 text-sm font-hindi">{doc.name}</strong>
                        <span className="text-xs text-slate-500">{doc.note}</span>
                      </div>
                      {isChecked && (
                        <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0">
                          ✓ तैयार
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Application Procedure Timeline */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'hi' ? 'चरण 2: आवेदन की क्रमवार प्रक्रिया' : 'Step 2: Step-by-Step Application Guide'}
              </h3>

              <ol className="space-y-3 text-sm text-slate-800">
                {scheme.applicationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#004B87] text-white flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Right 5 Columns: CSC Operator Slip & Official Source */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* The CSC Slip Trigger Card */}
            <div className="bg-blue-50/80 border-2 border-dashed border-[#004B87] rounded-3xl p-6 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#004B87] flex items-center justify-center mx-auto shadow-xs">
                <Printer className="w-7 h-7 text-[#004B87]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-lg">
                  {language === 'hi' ? 'जन सेवा केंद्र (CSC) के लिए पर्ची' : 'Kiosk / CSC Operator Slip'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi'
                    ? 'यदि आप स्वयं ऑनलाइन फॉर्म नहीं भर सकते, तो यह 1-क्लिक पर्ची प्रिंट कर अपने नजदीकी जन सेवा केंद्र (CSC) संचालक को दिखाएं।'
                    : 'Print this clean 1-page paper slip to hand directly to your village CSC operator with all matched rules.'}
                </p>
              </div>

              <TouchButton
                onClick={() => setShowSlipOnly(true)}
                variant="primary"
                className="w-full text-sm font-bold min-h-[48px]"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'hi' ? 'पर्ची देखें व प्रिंट करें' : 'View & Print CSC Slip'}</span>
              </TouchButton>
            </div>

            {/* Official Source Card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {language === 'hi' ? 'सत्यापित आधिकारिक पोर्टल' : 'Official Government Portal'}
              </span>
              
              <div className="font-extrabold text-slate-900 text-sm break-all bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono">
                {scheme.officialUrl}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                हमेशा सरकारी (.gov.in / .nic.in) वेबसाइट पर ही भरोसा करें। किसी भी फर्जी लिंक या अज्ञात व्यक्ति को कोई शुल्क न दें।
              </p>

              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3 rounded-xl text-center flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                <span>{language === 'hi' ? 'आधिकारिक वेबसाइट खोलें' : 'Open Official Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
