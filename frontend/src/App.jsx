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
import SchemeExplorer from './pages/SchemeExplorer';
import { evaluateEligibilityLocally, playSuccessChime } from './services/api';

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'interview' | 'review' | 'results' | 'guide' | 'slip' | 'explorer'
  const [language, setLanguage] = useState('hi'); // 'hi' | 'en'
  const [mode, setMode] = useState('citizen'); // 'citizen' | 'operator'
  const [fontSizeDelta, setFontSizeDelta] = useState(0); // -1, 0, 1
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const getFontSizeStyle = () => {
    let base = 16;
    if (fontSizeDelta === 1) base = 18;
    if (fontSizeDelta === -1) base = 15;
    return { fontSize: `${base}px` };
  };

  const handleStartInterview = () => {
    setScreen('interview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrowseSchemes = () => {
    setScreen('explorer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInterviewComplete = () => {
    playSuccessChime();
    setScreen('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmReview = () => {
    const profile = {};
    Object.keys(answers).forEach(key => {
      profile[key] = answers[key].value;
    });

    const evaluated = evaluateEligibilityLocally(profile);
    setResults(evaluated);
    playSuccessChime();
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

  return (
    <div
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-all font-sans selection:bg-[#004B87] selection:text-white"
      style={getFontSizeStyle()}
    >
      {/* 1. Subtle Trust Top Tag */}
      <DisclaimerBanner language={language} />

      {/* 2. Sleek Sticky Header */}
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

      {/* 3. Main Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {screen === 'home' && (
          <Home
            onStart={handleStartInterview}
            onBrowse={handleBrowseSchemes}
            language={language}
          />
        )}

        {screen === 'explorer' && (
          <SchemeExplorer
            onBack={() => setScreen('home')}
            onStartCheck={handleStartInterview}
            onSelectScheme={handleOpenDetails}
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

      {/* 4. Minimalist Footer */}
      <div className="no-print">
        <Footer language={language} />
      </div>
    </div>
  );
}
