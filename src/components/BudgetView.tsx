import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency, SHOPPING_CATEGORIES } from '../utils/calculations';
import {
  IndianRupee,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  DollarSign,
  Edit2,
  Check,
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    activeEvent,
    updateActiveEvent,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    overBudgetAmount,
    categoryTotals,
    optimizationResult,
    applyOptimizationSuggestion,
    applyAllOptimizationSuggestions,
    addToast,
  } = useParty();

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(activeEvent.budget.toString());

  const handleBudgetSave = () => {
    const parsed = parseInt(budgetInput.replace(/,/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateActiveEvent({ budget: parsed });
      setIsEditingBudget(false);
      addToast(`Allocated budget updated to ${formatCurrency(parsed)}`, 'success');
    } else {
      addToast('Please enter a valid positive budget number.', 'error');
    }
  };

  const budgetUsagePercent = Math.min(150, Math.round((totalShoppingCost / (activeEvent.budget || 1)) * 100));

  return (
    <div className="space-y-6">
      {/* Header & Budget Setting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <IndianRupee className="w-6 h-6 text-amber-500" />
            <span>Budget &amp; Financial Health</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Canonical budget manager for "{activeEvent.name}". Real-time cost allocation and AI savings recommendations.
          </p>
        </div>

        {/* Budget Editor */}
        <div className="flex items-center gap-2">
          {isEditingBudget ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleBudgetSave}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                title="Save Budget"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setBudgetInput(activeEvent.budget.toString());
                setIsEditingBudget(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Budget Limit ({formatCurrency(activeEvent.budget)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Budget Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allocated */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Allocated Budget
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            {formatCurrency(activeEvent.budget)}
          </div>
          <div className="text-xs text-slate-500">
            Target event budget ceiling
          </div>
        </div>

        {/* Current Items Cost */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estimated Shopping Total
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            {formatCurrency(totalShoppingCost)}
          </div>
          <div className="text-xs text-slate-500">
            {budgetUsagePercent}% of total budget allocated
          </div>
        </div>

        {/* Balance Status */}
        <div
          className={`p-5 rounded-3xl border space-y-2 ${
            isOverBudget
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isOverBudget ? 'Over Budget Alert' : 'Available Surplus'}
            </span>
            {isOverBudget ? (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black">
            {isOverBudget
              ? `-${formatCurrency(overBudgetAmount)}`
              : formatCurrency(remainingBudget)}
          </div>
          <div className="text-xs opacity-80">
            {isOverBudget
              ? 'Review AI suggestions below to bring event under budget.'
              : 'Spending is safely within planned limits.'}
          </div>
        </div>
      </div>

      {/* Visual Budget Progress Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600">Budget Consumption</span>
          <span className={isOverBudget ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
            {budgetUsagePercent}%
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 ${
              isOverBudget ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-emerald-500'
            }`}
            style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>₹0</span>
          <span>Target: {formatCurrency(activeEvent.budget)}</span>
        </div>
      </div>

      {/* AI Budget Optimizer Suggestions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                AI Budget Optimizer Suggestions
              </h2>
              <p className="text-xs text-slate-600">
                Potential Savings: <strong className="text-emerald-700 font-bold">{formatCurrency(optimizationResult.totalPotentialSavings)}</strong> across {optimizationResult.suggestions.length} items.
              </p>
            </div>
          </div>

          {optimizationResult.suggestions.length > 0 && (
            <button
              onClick={applyAllOptimizationSuggestions}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
            >
              Apply All ({formatCurrency(optimizationResult.totalPotentialSavings)} Savings)
            </button>
          )}
        </div>

        {optimizationResult.suggestions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Your shopping list is already lean and optimized! No high-cost redundancies detected.</span>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {optimizationResult.suggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sug.itemName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Save {formatCurrency(sug.estimatedSavings)}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      Action: {sug.suggestedAction}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{sug.reason}</p>
                </div>

                <button
                  onClick={() => applyOptimizationSuggestion(sug.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0"
                >
                  Apply Recommendation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Breakdown Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Expenditure by Shopping Category</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHOPPING_CATEGORIES.map((cat) => {
            const cost = categoryTotals[cat] || 0;
            const pct = totalShoppingCost > 0 ? Math.round((cost / totalShoppingCost) * 100) : 0;

            return (
              <div
                key={cat}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{cat}</div>
                  <div className="text-[11px] text-slate-500">{pct}% of total items</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{formatCurrency(cost)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
