import React, { useState, useRef, useEffect } from 'react';
import { useParty } from '../context/PartyContext';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
} from 'lucide-react';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    chatMessages,
    sendChatMessage,
    isAiThinking,
    activeEvent,
  } = useParty();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
      // Auto-focus input when drawer opens
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chatMessages, isAssistantOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isAiThinking) return;

    const query = inputVal;
    setInputVal('');
    setVoiceError(null);
    await sendChatMessage(query);
  };

  // Browser SpeechRecognition Voice Input Handler
  const handleToggleVoice = () => {
    setVoiceError(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputVal(transcript);
          sendChatMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. You can use text input instead.');
        } else if (e.error === 'no-speech') {
          setVoiceError('No speech detected. Please try speaking again or type your command.');
        } else {
          setVoiceError('Voice input unavailable. Please use text input.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      setIsListening(false);
      setVoiceError('Could not start microphone. Please use text input.');
    }
  };

  if (!isAssistantOpen) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl flex flex-col animate-in slide-in-from-right-5 duration-200 text-slate-900"
      role="region"
      aria-label="Alexa-Inspired Party Planning Assistant"
    >
      {/* Drawer Header with Alexa Visual Identity */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/50">
        <div className="flex items-center gap-3">
          {/* Animated Alexa Voice Orb Icon */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
            <Bot className="w-5 h-5 animate-pulse" />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Alexa Assistant</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700">
                  AI
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[210px]">
              Active: {activeEvent.name}
            </p>
          </div>
        </div>

        {/* Live Soundwave Motif when listening / thinking */}
        {(isListening || isAiThinking) && (
          <div className="flex items-end gap-1 h-6 px-2" aria-label="Listening audio indicator">
            <div className="w-1 bg-blue-500 rounded-full wave-bar-1" />
            <div className="w-1 bg-purple-500 rounded-full wave-bar-2" />
            <div className="w-1 bg-pink-500 rounded-full wave-bar-3" />
            <div className="w-1 bg-blue-500 rounded-full wave-bar-4" />
          </div>
        )}

        <button
          onClick={() => setIsAssistantOpen(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Close assistant drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Status Alert if error/warning */}
      {voiceError && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200/80 text-[11px] text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="flex-1">{voiceError}</span>
          <button
            onClick={() => setVoiceError(null)}
            className="text-amber-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed text-[13px] ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-md shadow-blue-500/15'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Navigated destination chip */}
                {msg.navigatedTo && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] text-blue-600 font-bold">
                    <ArrowRight className="w-3 h-3" />
                    <span>Switched to {msg.navigatedTo}</span>
                  </div>
                )}

                {/* Confirmed State Update Box (Differentiated from suggestions) */}
                {msg.updatedDataSummary && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-emerald-200 text-[11.5px] text-emerald-800 font-mono leading-tight whitespace-pre-line shadow-xs">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Confirmed State Update</span>
                    </div>
                    {msg.updatedDataSummary}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>

              {/* Quick Prompt Suggestions */}
              {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                  {msg.suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendChatMessage(prompt)}
                      className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-blue-700 font-semibold shadow-2xs transition-all text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 max-w-[75%] text-slate-600">
            <Bot className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-xs font-medium">Alexa is planning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer & Voice Controls */}
      <div className="p-3.5 border-t border-slate-200/80 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`p-2.5 rounded-xl border transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isListening
                ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/30 animate-pulse'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border-slate-200'
            }`}
            title={isListening ? 'Click to stop listening' : 'Click to speak to Alexa assistant'}
            aria-label={isListening ? 'Stop voice recognition' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder='Try: "Plan birthday for 12, budget ₹5000", "Add sparkling water"...'
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
            aria-label="Message your Alexa party planner"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputVal.trim() || isAiThinking}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white transition-all shrink-0 shadow-md shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 text-[10.5px] text-center text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>Alexa-inspired conversational planning • No continuous wake-word listening</span>
        </div>
      </div>
    </div>
  );
};
