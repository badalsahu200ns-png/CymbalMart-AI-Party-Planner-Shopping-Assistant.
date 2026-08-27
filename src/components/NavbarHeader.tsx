import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency } from '../utils/calculations';
import {
  Sparkles,
  Bot,
  Calendar,
  IndianRupee,
  Users,
  ChevronDown,
  PlusCircle,
  PartyPopper,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  UserCheck,
} from 'lucide-react';

export const NavbarHeader: React.FC = () => {
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
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Event Selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30 group-hover:scale-105 transition-transform">
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg tracking-tight text-white">
                  Cymbal<span className="text-blue-400">Mart</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  AI Planner
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Smart Event & Shopping Assistant
              </p>
            </div>
          </button>

          {/* Active Event Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="max-w-[140px] sm:max-w-[200px] truncate font-medium">
                {activeEvent.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isEventMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsEventMenuOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        evt.id === activeEvent.id
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-100 truncate">{evt.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {evt.eventDate} • {evt.guestCount} guests
                        </div>
                      </div>
                      {evt.id === activeEvent.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setCurrentTab('planner');
                      setIsEventMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Another Party</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Event Metrics Badges */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          {/* Budget pill */}
          <button
            onClick={() => setCurrentTab('budget')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
              isOverBudget
                ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="font-semibold">{formatCurrency(totalShoppingCost)}</span>
            <span className="text-slate-400">/ {formatCurrency(activeEvent.budget)}</span>
            {isOverBudget ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                OVER
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                ₹{remainingBudget.toLocaleString('en-IN')} left
              </span>
            )}
          </button>

          {/* Guests pill */}
          <button
            onClick={() => setCurrentTab('guests')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>
              <strong className="text-white">{guestMetrics.confirmed}</strong>/{guestMetrics.total} Confirmed
            </span>
          </button>

          {/* Date pill */}
          <button
            onClick={() => setCurrentTab('calendar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>{activeEvent.eventDate}</span>
          </button>
        </div>

        {/* Action Controls & AI Drawer Button */}
        <div className="flex items-center gap-2.5">
          {/* Universal AI Assistant Controller Trigger */}
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isAssistantOpen
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-blue-500/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20'
            }`}
          >
            <Bot className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">AI Controller</span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-700 transition-all focus:outline-none"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700 text-xs font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
              )}
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                {user ? (
                  <div className="p-2 border-b border-slate-800">
                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  </div>
                ) : (
                  <div className="p-2 border-b border-slate-800 text-xs text-slate-400">
                    Not signed in
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  {user ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-slate-800 transition-colors"
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
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-400 hover:bg-slate-800 transition-colors"
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
