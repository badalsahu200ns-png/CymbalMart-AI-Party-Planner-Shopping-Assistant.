import {
  PartyEvent,
  ShoppingItem,
  ShoppingCategory,
  Guest,
  BudgetOptimizationSuggestion,
  CheckPartyAnalysis,
  CheckPartyMissingItem,
} from '../types';

export const SHOPPING_CATEGORIES: ShoppingCategory[] = [
  'Food',
  'Drinks',
  'Cake & Desserts',
  'Decorations',
  'Tableware',
  'Entertainment',
  'Guest Supplies',
  'Cleaning Supplies',
  'Miscellaneous',
];

/**
 * Calculates total estimated shopping cost from active items (not marked as removed).
 * SINGLE SOURCE OF TRUTH: Never manually hardcoded.
 */
export function calculateTotalCost(items: ShoppingItem[]): number {
  return items
    .filter((item) => !item.isRemoved)
    .reduce((sum, item) => sum + item.recommendedQuantity * item.estimatedUnitPrice, 0);
}

/**
 * Calculates category-wise spending totals.
 */
export function calculateCategoryBreakdown(items: ShoppingItem[]): Record<ShoppingCategory, number> {
  const breakdown: Record<ShoppingCategory, number> = {
    Food: 0,
    Drinks: 0,
    'Cake & Desserts': 0,
    Decorations: 0,
    Tableware: 0,
    Entertainment: 0,
    'Guest Supplies': 0,
    'Cleaning Supplies': 0,
    Miscellaneous: 0,
  };

  items
    .filter((item) => !item.isRemoved)
    .forEach((item) => {
      const cat = item.category || 'Miscellaneous';
      breakdown[cat] = (breakdown[cat] || 0) + item.recommendedQuantity * item.estimatedUnitPrice;
    });

  return breakdown;
}

/**
 * Derives guest counts based on RSVP status.
 */
export function calculateGuestMetrics(guests: Guest[]) {
  const total = guests.length;
  const confirmed = guests.filter((g) => g.rsvpStatus === 'Confirmed').length;
  const maybe = guests.filter((g) => g.rsvpStatus === 'Maybe').length;
  const declined = guests.filter((g) => g.rsvpStatus === 'Declined').length;
  const pending = guests.filter((g) => g.rsvpStatus === 'Pending').length;

  const invitationsSent = guests.filter(
    (g) => g.invitationStatus === 'Sent' || g.invitationStatus === 'Delivered' || g.invitationSent
  ).length;

  return {
    total,
    confirmed,
    maybe,
    declined,
    pending,
    invitationsSent,
  };
}

/**
 * Calculates 1-hour before reminder time formatted.
 */
export function calculateReminderTime(eventDate: string, startTime: string): {
  reminderTimeStr: string;
  reminderDateTime: Date | null;
} {
  if (!eventDate || !startTime) {
    return { reminderTimeStr: '1 hour before event', reminderDateTime: null };
  }

  const [hours, minutes] = startTime.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return { reminderTimeStr: '1 hour before event', reminderDateTime: null };
  }

  let remHours = hours - 1;
  let remMinutes = minutes;

  if (remHours < 0) {
    remHours = 23;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedTime = `${pad(remHours)}:${pad(remMinutes)}`;

  try {
    const d = new Date(`${eventDate}T${startTime}:00`);
    d.setHours(d.getHours() - 1);
    return {
      reminderTimeStr: formattedTime,
      reminderDateTime: d,
    };
  } catch {
    return { reminderTimeStr: formattedTime, reminderDateTime: null };
  }
}

/**
 * Format 24-hour time "18:00" to "6:00 PM"
 */
export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const mPad = m < 10 ? `0${m}` : `${m}`;
  return `${h12}:${mPad} ${ampm}`;
}

/**
 * Formats Indian Rupees currency.
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const rounded = Math.round(amount || 0);
  return `${symbol}${rounded.toLocaleString('en-IN')}`;
}

/**
 * Generate Google Maps navigation URL for venue.
 */
export function getGoogleMapsNavigationUrl(venue: {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
}): string {
  if (venue.googleMapsUrl && venue.googleMapsUrl.startsWith('http')) {
    return venue.googleMapsUrl;
  }

  if (venue.latitude && venue.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
  }

  const queryParts = [venue.name, venue.address, venue.city, venue.state, venue.postalCode]
    .filter(Boolean)
    .join(', ');

  const destination = encodeURIComponent(queryParts || 'Party Venue');
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}

/**
 * Generate Google Calendar Web URL.
 */
export function getGoogleCalendarUrl(event: PartyEvent): string {
  const title = encodeURIComponent(event.name || 'CymbalMart Party Celebration');

  const dateClean = event.eventDate ? event.eventDate.replace(/-/g, '') : '20260905';
  const startClean = event.startTime ? event.startTime.replace(/:/g, '') + '00' : '180000';
  const endClean = event.endTime ? event.endTime.replace(/:/g, '') + '00' : '220000';

  const datesParam = `${dateClean}T${startClean}/${dateClean}T${endClean}`;

  const venueLoc = [event.venue.name, event.venue.address, event.venue.city].filter(Boolean).join(', ');
  const location = encodeURIComponent(venueLoc || 'Private Venue');

  const detailsText = `Party Type: ${event.type}\nTheme: ${event.theme}\nGuests: ${event.guestCount}\nPlanned with CymbalMart AI Party Planner.`;
  const details = encodeURIComponent(detailsText);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

/**
 * Generate RFC5545 .ics file for calendar export.
 */
export function generateICSFile(event: PartyEvent): string {
  const dateClean = event.eventDate ? event.eventDate.replace(/-/g, '') : '20260905';
  const startClean = event.startTime ? event.startTime.replace(/:/g, '') + '00' : '180000';
  const endClean = event.endTime ? event.endTime.replace(/:/g, '') + '00' : '220000';

  const venueLoc = [event.venue.name, event.venue.address, event.venue.city].filter(Boolean).join(', ');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CymbalMart//AI Party Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:cymbalmart-${event.id}-${Date.now()}@cymbalmart.ai`,
    `DTSTAMP:${dateClean}T${startClean}Z`,
    `DTSTART:${dateClean}T${startClean}`,
    `DTEND:${dateClean}T${endClean}`,
    `SUMMARY:${event.name}`,
    `DESCRIPTION:${event.theme} Celebration with ${event.guestCount} guests. Planned with CymbalMart AI.`,
    `LOCATION:${venueLoc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates formatted text for Google Drive Export.
 */
export function generateDriveExportContent(
  event: PartyEvent,
  totalCostParam?: number,
  guestMetricsParam?: any
): string {
  const totalCost = totalCostParam !== undefined ? totalCostParam : calculateTotalCost(event.shoppingItems);
  const remaining = event.budget - totalCost;
  const guestMetrics = guestMetricsParam || calculateGuestMetrics(event.guests);
  const categoryTotals = calculateCategoryBreakdown(event.shoppingItems);
  const reminder = calculateReminderTime(event.eventDate, event.startTime);

  return `# CYMBALMART AI PARTY PLANNER & SHOPPING REPORT
=====================================================
Event Name: ${event.name}
Event Type: ${event.type}
Theme: ${event.theme}
Date: ${event.eventDate} | Time: ${formatTime12h(event.startTime)} - ${formatTime12h(event.endTime)}
Age Group: ${event.ageGroup} | Environment: ${event.isOutdoor ? 'Outdoor' : 'Indoor'}
Venue: ${event.venue.name}, ${event.venue.address}, ${event.venue.city} ${event.venue.postalCode}
Google Maps Navigation: ${getGoogleMapsNavigationUrl(event.venue)}
1-Hour Automated Reminder: ${reminder.reminderTimeStr} on ${event.eventDate}

=====================================================
BUDGET & FINANCIAL OVERVIEW
=====================================================
Allocated Budget: ₹${event.budget.toLocaleString('en-IN')}
Estimated Shopping Total: ₹${totalCost.toLocaleString('en-IN')}
Budget Status: ${remaining >= 0 ? `Under Budget by ₹${remaining.toLocaleString('en-IN')}` : `OVER BUDGET by ₹${Math.abs(remaining).toLocaleString('en-IN')}`}

Category Breakdown:
${Object.entries(categoryTotals)
  .filter(([_, val]) => val > 0)
  .map(([cat, val]) => `- ${cat}: ₹${val.toLocaleString('en-IN')}`)
  .join('\n')}

=====================================================
GUEST SUMMARY & RSVP STATUS
=====================================================
Total Guests: ${guestMetrics.total} (Target: ${event.guestCount})
Confirmed: ${guestMetrics.confirmed}
Maybe: ${guestMetrics.maybe}
Declined: ${guestMetrics.declined}
Pending: ${guestMetrics.pending}
Invitations Sent: ${guestMetrics.invitationsSent}

=====================================================
CURATED SHOPPING LIST
=====================================================
${event.shoppingItems
  .filter((i) => !i.isRemoved)
  .map(
    (i, idx) =>
      `${idx + 1}. [${i.priority.toUpperCase()}] ${i.name} (${i.category})
   Quantity: ${i.recommendedQuantity} ${i.unit} | Unit Price: ₹${i.estimatedUnitPrice} | Total: ₹${i.recommendedQuantity * i.estimatedUnitPrice}
   Reason: ${i.reason}`
  )
  .join('\n\n')}

=====================================================
Report generated by CymbalMart AI Party Planner
=====================================================
`;
}

/**
 * Budget Optimizer Engine
 */
export function runBudgetOptimization(
  items: ShoppingItem[],
  budget: number
): {
  currentTotal: number;
  difference: number;
  isOverBudget: boolean;
  suggestions: BudgetOptimizationSuggestion[];
  totalPotentialSavings: number;
} {
  const currentTotal = calculateTotalCost(items);
  const difference = currentTotal - budget;
  const isOverBudget = difference > 0;

  const suggestions: BudgetOptimizationSuggestion[] = [];
  let potentialSavings = 0;

  // 1. Check items with pre-configured alternatives
  items.forEach((item) => {
    if (item.isRemoved) return;

    if (item.optionalAlternative) {
      const altSavings = item.optionalAlternative.estimatedSavings * item.recommendedQuantity;
      if (altSavings > 0) {
        suggestions.push({
          id: `opt-alt-${item.id}`,
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          currentPrice: item.recommendedQuantity * item.estimatedUnitPrice,
          suggestedAction: 'replace',
          alternativeName: item.optionalAlternative.name,
          alternativePrice: item.recommendedQuantity * item.optionalAlternative.estimatedUnitPrice,
          suggestedAlternative: `${item.optionalAlternative.name} (Save ₹${altSavings})`,
          estimatedSavings: altSavings,
          reason: item.optionalAlternative.reason,
        });
        potentialSavings += altSavings;
      }
    }
  });

  // 2. Check Optional items that can be removed
  items.forEach((item) => {
    if (item.isRemoved) return;
    if (item.priority === 'Optional') {
      const savings = item.recommendedQuantity * item.estimatedUnitPrice;
      if (!suggestions.some((s) => s.itemId === item.id)) {
        suggestions.push({
          id: `opt-rem-${item.id}`,
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          currentPrice: savings,
          suggestedAction: 'remove',
          suggestedAlternative: 'Omit optional luxury item',
          estimatedSavings: savings,
          reason: `Item is marked Optional (${item.reason || 'non-essential luxury'}). Safe to omit to meet budget.`,
        });
        potentialSavings += savings;
      }
    }
  });

  // 3. Check Recommended decorations or extras that can be scaled
  items.forEach((item) => {
    if (item.isRemoved || item.priority === 'Essential') return;
    if (!suggestions.some((s) => s.itemId === item.id)) {
      if (item.category === 'Decorations' && item.estimatedTotalPrice > 600) {
        const reducedQty = Math.max(1, Math.floor(item.recommendedQuantity * 0.6));
        const savings = (item.recommendedQuantity - reducedQty) * item.estimatedUnitPrice;
        if (savings > 100) {
          suggestions.push({
            id: `opt-red-${item.id}`,
            itemId: item.id,
            itemName: item.name,
            category: item.category,
            currentPrice: item.recommendedQuantity * item.estimatedUnitPrice,
            suggestedAction: 'reduce',
            suggestedQuantity: reducedQty,
            suggestedAlternative: `Scale quantity to ${reducedQty} ${item.unit}`,
            estimatedSavings: savings,
            reason: `Optimize decoration scale: reduce quantity from ${item.recommendedQuantity} to ${reducedQty} ${item.unit}.`,
          });
          potentialSavings += savings;
        }
      }
    }
  });

  return {
    currentTotal,
    difference: Math.max(0, difference),
    isOverBudget,
    suggestions,
    totalPotentialSavings: potentialSavings,
  };
}

/**
 * Check My Party: Completeness Auditor
 */
export function auditPartyCompleteness(event: PartyEvent): CheckPartyAnalysis {
  const activeItems = event.shoppingItems.filter((i) => !i.isRemoved);
  const categoriesPresent = new Set(activeItems.map((i) => i.category));

  const essentialMissing: CheckPartyMissingItem[] = [];
  const recommendedMissing: CheckPartyMissingItem[] = [];
  const optionalMissing: CheckPartyMissingItem[] = [];
  const advisories: string[] = [];
  const tips: string[] = [];

  // Tableware checks
  const hasPlates = activeItems.some((i) => i.name.toLowerCase().includes('plate') || i.name.toLowerCase().includes('dinnerware'));
  const hasCups = activeItems.some((i) => i.name.toLowerCase().includes('cup') || i.name.toLowerCase().includes('glass'));
  const hasNapkins = activeItems.some((i) => i.name.toLowerCase().includes('napkin') || i.name.toLowerCase().includes('tissue'));

  if (!hasPlates) {
    essentialMissing.push({
      name: 'Compostable Dinner Plates & Cutlery Pack',
      category: 'Tableware',
      recommendedQuantity: Math.ceil(event.guestCount * 1.25),
      unit: 'sets',
      estimatedUnitPrice: 14,
      priority: 'Essential',
      reason: `Required for serving meals to ${event.guestCount} guests with safety buffer.`,
    });
  }

  if (!hasCups) {
    essentialMissing.push({
      name: 'Eco Beverage Drinking Cups',
      category: 'Tableware',
      recommendedQuantity: Math.ceil(event.guestCount * 1.5),
      unit: 'cups',
      estimatedUnitPrice: 8,
      priority: 'Essential',
      reason: 'Essential for serving water, juices and party drinks.',
    });
  }

  if (!hasNapkins) {
    essentialMissing.push({
      name: 'Party Absorbent Napkins (Pack of 50)',
      category: 'Tableware',
      recommendedQuantity: Math.max(1, Math.ceil(event.guestCount / 15)),
      unit: 'packs',
      estimatedUnitPrice: 90,
      priority: 'Essential',
      reason: 'Necessary for food hygiene and quick spills cleanup.',
    });
  }

  // Cleaning checks
  const hasTrashBags = activeItems.some(
    (i) => i.name.toLowerCase().includes('trash') || i.name.toLowerCase().includes('garbage') || i.name.toLowerCase().includes('cleanup')
  );
  if (!hasTrashBags) {
    essentialMissing.push({
      name: 'Heavy Duty Post-Party Garbage Bags & Wet Wipes',
      category: 'Cleaning Supplies',
      recommendedQuantity: 2,
      unit: 'packs',
      estimatedUnitPrice: 120,
      priority: 'Essential',
      reason: 'Crucial for rapid post-event cleanup and waste segregation.',
    });
  }

  // Drinks & Food
  if (!categoriesPresent.has('Drinks')) {
    essentialMissing.push({
      name: 'Bottled Mineral Water & Refreshing Drink Mixers',
      category: 'Drinks',
      recommendedQuantity: Math.ceil(event.guestCount * 2),
      unit: 'bottles',
      estimatedUnitPrice: 30,
      priority: 'Essential',
      reason: 'Hydration is mandatory for all attending guests.',
    });
  }

  if (!categoriesPresent.has('Food')) {
    essentialMissing.push({
      name: 'Party Snack Platters & Finger Food Spread',
      category: 'Food',
      recommendedQuantity: Math.ceil(event.guestCount * 1.5),
      unit: 'servings',
      estimatedUnitPrice: 160,
      priority: 'Essential',
      reason: 'Main appetizers and food catering for your guests.',
    });
  }

  // Birthday cake
  if (event.type.includes('Birthday') || event.type === 'Anniversary') {
    const hasCake = activeItems.some((i) => i.category === 'Cake & Desserts' || i.name.toLowerCase().includes('cake'));
    if (!hasCake) {
      essentialMissing.push({
        name: `Celebration ${event.theme} Cake`,
        category: 'Cake & Desserts',
        recommendedQuantity: Math.max(1, Math.ceil(event.guestCount * 0.06)),
        unit: 'kg',
        estimatedUnitPrice: 1200,
        priority: 'Essential',
        reason: 'Cake-cutting ceremony is the centerpiece tradition of the event.',
      });
    }
  }

  // Outdoor
  let weatherAlert: string | undefined;
  if (event.isOutdoor) {
    weatherAlert = 'Outdoor Venue Advisory: Consider shaded canopies, cooling mist stations, and insect repellent.';
    advisories.push('Outdoor Venue: Sun exposure and hydration management recommended.');

    const hasBugRepellent = activeItems.some(
      (i) => i.name.toLowerCase().includes('bug') || i.name.toLowerCase().includes('repellent')
    );
    if (!hasBugRepellent) {
      recommendedMissing.push({
        name: 'Citronella Outdoor Bug Repellent & Sun Care Station',
        category: 'Guest Supplies',
        recommendedQuantity: 1,
        unit: 'kit',
        estimatedUnitPrice: 350,
        priority: 'Recommended',
        reason: 'Keeps outdoor guests comfortable from insects and sun.',
      });
    }
  }

  // Entertainment
  if (!categoriesPresent.has('Entertainment')) {
    recommendedMissing.push({
      name: 'Portable Bluetooth Party Speaker with Microphone',
      category: 'Entertainment',
      recommendedQuantity: 1,
      unit: 'unit',
      estimatedUnitPrice: 550,
      priority: 'Recommended',
      reason: 'Essential for background music, announcements, and party games.',
    });
  }

  optionalMissing.push({
    name: 'Party Photo Booth Props & Polaroid Frame',
    category: 'Decorations',
    recommendedQuantity: 1,
    unit: 'kit',
    estimatedUnitPrice: 450,
    priority: 'Optional',
    reason: 'Adds fun memory-making activity for social media sharing.',
  });

  const missingItems = [
    ...essentialMissing.map((i) => ({ ...i, estimatedUnitPrice: i.estimatedUnitPrice })),
    ...recommendedMissing.map((i) => ({ ...i, estimatedUnitPrice: i.estimatedUnitPrice })),
    ...optionalMissing.map((i) => ({ ...i, estimatedUnitPrice: i.estimatedUnitPrice })),
  ];

  let score = 100;
  score -= essentialMissing.length * 18;
  score -= recommendedMissing.length * 7;
  score = Math.max(25, Math.min(100, score));

  if (score >= 90) {
    tips.push('Your party plan has high completeness and covers all critical guest needs.');
  } else {
    tips.push('Review the missing items to ensure smooth hospitality and avoid last-minute store runs.');
  }

  return {
    summary:
      score >= 85
        ? 'Great job! Your party checklist covers virtually all essentials.'
        : `We identified ${essentialMissing.length} essential items that would enhance your event.`,
    score,
    essentialMissing,
    recommendedMissing,
    optionalMissing,
    missingItems,
    advisories,
    weatherAlert,
    tips,
  };
}

/**
 * Guest-Aware Shopping Quantity Recalculator
 */
export function recalculateQuantitiesForConfirmedGuests(
  items: ShoppingItem[],
  originalGuestCount: number,
  confirmedGuestCount: number
): Array<{
  item: ShoppingItem;
  currentQuantity: number;
  recommendedQuantity: number;
  difference: number;
  costDifference: number;
}> {
  if (originalGuestCount <= 0 || confirmedGuestCount <= 0) return [];
  const ratio = confirmedGuestCount / originalGuestCount;

  return items
    .filter((i) => !i.isRemoved)
    .map((item) => {
      let newQty = item.recommendedQuantity;
      if (['Food', 'Drinks', 'Tableware', 'Guest Supplies'].includes(item.category)) {
        newQty = Math.max(1, Math.round(item.recommendedQuantity * ratio));
      } else if (item.category === 'Cake & Desserts' && item.unit === 'kg') {
        newQty = Math.max(1, Math.round(item.recommendedQuantity * ratio * 10) / 10);
      }

      const diff = newQty - item.recommendedQuantity;
      const costDiff = diff * item.estimatedUnitPrice;

      return {
        item,
        currentQuantity: item.recommendedQuantity,
        recommendedQuantity: newQty,
        difference: diff,
        costDifference: costDiff,
      };
    });
}
