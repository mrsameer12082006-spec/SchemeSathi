import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Chips from '../components/Chips';
import { coreStrings } from '../i18n';
import { extraStrings } from '../i18n.extra';
import { useVoice } from '../hooks/useVoice';

export function Chat({
  lang,
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

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        if (transcript) {
          onSendMessage(transcript);
        }
      });
    }
  };

  // Convert profile object to chips array
  const profileChips = Object.entries(profile).map(([key, val]) => {
    // If value already includes key or is simple value
    return `${val}`;
  });

  // Can go back if user has answered at least one question after starting
  const canGoBack = messages.filter(m => m.sender === 'user').length > 1;

  // Find the latest bot message to check for quick replies / why / listen
  const latestBotMsgIndex = messages.map(m => m.sender).lastIndexOf('bot');
  const latestBotMsg = latestBotMsgIndex !== -1 ? messages[latestBotMsgIndex] : null;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-4.5rem)] px-4 py-4">
      {/* Top Header: Back navigation if previous answers exist */}
      {canGoBack && (
        <div className="shrink-0 mb-3 flex items-center justify-start">
          <button
            type="button"
            onClick={onGoBack}
            disabled={loading}
            className="text-sm font-semibold text-ink/80 dark:text-mist/80 hover:text-ink dark:hover:text-mist hover:underline focus:outline-none flex items-center gap-1.5 cursor-pointer py-0.5"
          >
            <span aria-hidden="true">←</span> {tCore.back}
          </button>
        </div>
      )}

      {/* "What I understood" Card */}
      {profileChips.length > 0 && (
        <div className="shrink-0 mb-3 p-3.5 rounded-2xl bg-white dark:bg-nightcard border border-line dark:border-nightline shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/60 dark:text-mist/60 mb-2">
            {tCore.understood}
          </p>
          <Chips items={profileChips} variant="display" ariaLabel={tCore.understood} />
        </div>
      )}

      {/* Message List (Scrollable, aria-live) */}
      <div
        className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth"
        role="region"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const isLatestBot = !isUser && index === latestBotMsgIndex;

          if (isUser) {
            return (
              <div key={msg.id || index} className="flex justify-end">
                <div className="max-w-[85%] bg-ink dark:bg-mist text-white dark:text-ink px-4 py-3 rounded-2xl rounded-tr-sm text-base font-medium shadow-sm">
                  {msg.text}
                </div>
              </div>
            );
          }

          // Bot message
          return (
            <div key={msg.id || index} className="flex flex-col items-start gap-2 max-w-[90%]">
              <div className="card w-full p-4 sm:p-5 flex flex-col gap-3 shadow-sm border border-line dark:border-nightline">
                <div className="text-base sm:text-lg font-medium text-ink dark:text-mist leading-relaxed space-y-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:leading-snug [&_strong]:font-bold [&_strong]:text-ink dark:[&_strong]:text-mist">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* "Why we ask: ..." */}
                {msg.why && (
                  <p className="text-xs sm:text-sm text-ink/60 dark:text-mist/60 italic leading-snug">
                    <span className="font-semibold not-italic text-ink/70 dark:text-mist/70">{tCore.whyAsk}: </span>
                    {msg.why}
                  </p>
                )}

                {/* Direct Results Navigation Button if AI identified eligible or domain schemes */}
                {msg.show_results && (
                  <div className="pt-1 pb-1">
                    <button
                      type="button"
                      onClick={() => navigate(msg.results_url || '/results')}
                      className="btn-primary inline-flex items-center gap-2 font-bold px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'विस्तृत परिणाम देखें (योजना कार्ड्स) →' : 'View Detailed Results →'}</span>
                    </button>
                  </div>
                )}

                {/* Listen button for question */}
                <div className="flex items-center justify-between pt-1 border-t border-line/50 dark:border-nightline/50 text-xs">
                  {(() => {
                    const msgId = msg.id || `msg_${index}`;
                    const isPlaying = activePlayingId === msgId;
                    return (
                      <button
                        type="button"
                        onClick={() => handlePlayMessage(msg, index)}
                        className={`inline-flex items-center gap-1.5 font-semibold py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                          isPlaying
                            ? 'bg-saffron text-ink font-bold shadow-sm'
                            : 'text-ink/80 dark:text-mist/80 hover:text-ink dark:hover:text-mist hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                        aria-label={isPlaying ? (lang === 'hi' ? 'रोकें' : 'Stop') : `${tCore.listen} ${msg.text}`}
                      >
                        <span aria-hidden="true">{isPlaying ? '⏸️' : '🔊'}</span>
                        <span>{isPlaying ? (lang === 'hi' ? 'रोकें' : 'Stop') : tCore.listen}</span>
                        {isPlaying && (
                          <span className="flex items-center gap-0.5 ml-1" aria-hidden="true">
                            <span className="w-1 h-3 bg-ink rounded-full animate-pulse" />
                            <span className="w-1 h-4 bg-ink rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-2 bg-ink rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          </span>
                        )}
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Quick Replies below the latest bot message */}
              {isLatestBot && !loading && (
                <div className="w-full mt-2 flex flex-col gap-2">
                  {msg.quick_replies && msg.quick_replies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {msg.quick_replies.map((qr, qrIdx) => (
                        <button
                          key={`qr-${qrIdx}`}
                          type="button"
                          onClick={() => handleChipClick(qr)}
                          className="chip text-sm font-semibold hover:border-saffron hover:bg-white dark:hover:bg-nightcard active:scale-95 transition-all"
                        >
                          {qr}
                        </button>
                      ))}
                      {/* "Not sure" chip only present when answering active questions */}
                      <button
                        type="button"
                        onClick={() => handleChipClick(tCore.notSure)}
                        className="chip text-sm font-semibold text-ink/70 dark:text-mist/70 hover:border-saffron hover:bg-white dark:hover:bg-nightcard active:scale-95 transition-all"
                      >
                        {tCore.notSure}
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading "..." indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="card px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 text-ink/60 dark:text-mist/60 shadow-sm" aria-label={tExtra.loading}>
              <span className="w-2 h-2 rounded-full bg-ink/40 dark:bg-mist/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-ink/40 dark:bg-mist/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-ink/40 dark:bg-mist/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Error retry banner */}
        {error && (
          <div role="alert" className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{error || tExtra.errorNetwork}</span>
            <button
              type="button"
              onClick={onRetry}
              className="btn text-xs font-bold px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 rounded-lg shrink-0"
            >
              {tExtra.retry}
            </button>
          </div>
        )}

        {/* Voice error notice if speech recognition failed */}
        {voiceError && (
          <div role="alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            {voiceError}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar at Bottom */}
      <div className="shrink-0 pt-3">
        <form onSubmit={handleSend} autoComplete="off" className="flex items-center gap-2">
          {/* Round Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            disabled={loading}
            aria-pressed={isListening}
            aria-label={isListening ? tCore.stopListening : tCore.speak}
            title={isListening ? tCore.stopListening : tCore.speak}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-line dark:border-nightline transition-all cursor-pointer ${
              isListening
                ? 'bg-saffron text-ink border-saffron animate-pulse scale-105'
                : 'bg-white dark:bg-nightcard text-ink dark:text-mist hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
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
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-line dark:border-nightline bg-white dark:bg-nightcard text-ink dark:text-mist placeholder:text-ink/40 dark:placeholder:text-mist/40 transition-colors"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="btn-primary px-5 py-2.5 shrink-0"
          >
            {tCore.send}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
