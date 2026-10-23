import React, { useEffect, useRef } from 'react';
import { useParty } from '../context/PartyContext';
import { BirthdayLogo } from './BirthdayLogo';
import { Bot, SlidersHorizontal, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomePlanningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlexaPlan: () => void;
  onSelectManualPlan: () => void;
}

export const WelcomePlanningDialog: React.FC<WelcomePlanningDialogProps> = ({
  isOpen,
  onClose,
  onSelectAlexaPlan,
  onSelectManualPlan,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const alexaButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus primary action when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        alexaButtonRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-dialog-title"
      aria-describedby="welcome-dialog-subtitle"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-9 text-slate-900 overflow-hidden transform animate-in zoom-in-95 duration-200"
      >
        {/* Top Gradient Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Close welcome dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Logo */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <BirthdayLogo variant="icon" className="w-16 h-16 mb-1" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Smart Event &amp; Shopping Assistant</span>
          </div>
          <h2
            id="welcome-dialog-title"
            className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900"
          >
            Welcome to CymbalMart PLANNER – Birthday
          </h2>
          <p
            id="welcome-dialog-subtitle"
            className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed"
          >
            Your personal birthday-planning assistant. How would you like to plan today?
          </p>
        </div>

        {/* Two Equal Choices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
          {/* Option A: Let Alexa Assist Me */}
          <div className="group relative flex flex-col justify-between p-6 rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/50 via-white to-indigo-50/30 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                  Option A • Conversational
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  Let Alexa Assist Me
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tell us about your celebration, and your AI assistant will help organize the party, suggest shopping items, calculate your budget, and guide you through the planning process.
              </p>
            </div>

            <button
              ref={alexaButtonRef}
              onClick={onSelectAlexaPlan}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span>Let Alexa Plan for Me</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Option B: I'll Do It Myself */}
          <div className="group relative flex flex-col justify-between p-6 rounded-2xl border border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg hover:shadow-slate-500/5 transition-all">
            <div className="space-y-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Option B • Direct Control
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  I'll Do It Myself
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                I prefer to control every detail. Create my party and shopping list myself.
              </p>
            </div>

            <button
              onClick={onSelectManualPlan}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              <span>Plan Manually</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Trust & Transparency Note */}
        <div className="flex items-center gap-2 text-center justify-center text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>You can switch between Alexa assistance and manual planning at any time.</span>
        </div>
      </div>
    </div>
  );
};
