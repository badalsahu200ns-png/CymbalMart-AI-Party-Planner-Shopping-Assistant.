import React from 'react';
import { useParty } from '../context/PartyContext';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingCart,
  IndianRupee,
  Users,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Bot,
  ExternalLink,
  SlidersHorizontal,
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
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ onOpenWelcome }) => {
  const {
    currentTab,
    setCurrentTab,
    activeEvent,
    guestMetrics,
    totalShoppingCost,
    partyAnalysis,
    setIsAssistantOpen,
  } = useParty();

  const activeItemCount = activeEvent.shoppingItems.filter((i) => !i.isRemoved).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'planner',
      label: 'Party Planner',
      icon: Sparkles,
      badge: 'Creator',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'shopping',
      label: 'Shopping List',
      icon: ShoppingCart,
      badge: activeItemCount,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: IndianRupee,
      badge: `₹${Math.round(totalShoppingCost / 1000)}k`,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'guests',
      label: 'Guest List',
      icon: Users,
      badge: `${guestMetrics.confirmed}/${guestMetrics.total}`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: Mail,
    },
    {
      id: 'venue',
      label: 'Venue',
      icon: MapPin,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
    },
    {
      id: 'final-review',
      label: 'Final Review',
      icon: CheckCircle2,
      badge: `${partyAnalysis.score}%`,
      badgeColor: partyAnalysis.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white/80 md:border-r border-slate-200/80 p-3 sm:p-4 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-x-visible">
      <div className="flex md:flex-col gap-1 w-full">
        <div className="hidden md:flex items-center justify-between px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          <span>Navigation</span>
          <span className="text-[10px] text-blue-600 font-bold">Canonical</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap md:whitespace-normal group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
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

      {/* Bottom Alexa Companion Card & Creator Link (Desktop) */}
      <div className="hidden md:flex flex-col gap-3 pt-4 mt-4 border-t border-slate-200/80">
        {/* Alexa AI Assistant Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 border border-blue-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Alexa Planner</span>
            </div>
            {/* Mini sound wave animation */}
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-0.5 bg-blue-500 rounded-full wave-bar-1" />
              <span className="w-0.5 bg-purple-500 rounded-full wave-bar-2" />
              <span className="w-0.5 bg-pink-500 rounded-full wave-bar-3" />
            </div>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight mb-2.5">
            Voice &amp; conversational planning ready for your birthday.
          </p>
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors"
          >
            <span>Talk to Alexa</span>
          </button>
        </div>

        {/* Planning Mode & Creator Links */}
        <div className="space-y-1">
          {onOpenWelcome && (
            <button
              onClick={onOpenWelcome}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors text-left"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Switch Planning Mode</span>
            </button>
          )}

          <a
            href="/creator.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <span>About Creator (Badal)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </aside>
  );
};
