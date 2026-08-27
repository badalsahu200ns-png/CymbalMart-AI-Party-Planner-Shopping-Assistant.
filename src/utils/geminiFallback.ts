import { PartyEvent, ShoppingItem, PartyType } from '../types';

export function generatePersonalizedInviteText(guestName: string, event: PartyEvent): string {
  const dateFormatted = event.eventDate || 'Upcoming Date';
  const venueStr = event.venue?.name ? `at ${event.venue.name} (${event.venue.address || event.venue.city || ''})` : '';

  return `🎉 You're Invited!

Dear ${guestName},

You are cordially invited to celebrate ${event.name}!

📅 Date: ${dateFormatted}
⏰ Time: ${event.startTime || '18:00'} - ${event.endTime || '22:00'}
📍 Venue: ${venueStr || 'Private Venue'}
🎨 Theme: ${event.theme || 'Celebration'}

Please RSVP at your earliest convenience so we can prepare your personalized hospitality.

Warm regards,
Hosted with CymbalMart AI Party Planner`;
}

export function generateDefaultShoppingListForEvent(
  type: PartyType,
  theme: string,
  guestCount: number,
  isOutdoor: boolean
): ShoppingItem[] {
  const items: ShoppingItem[] = [];

  // Cake
  const cakeWeight = Math.max(1, Math.round((guestCount * 0.08) * 10) / 10);
  items.push({
    id: `shp-gen-${Date.now()}-1`,
    name: `${theme || type} Designer Celebration Cake`,
    category: 'Cake & Desserts',
    recommendedQuantity: cakeWeight,
    unit: 'kg',
    estimatedUnitPrice: 1000,
    estimatedTotalPrice: cakeWeight * 1000,
    priority: 'Essential',
    reason: `Custom centerpiece celebration cake for ${guestCount} guests (~${cakeWeight}kg).`,
    optionalAlternative: {
      name: 'Standard Bakery Fresh Cake',
      estimatedUnitPrice: 700,
      estimatedSavings: 300,
      reason: 'Saves 30% while retaining high taste quality.',
    },
  });

  // Food
  const appetizerPlatters = Math.max(1, Math.ceil(guestCount / 12));
  items.push({
    id: `shp-gen-${Date.now()}-2`,
    name: 'Party Appetizer & Finger Food Platter',
    category: 'Food',
    recommendedQuantity: appetizerPlatters,
    unit: 'platters',
    estimatedUnitPrice: 850,
    estimatedTotalPrice: appetizerPlatters * 850,
    priority: 'Essential',
    reason: `Savory appetizers scaled for ${guestCount} attendees.`,
  });

  // Drinks
  const drinksCount = Math.ceil(guestCount * 1.5);
  items.push({
    id: `shp-gen-${Date.now()}-3`,
    name: 'Sparkling Party Mocktails & Beverages',
    category: 'Drinks',
    recommendedQuantity: drinksCount,
    unit: 'bottles (1L)',
    estimatedUnitPrice: 85,
    estimatedTotalPrice: drinksCount * 85,
    priority: 'Essential',
    reason: `Hydration and welcome beverages for ${guestCount} guests.`,
  });

  // Tableware
  const tablewareCount = Math.ceil(guestCount * 1.25);
  items.push({
    id: `shp-gen-${Date.now()}-4`,
    name: 'Eco-Friendly Dinner Plates & Cutlery Kit',
    category: 'Tableware',
    recommendedQuantity: tablewareCount,
    unit: 'sets',
    estimatedUnitPrice: 16,
    estimatedTotalPrice: tablewareCount * 16,
    priority: 'Essential',
    reason: `Plates, spoons, and forks with spare buffer.`,
  });

  // Cups
  const cupsCount = Math.ceil(guestCount * 2);
  items.push({
    id: `shp-gen-${Date.now()}-5`,
    name: 'Biodegradable Beverage Cups',
    category: 'Tableware',
    recommendedQuantity: cupsCount,
    unit: 'cups',
    estimatedUnitPrice: 10,
    estimatedTotalPrice: cupsCount * 10,
    priority: 'Essential',
    reason: `Multi-round drinking cups.`,
  });

  // Decorations
  items.push({
    id: `shp-gen-${Date.now()}-6`,
    name: `${theme || 'Celebration'} Backdrop Banner & Balloon Garland Kit`,
    category: 'Decorations',
    recommendedQuantity: 1,
    unit: 'kit',
    estimatedUnitPrice: 750,
    estimatedTotalPrice: 750,
    priority: 'Recommended',
    reason: `Transforms venue ambiance to match ${theme} aesthetic.`,
    optionalAlternative: {
      name: 'Simple Ribbon & Fairy Light Pack',
      estimatedUnitPrice: 300,
      estimatedSavings: 450,
      reason: 'Minimalist decoration saving ₹450.',
    },
  });

  // Cleaning
  items.push({
    id: `shp-gen-${Date.now()}-7`,
    name: 'Post-Party Heavy Duty Cleanup Bags & Wipes',
    category: 'Cleaning Supplies',
    recommendedQuantity: 2,
    unit: 'packs',
    estimatedUnitPrice: 95,
    estimatedTotalPrice: 190,
    priority: 'Essential',
    reason: `Quick hygienic post-event cleanup.`,
  });

  if (isOutdoor) {
    items.push({
      id: `shp-gen-${Date.now()}-8`,
      name: 'Outdoor Citronella Bug Repellent & Sunscreen Kit',
      category: 'Guest Supplies',
      recommendedQuantity: 1,
      unit: 'kit',
      estimatedUnitPrice: 320,
      estimatedTotalPrice: 320,
      priority: 'Recommended',
      reason: 'Outdoor hospitality and comfort station.',
    });
  }

  return items;
}
