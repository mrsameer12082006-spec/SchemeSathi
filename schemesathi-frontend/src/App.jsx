import React, { useState, useCallback } from 'react';
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

  // Live language switcher that translates in-memory conversation, profile chips, and mock session
  const handleLanguageChange = useCallback((newLang) => {
    if (newLang === lang) return;

    setLang(newLang);
    document.documentElement.lang = newLang;

    // 1. Translate active chat messages
    setMessages(prevMessages =>
      prevMessages.map(msg => ({
        ...msg,
        text: translateText(msg.text, newLang),
        why: msg.why ? translateText(msg.why, newLang) : msg.why,
        quick_replies: Array.isArray(msg.quick_replies)
          ? msg.quick_replies.map(qr => translateText(qr, newLang))
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
          text: translateText(msg.text, newLang),
          why: msg.why ? translateText(msg.why, newLang) : msg.why,
          quick_replies: Array.isArray(msg.quick_replies)
            ? msg.quick_replies.map(qr => translateText(qr, newLang))
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
    setLoading(true);
    setError(null);

    // Initial user message
    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: initialText
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
        why: response.why,
        quick_replies: response.quick_replies || []
      };

      setMessages([userMsg, botMsg]);
      if (response.profile) {
        setProfile(prev => ({ ...prev, ...response.profile }));
      }
      if (response.progress) {
        setProgress(response.progress);
      }

      if (response.done && response.results) {
        setResults(response.results);
        navigate('/results');
      }
    } catch (err) {
      console.error("Start chat error:", err);
      setError(lang === 'hi' ? "संपर्क नहीं हो सका। पुनः प्रयास करें।" : "Could not connect to the assistant. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [lang, navigate]);

  // Send subsequent message in Chat
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

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
      text
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
        why: response.why,
        quick_replies: response.quick_replies || []
      };

      setMessages(prev => [...prev, botMsg]);

      if (response.profile) {
        setProfile(prev => ({ ...prev, ...response.profile }));
      }
      if (response.progress) {
        setProgress(response.progress);
      }

      if (response.done && response.results) {
        setResults(response.results);
        navigate('/results');
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError(lang === 'hi' ? "जवाब भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Error sending message. Please try again.");
    } finally {
      setLoading(false);
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
  const handleAnswerMore = useCallback(() => {
    navigate('/chat');
  }, [navigate]);

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
