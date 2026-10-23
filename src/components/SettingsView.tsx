import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { Settings, User, Bell, Shield, Palette, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user } = useParty();
  const [currency, setCurrency] = useState('INR (₹)');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Settings &amp; Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage currency standards, AI assistant configurations, and alert triggers.
        </p>
      </section>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" />
            <span>User Profile &amp; Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Planner Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || 'Badal Kumar Sahu'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || 'badalsahu200ns@gmail.com'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Currency & Regional Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span>Regional &amp; Currency Format</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
            >
              <option value="INR (₹)">Indian Rupee (₹ INR)</option>
              <option value="USD ($)">US Dollar ($ USD)</option>
              <option value="EUR (€)">Euro (€ EUR)</option>
              <option value="GBP (£)">British Pound (£ GBP)</option>
            </select>
          </div>
        </div>

        {/* Notifications & AI Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Notifications &amp; AI Alerts</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={budgetWarnings}
                onChange={(e) => setBudgetWarnings(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-medium">
                Notify immediately when shopping total exceeds 90% of budget
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-medium">
                Receive guest RSVP status summaries via email
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </form>
    </div>
  );
};
