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
  ExternalLink,
  LogOut,
  UserCheck,
  Search,
  Bell,
  Film,
  Sparkles,
} from 'lucide-react';

interface NavbarHeaderProps {
  onOpenWelcome?: () => void;
  onOpenShowcase?: () => void;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({ onOpenWelcome, onOpenShowcase }) => {
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
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('shop') || q.includes('cake') || q.includes('drink') || q.includes('food') || q.includes('buy')) {
      setCurrentTab('shopping');
    } else if (q.includes('supplier') || q.includes('cater') || q.includes('venue') || q.includes('dj') || q.includes('photo')) {
      setCurrentTab('suppliers');
    } else if (q.includes('budget') || q.includes('cost') || q.includes('save') || q.includes('spend')) {
      setCurrentTab('budgets');
    } else if (q.includes('report') || q.includes('summary') || q.includes('analytic')) {
      setCurrentTab('reports');
    } else if (q.includes('plan') || q.includes('task') || q.includes('guest')) {
      setCurrentTab('planning');
    } else {
      setCurrentTab('celebrations');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Event Selector */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <BirthdayLogo
            variant="compact"
            onClick={() => setCurrentTab('my-hub')}
          />

          {/* Active Event Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsEventMenuOpen(!isEventMenuOpen)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Select active celebration"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="max-w-[110px] sm:max-w-[160px] truncate font-bold text-slate-900">
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
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
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
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentTab('events');
                      setIsEventMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-700 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create / Manage Celebrations</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar (Matching Reference Header) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-sm relative mx-2"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, items, suppliers..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100/90 border border-slate-200/90 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all"
          />
        </form>

        {/* Right Section: Indicators & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Budget Quick Indicator */}
          <button
            onClick={() => setCurrentTab('budgets')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              isOverBudget
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
            title="View budget breakdown"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="font-bold">{formatCurrency(totalShoppingCost)}</span>
            <span className="text-slate-400 text-[11px]">/ {formatCurrency(activeEvent.budget)}</span>
          </button>

          {/* 10s Showcase Video Trigger Button */}
          {onOpenShowcase && (
            <button
              onClick={onOpenShowcase}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-2xs"
              title="Watch 10-second reference product journey"
            >
              <Film className="w-3.5 h-3.5 text-emerald-600" />
              <span>Watch Demo (10s)</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {isNotifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsNotifOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">2 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <p className="font-semibold text-slate-900">Guest RSVP Confirmed</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">Rahul Verma confirmed attendance (+1 guest).</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="font-semibold text-slate-900">Budget Saving Tip</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">Switching to bulk tableware saves ₹875.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Universal Alexa Voice Trigger */}
          <button
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isAssistantOpen
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25'
            }`}
            title="Open Alexa Voice AI Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="User account menu"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200 text-xs font-bold">
                  {user?.name?.[0] || 'B'}
                </div>
              )}
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="p-2.5 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900 truncate">Badal Kumar Sahu</div>
                  <div className="text-[11px] text-slate-500 truncate">Creator &amp; Architect</div>
                </div>

                <div className="mt-2 space-y-1">
                  <a
                    href="https://badalsahu200ns-png.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <span>Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/badalsahu200ns"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="https://github.com/badalsahu200ns-png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="/creator.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border-t border-slate-100 pt-2 mt-1"
                  >
                    <span>Creator Profile Page</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
