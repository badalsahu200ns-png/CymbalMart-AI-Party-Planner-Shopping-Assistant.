import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  PartyEvent,
  ShoppingItem,
  Guest,
  UserProfile,
  ShoppingCategory,
  RSVPStatus,
  InvitationStatus,
  BudgetOptimizationSuggestion,
  CheckPartyAnalysis,
  ChatMessage,
  Priority,
  PartyType,
  NavigationTab,
} from '../types';
import { SAMPLE_EVENTS } from '../data/sampleEvents';
import {
  calculateTotalCost,
  calculateCategoryBreakdown,
  calculateGuestMetrics,
  calculateReminderTime,
  runBudgetOptimization,
  auditPartyCompleteness,
  formatCurrency,
} from '../utils/calculations';
import { generatePersonalizedInviteText } from '../utils/geminiFallback';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface PartyContextType {
  // Navigation & User
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  user: UserProfile | null;
  signInWithGoogle: () => void;
  signOut: () => void;

  // Single Canonical Events State
  events: PartyEvent[];
  activeEvent: PartyEvent;
  setActiveEventId: (eventId: string) => void;
  createNewEvent: (newEventData: Partial<PartyEvent>) => PartyEvent;
  updateActiveEvent: (updates: Partial<PartyEvent>) => void;
  deleteEvent: (eventId: string) => void;
  duplicateEvent: (eventId: string) => void;
  finalizeEvent: () => void;

  // Derived Single Source of Truth
  totalShoppingCost: number;
  categoryTotals: Record<ShoppingCategory, number>;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  guestMetrics: ReturnType<typeof calculateGuestMetrics>;
  reminderInfo: ReturnType<typeof calculateReminderTime>;

  // Canonical Shopping List Actions
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'estimatedTotalPrice'>) => void;
  updateShoppingItemQuantity: (itemId: string, newQuantity: number) => void;
  removeShoppingItem: (itemId: string) => void;
  restoreShoppingItem: (itemId: string) => void;
  toggleItemPriority: (itemId: string) => void;
  replaceWithAlternative: (itemId: string) => void;
  setAllShoppingItems: (items: ShoppingItem[]) => void;
  recalculateShoppingForConfirmedGuests: () => void;
  isAddItemFormOpen: boolean;
  setIsAddItemFormOpen: (open: boolean) => void;

  // Canonical Guest Management Actions
  addGuest: (guestData: { name: string; email?: string; phone?: string; dietaryNotes?: string; plusOnes?: number }) => { success: boolean; message?: string };
  updateGuest: (guestId: string, updates: Partial<Guest>) => void;
  deleteGuest: (guestId: string) => void;
  updateGuestRSVP: (guestId: string, newStatus: RSVPStatus) => void;
  resendInvitation: (guestId: string) => void;
  generateInvitationForGuest: (guestId: string) => Promise<string>;
  selectedGuestForInvite: Guest | null;
  setSelectedGuestForInvite: (guest: Guest | null) => void;
  isAddGuestFormOpen: boolean;
  setIsAddGuestFormOpen: (open: boolean) => void;

  // Canonical Budget Optimization
  optimizationResult: ReturnType<typeof runBudgetOptimization>;
  applyOptimizationSuggestion: (suggestionId: string) => void;
  applyAllOptimizationSuggestions: () => void;

  // Completeness Audit
  partyAnalysis: CheckPartyAnalysis;
  refreshPartyAnalysis: () => void;
  addMissingItemToShoppingList: (item: any) => void;

  // AI Assistant Application Controller
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  isAiThinking: boolean;
  executeIntent: (command: string) => Promise<{ executed: boolean; reply: string }>;

  // Toasts
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY_EVENTS = 'cymbalmart_ai_party_events_v3';
const STORAGE_KEY_ACTIVE_ID = 'cymbalmart_active_event_id_v3';
const STORAGE_KEY_USER = 'cymbalmart_user_profile_v3';

const DEFAULT_USER: UserProfile = {
  uid: 'user-google-default',
  name: 'Badal Sahu',
  email: 'badalsahu200ns@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  currency: 'INR',
  currencySymbol: '₹',
};

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAddGuestFormOpen, setIsAddGuestFormOpen] = useState(false);
  const [isAddItemFormOpen, setIsAddItemFormOpen] = useState(false);
  const [selectedGuestForInvite, setSelectedGuestForInvite] = useState<Guest | null>(null);

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [events, setEvents] = useState<PartyEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load events from storage', e);
    }
    return SAMPLE_EVENTS;
  });

  const [activeEventId, setActiveEventIdState] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId && events.some((e) => e.id === savedId)) return savedId;
    } catch {}
    return events[0]?.id || SAMPLE_EVENTS[0].id;
  });

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeEventId);
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [events, activeEventId]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const activeEvent = useMemo(() => {
    const found = events.find((e) => e.id === activeEventId);
    return found || events[0] || SAMPLE_EVENTS[0];
  }, [events, activeEventId]);

  const setActiveEventId = (id: string) => {
    if (events.some((e) => e.id === id)) {
      setActiveEventIdState(id);
      addToast(`Switched active event to "${events.find((e) => e.id === id)?.name}"`, 'info');
    }
  };

  const signInWithGoogle = () => {
    setUser(DEFAULT_USER);
    addToast('Signed in with Google successfully!', 'success');
  };

  const signOut = () => {
    setUser(null);
    addToast('Signed out of CymbalMart', 'info');
  };

  // Event Mutations
  const updateActiveEvent = (updates: Partial<PartyEvent>) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === activeEvent.id) {
          const updated = {
            ...evt,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          if (updates.startTime || updates.eventDate) {
            const date = updates.eventDate || evt.eventDate;
            const time = updates.startTime || evt.startTime;
            const rem = calculateReminderTime(date, time);
            updated.guests = (updates.guests || evt.guests).map((g) => ({
              ...g,
              reminderTimestamp: rem.reminderDateTime ? rem.reminderDateTime.toISOString() : g.reminderTimestamp,
            }));
          }

          return updated;
        }
        return evt;
      })
    );
  };

  const finalizeEvent = () => {
    updateActiveEvent({ isFinalized: true });
    addToast('Party Plan has been finalized and verified!', 'success');
  };

  // SINGLE PARTY CREATION FLOW
  const createNewEvent = (newEventData: Partial<PartyEvent>): PartyEvent => {
    const id = `evt-${Date.now()}`;
    const newEvent: PartyEvent = {
      id,
      userId: user?.uid || 'user-default',
      name: newEventData.name || 'New Celebration Party',
      type: (newEventData.type as PartyType) || 'Birthday Party',
      theme: newEventData.theme || 'Modern Neon Glow',
      guestCount: newEventData.guestCount || 20,
      eventDate: newEventData.eventDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      startTime: newEventData.startTime || '18:00',
      endTime: newEventData.endTime || '22:00',
      budget: newEventData.budget || 10000,
      ageGroup: newEventData.ageGroup || 'All Ages',
      isOutdoor: Boolean(newEventData.isOutdoor),
      venue: newEventData.venue || {
        name: 'Private Venue Hall',
        address: '100 Celebration Way',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
      },
      dietaryPreferences: newEventData.dietaryPreferences || ['Vegetarian'],
      specialRequests: newEventData.specialRequests || '',
      shoppingItems: newEventData.shoppingItems || [],
      guests: newEventData.guests || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFinalized: false,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventIdState(id);
    addToast(`Created "${newEvent.name}" successfully!`, 'success');
    return newEvent;
  };

  const deleteEvent = (eventId: string) => {
    if (events.length <= 1) {
      addToast('Cannot delete the only remaining party plan.', 'warning');
      return;
    }
    const filtered = events.filter((e) => e.id !== eventId);
    setEvents(filtered);
    if (activeEventId === eventId) {
      setActiveEventIdState(filtered[0].id);
    }
    addToast('Party plan removed.', 'info');
  };

  const duplicateEvent = (eventId: string) => {
    const target = events.find((e) => e.id === eventId);
    if (!target) return;
    const clone: PartyEvent = {
      ...target,
      id: `evt-${Date.now()}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFinalized: false,
      guests: target.guests.map((g) => ({
        ...g,
        id: `gst-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        invitationStatus: 'Generated',
        rsvpStatus: 'Pending',
      })),
      shoppingItems: target.shoppingItems.map((i) => ({
        ...i,
        id: `shp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      })),
    };
    setEvents((prev) => [clone, ...prev]);
    setActiveEventIdState(clone.id);
    addToast(`Duplicated "${target.name}"!`, 'success');
  };

  // Derived Single Source of Truth
  const totalShoppingCost = useMemo(() => calculateTotalCost(activeEvent.shoppingItems), [activeEvent.shoppingItems]);
  const categoryTotals = useMemo(() => calculateCategoryBreakdown(activeEvent.shoppingItems), [activeEvent.shoppingItems]);
  const remainingBudget = useMemo(() => activeEvent.budget - totalShoppingCost, [activeEvent.budget, totalShoppingCost]);
  const isOverBudget = remainingBudget < 0;
  const overBudgetAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
  const guestMetrics = useMemo(() => calculateGuestMetrics(activeEvent.guests), [activeEvent.guests]);
  const reminderInfo = useMemo(
    () => calculateReminderTime(activeEvent.eventDate, activeEvent.startTime),
    [activeEvent.eventDate, activeEvent.startTime]
  );

  // Canonical Shopping List Actions
  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'estimatedTotalPrice'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: `shp-custom-${Date.now()}`,
      estimatedTotalPrice: item.recommendedQuantity * item.estimatedUnitPrice,
      isCustom: true,
    };
    updateActiveEvent({
      shoppingItems: [newItem, ...activeEvent.shoppingItems],
    });
    addToast(`Added "${item.name}" to shopping list.`, 'success');
  };

  const updateShoppingItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      addToast('Shopping quantity cannot be negative.', 'error');
      return;
    }
    const updated = activeEvent.shoppingItems.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          recommendedQuantity: newQuantity,
          estimatedTotalPrice: newQuantity * i.estimatedUnitPrice,
          isRemoved: newQuantity === 0 ? true : i.isRemoved,
        };
      }
      return i;
    });
    updateActiveEvent({ shoppingItems: updated });
    addToast('Shopping item quantity updated.', 'info');
  };

  const removeShoppingItem = (itemId: string) => {
    const updated = activeEvent.shoppingItems.map((i) => (i.id === itemId ? { ...i, isRemoved: true } : i));
    updateActiveEvent({ shoppingItems: updated });
    addToast('Item removed from shopping list.', 'info');
  };

  const restoreShoppingItem = (itemId: string) => {
    const updated = activeEvent.shoppingItems.map((i) => (i.id === itemId ? { ...i, isRemoved: false } : i));
    updateActiveEvent({ shoppingItems: updated });
    addToast('Item restored to shopping list.', 'success');
  };

  const toggleItemPriority = (itemId: string) => {
    const priorities: Priority[] = ['Essential', 'Recommended', 'Optional'];
    const updated = activeEvent.shoppingItems.map((i) => {
      if (i.id === itemId) {
        const nextIdx = (priorities.indexOf(i.priority) + 1) % priorities.length;
        return { ...i, priority: priorities[nextIdx] };
      }
      return i;
    });
    updateActiveEvent({ shoppingItems: updated });
  };

  const replaceWithAlternative = (itemId: string) => {
    const target = activeEvent.shoppingItems.find((i) => i.id === itemId);
    if (!target || !target.optionalAlternative) return;

    const alt = target.optionalAlternative;
    const updated = activeEvent.shoppingItems.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          name: alt.name,
          estimatedUnitPrice: alt.estimatedUnitPrice,
          estimatedTotalPrice: i.recommendedQuantity * alt.estimatedUnitPrice,
          reason: `Optimized alternative: ${alt.reason}`,
          optionalAlternative: undefined,
        };
      }
      return i;
    });
    updateActiveEvent({ shoppingItems: updated });
    addToast(`Switched to "${alt.name}". Saved ₹${alt.estimatedSavings * target.recommendedQuantity}!`, 'success');
  };

  const setAllShoppingItems = (items: ShoppingItem[]) => {
    updateActiveEvent({ shoppingItems: items });
  };

  const recalculateShoppingForConfirmedGuests = () => {
    const confirmedCount = guestMetrics.confirmed || 1;
    const originalCount = activeEvent.guestCount || 20;
    const ratio = Math.max(0.2, confirmedCount / originalCount);

    const scalableCats = ['Food', 'Drinks', 'Cake & Desserts', 'Tableware', 'Guest Supplies'];

    const updated = activeEvent.shoppingItems.map((item) => {
      if (scalableCats.includes(item.category) && !item.isRemoved) {
        const newQty = Math.max(1, Math.ceil(item.recommendedQuantity * ratio));
        return {
          ...item,
          recommendedQuantity: newQty,
          estimatedTotalPrice: newQty * item.estimatedUnitPrice,
        };
      }
      return item;
    });

    updateActiveEvent({ shoppingItems: updated });
    addToast(`Recalculated quantities for ${confirmedCount} confirmed guests!`, 'success');
  };

  // Canonical Guest Management Actions
  const addGuest = (guestData: {
    name: string;
    email?: string;
    phone?: string;
    dietaryNotes?: string;
    plusOnes?: number;
  }): { success: boolean; message?: string } => {
    if (!guestData.name || guestData.name.trim().length === 0) {
      addToast('Please enter a valid guest name.', 'error');
      return { success: false, message: 'Please enter a valid guest name.' };
    }

    const normalizedName = guestData.name.trim().toLowerCase();
    const normalizedEmail = guestData.email?.trim().toLowerCase();
    const normalizedPhone = guestData.phone?.replace(/[^0-9]/g, '');

    const isDuplicate = activeEvent.guests.some((g) => {
      if (normalizedEmail && g.email && g.email.trim().toLowerCase() === normalizedEmail) return true;
      if (normalizedPhone && g.phone && g.phone.replace(/[^0-9]/g, '') === normalizedPhone) return true;
      if (g.name.trim().toLowerCase() === normalizedName) return true;
      return false;
    });

    if (isDuplicate) {
      addToast('A guest with this name or contact details already exists.', 'warning');
      return { success: false, message: 'Duplicate guest entry detected.' };
    }

    const rem = calculateReminderTime(activeEvent.eventDate, activeEvent.startTime);
    const personalizedInvite = generatePersonalizedInviteText(guestData.name.trim(), activeEvent);

    const newGuest: Guest = {
      id: `gst-${Date.now()}`,
      name: guestData.name.trim(),
      email: guestData.email?.trim(),
      phone: guestData.phone?.trim(),
      invitationStatus: 'Generated',
      invitationSent: false,
      rsvpStatus: 'Pending',
      invitationTimestamp: new Date().toISOString(),
      reminderStatus: 'Scheduled',
      reminderTimestamp: rem.reminderDateTime ? rem.reminderDateTime.toISOString() : undefined,
      personalizedMessage: personalizedInvite,
      personalizedInviteText: personalizedInvite,
      dietaryNotes: guestData.dietaryNotes,
      plusOnes: guestData.plusOnes || 0,
    };

    updateActiveEvent({
      guests: [newGuest, ...activeEvent.guests],
    });

    addToast(`Guest "${newGuest.name}" added successfully!`, 'success');
    return { success: true };
  };

  const updateGuest = (guestId: string, updates: Partial<Guest>) => {
    const updated = activeEvent.guests.map((g) => (g.id === guestId ? { ...g, ...updates } : g));
    updateActiveEvent({ guests: updated });
    addToast('Guest record updated.', 'info');
  };

  const deleteGuest = (guestId: string) => {
    const updated = activeEvent.guests.filter((g) => g.id !== guestId);
    updateActiveEvent({ guests: updated });
    addToast('Guest removed from event.', 'info');
  };

  const updateGuestRSVP = (guestId: string, newStatus: RSVPStatus) => {
    const updated = activeEvent.guests.map((g) => (g.id === guestId ? { ...g, rsvpStatus: newStatus } : g));
    updateActiveEvent({ guests: updated });
    addToast(`RSVP status updated to "${newStatus}"`, 'success');
  };

  const resendInvitation = (guestId: string) => {
    const updated = activeEvent.guests.map((g) =>
      g.id === guestId
        ? {
            ...g,
            invitationStatus: 'Sent' as InvitationStatus,
            invitationSent: true,
            invitationTimestamp: new Date().toISOString(),
          }
        : g
    );
    updateActiveEvent({ guests: updated });
    addToast('Personalized invitation dispatched to guest.', 'success');
  };

  const generateInvitationForGuest = async (guestId: string): Promise<string> => {
    const guest = activeEvent.guests.find((g) => g.id === guestId);
    if (!guest) return '';

    try {
      const res = await fetch('/api/gemini/personalized-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: guest.name, event: activeEvent }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.invitationText) {
          updateGuest(guestId, {
            personalizedMessage: data.invitationText,
            personalizedInviteText: data.invitationText,
          });
          return data.invitationText;
        }
      }
    } catch (e) {
      console.warn('API invite generation error:', e);
    }

    const fallback = generatePersonalizedInviteText(guest.name, activeEvent);
    updateGuest(guestId, {
      personalizedMessage: fallback,
      personalizedInviteText: fallback,
    });
    return fallback;
  };

  // Canonical Budget Optimization
  const optimizationResult = useMemo(
    () => runBudgetOptimization(activeEvent.shoppingItems, activeEvent.budget),
    [activeEvent.shoppingItems, activeEvent.budget]
  );

  const applyOptimizationSuggestion = (suggestionId: string) => {
    const suggestion = optimizationResult.suggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;

    if (suggestion.suggestedAction === 'replace' && suggestion.alternativeName && suggestion.alternativePrice) {
      const updated = activeEvent.shoppingItems.map((item) => {
        if (item.id === suggestion.itemId) {
          const newUnitPrice = suggestion.alternativePrice! / item.recommendedQuantity;
          return {
            ...item,
            name: suggestion.alternativeName!,
            estimatedUnitPrice: newUnitPrice,
            estimatedTotalPrice: suggestion.alternativePrice!,
            reason: `Optimized savings: ${suggestion.reason}`,
            optionalAlternative: undefined,
          };
        }
        return item;
      });
      updateActiveEvent({ shoppingItems: updated });
      addToast(`Applied savings of ₹${suggestion.estimatedSavings}!`, 'success');
    } else if (suggestion.suggestedAction === 'remove') {
      removeShoppingItem(suggestion.itemId);
    } else if (suggestion.suggestedAction === 'reduce' && suggestion.suggestedQuantity) {
      updateShoppingItemQuantity(suggestion.itemId, suggestion.suggestedQuantity);
    }
  };

  const applyAllOptimizationSuggestions = () => {
    optimizationResult.suggestions.forEach((s) => {
      applyOptimizationSuggestion(s.id);
    });
    addToast(`Applied all recommendations! Total saved: ₹${optimizationResult.totalPotentialSavings}`, 'success');
  };

  // Completeness Audit
  const partyAnalysis = useMemo(() => auditPartyCompleteness(activeEvent), [activeEvent]);

  const refreshPartyAnalysis = () => {
    addToast('Party completeness analysis updated!', 'info');
  };

  const addMissingItemToShoppingList = (item: any) => {
    addShoppingItem({
      name: item.name,
      category: item.category,
      recommendedQuantity: item.recommendedQuantity || 1,
      unit: item.unit || 'pack',
      estimatedUnitPrice: item.estimatedUnitPrice || 200,
      priority: item.priority || 'Recommended',
      reason: item.reason || 'Added from party completeness audit',
    });
  };

  // CONTEXT-AWARE AI APPLICATION CONTROLLER & INTENT PARSER
  const executeIntent = async (command: string): Promise<{ executed: boolean; reply: string; navigatedTo?: string; updatedDataSummary?: string; suggestedPrompts?: string[] }> => {
    const lower = command.toLowerCase().trim();

    // AMBIGUOUS QUERY HANDLERS (Ask clarifying question)
    if (lower === 'water' || lower === 'bottled water' || lower === 'sparkling water') {
      return {
        executed: true,
        reply: "Would you like to add Bottled Water (₹35 each) or Sparkling Water (₹70 each) to your shopping list? You can say 'Add 2 bottles of sparkling water' or 'Add 10 bottles of water'.",
        suggestedPrompts: ["Add 2 bottles of sparkling water", "Add 10 bottles of water", "View Drinks Aisle"],
      };
    }

    if (lower === 'budget' || lower === 'my budget') {
      return {
        executed: true,
        reply: `Your active budget is ${formatCurrency(activeEvent.budget)} (estimated spend: ${formatCurrency(totalShoppingCost)}, remaining: ${formatCurrency(remainingBudget)}). Would you like to view your budget breakdown or update your spending limit?`,
        suggestedPrompts: ["Show me my remaining budget", "Change my budget to ₹7,000", "Optimize budget"],
      };
    }

    if (lower === 'decorations' || lower === 'decor' || lower === 'balloons') {
      return {
        executed: true,
        reply: "Would you like decoration recommendations for your birthday theme, or would you like to view the Decorations aisle in your shopping list?",
        suggestedPrompts: ["Suggest decorations for a children's birthday", "View Decorations Aisle"],
      };
    }

    // 0. INLINE ACTION: Plan or configure celebration (e.g. "Plan a birthday party for 12 guests with a budget of ₹5,000")
    if (
      (/birthday|party|celebration|plan.*(?:party|event|celebration)|create.*(?:party|event)/i.test(lower) && 
      (lower.includes('plan') || lower.includes('create') || lower.includes('for') || lower.includes('budget') || lower.includes('guest')))
    ) {
      const gMatch = lower.match(/(\d+)\s*(?:people|guests|persons|attendees)?/i);
      const bMatch = lower.match(/(?:₹|rs\.?\s*|rupees?\s*|inr\s*)([\d,]+)/i) || 
                     lower.match(/budget\s*(?:of|to|is)?\s*(?:₹|rs\.?\s*|inr\s*)?([\d,]+)/i);

      const parsedGuests = gMatch ? Math.max(1, Math.min(500, parseInt(gMatch[1], 10))) : activeEvent.guestCount;
      const parsedBudget = bMatch ? Math.max(100, parseInt(bMatch[1].replace(/,/g, ''), 10)) : activeEvent.budget;

      let eventType: PartyType = 'Birthday Party';
      if (/wedding/i.test(lower)) eventType = 'Wedding Reception';
      else if (/corporate|team/i.test(lower)) eventType = 'Corporate Team Event';
      else if (/anniversary/i.test(lower)) eventType = 'Anniversary';

      const updatedParams: Partial<PartyEvent> = {
        name: `${eventType.replace(' Party', '')} for ${parsedGuests} Guests`,
        type: eventType,
        guestCount: parsedGuests,
        budget: parsedBudget,
      };

      updateActiveEvent(updatedParams);
      const newRemaining = parsedBudget - totalShoppingCost;

      return {
        executed: true,
        reply: `Planned your ${eventType} for ${parsedGuests} guests with a budget of ${formatCurrency(parsedBudget)}. I've synced your starter shopping list and budget ceiling.`,
        updatedDataSummary: `Guests: ${parsedGuests}\nBudget: ${formatCurrency(parsedBudget)}\nEstimated shopping total: ${formatCurrency(totalShoppingCost)}\nRemaining: ${formatCurrency(newRemaining)}`,
        suggestedPrompts: ["Add two bottles of sparkling water", "Show me my remaining budget", "Suggest decorations for a children's birthday"],
        navigatedTo: 'Dashboard',
      };
    }

    // 1. INLINE ACTION: Remove item (e.g. "remove balloons", "remove balloons from my shopping list", "delete pizza")
    if (lower.startsWith('remove ') || lower.startsWith('delete ') || lower.includes('remove item') || lower.includes('take off')) {
      const cleaned = lower
        .replace(/^(?:please\s+)?(?:remove|delete|take\s+off)\s+(?:the\s+)?/i, '')
        .replace(/\s+from\s+(?:my\s+)?(?:shopping\s+)?list/i, '')
        .trim();

      const isSparkling = /sparkling/i.test(cleaned);
      const isOrdinaryWater = /water/i.test(cleaned) && !isSparkling;

      const match = activeEvent.shoppingItems.find((i) => {
        if (i.isRemoved) return false;
        const itemName = i.name.toLowerCase();
        if (isSparkling) return /sparkling/i.test(itemName);
        if (isOrdinaryWater) return /water/i.test(itemName) && !/sparkling/i.test(itemName);
        if (/balloon|decor/i.test(cleaned)) return /balloon|decor/i.test(itemName);
        if (/cake/i.test(cleaned)) return /cake/i.test(itemName);
        if (/plate/i.test(cleaned)) return /plate/i.test(itemName);
        if (/snack/i.test(cleaned)) return /snack|popcorn|chips/i.test(itemName);
        return itemName.includes(cleaned) || cleaned.includes(itemName);
      });

      if (match) {
        const updated = activeEvent.shoppingItems.map((i) => (i.id === match.id ? { ...i, isRemoved: true } : i));
        const newTotal = calculateTotalCost(updated);
        const newRemaining = activeEvent.budget - newTotal;
        updateActiveEvent({ shoppingItems: updated });

        return {
          executed: true,
          reply: `Removed "${match.name}" from your shopping list.`,
          updatedDataSummary: `Updated total: ${formatCurrency(newTotal)}\nBudget remaining: ${formatCurrency(newRemaining)}`,
          suggestedPrompts: ["Show me my remaining budget", "View shopping list", "Add two bottles of sparkling water"],
        };
      } else {
        return {
          executed: true,
          reply: `I couldn't find "${cleaned}" on your active shopping list. Try "Remove balloons" or "View shopping list".`,
          suggestedPrompts: ["View shopping list", "Show me my remaining budget"],
        };
      }
    }

    // 2. INLINE ACTION: Add quick shopping items with quantity (supports digits and word numbers like "two")
    const wordNumbers: Record<string, number> = {
      one: 1, a: 1, an: 1, two: 2, couple: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
      dozen: 12, fifteen: 15, twenty: 20
    };
    const addQuantityMatch = lower.match(/^(?:please\s+)?(?:add|include|buy|need)\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a|an)\s+([a-zA-Z\s]+?)(?:for\s+(?:₹|rs\.?|inr)?\s*(\d+))?$/i);
    if (addQuantityMatch) {
      const rawQty = addQuantityMatch[1].toLowerCase();
      const qty = /^\d+$/.test(rawQty) ? parseInt(rawQty, 10) : (wordNumbers[rawQty] || 1);
      
      if (qty <= 0) {
        return {
          executed: true,
          reply: "Item quantity must be at least 1. For example, try saying 'Add two bottles of sparkling water'.",
        };
      }

      const rawItemName = addQuantityMatch[2].trim();
      const isSparkling = /sparkling/i.test(rawItemName);
      const isOrdinaryWater = /water/i.test(rawItemName) && !isSparkling;

      const unitPrice = addQuantityMatch[3] ? parseInt(addQuantityMatch[3], 10) : (isSparkling ? 70 : (isOrdinaryWater ? 35 : 50));

      let cat: ShoppingCategory = 'Food';
      let itemName = rawItemName.charAt(0).toUpperCase() + rawItemName.slice(1);

      if (isSparkling) {
        cat = 'Drinks';
        itemName = 'Sparkling Water';
      } else if (isOrdinaryWater) {
        cat = 'Drinks';
        itemName = 'Bottled Water';
      } else if (rawItemName.includes('juice') || rawItemName.includes('drink') || rawItemName.includes('soda')) {
        cat = 'Drinks';
      } else if (rawItemName.includes('plate') || rawItemName.includes('cup') || rawItemName.includes('spoon') || rawItemName.includes('napkin')) {
        cat = 'Tableware';
      } else if (rawItemName.includes('balloon') || rawItemName.includes('light') || rawItemName.includes('banner')) {
        cat = 'Decorations';
      }

      const existing = activeEvent.shoppingItems.find(i => {
        if (i.isRemoved) return false;
        const n = i.name.toLowerCase();
        if (isSparkling) return /sparkling/i.test(n);
        if (isOrdinaryWater) return /water/i.test(n) && !/sparkling/i.test(n);
        return n.includes(rawItemName.toLowerCase());
      });

      let updated: ShoppingItem[];
      if (existing) {
        updated = activeEvent.shoppingItems.map(i => i.id === existing.id ? {
          ...i,
          recommendedQuantity: i.recommendedQuantity + qty,
          estimatedTotalPrice: (i.recommendedQuantity + qty) * i.estimatedUnitPrice
        } : i);
      } else {
        const newItem: ShoppingItem = {
          id: `shp-custom-${Date.now()}`,
          name: itemName,
          category: cat,
          recommendedQuantity: qty,
          unit: 'units',
          estimatedUnitPrice: unitPrice,
          estimatedTotalPrice: qty * unitPrice,
          priority: 'Essential',
          reason: 'Added via Alexa-inspired Assistant',
          isCustom: true,
        };
        updated = [newItem, ...activeEvent.shoppingItems];
      }

      const newTotal = calculateTotalCost(updated);
      const newRemaining = activeEvent.budget - newTotal;
      updateActiveEvent({ shoppingItems: updated });

      return {
        executed: true,
        reply: `Added ${qty} ${itemName} to your Shopping List at ${formatCurrency(unitPrice)} each.`,
        updatedDataSummary: `Updated total: ${formatCurrency(newTotal)}\nBudget remaining: ${formatCurrency(newRemaining)}`,
        suggestedPrompts: ["Show me my remaining budget", "Remove balloons from my shopping list", "View shopping list"],
      };
    }

    // 3. INLINE ACTION: Change budget (e.g. "Change my budget to ₹7,000", "Set the budget to 7000 rupees")
    if (/(?:change|set|increase|update|make)\s+(?:my\s+|the\s+)?budget|budget\s*(?:to|at|is|=)/i.test(lower)) {
      if (lower.includes('-') || lower.includes('negative')) {
        return {
          executed: true,
          reply: "Budget must be a positive amount in Indian Rupees (e.g., 'Change my budget to ₹7,000').",
        };
      }

      const budgetMatch = lower.match(/(?:(?:change|set|increase|update|make)\s+(?:my\s+|the\s+)?budget|budget\s*(?:to|at|is|=))\s*(?:to\s+)?(?:₹|rs\.?|inr)?\s*([\d,]+)(?:\s*(?:rupees?|inr))?/i);
      if (budgetMatch) {
        const rawNum = budgetMatch[1].replace(/,/g, '');
        const newBudget = parseInt(rawNum, 10);
        if (!isNaN(newBudget) && newBudget > 0) {
          updateActiveEvent({ budget: newBudget });
          const newRemaining = newBudget - totalShoppingCost;
          return {
            executed: true,
            reply: `Updated event budget to ${formatCurrency(newBudget)}.`,
            updatedDataSummary: `Total shopping cost: ${formatCurrency(totalShoppingCost)}\nBudget status: ${newRemaining >= 0 ? `Under budget by ${formatCurrency(newRemaining)}` : `Over budget by ${formatCurrency(Math.abs(newRemaining))}`}`,
            suggestedPrompts: ["Show me my remaining budget", "How much will the party cost?", "View Budget Breakdown"],
          };
        }
      }
    }

    // 4. INLINE ACTION: Suggest decorations for a children's birthday
    if (lower.includes('suggest decoration') || lower.includes('decoration suggestion') || lower.includes('decorations for') || lower.includes('party decoration')) {
      return {
        executed: true,
        reply: "Here are popular birthday decoration suggestions for your party:\n• Themed Superhero Foil Balloons & Banner Kit (est. ₹650)\n• Colorful Confetti Table Runners (est. ₹250)\n• Warm White LED Fairy String Lights (est. ₹350)\n• Festive Photo Backdrop & Prop Pack (est. ₹480)\n\n(These are AI suggestions — tell me which you would like to confirm and add to your list!)",
        suggestedPrompts: ["Add 1 banner kit", "Add fairy lights", "View Decorations Aisle"],
      };
    }

    // 5. QUERY: How much will the party cost?
    if (
      lower.includes('how much will the party cost') ||
      lower.includes('how much does the party cost') ||
      lower.includes('what will the party cost') ||
      lower.includes('total cost') ||
      lower.includes('party cost')
    ) {
      setCurrentTab('budget');
      return {
        executed: true,
        reply: `The estimated shopping cost for "${activeEvent.name}" is ${formatCurrency(totalShoppingCost)} against your ${formatCurrency(activeEvent.budget)} budget. You have ${remainingBudget >= 0 ? `${formatCurrency(remainingBudget)} remaining` : `exceeded your budget by ${formatCurrency(Math.abs(remainingBudget))}`}.`,
        updatedDataSummary: `Estimated Shopping: ${formatCurrency(totalShoppingCost)}\nAllocated Budget: ${formatCurrency(activeEvent.budget)}\nStatus: ${remainingBudget >= 0 ? `Under by ${formatCurrency(remainingBudget)}` : `Over by ${formatCurrency(Math.abs(remainingBudget))}`}`,
        suggestedPrompts: ["Show me my remaining budget", "Optimize budget", "View shopping list"],
        navigatedTo: 'Budget',
      };
    }

    // 6. QUERY: Show me my remaining budget
    if (
      lower.includes('remaining budget') ||
      lower.includes('show budget') ||
      lower.includes('show the budget') ||
      lower.includes('view budget') ||
      lower.includes('my budget') ||
      lower.includes('the budget') ||
      lower.includes('what is my budget') ||
      lower.includes('what is the budget') ||
      lower.includes('budget breakdown')
    ) {
      setCurrentTab('budget');
      return {
        executed: true,
        reply: `Navigated to Budget. Allocated Budget: ${formatCurrency(activeEvent.budget)} | Estimated Shopping Spend: ${formatCurrency(totalShoppingCost)} | Remaining Capacity: ${formatCurrency(remainingBudget)}.`,
        updatedDataSummary: `Allocated: ${formatCurrency(activeEvent.budget)}\nEstimated Spend: ${formatCurrency(totalShoppingCost)}\nRemaining: ${formatCurrency(remainingBudget)}`,
        suggestedPrompts: ["How much will the party cost?", "Change my budget to ₹7,000", "Optimize budget"],
        navigatedTo: 'Budget',
      };
    }

    // 7. INTENT NAVIGATION: Guests
    if (
      lower.includes('add guest') ||
      lower.includes('add a guest') ||
      lower.includes('add rahul') ||
      lower.includes('add guests')
    ) {
      setCurrentTab('guests');
      setIsAddGuestFormOpen(true);
      return {
        executed: true,
        reply: "I've opened the Guest List with the Add Guest form ready for you.",
        navigatedTo: 'Guest List',
      };
    }

    if (
      lower.includes('show guest') ||
      lower.includes('view guest') ||
      lower.includes('my guests') ||
      lower.includes('check rsvp') ||
      lower.includes('who has responded') ||
      lower.includes('who confirmed')
    ) {
      setCurrentTab('guests');
      return {
        executed: true,
        reply: `Navigated to Guest List. You currently have ${guestMetrics.confirmed} confirmed of ${guestMetrics.total} total guests.`,
        navigatedTo: 'Guest List',
      };
    }

    // 8. INTENT NAVIGATION: Venue
    if (
      lower.includes('venue') ||
      lower.includes('where is my venue') ||
      lower.includes('change venue') ||
      lower.includes('edit venue') ||
      lower.includes('add venue') ||
      lower.includes('show venue')
    ) {
      setCurrentTab('venue');
      return {
        executed: true,
        reply: `Here is your Venue details: ${activeEvent.venue.name}, ${activeEvent.venue.city}. Interactive Google Maps routing is available.`,
        navigatedTo: 'Venue',
      };
    }

    // 9. INTENT NAVIGATION: Shopping List
    if (
      lower.includes('add item') ||
      lower.includes('add shopping item') ||
      lower.includes('add to shopping list')
    ) {
      setCurrentTab('shopping');
      setIsAddItemFormOpen(true);
      return {
        executed: true,
        reply: "I've opened the Shopping List with the Add Item form ready.",
        navigatedTo: 'Shopping List',
      };
    }

    if (
      lower.includes('show shopping') ||
      lower.includes('view shopping') ||
      lower.includes('my shopping list') ||
      lower.includes('shopping list')
    ) {
      setCurrentTab('shopping');
      return {
        executed: true,
        reply: `Navigated to Shopping List. You have ${activeEvent.shoppingItems.filter((i) => !i.isRemoved).length} active items totaling ${formatCurrency(totalShoppingCost)}.`,
        navigatedTo: 'Shopping List',
      };
    }

    // 10. INTENT NAVIGATION: Budget Optimizer
    if (
      lower.includes('optimize budget') ||
      lower.includes('make it cheaper') ||
      lower.includes('suggest savings') ||
      lower.includes('cut cost')
    ) {
      setCurrentTab('budget');
      return {
        executed: true,
        reply: `Navigated to Budget Optimizer. We found ${optimizationResult.suggestions.length} optimization suggestions that could save up to ${formatCurrency(optimizationResult.totalPotentialSavings)}.`,
        navigatedTo: 'Budget',
      };
    }

    // 11. INTENT NAVIGATION: Invitations
    if (
      lower.includes('invitation') ||
      lower.includes('invite') ||
      lower.includes('send invitation') ||
      lower.includes('show invitations')
    ) {
      setCurrentTab('invitations');
      return {
        executed: true,
        reply: "Navigated to Invitations. You can generate personalized invitations and track delivery statuses here.",
        navigatedTo: 'Invitations',
      };
    }

    // 12. INTENT NAVIGATION: Calendar
    if (
      lower.includes('calendar') ||
      lower.includes('schedule') ||
      lower.includes('add to calendar') ||
      lower.includes('google calendar') ||
      lower.includes('timeline')
    ) {
      setCurrentTab('calendar');
      return {
        executed: true,
        reply: `Navigated to Calendar. Event is scheduled for ${activeEvent.eventDate} at ${activeEvent.startTime}. Google Calendar sync & .ics export ready.`,
        navigatedTo: 'Calendar',
      };
    }

    // 13. INTENT NAVIGATION: Final Review & Completeness
    if (
      lower.includes('finalize') ||
      lower.includes('final review') ||
      lower.includes('check my party') ||
      lower.includes('check party') ||
      lower.includes('audit') ||
      lower.includes('summary report')
    ) {
      setCurrentTab('final-review');
      return {
        executed: true,
        reply: `Navigated to Final Review. Party completeness score is ${partyAnalysis.score}%.`,
        navigatedTo: 'Final Review',
      };
    }

    // 14. INTENT NAVIGATION: Party Planner
    if (
      lower.includes('edit event') ||
      lower.includes('edit party') ||
      lower.includes('party planner') ||
      lower.includes('change theme') ||
      lower.includes('change date')
    ) {
      setCurrentTab('planner');
      return {
        executed: true,
        reply: `Navigated to Party Planner to edit "${activeEvent.name}".`,
        navigatedTo: 'Party Planner',
      };
    }

    return {
      executed: false,
      reply: '',
    };
  };

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I'm your CymbalMart Assistant & Application Controller. Ask me to add guests, adjust your budget, remove items, or navigate to any section.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        "Show my budget",
        "Add guests",
        "Where is my venue?",
        "Remove optional items",
      ],
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      // First attempt rule-based intent parsing (for instant, reliable app control)
      const localResult = await executeIntent(text);
      if (localResult.executed) {
        const assistantMsg: ChatMessage = {
          id: `msg-asst-${Date.now()}`,
          sender: 'assistant',
          text: localResult.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          navigatedTo: localResult.navigatedTo,
          updatedDataSummary: localResult.updatedDataSummary,
          suggestedPrompts: ["Show my budget", "View shopping list", "Check RSVP", "Final review"],
        };
        setChatMessages((prev) => [...prev, assistantMsg]);
        setIsAiThinking(false);
        return;
      }

      // If not caught locally, send to server-side Gemini API
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          event: activeEvent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `msg-asst-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || "I've processed your request.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPrompts: data.suggestedPrompts || ["Show my budget", "Manage guests"],
        };

        if (data.targetTab) {
          setCurrentTab(data.targetTab);
        }

        setChatMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Chat API returned non-200');
      }
    } catch (e) {
      console.warn('Chat request failed, providing local fallback:', e);
      const fallbackMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        text: `Currently monitoring "${activeEvent.name}". Allocated Budget: ${formatCurrency(activeEvent.budget)} | Estimated Items Total: ${formatCurrency(totalShoppingCost)} | Remaining: ${formatCurrency(remainingBudget)}. ${guestMetrics.confirmed} of ${guestMetrics.total} guests confirmed.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: ["Show my budget", "Show my guests", "Where is my venue?", "Show my shopping list"],
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <PartyContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        user,
        signInWithGoogle,
        signOut,
        events,
        activeEvent,
        setActiveEventId,
        createNewEvent,
        updateActiveEvent,
        deleteEvent,
        duplicateEvent,
        finalizeEvent,
        totalShoppingCost,
        categoryTotals,
        remainingBudget,
        isOverBudget,
        overBudgetAmount,
        guestMetrics,
        reminderInfo,
        addShoppingItem,
        updateShoppingItemQuantity,
        removeShoppingItem,
        restoreShoppingItem,
        toggleItemPriority,
        replaceWithAlternative,
        setAllShoppingItems,
        recalculateShoppingForConfirmedGuests,
        isAddItemFormOpen,
        setIsAddItemFormOpen,
        addGuest,
        updateGuest,
        deleteGuest,
        updateGuestRSVP,
        resendInvitation,
        generateInvitationForGuest,
        selectedGuestForInvite,
        setSelectedGuestForInvite,
        isAddGuestFormOpen,
        setIsAddGuestFormOpen,
        optimizationResult,
        applyOptimizationSuggestion,
        applyAllOptimizationSuggestions,
        partyAnalysis,
        refreshPartyAnalysis,
        addMissingItemToShoppingList,
        isAssistantOpen,
        setIsAssistantOpen,
        chatMessages,
        sendChatMessage,
        isAiThinking,
        executeIntent,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </PartyContext.Provider>
  );
};

export const useParty = (): PartyContextType => {
  const context = useContext(PartyContext);
  if (!context) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
};
