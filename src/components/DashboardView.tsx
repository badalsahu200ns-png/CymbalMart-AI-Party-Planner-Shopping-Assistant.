import React from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency, formatTime12h } from '../utils/calculations';
import {
  Sparkles,
  Users,
  ShoppingCart,
  IndianRupee,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Mail,
  ShieldAlert,
  Bot,
  ExternalLink,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    activeEvent,
    setCurrentTab,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    guestMetrics,
    reminderInfo,
    partyAnalysis,
    setIsAssistantOpen,
  } = useParty();

  const activeItems = activeEvent.shoppingItems.filter((i) => !i.isRemoved);
  const budgetProgressPercent = Math.min(100, Math.round((totalShoppingCost / (activeEvent.budget || 1)) * 100));

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/15 p-6 sm:p-8">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs border border-white/30">
                {activeEvent.type}
              </span>
              <span className="text-xs text-blue-100 font-medium">
                Created {new Date(activeEvent.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              {activeEvent.name}
            </h1>
            <p className="text-sm text-blue-50 max-w-2xl leading-relaxed">
              Theme: <span className="text-white font-semibold">{activeEvent.theme}</span> • Target: <span className="text-white font-semibold">{activeEvent.guestCount} Guests</span> • Age Group: <span className="text-white font-semibold">{activeEvent.ageGroup}</span> • Setting: <span className="text-white font-semibold">{activeEvent.isOutdoor ? 'Outdoor' : 'Indoor'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentTab('planner')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-xs font-bold text-white transition-all shadow-xs"
            >
              Edit Event
            </button>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs font-extrabold transition-all shadow-lg shadow-black/10"
            >
              <Bot className="w-4 h-4 text-blue-600" />
              <span>Ask Alexa Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget KPI */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Allocated Budget
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-black text-slate-900">
              {formatCurrency(totalShoppingCost)}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Budget: {formatCurrency(activeEvent.budget)} ({budgetProgressPercent}% used)
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, budgetProgressPercent)}%` }}
            />
          </div>
          <button
            onClick={() => setCurrentTab('budget')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 pt-1"
          >
            <span>Review Budget</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Guests KPI */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Guest RSVPs
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-black text-slate-900">
              {guestMetrics.confirmed} <span className="text-sm font-normal text-slate-500">Confirmed</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {guestMetrics.pending} Pending • {guestMetrics.maybe} Maybe • {guestMetrics.total} Total
            </div>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-slate-100">
            <div
              className="bg-emerald-500"
              style={{ width: `${guestMetrics.total ? (guestMetrics.confirmed / guestMetrics.total) * 100 : 0}%` }}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${guestMetrics.total ? (guestMetrics.maybe / guestMetrics.total) * 100 : 0}%` }}
            />
          </div>
          <button
            onClick={() => setCurrentTab('guests')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 pt-1"
          >
            <span>Manage Guests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shopping Items KPI */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Shopping Checklist
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-black text-slate-900">
              {activeItems.length} <span className="text-sm font-normal text-slate-500">Items</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Across 9 shopping categories
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Single Source of Truth enabled
          </div>
          <button
            onClick={() => setCurrentTab('shopping')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 pt-1"
          >
            <span>View Shopping List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Completeness Score KPI */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-5 space-y-3 hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Party Readiness
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-display font-black text-slate-900">
              {partyAnalysis.score}% <span className="text-sm font-normal text-slate-500">Ready</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">
              {partyAnalysis.essentialMissing.length === 0 ? 'All essentials covered' : `${partyAnalysis.essentialMissing.length} essential items missing`}
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                partyAnalysis.score >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${partyAnalysis.score}%` }}
            />
          </div>
          <button
            onClick={() => setCurrentTab('final-review')}
            className="w-full flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 pt-1"
          >
            <span>Final Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Summaries (Venue & Schedule Summary + Shopping Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Venue & Schedule Summary Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Venue &amp; Logistics Summary</h2>
            </div>
            <button
              onClick={() => setCurrentTab('venue')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage Venue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div>
              <div className="text-xs text-slate-400 font-medium">Location</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{activeEvent.venue.name}</div>
              <div className="text-xs text-slate-600">{activeEvent.venue.address}, {activeEvent.venue.city} {activeEvent.venue.postalCode}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
              <div>
                <span className="text-slate-500">Date:</span>{' '}
                <strong className="text-slate-800">{activeEvent.eventDate}</strong>
              </div>
              <div>
                <span className="text-slate-500">Time:</span>{' '}
                <strong className="text-slate-800">{formatTime12h(activeEvent.startTime)} - {formatTime12h(activeEvent.endTime)}</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
              <span className="text-slate-500">1-Hour Alert:</span>{' '}
              <span className="text-amber-700 font-semibold">{reminderInfo.reminderTimeStr}</span> on {activeEvent.eventDate}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('venue')}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 text-center transition-colors"
            >
              Open Maps &amp; Directions
            </button>
            <button
              onClick={() => setCurrentTab('calendar')}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 text-center transition-colors"
            >
              View Schedule &amp; Sync
            </button>
          </div>
        </div>

        {/* Shopping Aisle Summary Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Shopping Overview</h2>
            </div>
            <button
              onClick={() => setCurrentTab('shopping')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Full List</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {activeItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {item.category} • {item.recommendedQuantity} {item.unit}
                  </div>
                </div>
                <div className="font-bold text-slate-800">
                  {formatCurrency(item.recommendedQuantity * item.estimatedUnitPrice)}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center justify-between text-xs">
            <span className="text-blue-900 font-medium">Total active shopping items:</span>
            <strong className="text-blue-700 text-sm font-bold">{formatCurrency(totalShoppingCost)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
