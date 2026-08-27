import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency, formatTime12h } from '../utils/calculations';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Printer,
  ShoppingBag,
  IndianRupee,
  Users,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export const FinalReviewView: React.FC = () => {
  const {
    activeEvent,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    guestMetrics,
    reminderInfo,
    partyAnalysis,
    addMissingItemToShoppingList,
    finalizeEvent,
    setCurrentTab,
    addToast,
  } = useParty();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const activeItems = activeEvent.shoppingItems.filter((i) => !i.isRemoved);

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      finalizeEvent();
      addToast('CymbalMart order prepared & reserved successfully!', 'success');
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>Final Review & Checkout Preparation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Canonical final confirmation for "{activeEvent.name}". Readiness audit and CymbalMart order staging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Master Plan</span>
          </button>
        </div>
      </div>

      {/* Completeness Score Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl border ${
                partyAnalysis.score >= 80
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {partyAnalysis.score}%
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Party Readiness Health Check</h2>
              <p className="text-xs text-slate-400">
                {partyAnalysis.score >= 90
                  ? 'Your celebration plan is airtight and fully provisioned!'
                  : 'Review missing recommendations below to ensure complete host preparedness.'}
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
            {partyAnalysis.essentialMissing.length === 0 ? 'All Essentials Met' : `${partyAnalysis.essentialMissing.length} Needs Attention`}
          </div>
        </div>

        {/* Missing Essentials Recommendations */}
        {partyAnalysis.essentialMissing.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Recommended Additions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {partyAnalysis.essentialMissing.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-400">{item.reason}</div>
                  </div>
                  <button
                    onClick={() => addMissingItemToShoppingList(item)}
                    className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/60 text-blue-200 text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Master Event Summary Dossier */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Master Event Plan Summary</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Event Title</span>
            <div className="font-bold text-white text-sm">{activeEvent.name}</div>
            <div className="text-[11px] text-slate-400">{activeEvent.type} • {activeEvent.theme}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Date & Time</span>
            <div className="font-bold text-white text-sm">{activeEvent.eventDate}</div>
            <div className="text-[11px] text-slate-400">{formatTime12h(activeEvent.startTime)} - {formatTime12h(activeEvent.endTime)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Venue Location</span>
            <div className="font-bold text-white text-sm truncate">{activeEvent.venue.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{activeEvent.venue.city}, {activeEvent.venue.state}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Financial & RSVP</span>
            <div className="font-bold text-white text-sm">{formatCurrency(totalShoppingCost)} Total</div>
            <div className="text-[11px] text-slate-400">{guestMetrics.confirmed} Confirmed / {guestMetrics.total} Guests</div>
          </div>
        </div>

        {/* Shopping Items Quick Roster */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">Staged Shopping Items ({activeItems.length})</span>
            <span className="text-white">{formatCurrency(totalShoppingCost)}</span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 text-xs"
              >
                <div className="truncate">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    ({item.recommendedQuantity} {item.unit})
                  </span>
                </div>
                <div className="font-bold text-white ml-3 shrink-0">
                  {formatCurrency(item.recommendedQuantity * item.estimatedUnitPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CymbalMart Checkout Preparation Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">CymbalMart Store Cart Staging</h2>
            <p className="text-xs text-slate-400">
              One-click checkout preparation for grocery delivery, cake orders, and party tableware supplies.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-slate-400">Estimated Order Total</div>
            <div className="text-2xl font-display font-black text-emerald-400">
              {formatCurrency(totalShoppingCost)}
            </div>
            <div className="text-[11px] text-slate-400">
              Includes {activeItems.length} curated aisle items ready for store delivery to {activeEvent.venue.name}.
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {checkoutComplete ? (
              <div className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Order Staged & Ready</span>
              </div>
            ) : (
              <button
                onClick={handleSimulateCheckout}
                disabled={isCheckingOut || activeItems.length === 0}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isCheckingOut ? 'Preparing Cart...' : 'Prepare CymbalMart Checkout'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
