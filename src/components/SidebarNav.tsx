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
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

export const SidebarNav: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    activeEvent,
    guestMetrics,
    totalShoppingCost,
    partyAnalysis,
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
      badge: 'Canonical',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'shopping',
      label: 'Shopping List',
      icon: ShoppingCart,
      badge: activeItemCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: IndianRupee,
      badge: `₹${Math.round(totalShoppingCost / 1000)}k`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'guests',
      label: 'Guest List',
      icon: Users,
      badge: `${guestMetrics.confirmed}/${guestMetrics.total}`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
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
      badgeColor: partyAnalysis.score >= 80 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/60 md:border-r border-slate-800 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-x-visible">
      <div className="flex md:flex-col gap-1 w-full">
        <div className="hidden md:block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Canonical Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap md:whitespace-normal group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`hidden md:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md border ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
