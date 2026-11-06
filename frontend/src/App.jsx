import React, { useState } from 'react';
import DisclaimerBanner from './components/layout/DisclaimerBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import GuidedInterview from './pages/GuidedInterview';
import ReviewAnswers from './pages/ReviewAnswers';
import EligibilityResults from './pages/EligibilityResults';
import SchemeGuide from './pages/SchemeGuide';
import CscPrintSlip from './components/results/CscPrintSlip';
import { evaluateEligibilityLocally } from './services/api';
import { VERIFIED_SCHEMES } from './data/schemesData';

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'interview' | 'review' | 'results' | 'guide' | 'slip'
  const [language, setLanguage] = useState('hi'); // 'hi' | 'en'
  const [mode, setMode] = useState('citizen'); // 'citizen' | 'operator'
  const [fontSizeDelta, setFontSizeDelta] = useState(0); // -1, 0, 1
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Dynamic root font size based on accessibility scaler and citizen mode
  const getFontSizeStyle = () => {
    // In Citizen Mode, baseline is 18px (1.125rem) for extreme legibility with Hindi script
    let base = mode === 'citizen' ? 18 : 16;
    if (fontSizeDelta === 1) base += 2;
    if (fontSizeDelta === -1) base -= 2;
    return { fontSize: `${base}px` };
  };

  const handleStartInterview = () => {
    setScreen('interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrowseSchemes = () => {
    // Run evaluation with empty profile to browse all 3 schemes
    const evaluated = evaluateEligibilityLocally({});
    setResults(evaluated);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInterviewComplete = () => {
    setScreen('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReview = () => {
    // Convert answers into profile fields for deterministic rule engine
    const profile = {};
    Object.keys(answers).forEach(key => {
      profile[key] = answers[key].value;
    });

    const evaluated = evaluateEligibilityLocally(profile);
    setResults(evaluated);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (scheme) => {
    setSelectedScheme(scheme);
    setScreen('guide');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintSlip = (scheme) => {
    setSelectedScheme(scheme || results[0]);
    setScreen('slip');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic container width based on mode
  const containerWidthClass = mode === 'operator' ? 'max-w-7xl' : 'max-w-5xl';

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-all selection:bg-[#004B87] selection:text-white"
      style={getFontSizeStyle()}
    >
      
      {/* 1. Top Civic Trust Disclaimer */}
      <DisclaimerBanner language={language} />

      {/* 2. Sticky Civic Header */}
      <Navbar
        currentScreen={screen}
        setScreen={setScreen}
        language={language}
        setLanguage={setLanguage}
        mode={mode}
        setMode={setMode}
        fontSizeDelta={fontSizeDelta}
        setFontSizeDelta={setFontSizeDelta}
      />

      {/* 3. Kiosk Mode Operator Notice Banner */}
      {mode === 'operator' && (
        <aside className="bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-3 border-b border-slate-800 animate-fade-in no-print">
          <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
            CSC KIOSK WORKSPACE
          </span>
          <span className="hidden sm:inline">
            ग्राम स्तरीय उद्यमी (VLE) सहायता मोड सक्रिय है। 2-कॉलम लेआउट व कीबोर्ड शॉर्टकट (1, 2, 3) सक्षम हैं।
          </span>
          <button
            onClick={() => setMode('citizen')}
            className="text-amber-400 hover:text-amber-300 underline font-bold ml-2 text-xs"
          >
            नागरिक मोड में बदलें
          </button>
        </aside>
      )}

      {/* 4. Main Dynamic Viewport */}
      <main className={`flex-1 ${containerWidthClass} w-full mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300`}>
        {screen === 'home' && (
          <Home
            onStart={handleStartInterview}
            onBrowse={handleBrowseSchemes}
            language={language}
          />
        )}

        {screen === 'interview' && (
          <GuidedInterview
            answers={answers}
            setAnswers={setAnswers}
            onComplete={handleInterviewComplete}
            language={language}
            mode={mode}
          />
        )}

        {screen === 'review' && (
          <ReviewAnswers
            answers={answers}
            onEditIndex={() => setScreen('interview')}
            onConfirm={handleConfirmReview}
            onBack={() => setScreen('interview')}
            language={language}
          />
        )}

        {screen === 'results' && (
          <EligibilityResults
            results={results.length > 0 ? results : evaluateEligibilityLocally({})}
            answers={answers}
            onEditAnswers={() => setScreen('interview')}
            onOpenDetails={handleOpenDetails}
            onPrintSlip={handlePrintSlip}
            language={language}
          />
        )}

        {screen === 'guide' && (
          <SchemeGuide
            scheme={selectedScheme || results[0]}
            userAnswers={answers}
            onBack={() => setScreen('results')}
            language={language}
          />
        )}

        {screen === 'slip' && (
          <CscPrintSlip
            scheme={selectedScheme || results[0]}
            userAnswers={answers}
            onBack={() => setScreen('results')}
            language={language}
          />
        )}
      </main>

      {/* 5. Civic Footer (Hidden on print) */}
      <div className="no-print">
        <Footer language={language} />
      </div>

    </div>
  );
}
