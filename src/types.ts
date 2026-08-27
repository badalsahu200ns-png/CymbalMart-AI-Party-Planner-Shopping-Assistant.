export type PartyType =
  | 'Birthday Party'
  | "Children's Birthday Party"
  | 'Corporate Team Event'
  | 'Wedding Reception'
  | 'Anniversary'
  | 'Baby Shower'
  | 'Housewarming'
  | 'Graduation Party'
  | 'Festival Celebration'
  | 'Outdoor BBQ / Picnic'
  | 'Custom Celebration';

export type Priority = 'Essential' | 'Recommended' | 'Optional';

export type ShoppingCategory =
  | 'Food'
  | 'Drinks'
  | 'Cake & Desserts'
  | 'Decorations'
  | 'Tableware'
  | 'Entertainment'
  | 'Guest Supplies'
  | 'Cleaning Supplies'
  | 'Miscellaneous';

export type RSVPStatus = 'Confirmed' | 'Maybe' | 'Declined' | 'Pending';

export type InvitationStatus = 'Generated' | 'Scheduled' | 'Sent' | 'Delivered' | 'Failed';

export type ReminderStatus = 'Scheduled' | 'Sent' | 'Delivered';

export type DietaryPreference =
  | 'Vegetarian'
  | 'Vegan'
  | 'Jain'
  | 'Gluten-free'
  | 'Nut-free'
  | 'Kids-friendly'
  | 'Low-sugar'
  | 'Halal'
  | 'Kosher';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  recommendedQuantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  priority: Priority;
  reason: string;
  optionalAlternative?: {
    name: string;
    estimatedUnitPrice: number;
    estimatedSavings: number;
    reason: string;
  };
  isCustom?: boolean;
  isRemoved?: boolean;
  checked?: boolean;
}

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  invitationStatus: InvitationStatus;
  invitationSent?: boolean;
  rsvpStatus: RSVPStatus;
  invitationTimestamp?: string;
  reminderStatus: ReminderStatus;
  reminderTimestamp?: string;
  personalizedMessage?: string;
  personalizedInviteText?: string;
  dietaryNotes?: string;
  plusOnes?: number;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  notes?: string;
  parkingNotes?: string;
}

export interface PartyEvent {
  id: string;
  userId: string;
  name: string;
  type: PartyType;
  theme: string;
  guestCount: number;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  budget: number;
  ageGroup: 'Kids (0-12)' | 'Teens (13-17)' | 'Adults (18+)' | 'All Ages' | 'Corporate';
  isOutdoor: boolean;
  venue: Venue;
  dietaryPreferences: DietaryPreference[];
  specialRequests?: string;
  shoppingItems: ShoppingItem[];
  guests: Guest[];
  createdAt: string;
  updatedAt: string;
  isFinalized?: boolean;
}

export interface BudgetOptimizationSuggestion {
  id: string;
  itemId: string;
  itemName: string;
  category: ShoppingCategory;
  currentPrice: number;
  suggestedAction: 'replace' | 'reduce' | 'remove';
  alternativeName?: string;
  alternativePrice?: number;
  suggestedAlternative?: string;
  suggestedQuantity?: number;
  estimatedSavings: number;
  reason: string;
  accepted?: boolean;
}

export interface CheckPartyMissingItem {
  name: string;
  category: ShoppingCategory;
  recommendedQuantity: number;
  unit: string;
  estimatedUnitPrice: number;
  priority: Priority;
  reason: string;
}

export interface CheckPartyAnalysis {
  summary: string;
  score: number; // 0 - 100 completeness score
  essentialMissing: CheckPartyMissingItem[];
  recommendedMissing: CheckPartyMissingItem[];
  optionalMissing: CheckPartyMissingItem[];
  missingItems: Array<{
    name: string;
    category: ShoppingCategory;
    priority: Priority;
    reason: string;
    estimatedUnitPrice: number;
  }>;
  advisories: string[];
  weatherAlert?: string;
  dietaryAlert?: string;
  tips: string[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  currency: string;
  currencySymbol: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  actionExecuted?: string;
  navigatedTo?: string;
  updatedDataSummary?: string;
  suggestedPrompts?: string[];
}

export type NavigationTab =
  | 'dashboard'
  | 'planner'
  | 'shopping'
  | 'budget'
  | 'guests'
  | 'invitations'
  | 'venue'
  | 'calendar'
  | 'final-review';
