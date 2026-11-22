import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Volume2, Square, ArrowRight, ArrowLeft } from 'lucide-react';
import Chips from '../components/Chips';
import { coreStrings, translateText } from '../i18n';
import { extraStrings } from '../i18n.extra';
import { useVoice } from '../hooks/useVoice';

export function Chat({
  lang = 'en',
  messages = [],
  profile = {},
  progress = { answered: 1, total: 3 },
  loading = false,
  error = null,
  onSendMessage,
  onGoBack,
  onRetry,
  navigate
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const tCore = coreStrings[lang] || coreStrings.en;
  const tExtra = extraStrings[lang] || extraStrings.en;

  const {
    isListening,
    isSpeaking,
    activePlayingId,
    voiceError,
    startListening,
    stopListening,
    speak,
    cancelSpeech
  } = useVoice({ lang });

  const handlePlayMessage = async (msg, index) => {
    const msgId = msg.id || `msg_${index}`;
    if (activePlayingId === msgId) {
      cancelSpeech();
      return;
    }
    const resultAudio = await speak(msg.text, { audioBase64: msg.audio_base64, id: msgId });
    if (resultAudio && !msg.audio_base64) {
      msg.audio_base64 = resultAudio;
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when loading finishes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || loading) return;
    cancelSpeech();
    setInputText('');
    onSendMessage(text);
  };

  const handleChipClick = (replyText) => {
    if (loading) return;
    cancelSpeech();
    onSendMessage(replyText);
  };

  const voiceDispatchedRef = useRef(false);

  const handleToggleVoice = () => {
    cancelSpeech();
    if (isListening) {
      stopListening();
    } else {
      voiceDispatchedRef.current = false;
      startListening(
        (transcript) => {
          if (voiceDispatchedRef.current) return;
          voiceDispatchedRef.current = true;
          if (transcript && transcript.trim()) {
            setInputText('');
            onSendMessage(transcript.trim());
          }
        },
        (interim) => {
          if (!voiceDispatchedRef.current && interim) {
            setInputText(interim.trim());
          }
        }
      );
    }
  };

  // Convert profile object to chips array
  const profileChips = Object.entries(profile).map(([, val]) => translateText(String(val), lang));

  // Can go back if user has answered at least one question after starting
  const canGoBack = messages.filter(m => m.sender === 'user').length > 1;

  // Find latest bot message
  const latestBotMsgIndex = messages.map(m => m.sender).lastIndexOf('bot');
  const latestBotMsg = latestBotMsgIndex !== -1 ? messages[latestBotMsgIndex] : null;

  // Helper to deduce strictly contextual quick-reply options from conversation if backend returns empty
  const getContextualFallbackChips = (latestBot, allMsgs, userProfile, currentLang) => {
    const isHi = currentLang === 'hi';
    if (!latestBot && allMsgs.length === 0) {
      return isHi
        ? ['किसान योजनाएं', 'छात्रवृत्ति', 'महिला कल्याण', 'स्वास्थ्य बीमा', 'पेंशन']
        : ['Farmer Schemes', 'Scholarships', 'Women Welfare', 'Health Insurance', 'Pensions'];
    }

    const botText = (latestBot?.text || '').toLowerCase();
    const convText = allMsgs.map(m => m.text).join(' ').toLowerCase();
    const profValues = Object.values(userProfile || {}).join(' ').toLowerCase();
    const fullContext = `${convText} ${botText} ${profValues}`;

    // 1. Direct follow-up to question in bot's message
    if (/crop insurance|fasal bima|फसल बीमा|बीमा/.test(botText)) {
      return isHi
        ? ['हाँ, फसल बीमा की जानकारी दें', 'पीएम किसान स्टेटस', 'ज़रूरी दस्तावेज़', 'किसान क्रेडिट कार्ड']
        : ['Yes, tell me about crop insurance', 'PM Kisan status', 'Required documents', 'Kisan Credit Card'];
    }
    if (/land|hectare|acre|ज़मीन|रकबा|हेक्टेयर|बटाईदार/.test(botText)) {
      return isHi
        ? ['अपनी ज़मीन (2 हेक्टेयर तक)', 'अपनी ज़मीन (2 हेक्टेयर से अधिक)', 'बटाईदार / भूमिहीन']
        : ['Own land (up to 2 hectares)', 'Own land (more than 2 hectares)', 'Tenant farmer / Landless'];
    }
    if (/sow|cultivat|बुवाई|बोई/.test(botText)) {
      return isHi
        ? ['हाँ, मौसमी फसल बोई है', 'नहीं, खेत खाली रहा', 'शर्तें बताएं']
        : ['Yes, cultivated seasonal crops', 'No, land was fallow', 'Tell me requirements'];
    }
    if (/class 12|12वीं|college|enrolled|दाखिला|marksheet/.test(botText)) {
      return isHi
        ? ['हाँ, 12वीं पास हैं', 'अभी स्कूल में पढ़ रहे हैं', 'कॉलेज में दाखिला है']
        : ['Yes, passed Class 12', 'Currently in school', 'Enrolled in college'];
    }
    if (/income|annual income|आय|सालाना आय/.test(botText)) {
      return isHi
        ? ['₹1 लाख से कम', '₹1 - ₹2.5 लाख', '₹2.5 लाख से अधिक']
        : ['Below ₹1 Lakh', '₹1 - ₹2.5 Lakh', 'Above ₹2.5 Lakh'];
    }
    if (/ration card|राशन कार्ड|ayushman list|सूची में नाम/.test(botText)) {
      return isHi
        ? ['हाँ, राशन कार्ड है', 'राशन कार्ड नहीं है', 'नाम कैसे चेक करें?']
        : ['Yes, have ration card', 'No ration card', 'How to check name?'];
    }

    // 2. Topic/Role specific options based on current conversation context
    if (/farmer|kisan|farming|खेती|किसान|हरियाणा|कृषि/.test(fullContext)) {
      return isHi
        ? ['पीएम किसान ₹6,000 किस्त', 'फसल बीमा की जानकारी', 'किसान क्रेडिट कार्ड (KCC)', 'ज़रूरी दस्तावेज़']
        : ['PM Kisan ₹6,000 status', 'Crop insurance details', 'Kisan Credit Card (KCC)', 'Required documents'];
    }
    if (/student|scholarship|college|छात्र|छात्रवृत्ति|पढ़ाई/.test(fullContext)) {
      return isHi
        ? ['कॉलेज छात्रवृत्ति योजना', 'पात्रता की शर्तें', 'आवश्यक दस्तावेज़', 'आवेदन के चरण']
        : ['College Scholarship (CSSS)', 'Eligibility criteria', 'Required documents', 'Application steps'];
    }
    if (/woman|women|maternity|pregnant|महिला|मातृ/.test(fullContext)) {
      return isHi
        ? ['मातृ वंदना योजना (PMMVY)', 'लखपति दीदी योजना', 'ज़रूरी दस्तावेज़', 'आवेदन के चरण']
        : ['Matru Vandana (PMMVY)', 'Lakhpati Didi', 'Required documents', 'Application steps'];
    }
    if (/worker|labour|shramik|मज़दूर|श्रमिक|ई-श्रम/.test(fullContext)) {
      return isHi
        ? ['ई-श्रम कार्ड लाभ', 'सुरक्षा बीमा (PMSBY)', 'श्रम योगी मान-धन', 'ज़रूरी दस्तावेज़']
        : ['e-Shram card benefits', 'Accident insurance (PMSBY)', 'PM-SYM pension', 'Required documents'];
    }
    if (/senior|elderly|pension|वृद्धावस्था|बुजुर्ग|पेंशन/.test(fullContext)) {
      return isHi
        ? ['वृद्धावस्था पेंशन', 'अटल पेंशन योजना', 'मुफ़्त अस्पताल इलाज', 'आवेदन प्रक्रिया']
        : ['Old age pension', 'Atal Pension Yojana', 'Free hospital cover', 'Application process'];
    }
    if (/health|hospital|ayushman|इलाज|आयुष्मान|दवा/.test(fullContext)) {
      return isHi
        ? ['आयुष्मान भारत ₹5 लाख', 'सूची में नाम चेक करें', 'संबद्ध अस्पताल', 'ज़रूरी दस्तावेज़']
        : ['Ayushman Bharat ₹5 Lakh', 'Check name in list', 'Empaneled hospitals', 'Required documents'];
    }
    if (/loan|business|vyapar|लोन|मुद्रा|व्यापार/.test(fullContext)) {
      return isHi
        ? ['पीएम मुद्रा लोन', 'पीएम स्वनिधि', 'पात्रता की शर्तें', 'ज़रूरी दस्तावेज़']
        : ['PM Mudra loan', 'PM SVANidhi', 'Eligibility criteria', 'Required documents'];
    }

    // 3. Conversational follow-up if question was asked
    if (botText.includes('?') || botText.includes('क्या')) {
      return isHi
        ? ['हाँ, और जानकारी दें', 'पात्रता की शर्तें क्या हैं?', 'ज़रूरी दस्तावेज़']
        : ['Yes, tell me more', 'What are the rules?', 'Required documents'];
    }

    // Default clean options for ongoing chat
    return isHi
      ? ['पात्रता की शर्तें', 'आवश्यक दस्तावेज़', 'आवेदन प्रक्रिया']
      : ['Eligibility criteria', 'Required documents', 'Application steps'];
  };

  const activeChips = (
    (lang === 'hi' && Array.isArray(latestBotMsg?.quick_replies_hi) && latestBotMsg.quick_replies_hi.length > 0)
      ? latestBotMsg.quick_replies_hi
      : (lang === 'en' && Array.isArray(latestBotMsg?.quick_replies_en) && latestBotMsg.quick_replies_en.length > 0)
        ? latestBotMsg.quick_replies_en
        : (Array.isArray(latestBotMsg?.quick_replies) && latestBotMsg.quick_replies.length > 0)
          ? latestBotMsg.quick_replies
          : getContextualFallbackChips(latestBotMsg, messages, profile, lang)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-[#F9F8F6]">
      {/* 1. Centered Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 sm:gap-8">
          
          {/* Top Header: Back navigation if previous answers exist */}
          {canGoBack && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onGoBack}
                disabled={loading}
                className="text-sm font-medium text-stone-500 hover:text-[#166534] hover:underline focus:outline-none flex items-center gap-1.5 cursor-pointer py-1"
              >
                <ArrowLeft size={15} />
                <span>{tCore.back}</span>
              </button>
            </div>
          )}

          {/* "What I understood" Card */}
          {profileChips.length > 0 && (
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                {tCore.understood}
              </p>
              <Chips items={profileChips} variant="display" ariaLabel={tCore.understood} />
            </div>
          )}

          {/* Messages Stack */}
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const msgId = msg.id || `msg_${index}`;
              const isPlaying = activePlayingId === msgId;

              if (isUser) {
                return (
                  <motion.div
                    key={msgId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] bg-[#166534] text-white rounded-2xl rounded-tr-sm px-5 py-3 text-[15px] sm:text-[16px] leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                  </motion.div>
                );
              }

              // Assistant message (Claude style: avatar + clean markdown text, no bounding card)
              return (
                <motion.div
                  key={msgId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3.5 sm:gap-4 justify-start items-start"
                >
                  {/* AI Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center shrink-0 mt-1 shadow-sm select-none">
                    <span className="text-white font-serif font-bold text-sm">S</span>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 min-w-0 text-[#1C1B1A]">
                    <div className="prose prose-stone max-w-none text-[15px] sm:text-[16px] leading-relaxed space-y-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:leading-snug [&_strong]:font-semibold [&_strong]:text-[#1C1B1A]">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    {/* "Why we ask" hint */}
                    {msg.why && (
                      <p className="mt-2 text-xs sm:text-sm text-stone-500 italic leading-snug">
                        <span className="font-semibold not-italic text-stone-600">{tCore.whyAsk}: </span>
                        {translateText(msg.why, lang)}
                      </p>
                    )}

                    {/* AI Audio Listen / Stop button */}
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handlePlayMessage(msg, index)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          isPlaying ? 'text-[#166534] font-semibold' : 'text-stone-500 hover:text-[#166534]'
                        }`}
                        aria-label={isPlaying ? (lang === 'hi' ? 'रोकें' : 'Stop') : `${tCore.listen} ${msg.text}`}
                      >
                        {isPlaying ? <Square size={13} className="text-[#166534] fill-current" /> : <Volume2 size={14} />}
                        <span>{isPlaying ? (lang === 'hi' ? 'रोकें' : 'Stop') : (lang === 'hi' ? 'सुनें' : 'Listen')}</span>
                      </button>
                    </div>

                    {/* View Detailed Results Button */}
                    {(msg.show_results || (Array.isArray(msg.results) && msg.results.length > 0)) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => navigate(msg.results_url || '/results')}
                        className="mt-4 bg-white border border-stone-200 shadow-soft text-[#1C1B1A] px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-stone-50 transition-all cursor-pointer"
                      >
                        <span>{lang === 'hi' ? 'विस्तृत परिणाम देखें (योजना कार्ड्स)' : 'View Detailed Results'}</span>
                        <ArrowRight size={16} />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Loading Indicator (Avatar + bouncing dots) */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-[#166534] flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white font-serif font-bold text-sm">S</span>
              </div>
              <div className="flex items-center gap-1.5 h-8">
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}

          {/* Error retry banner */}
          {error && (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center justify-between gap-3 shadow-soft">
              <span className="text-sm font-medium">{error || tExtra.errorNetwork}</span>
              <button
                type="button"
                onClick={onRetry}
                className="btn text-xs font-semibold px-3 py-1.5 bg-red-100 hover:bg-red-200 rounded-lg shrink-0 text-red-900"
              >
                {tExtra.retry}
              </button>
            </div>
          )}

          {/* Voice error notice */}
          {voiceError && (
            <div role="alert" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 shadow-soft">
              {voiceError}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 2. Floating Input Bar (Claude Style) */}
      <div className="border-t border-stone-200 bg-[#F9F8F6] p-4 pb-6 shrink-0">
        <div className="max-w-3xl mx-auto">
          
          {/* Suggestion Chips */}
          {activeChips.length > 0 && !loading && (
            <div className="flex flex-wrap gap-2 mb-3">
              {activeChips.map((chip, idx) => {
                const localizedChip = translateText(chip, lang);
                return (
                  <button
                    key={`chip-${idx}`}
                    type="button"
                    onClick={() => handleChipClick(localizedChip)}
                    className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-medium text-stone-600 hover:border-[#166534] hover:text-[#166534] hover:bg-white transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {localizedChip}
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Form Pill */}
          <form
            onSubmit={handleSend}
            autoComplete="off"
            className="relative flex items-center bg-white border border-stone-300 rounded-2xl shadow-soft focus-within:border-[#166534] focus-within:ring-1 focus-within:ring-[#166534] transition-all p-1.5 sm:p-2"
          >
            {/* Microphone button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              disabled={loading}
              aria-pressed={isListening}
              aria-label={isListening ? tCore.stopListening : tCore.speak}
              title={isListening ? tCore.stopListening : tCore.speak}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#166534] text-white animate-pulse shadow-sm'
                  : 'text-stone-400 hover:text-[#166534] hover:bg-stone-50'
              }`}
            >
              <Mic size={20} />
            </button>

            {/* Text Input */}
            <label htmlFor="chat-input" className="sr-only">
              {tCore.typeHere}
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              name="chat_message"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={inputText}
              onChange={(e) => {
                if (isSpeaking) cancelSpeech();
                setInputText(e.target.value);
              }}
              disabled={loading}
              placeholder={tCore.typeHere}
              className="flex-1 py-3 px-2 bg-transparent outline-none text-[#1C1B1A] placeholder:text-stone-400 text-[15px]"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-2.5 text-white bg-[#166534] hover:bg-[#14532D] rounded-xl disabled:opacity-30 disabled:bg-stone-300 transition-all cursor-pointer"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Disclaimer Footer */}
          <p className="text-center text-xs text-stone-400 mt-2.5">
            {lang === 'hi'
              ? 'योजना साथी से त्रुटि हो सकती है। कृपया आधिकारिक सरकारी स्रोतों से पुष्टि करें।'
              : 'SchemeSathi can make mistakes. Please verify with official sources.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
