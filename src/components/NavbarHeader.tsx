import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency } from '../utils/calculations';
import { BirthdayLogo } from './BirthdayLogo';
import {
  Bot,
  Calendar,
  IndianRupee,
  Users,
  ChevronDown,
  PlusCircle,
  CheckCircle2,
  SlidersHorizontal,
  ExternalLink,
  LogOut,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface NavbarHeaderProps {
  onOpenWelcome?: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({ onOpenWelcome }) => {
  const {
    activeEvent,
    events,
    setActiveEventId,
    setCurrentTab,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    guestMetrics,
    user,
    signInWithGoogle,
    signOut,
    setIsAssistantOpen,
    isAssistantOpen,
  } = useParty();

  const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Event Selector */}
        <div className="flex items-center gap-4">
          <BirthdayLogo
            variant="compact"
            onClick={() => setCurrentTab('dashboard')}
          />

          {/* Active Event Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Select active party event"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[130px] sm:max-w-[180px] truncate font-bold text-slate-900">
                {activeEvent.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isEventMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsEventMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Active Party Plans ({events.length})
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        setActiveEventId(evt.id);
                        setIsEventMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                        evt.id === activeEvent.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{evt.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {evt.eventDate} • {evt.guestCount} guests
                        </div>
                      </div>
                      {evt.id === activeEvent.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentTab('planner');
                      setIsEventMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-xs font-bold text-blue-600 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Celebration</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Live Indicators (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          {/* Budget Quick Indicator */}
          <button
            onClick={() => setCurrentTab('budget')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors shadow-2xs ${
              isOverBudget
                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
            }`}
            title="View budget breakdown"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="font-bold">{formatCurrency(totalShoppingCost)}</span>
            <span className="text-slate-400">/ {formatCurrency(activeEvent.budget)}</span>
            {isOverBudget ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-200 text-red-800 font-extrabold">
                OVER
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 font-extrabold">
                ₹{remainingBudget.toLocaleString('en-IN')} left
              </span>
            )}
          </button>

          {/* Guests pill */}
          <button
            onClick={() => setCurrentTab('guests')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            title="View confirmed guests"
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>
              <strong className="text-slate-900">{guestMetrics.confirmed}</strong>/{guestMetrics.total} Confirmed
            </span>
          </button>

          {/* Date pill */}
          <button
            onClick={() => setCurrentTab('calendar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            title="View calendar schedule"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{activeEvent.eventDate}</span>
          </button>
        </div>

        {/* Action Controls & AI Assistant Button */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Welcome / Mode Switcher */}
          {onOpenWelcome && (
            <button
              onClick={onOpenWelcome}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              title="Switch between Alexa assistance and manual planning"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>Planning Mode</span>
            </button>
          )}

          {/* Creator Contact Button (Section 7) */}
          <a
            href="/creator.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs"
            title="Learn about creator Badal Kumar Sahu"
          >
            <span className="hidden md:inline">About Creator</span>
            <span className="md:hidden">Creator</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Universal Alexa AI Assistant Controller Trigger */}
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isAssistantOpen
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-blue-500/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/25 hover:shadow-lg'
            }`}
            title="Open Alexa-Inspired Party Planning Assistant"
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Alexa Assistant</span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="User account menu"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 text-xs font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                {user ? (
                  <div className="p-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  </div>
                ) : (
                  <div className="p-2.5 border-b border-slate-100 text-xs text-slate-500">
                    Not signed in
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  <a
                    href="/creator.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span>About Creator (Badal Kumar Sahu)</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        signInWithGoogle();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Sign In with Google</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
