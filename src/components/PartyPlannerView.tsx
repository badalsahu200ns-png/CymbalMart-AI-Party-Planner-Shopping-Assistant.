import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { PartyType, DietaryPreference } from '../types';
import { generateDefaultShoppingListForEvent } from '../utils/geminiFallback';
import {
  Sparkles,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  PartyPopper,
  MapPin,
  CheckCircle2,
  Bot,
  PlusCircle,
  Save,
  Wand2,
} from 'lucide-react';

const PARTY_TYPES: PartyType[] = [
  'Birthday Party',
  "Children's Birthday Party",
  'Corporate Team Event',
  'Wedding Reception',
  'Anniversary',
  'Baby Shower',
  'Housewarming',
  'Graduation Party',
  'Festival Celebration',
  'Outdoor BBQ / Picnic',
  'Custom Celebration',
];

const DIETARY_OPTIONS: DietaryPreference[] = [
  'Vegetarian',
  'Vegan',
  'Jain',
  'Gluten-free',
  'Nut-free',
  'Kids-friendly',
  'Low-sugar',
  'Halal',
  'Kosher',
];

export const PartyPlannerView: React.FC = () => {
  const {
    activeEvent,
    updateActiveEvent,
    createNewEvent,
    setCurrentTab,
    addToast,
  } = useParty();

  // Mode: "edit" (modifying active event) or "create" (initiating new party)
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State
  const [name, setName] = useState(activeEvent.name);
  const [type, setType] = useState<PartyType>(activeEvent.type);
  const [theme, setTheme] = useState(activeEvent.theme);
  const [guestCount, setGuestCount] = useState(activeEvent.guestCount);
  const [eventDate, setEventDate] = useState(activeEvent.eventDate);
  const [startTime, setStartTime] = useState(activeEvent.startTime);
  const [endTime, setEndTime] = useState(activeEvent.endTime);
  const [budget, setBudget] = useState(activeEvent.budget);
  const [ageGroup, setAgeGroup] = useState(activeEvent.ageGroup);
  const [isOutdoor, setIsOutdoor] = useState(activeEvent.isOutdoor);
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(activeEvent.dietaryPreferences);
  const [specialRequests, setSpecialRequests] = useState(activeEvent.specialRequests || '');

  // AI Prompt Planner State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);

  // Sync state when activeEvent changes (if not creating new)
  React.useEffect(() => {
    if (!isCreatingNew) {
      setName(activeEvent.name);
      setType(activeEvent.type);
      setTheme(activeEvent.theme);
      setGuestCount(activeEvent.guestCount);
      setEventDate(activeEvent.eventDate);
      setStartTime(activeEvent.startTime);
      setEndTime(activeEvent.endTime);
      setBudget(activeEvent.budget);
      setAgeGroup(activeEvent.ageGroup);
      setIsOutdoor(activeEvent.isOutdoor);
      setDietaryPreferences(activeEvent.dietaryPreferences);
      setSpecialRequests(activeEvent.specialRequests || '');
    }
  }, [activeEvent, isCreatingNew]);

  const toggleDietary = (pref: DietaryPreference) => {
    setDietaryPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSaveOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast('Please enter an event name', 'error');
      return;
    }

    if (isCreatingNew) {
      // SINGLE CREATION FLOW
      const generatedItems = generateDefaultShoppingListForEvent(type, theme, guestCount, isOutdoor);
      const newEvt = createNewEvent({
        name: name.trim(),
        type,
        theme: theme.trim() || 'Festive Celebration',
        guestCount,
        eventDate,
        startTime,
        endTime,
        budget,
        ageGroup,
        isOutdoor,
        dietaryPreferences,
        specialRequests,
        shoppingItems: generatedItems,
        guests: [],
      });

      setIsCreatingNew(false);
      addToast(`Created "${newEvt.name}"! Shopping items generated.`, 'success');
      setCurrentTab('dashboard');
    } else {
      // EDIT EVENT
      updateActiveEvent({
        name: name.trim(),
        type,
        theme: theme.trim(),
        guestCount,
        eventDate,
        startTime,
        endTime,
        budget,
        ageGroup,
        isOutdoor,
        dietaryPreferences,
        specialRequests,
      });

      addToast('Event details updated successfully!', 'success');
      setCurrentTab('dashboard');
    }
  };

  const handleAiQuickPlan = async () => {
    if (!aiPrompt.trim()) {
      addToast('Please describe your party idea in the prompt box', 'warning');
      return;
    }

    setIsGeneratingWithAi(true);
    try {
      const res = await fetch('/api/gemini/parse-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.name) setName(data.name);
        if (data.type) setType(data.type);
        if (data.theme) setTheme(data.theme);
        if (data.guestCount) setGuestCount(data.guestCount);
        if (data.budget) setBudget(data.budget);
        if (data.ageGroup) setAgeGroup(data.ageGroup);
        if (data.isOutdoor !== undefined) setIsOutdoor(data.isOutdoor);
        if (data.dietaryPreferences) setDietaryPreferences(data.dietaryPreferences);

        addToast('AI structured your party plan! Review details below.', 'success');
      } else {
        throw new Error('AI parse failed');
      }
    } catch (e) {
      // Local fallback parsing
      const text = aiPrompt.toLowerCase();
      if (text.includes('birthday')) setType('Birthday Party');
      if (text.includes('wedding')) setType('Wedding Reception');
      if (text.includes('corporate')) setType('Corporate Team Event');
      if (text.includes('outdoor') || text.includes('rooftop') || text.includes('bbq')) setIsOutdoor(true);

      const guestMatch = text.match(/(\d+)\s*(?:guests?|people|attendees)/);
      if (guestMatch) setGuestCount(parseInt(guestMatch[1], 10));

      const budgetMatch = text.match(/(?:₹|rs\.?|budget of|budget)\s*([\d,]+)/);
      if (budgetMatch) setBudget(parseInt(budgetMatch[1].replace(/,/g, ''), 10));

      setName(aiPrompt.slice(0, 40) + ' Celebration');
      setTheme(aiPrompt.slice(0, 30));
      addToast('Generated plan structure from prompt.', 'info');
    } finally {
      setIsGeneratingWithAi(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span>{isCreatingNew ? 'Create Party' : 'Edit Event'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isCreatingNew
              ? 'One primary creation flow: configure your event details to generate matching shopping lists and schedules.'
              : `Managing canonical settings for "${activeEvent.name}".`}
          </p>
        </div>

        <div>
          {isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel & Return to Active Event
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCreatingNew(true);
                setName('');
                setTheme('');
                setBudget(10000);
                setGuestCount(20);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Another Party</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Quick Generator Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-900/40 space-y-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Gemini AI Instant Party Builder
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Type your party idea in plain language (e.g., <span className="italic text-blue-300">"Bollywood Retro Birthday for 30 friends with budget ₹18,000"</span>) and let AI populate the parameters.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiQuickPlan()}
            placeholder="E.g., 25th Anniversary rooftop dinner for 40 guests, budget ₹25,000 with mocktail bar"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            disabled={isGeneratingWithAi}
            onClick={handleAiQuickPlan}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Bot className="w-4 h-4" />
            <span>{isGeneratingWithAi ? 'Thinking...' : 'AI Auto-Fill'}</span>
          </button>
        </div>
      </div>

      {/* Canonical Event Form */}
      <form onSubmit={handleSaveOrUpdate} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-blue-400" />
            <span>Event Core Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Event Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul's Tropical Birthday Celebration"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Party Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Party Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PartyType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PARTY_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Theme / Aesthetic</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Tropical Neon Fiesta, Retro 90s, Bollywood Glam"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Target Guests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Target Guest Count</span>
                <span className="text-blue-400 font-bold">{guestCount} Guests</span>
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Budget (₹)</span>
                <span className="text-emerald-400 font-bold">₹{budget.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Date, Time & Environment */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Schedule & Logistics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Age Demographic</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Kids (0-12)">Kids (0-12)</option>
                <option value="Teens (13-17)">Teens (13-17)</option>
                <option value="Adults (18+)">Adults (18+)</option>
                <option value="All Ages">All Ages (Family)</option>
                <option value="Corporate">Corporate / Professional</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Environment</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOutdoor(false)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    !isOutdoor
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Indoor
                </button>
                <button
                  type="button"
                  onClick={() => setIsOutdoor(true)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    isOutdoor
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Outdoor / Rooftop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dietary & Hospitality Notes */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Dietary Preferences & Special Requests
          </h2>

          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((pref) => {
              const isSelected = dietaryPreferences.includes(pref);
              return (
                <button
                  type="button"
                  key={pref}
                  onClick={() => toggleDietary(pref)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {pref}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-300">Special Host Notes</label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Need dedicated mocktail station, acoustic playlist during entry, cake cutting sharp at 8 PM..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Single Primary Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isCreatingNew ? 'Create Party' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
