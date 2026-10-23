import React from 'react';
import { useParty } from '../context/PartyContext';
import { NavigationTab } from '../types';
import {
  Sparkles,
  CalendarDays,
  CheckSquare,
  PartyPopper,
  ShoppingCart,
  Store,
  Wallet,
  BarChart3,
  Settings,
  MessageSquarePlus,
  Bot,
  ExternalLink,
  Film,
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

interface SidebarNavProps {
  onOpenWelcome?: () => void;
  onOpenShowcase?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onOpenWelcome, onOpenShowcase }) => {
  const {
    currentTab,
    setCurrentTab,
    activeEvent,
    events,
    totalShoppingCost,
    partyAnalysis,
    setIsAssistantOpen,
  } = useParty();

  const activeItemCount = activeEvent.shoppingItems.filter((i) => !i.isRemoved).length;

  // The 10 official sidebar navigation items from the reference specification
  const navItems: NavItem[] = [
    {
      id: 'my-hub',
      label: 'My Hub',
      icon: Sparkles,
      badge: 'AI Start',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'events',
      label: 'Events',
      icon: CalendarDays,
      badge: events.length,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'planning',
      label: 'Planning',
      icon: CheckSquare,
      badge: 'Workspace',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'celebrations',
      label: 'Celebrations',
      icon: PartyPopper,
      badge: '6 Types',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: ShoppingCart,
      badge: activeItemCount,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: Store,
      badge: 'Curated',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: Wallet,
      badge: `₹${Math.round(totalShoppingCost / 1000)}k`,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      badge: `${partyAnalysis.score}%`,
      badgeColor: partyAnalysis.score >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'feedback',
      label: 'Send Feedback',
      icon: MessageSquarePlus,
    },
  ];

  // Helper to map legacy active tab to matching new tab
  const isNavActive = (itemId: NavigationTab): boolean => {
    if (currentTab === itemId) return true;
    if (itemId === 'my-hub' && currentTab === 'dashboard') return true;
    if (itemId === 'planning' && (currentTab === 'planner' || currentTab === 'guests' || currentTab === 'invitations' || currentTab === 'calendar')) return true;
    if (itemId === 'budgets' && currentTab === 'budget') return true;
    if (itemId === 'reports' && currentTab === 'final-review') return true;
    if (itemId === 'suppliers' && currentTab === 'venue') return true;
    return false;
  };

  return (
    <aside className="w-full md:w-64 bg-white/95 md:border-r border-slate-200/80 p-3 sm:p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
      <div className="flex md:flex-col gap-1 w-full">
        <div className="hidden md:flex items-center justify-between px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          <span>Main Navigation</span>
          <span className="text-[10px] text-emerald-600 font-bold">10 Hubs</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavActive(item.id);

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap md:whitespace-normal group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Showcase, Assistant & Creator Link (Desktop) */}
      <div className="hidden md:flex flex-col gap-2.5 pt-4 mt-4 border-t border-slate-200/80">
        {/* 10-Second Showcase Pill Button */}
        {onOpenShowcase && (
          <button
            onClick={onOpenShowcase}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold shadow-2xs transition-all group"
          >
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>10s Product Video Demo</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-extrabold uppercase">
              Play
            </span>
          </button>
        )}

        {/* Alexa AI Assistant Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-slate-50 to-teal-50/40 border border-emerald-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Alexa Voice AI</span>
            </div>
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-teal-500 rounded-full animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-emerald-600 rounded-full animate-pulse delay-150" />
            </div>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight mb-2">
            Speak naturally to plan party timelines &amp; supplies.
          </p>
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
          >
            <span>Talk to Voice AI</span>
          </button>
        </div>

        {/* Creator Links */}
        <div className="space-y-1">
          <a
            href="https://badalsahu200ns-png.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
            title="Portfolio of Badal Kumar Sahu"
          >
            <span>Badal Kumar Sahu (Portfolio)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="https://www.linkedin.com/in/badalsahu200ns"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
            title="LinkedIn of Badal Kumar Sahu"
          >
            <span>Creator LinkedIn</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </aside>
  );
};
