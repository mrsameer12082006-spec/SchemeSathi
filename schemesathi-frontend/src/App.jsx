import React, { useState, useCallback, useRef } from 'react';
import useRoute from './hooks/useRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import Results from './pages/Results';
import SchemeDetail from './pages/SchemeDetail';
import Schemes from './pages/Schemes';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';

// Services
import { createSession, sendMessage, mockRollbackStep, updateSessionLanguage } from './services/api';

// Translations
import { translateText, translateProfile, translateResults } from './i18n';

export function App() {
  const { route, path, params, navigate } = useRoute();

  // Global UI states (in-memory only, no localStorage/cookies)
  const [lang, setLang] = useState('en');
  const [isBigText, setIsBigText] = useState(false);
  const [dismissPrivacyNote, setDismissPrivacyNote] = useState(false);

  // Chat and session state
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [progress, setProgress] = useState({ answered: 1 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stack of previous states for "Go back" support
  const [historyStack, setHistoryStack] = useState([]);

  // Concurrency guard to prevent rapid duplicate message submissions
  const isSendingRef = useRef(false);

  // Live language switcher that translates in-memory conversation, profile chips, and mock session
  const handleLanguageChange = useCallback((newLang) => {
    if (newLang === lang) return;

    setLang(newLang);
    document.documentElement.lang = newLang;

    // 1. Translate active chat messages
    setMessages(prevMessages =>
      prevMessages.map(msg => ({
        ...msg,
        text: newLang === 'hi'
          ? (msg.text_hi || translateText(msg.text, 'hi'))
          : (msg.text_en || translateText(msg.text, 'en')),
        why: msg.why
          ? (newLang === 'hi'
              ? (msg.why_hi || translateText(msg.why, 'hi'))
              : (msg.why_en || translateText(msg.why, 'en')))
          : msg.why,
        quick_replies: Array.isArray(msg.quick_replies)
          ? (newLang === 'hi'
              ? (msg.quick_replies_hi || msg.quick_replies.map(qr => translateText(qr, 'hi')))
              : (msg.quick_replies_en || msg.quick_replies.map(qr => translateText(qr, 'en'))))
          : msg.quick_replies
      }))
    );

    // 2. Translate current profile and sync mock session
    setProfile(prevProfile => {
      const translated = translateProfile(prevProfile, newLang);
      if (sessionId) {
        updateSessionLanguage(sessionId, newLang, translated);
      }
      return translated;
    });

    // 3. Translate history stack for "Go back"
    setHistoryStack(prevStack =>
      prevStack.map(snapshot => ({
        ...snapshot,
        messages: snapshot.messages.map(msg => ({
          ...msg,
          text: newLang === 'hi'
            ? (msg.text_hi || translateText(msg.text, 'hi'))
            : (msg.text_en || translateText(msg.text, 'en')),
          why: msg.why
            ? (newLang === 'hi'
                ? (msg.why_hi || translateText(msg.why, 'hi'))
                : (msg.why_en || translateText(msg.why, 'en')))
            : msg.why,
          quick_replies: Array.isArray(msg.quick_replies)
            ? (newLang === 'hi'
                ? (msg.quick_replies_hi || msg.quick_replies.map(qr => translateText(qr, 'hi')))
                : (msg.quick_replies_en || msg.quick_replies.map(qr => translateText(qr, 'en'))))
            : msg.quick_replies
        })),
        profile: translateProfile(snapshot.profile, newLang)
      }))
    );

    // 4. Translate results if present
    setResults(prevResults => translateResults(prevResults, newLang));

    if (sessionId) {
      updateSessionLanguage(sessionId, newLang);
    }
  }, [lang, sessionId]);

  // Start chat from Home page
  const handleStartChat = useCallback(async (initialText, { initialChip } = {}) => {
    const cleanText = (initialText || '').trim();
    if (!cleanText || loading || isSendingRef.current) return;
    isSendingRef.current = true;
    setLoading(true);
    setError(null);

    // Initial user message
    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: cleanText,
      text_en: lang === 'en' ? initialText : translateText(initialText, 'en'),
      text_hi: lang === 'hi' ? initialText : translateText(initialText, 'hi')
    };

    const initialProfile = initialChip
      ? { [lang === 'hi' ? 'पेशा' : 'Occupation']: initialChip }
      : {};

    setMessages([userMsg]);
    setProfile(initialProfile);
    setProgress({ answered: 1 });
    setHistoryStack([]);
    setResults([]);

    // Navigate to /chat
    navigate('/chat');

    try {
      const sessionData = await createSession(lang);
      const activeSessionId = sessionData.session_id;
      setSessionId(activeSessionId);

      const response = await sendMessage({
        sessionId: activeSessionId,
        message: initialText,
        language: lang
      });

      // Bot reply message
      const botMsg = {
        id: 'msg_bot_' + Date.now(),
        sender: 'bot',
        text: response.reply,
        text_en: response.reply_en || (lang === 'en' ? response.reply : translateText(response.reply, 'en')),
        text_hi: response.reply_hi || (lang === 'hi' ? response.reply : translateText(response.reply, 'hi')),
        why: response.why,
        why_en: response.why_en || (response.why ? (lang === 'en' ? response.why : translateText(response.why, 'en')) : ''),
        why_hi: response.why_hi || (response.why ? (lang === 'hi' ? response.why : translateText(response.why, 'hi')) : ''),
        audio_base64: response.audio_base64 || null,
        quick_replies: response.quick_replies || [],
        quick_replies_en: response.quick_replies_en,
        quick_replies_hi: response.quick_replies_hi,
        show_results: response.show_results ?? (Array.isArray(response.results) && response.results.length > 0),
        results_url: response.results_url || '/results'
      };

      setMessages([userMsg, botMsg]);
      if (response.profile) {
        setProfile(prev => ({ ...prev, ...response.profile }));
      }
      if (response.progress) {
        setProgress(response.progress);
      }

      if (response.results && response.results.length > 0) {
        setResults(response.results);
      }
      // User stays in chat; no automatic redirect to /results. Clickable button is provided.
    } catch (err) {
      console.error("Start chat error:", err);
      setError(lang === 'hi' ? "संपर्क नहीं हो सका। पुनः प्रयास करें।" : "Could not connect to the assistant. Please retry.");
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  }, [lang, navigate]);

  // Send subsequent message in Chat
  const handleSendMessage = useCallback(async (text) => {
    const cleanText = (text || '').trim();
    if (!cleanText || loading || isSendingRef.current) return;
    isSendingRef.current = true;

    // Save snapshot of current state to stack for "Go back"
    setHistoryStack(prev => [
      ...prev,
      {
        messages: [...messages],
        profile: { ...profile },
        progress: { ...progress }
      }
    ]);

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text,
      text_en: lang === 'en' ? text : translateText(text, 'en'),
      text_hi: lang === 'hi' ? text : translateText(text, 'hi')
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const currentSessionId = sessionId || (await createSession(lang)).session_id;
      if (!sessionId) setSessionId(currentSessionId);

      const response = await sendMessage({
        sessionId: currentSessionId,
        message: text,
        language: lang
      });

      const botMsg = {
        id: 'msg_bot_' + Date.now(),
        sender: 'bot',
        text: response.reply,
        text_en: response.reply_en || (lang === 'en' ? response.reply : translateText(response.reply, 'en')),
        text_hi: response.reply_hi || (lang === 'hi' ? response.reply : translateText(response.reply, 'hi')),
        why: response.why,
        why_en: response.why_en || (response.why ? (lang === 'en' ? response.why : translateText(response.why, 'en')) : ''),
        why_hi: response.why_hi || (response.why ? (lang === 'hi' ? response.why : translateText(response.why, 'hi')) : ''),
        audio_base64: response.audio_base64 || null,
        quick_replies: response.quick_replies || [],
        quick_replies_en: response.quick_replies_en,
        quick_replies_hi: response.quick_replies_hi,
        show_results: response.show_results ?? (Array.isArray(response.results) && response.results.length > 0),
        results_url: response.results_url || '/results'
      };

      setMessages(prev => [...prev, botMsg]);

      if (response.profile) {
        setProfile(prev => ({ ...prev, ...response.profile }));
      }
      if (response.progress) {
        setProgress(response.progress);
      }

      if (response.results && response.results.length > 0) {
        setResults(response.results);
      }
      // User stays in chat; no automatic redirect to /results. Clickable button is provided.
    } catch (err) {
      console.error("Send message error:", err);
      setError(lang === 'hi' ? "जवाब भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Error sending message. Please try again.");
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  }, [loading, messages, profile, progress, sessionId, lang, navigate]);

  // Go back to previous question and remove last answer & chip
  const handleGoBack = useCallback(() => {
    if (historyStack.length === 0) return;

    const lastSnapshot = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));

    setMessages(lastSnapshot.messages);
    setProfile(lastSnapshot.profile);
    setProgress(lastSnapshot.progress);
    setError(null);

    if (sessionId) {
      mockRollbackStep(sessionId);
    }
  }, [historyStack, sessionId]);

  // Retry last action on error
  const handleRetry = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user');
      if (lastUserMsg) {
        handleSendMessage(lastUserMsg.text);
      }
    }
  }, [messages, handleSendMessage]);

  // Reset entire assistant session and return home
  const handleStartAgain = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    setProfile({});
    setProgress({ answered: 1 });
    setResults([]);
    setHistoryStack([]);
    setError(null);
    setLoading(false);
    navigate('/');
  }, [navigate]);

  // Handle "How to apply" click from Results page
  const handleHowToApply = useCallback((schemeId) => {
    navigate(`/scheme/${schemeId}`);
  }, [navigate]);

  // Handle "Answer 1 question" from Results page
  const handleAnswerMore = useCallback((schemeId) => {
    const target = results.find(r => r.scheme_id === schemeId) || results.find(r => r.status === 'needs_information');
    if (!target) {
      navigate('/chat');
      return;
    }

    const isHi = lang === 'hi' || (messages.length > 0 && /[\u0900-\u097F]/.test(messages[messages.length - 1].text || ''));
    const missingItems = target.missing || [];
    const missingStr = missingItems.join(' ').toLowerCase();

    const schemeNameHi = target.name_hi || translateText(target.name, 'hi') || target.name;
    const schemeNameEn = target.name_en || translateText(target.name, 'en') || target.name;

    let questionHi = "";
    let questionEn = "";
    let quickRepliesHi = [];
    let quickRepliesEn = [];

    const whyHi = `यह प्रश्न ${schemeNameHi} के लिए आपकी पात्रता की पुष्टि करने हेतु आवश्यक है।`;
    const whyEn = `This question is needed to verify your eligibility for ${schemeNameEn}.`;

    if (missingStr.includes('फसल') || missingStr.includes('crop') || missingStr.includes('बुवाई') || missingStr.includes('sowing')) {
      questionHi = `${schemeNameHi} के लिए: क्या आपने वर्तमान कृषि मौसम में फसल की बुवाई की है?`;
      questionEn = `For ${schemeNameEn}: Did you sow crops in the current agricultural season?`;
      quickRepliesHi = ["हाँ, मौसमी फसल बोई है", "नहीं, खेत खाली रहा"];
      quickRepliesEn = ["Yes, cultivated seasonal crops", "No, land was fallow"];
    } else if (missingStr.includes('भूमि') || missingStr.includes('land') || missingStr.includes('रकबे') || missingStr.includes('हेक्टेयर')) {
      questionHi = `${schemeNameHi} के लिए: आपके पास कितनी खेती की ज़मीन है?`;
      questionEn = `For ${schemeNameEn}: How much agricultural land do you own or cultivate?`;
      quickRepliesHi = ["अपनी ज़मीन (2 हेक्टेयर तक)", "अपनी ज़मीन (2 हेक्टेयर से अधिक)", "बटाईदार / भूमिहीन"];
      quickRepliesEn = ["Own land (up to 2 hectares)", "Own land (more than 2 hectares)", "Tenant farmer / Landless"];
    } else if (missingStr.includes('आय') || missingStr.includes('income')) {
      questionHi = `${schemeNameHi} के लिए: आपके परिवार की कुल अनुमानित वार्षिक आय कितनी है?`;
      questionEn = `For ${schemeNameEn}: What is your approximate household annual income?`;
      quickRepliesHi = ["₹1 लाख से कम", "₹1 लाख - ₹2.5 लाख", "₹2.5 लाख से अधिक"];
      quickRepliesEn = ["Below ₹1 Lakh", "₹1 Lakh - ₹2.5 Lakh", "Above ₹2.5 Lakh"];
    } else if (missingStr.includes('क्षेत्र') || missingStr.includes('area') || missingStr.includes('ग्रामीण') || missingStr.includes('rural')) {
      questionHi = `${schemeNameHi} के लिए: क्या आप ग्रामीण (गाँव) क्षेत्र में रहते हैं या शहरी (शहर) में?`;
      questionEn = `For ${schemeNameEn}: Do you reside in a rural (village) or urban (city) area?`;
      quickRepliesHi = ["ग्रामीण क्षेत्र", "शहरी क्षेत्र"];
      quickRepliesEn = ["Rural area", "Urban area"];
    } else {
      questionHi = `${schemeNameHi} के लिए अतिरिक्त विवरण: ${translateText(missingItems[0] || 'कृपया अपनी स्थिति बताएं', 'hi')}`;
      questionEn = `Additional requirement for ${schemeNameEn}: ${translateText(missingItems[0] || 'Please confirm your status', 'en')}`;
      quickRepliesHi = ["हाँ, मैं यह शर्त पूरी करता/करती हूँ", "नहीं, यह लागू नहीं होता"];
      quickRepliesEn = ["Yes, I meet this condition", "No, does not apply"];
    }

    const followUpBotMsg = {
      id: 'msg_bot_more_' + Date.now(),
      sender: 'bot',
      text: isHi ? questionHi : questionEn,
      text_hi: questionHi,
      text_en: questionEn,
      why: isHi ? whyHi : whyEn,
      why_hi: whyHi,
      why_en: whyEn,
      quick_replies: isHi ? quickRepliesHi : quickRepliesEn,
      quick_replies_hi: quickRepliesHi,
      quick_replies_en: quickRepliesEn,
      resolvingSchemeId: target.scheme_id
    };

    setMessages(prev => [...prev, followUpBotMsg]);
    navigate('/chat');
  }, [results, lang, navigate]);

  // Render current page based on hash route
  const renderPage = () => {
    switch (route) {
      case '/':
        return (
          <Home
            lang={lang}
            navigate={navigate}
            onStartChat={handleStartChat}
            dismissPrivacyNote={dismissPrivacyNote}
            setDismissPrivacyNote={setDismissPrivacyNote}
          />
        );

      case '/chat':
        // If there are no messages yet, show Home instead
        if (!messages || messages.length === 0) {
          return (
            <Home
              lang={lang}
              navigate={navigate}
              onStartChat={handleStartChat}
              dismissPrivacyNote={dismissPrivacyNote}
              setDismissPrivacyNote={setDismissPrivacyNote}
            />
          );
        }
        return (
          <Chat
            lang={lang}
            messages={messages}
            profile={profile}
            progress={progress}
            loading={loading}
            error={error}
            onSendMessage={handleSendMessage}
            onGoBack={handleGoBack}
            onRetry={handleRetry}
            navigate={navigate}
          />
        );

      case '/results':
        // If there are no results yet, show Home instead
        if (!results || results.length === 0) {
          return (
            <Home
              lang={lang}
              navigate={navigate}
              onStartChat={handleStartChat}
              dismissPrivacyNote={dismissPrivacyNote}
              setDismissPrivacyNote={setDismissPrivacyNote}
            />
          );
        }
        return (
          <Results
            lang={lang}
            results={results}
            profile={profile}
            onHowToApply={handleHowToApply}
            onAnswerMore={handleAnswerMore}
            onStartAgain={handleStartAgain}
          />
        );

      case '/scheme/:id':
        return (
          <SchemeDetail
            id={params.id}
            lang={lang}
            results={results}
            navigate={navigate}
          />
        );

      case '/schemes':
        return (
          <Schemes
            lang={lang}
            navigate={navigate}
          />
        );

      case '/how-it-works':
        return (
          <HowItWorks
            lang={lang}
            navigate={navigate}
          />
        );

      case '/about':
        return (
          <About
            lang={lang}
            navigate={navigate}
          />
        );

      default:
        return (
          <Home
            lang={lang}
            navigate={navigate}
            onStartChat={handleStartChat}
            dismissPrivacyNote={dismissPrivacyNote}
            setDismissPrivacyNote={setDismissPrivacyNote}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink dark:bg-night dark:text-mist transition-colors">
      <Navbar
        route={route}
        navigate={navigate}
        lang={lang}
        setLang={handleLanguageChange}
        isBigText={isBigText}
        setIsBigText={setIsBigText}
      />

      <main className="flex-1 w-full flex flex-col">
        {renderPage()}
      </main>

      <Footer lang={lang} />
    </div>
  );
}

export default App;
