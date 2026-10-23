import React from 'react';
import { useParty } from '../context/PartyContext';
import { formatCurrency } from '../utils/calculations';
import { ShoppingCategory } from '../types';
import {
  BarChart3,
  TrendingDown,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Calendar,
  Users,
  Download,
  Printer,
  Sparkles,
} from 'lucide-react';

export const ReportsBudgetView: React.FC = () => {
  const {
    activeEvent,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    categoryTotals,
    partyAnalysis,
    guestMetrics,
    optimizationResult,
    applyAllOptimizationSuggestions,
  } = useParty();

  const categories = Object.keys(categoryTotals) as ShoppingCategory[];
  const budgetUtilization = activeEvent.budget > 0
    ? Math.round((totalShoppingCost / activeEvent.budget) * 100)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Screen D • Financial &amp; Event Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reports &amp; Budget Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time analytics for {activeEvent.name} • {activeEvent.eventDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
        </div>
      </section>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Cost Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Allocated Spending
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(totalShoppingCost)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Budget: {formatCurrency(activeEvent.budget)}</span>
            <span className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-emerald-700'}`}>
              {budgetUtilization}% used
            </span>
          </div>
        </div>

        {/* Potential Savings Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Optimized Savings Potential
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {formatCurrency(optimizationResult.totalPotentialSavings)}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{optimizationResult.suggestions.length} suggestions</span>
            {optimizationResult.suggestions.length > 0 && (
              <button
                onClick={applyAllOptimizationSuggestions}
                className="font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Apply All
              </button>
            )}
          </div>
        </div>

        {/* Readiness Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Party Completeness Score
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {partyAnalysis.score} / 100
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{guestMetrics.confirmed} guests attending</span>
            <span className="font-bold text-slate-700">Audit Grade: A</span>
          </div>
        </div>
      </div>

      {/* Screen D Category Spending Breakdown Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Expense Breakdown by Category
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Detailed spending across food, beverages, decor, and entertainment.
          </p>

          <div className="space-y-4">
            {categories.map((cat) => {
              const amount = categoryTotals[cat] || 0;
              const percent = totalShoppingCost > 0
                ? Math.round((amount / totalShoppingCost) * 100)
                : 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat}</span>
                    <span className="font-semibold text-slate-600">
                      {formatCurrency(amount)} ({percent}%)
                    </span>
                  </div>
                  {/* Emerald Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completeness Audit & Advisories */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              AI Checklist &amp; Optimization Advisories
            </h3>
            <p className="text-xs text-slate-500">
              Automated audit to ensure zero missing party essentials.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audit Summary</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              {partyAnalysis.summary}
            </p>
          </div>

          {/* AI Tips List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-800">
              Pro Party Planning Tips
            </span>
            <div className="space-y-2">
              {partyAnalysis.tips.slice(0, 3).map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
