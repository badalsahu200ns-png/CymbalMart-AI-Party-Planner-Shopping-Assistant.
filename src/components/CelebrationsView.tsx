import React from 'react';
import { useParty } from '../context/PartyContext';
import { CELEBRATION_CATEGORIES } from '../data/celebrationCategories';
import { CelebrationCategory } from '../types';
import { PartyPopper, Users, IndianRupee, ArrowRight, Sparkles } from 'lucide-react';

export const CelebrationsView: React.FC = () => {
  const { createNewEvent, setCurrentTab } = useParty();

  const handleLaunchCategory = (cat: CelebrationCategory) => {
    createNewEvent({
      name: `${cat.title} Celebration`,
      type: cat.defaultPartyType,
      theme: cat.suggestedTheme,
      budget: cat.defaultBudget,
      guestCount: cat.defaultGuests,
    });
    setCurrentTab('planning');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <PartyPopper className="w-3.5 h-3.5" />
          <span>Occasions &amp; Themes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Celebrations Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Choose from curated celebration archetypes with tailored timelines, budgets, and shopping inventories.
        </p>
      </section>

      {/* Grid of 6 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CELEBRATION_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                src={cat.imageUrl}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white shadow-xs">
                  {cat.badge}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-lg font-bold drop-shadow-sm leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/90 drop-shadow-sm truncate">
                  {cat.tagline}
                </p>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cat.description}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 mb-4">
                  <span className="font-bold text-slate-900">Recommended Theme: </span>
                  {cat.suggestedTheme}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {cat.defaultGuests} guests
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    ₹{(cat.defaultBudget / 1000).toFixed(0)}k
                  </span>
                </div>

                <button
                  onClick={() => handleLaunchCategory(cat)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Start Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
