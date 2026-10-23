import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { CELEBRATION_CATEGORIES } from '../data/celebrationCategories';
import { CelebrationCategory } from '../types';
import { formatCurrency } from '../utils/calculations';
import {
  Sparkles,
  ArrowRight,
  Send,
  Calendar,
  Users,
  IndianRupee,
  CheckCircle2,
  Clock,
  ChevronRight,
  PartyPopper,
  Zap,
} from 'lucide-react';

export const CelebrationStartHub: React.FC = () => {
  const {
    activeEvent,
    createNewEvent,
    setCurrentTab,
    totalShoppingCost,
    guestMetrics,
    partyAnalysis,
    setIsAssistantOpen,
  } = useParty();

  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const samplePrompts = [
    '30th Birthday bash with 25 friends & DJ night',
    'Silver 25th Wedding Anniversary with elegant dinner',
    'Annual Corporate Tech Gala for 50 colleagues',
    'Outdoor Garden BBQ Family Reunion with lawn games',
  ];

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      // Create new event matching prompt
      const inputLower = promptInput.toLowerCase();
      let detectedType = activeEvent.type;
      let detectedBudget = 40000;
      let detectedTheme = promptInput;

      if (inputLower.includes('anniversary')) {
        detectedType = 'Anniversary';
        detectedBudget = 45000;
      } else if (inputLower.includes('gala') || inputLower.includes('corporate') || inputLower.includes('office')) {
        detectedType = 'Corporate Team Event';
        detectedBudget = 75000;
      } else if (inputLower.includes('family') || inputLower.includes('reunion') || inputLower.includes('bbq')) {
        detectedType = 'Outdoor BBQ / Picnic';
        detectedBudget = 30000;
      } else if (inputLower.includes('graduation')) {
        detectedType = 'Graduation Party';
        detectedBudget = 35000;
      } else if (inputLower.includes('retirement')) {
        detectedType = 'Custom Celebration';
        detectedBudget = 42000;
      } else {
        detectedType = 'Birthday Party';
        detectedBudget = 35000;
      }

      createNewEvent({
        name: promptInput.length > 40 ? promptInput.slice(0, 40) + '...' : promptInput,
        type: detectedType,
        theme: detectedTheme,
        budget: detectedBudget,
      });

      setIsGenerating(false);
      setPromptInput('');
      setCurrentTab('planning');
    }, 700);
  };

  const handleSelectCategory = (cat: CelebrationCategory) => {
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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Screen A Hero Header & AI Prompt Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-10 text-center">
        {/* Soft background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Next-Gen Celebration Planning</span>
          </div>

          {/* Heading strictly matching Reference Screen A */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            Celebrationstart AI Party Planner
          </h1>

          {/* Subheading strictly matching Reference Screen A */}
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto mb-8">
            Let our AI build your timeline, budget, and shopping list in seconds.
          </p>

          {/* Prominent Prompt Input Box */}
          <form onSubmit={handlePromptSubmit} className="relative max-w-2xl mx-auto mb-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl border-2 border-emerald-500/50 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/15 shadow-lg shadow-emerald-500/5 transition-all p-2 gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Tell us about your event… (e.g., An elegant 30th birthday dinner with 20 guests and a ₹45,000 budget)"
                className="flex-1 px-4 py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none border-none"
              />
              <button
                type="submit"
                disabled={isGenerating || !promptInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition-all shrink-0 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggested Quick Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-500 font-medium">Try:</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptInput(p)}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/80 text-slate-600 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Screen A: 6 Photographic Event Category Cards */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Celebration Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select an occasion to immediately configure timelines, supplies, and budget allocations.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('celebrations')}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CELEBRATION_CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleSelectCategory(category)}
              className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Zoom & Badge */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={category.imageUrl}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-emerald-600/95 text-white backdrop-blur-xs shadow-sm">
                    {category.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-bold drop-shadow-sm leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-xs text-white/90 drop-shadow-sm truncate">
                    {category.tagline}
                  </p>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {category.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {category.defaultGuests} guests
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      ₹{(category.defaultBudget / 1000).toFixed(0)}k est.
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 group-hover:text-emerald-800 transition-colors">
                    Plan <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Celebration Overview Banner */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                Active Celebration Workspace
              </span>
              <span className="text-xs text-slate-400 font-medium">Ready to coordinate</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{activeEvent.name}</h3>
            <p className="text-xs text-slate-500">
              {activeEvent.theme} • {activeEvent.eventDate} • {activeEvent.venue.name}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Budget Spent</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {formatCurrency(totalShoppingCost)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Guests Confirmed</span>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">
                {guestMetrics.confirmed} / {guestMetrics.total}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Shopping Items</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {activeEvent.shoppingItems.length} items
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] uppercase font-bold text-slate-400">Readiness Score</span>
              <div className="text-sm font-bold text-emerald-700 mt-0.5">
                {partyAnalysis.score}% Ready
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('planning')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Open Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
