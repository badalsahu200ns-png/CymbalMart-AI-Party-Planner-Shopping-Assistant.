import React, { useState, useRef, useEffect } from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency } from '../utils/calculations';
import {
  startSpeechRecognition,
  stopSpeechRecognition,
  isSpeechRecognitionSupported,
  stopSpeaking,
} from '../utils/speechService';
import { AssistantLifecycleState } from '../types';
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
  VolumeX,
  IndianRupee,
  Users,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    assistantState,
    setAssistantState,
    planningSession,
    startAlexaPlanningSession,
    isVoiceOutputEnabled,
    setIsVoiceOutputEnabled,
    chatMessages,
    sendChatMessage,
    isAiThinking,
    activeEvent,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
  } = useParty();

  const [inputVal, setInputVal] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAssistantOpen) {
      scrollToBottom();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // When drawer is closed, stop speech and recognition
      stopSpeechRecognition();
      stopSpeaking();
    }
  }, [chatMessages, isAssistantOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAssistantOpen) {
        setIsAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAssistantOpen, setIsAssistantOpen]);

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

    if (!isSpeechRecognitionSupported()) {
      setVoiceError('Speech recognition is not supported in this browser. Please use text input below.');
      return;
    }

    if (assistantState === 'listening') {
      stopSpeechRecognition();
      setAssistantState('awaiting_answer');
      return;
    }

    setAssistantState('requesting_permission');

    const started = startSpeechRecognition({
      onStart: () => {
        setAssistantState('listening');
        setVoiceError(null);
      },
      onResult: (transcript: string, isFinal: boolean) => {
        if (transcript) {
          setInputVal(transcript);
          if (isFinal) {
            setAssistantState('processing');
            sendChatMessage(transcript);
          }
        }
      },
      onError: (errMsg: string) => {
        setVoiceError(errMsg);
        setAssistantState('error');
      },
      onEnd: () => {
        setAssistantState('awaiting_answer');
      },
    });

    if (!started) {
      setAssistantState('idle');
    }
  };

  const handleToggleAudioOutput = () => {
    if (isVoiceOutputEnabled) {
      stopSpeaking();
      setIsVoiceOutputEnabled(false);
    } else {
      setIsVoiceOutputEnabled(true);
    }
  };

  if (!isAssistantOpen) return null;

  // Active items count
  const activeItemsCount = activeEvent.shoppingItems.filter((i) => !i.isRemoved).length;

  // Assistant state description helper
  const getStatePill = () => {
    switch (assistantState) {
      case 'requesting_permission':
        return {
          label: 'Requesting Mic Access...',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'listening':
        return {
          label: 'Listening... Speak now',
          color: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
        };
      case 'processing':
        return {
          label: 'Thinking & Planning...',
          color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        };
      case 'speaking':
        return {
          label: 'Alexa is Speaking...',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
        };
      case 'executing_action':
        return {
          label: 'Applying Changes...',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'completed':
        return {
          label: 'Plan Ready • Editable',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'error':
        return {
          label: 'Voice Error • Use Text',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'awaiting_answer':
      default:
        return {
          label: 'Ready • Speak or type',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
        };
    }
  };

  const statePill = getStatePill();

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white/98 backdrop-blur-2xl border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right-5 duration-200 text-slate-900"
      role="region"
      aria-label="Alexa-Inspired Party Planning Voice Assistant"
    >
      {/* Drawer Header with Alexa Visual Identity */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/60">
        <div className="flex items-center gap-3">
          {/* Animated Alexa Voice Orb Icon with gradient */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 voice-orb-active">
            <Bot className="w-5 h-5 animate-pulse" />
            {assistantState === 'listening' && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Alexa Assistant</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200">
                  Voice AI
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[210px]">
              Active: {activeEvent.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Speech Audio Output Toggle */}
          <button
            onClick={handleToggleAudioOutput}
            className={`p-2 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isVoiceOutputEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
            }`}
            title={isVoiceOutputEnabled ? 'Mute Alexa voice output' : 'Enable Alexa voice output'}
            aria-label={isVoiceOutputEnabled ? 'Mute voice responses' : 'Unmute voice responses'}
          >
            {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset / New Session */}
          <button
            onClick={startAlexaPlanningSession}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Start new planning conversation"
            aria-label="Restart planning conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Close assistant drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Orb & Soundwave Hero Banner */}
      <div className="relative p-4 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/40 border-b border-slate-200/70 flex flex-col items-center text-center overflow-hidden">
        {/* Central Animated Voice Orb */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Ripple Waves */}
          {(assistantState === 'listening' || assistantState === 'speaking') && (
            <>
              <div className="absolute w-24 h-24 rounded-full bg-cyan-400/20 voice-ripple-wave" />
              <div
                className="absolute w-28 h-28 rounded-full bg-indigo-500/15 voice-ripple-wave"
                style={{ animationDelay: '0.6s' }}
              />
            </>
          )}

          {/* Core Orb */}
          <button
            onClick={handleToggleVoice}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 cursor-pointer ${
              assistantState === 'listening'
                ? 'bg-gradient-to-tr from-cyan-400 via-blue-600 to-pink-500 text-white scale-110 shadow-cyan-500/40 ring-4 ring-cyan-200'
                : assistantState === 'speaking'
                ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-500 text-white shadow-purple-500/30'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white hover:scale-105 shadow-blue-500/25'
            }`}
            title="Tap to speak"
            aria-label="Voice Assistant Orb. Tap to speak"
          >
            {assistantState === 'listening' ? (
              <Mic className="w-7 h-7 animate-pulse text-white" />
            ) : assistantState === 'speaking' ? (
              <Volume2 className="w-7 h-7 animate-bounce text-white" />
            ) : assistantState === 'processing' ? (
              <Bot className="w-7 h-7 animate-spin text-white" />
            ) : (
              <Bot className="w-7 h-7 text-white" />
            )}
          </button>
        </div>

        {/* Dynamic Soundwave Visualizer Bars */}
        <div className="flex items-end justify-center gap-1.5 h-6 my-1.5">
          <div
            className={`w-1 rounded-full bg-cyan-500 ${
              assistantState === 'listening' || assistantState === 'speaking' || assistantState === 'processing'
                ? 'wave-bar-1'
                : 'h-1.5'
            }`}
          />
          <div
            className={`w-1 rounded-full bg-blue-600 ${
              assistantState === 'listening' || assistantState === 'speaking' || assistantState === 'processing'
                ? 'wave-bar-2'
                : 'h-2'
            }`}
          />
          <div
            className={`w-1 rounded-full bg-purple-600 ${
              assistantState === 'listening' || assistantState === 'speaking' || assistantState === 'processing'
                ? 'wave-bar-3'
                : 'h-1.5'
            }`}
          />
          <div
            className={`w-1 rounded-full bg-pink-500 ${
              assistantState === 'listening' || assistantState === 'speaking' || assistantState === 'processing'
                ? 'wave-bar-4'
                : 'h-1'
            }`}
          />
        </div>

        {/* State Pill */}
        <div className="inline-flex items-center gap-1.5 mt-1">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${statePill.color}`}
          >
            {statePill.label}
          </span>
        </div>
      </div>

      {/* Voice Status Alert if error/warning */}
      {voiceError && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="flex-1 leading-tight">{voiceError}</span>
          <button
            onClick={() => setVoiceError(null)}
            className="text-amber-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Birthday Planning Summary Panel (Synchronized with Canonical State) */}
      <div className="border-b border-slate-200/80 bg-slate-50/80">
        <button
          onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100/80 transition-colors"
          aria-expanded={isSummaryExpanded}
          aria-label="Toggle live party plan summary"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Plan Summary</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white text-slate-600 border border-slate-200">
              Single Source of Truth
            </span>
          </div>
          {isSummaryExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isSummaryExpanded && (
          <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-xs">
            {/* Guests */}
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <Users className="w-3 h-3 text-indigo-600" />
                <span>Guests</span>
              </span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {activeEvent.guestCount}
              </div>
            </div>

            {/* Shopping Total */}
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                <ShoppingCart className="w-3 h-3 text-emerald-600" />
                <span>{activeItemsCount} Items</span>
              </span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {formatCurrency(totalShoppingCost)}
              </div>
            </div>

            {/* Remaining Budget */}
            <div
              className={`p-2 rounded-xl border shadow-2xs ${
                isOverBudget
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <span className="text-[10px] font-semibold uppercase flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                <span>Budget</span>
              </span>
              <div className="text-sm font-black mt-0.5 truncate">
                {isOverBudget
                  ? `Over ₹${Math.abs(remainingBudget)}`
                  : `₹${remainingBudget} left`}
              </div>
            </div>
          </div>
        )}
      </div>

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
                    : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200/90 shadow-xs'
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
                  <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-emerald-300 text-[11.5px] text-emerald-900 font-mono leading-tight whitespace-pre-line shadow-2xs">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
                      className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-blue-700 font-semibold shadow-2xs transition-all text-left cursor-pointer"
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
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 max-w-[75%] text-slate-600 animate-in fade-in">
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
            className={`p-2.5 rounded-xl border transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
              assistantState === 'listening'
                ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/30 animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-200'
            }`}
            title={
              assistantState === 'listening'
                ? 'Click to stop listening'
                : 'Click to speak to Alexa assistant (Microphone required)'
            }
            aria-label={
              assistantState === 'listening' ? 'Stop listening' : 'Start microphone voice input'
            }
          >
            {assistantState === 'listening' ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Text Input Alternative */}
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
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white transition-all shrink-0 shadow-md shadow-blue-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
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
