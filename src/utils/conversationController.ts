import {
  PartyEvent,
  ShoppingItem,
  ShoppingCategory,
  Priority,
  PartyType,
  StructuredPlanningSession,
  PlanningStage,
} from '../types';
import { formatCurrency, calculateTotalCost } from './calculations';
import { generateDefaultShoppingListForEvent } from './geminiFallback';

export interface ControllerResult {
  executedAction: boolean;
  actionType?: string;
  reply: string;
  spokenReply?: string;
  updatedDataSummary?: string;
  navigatedTo?: string;
  suggestedPrompts: string[];
  sessionUpdates?: Partial<StructuredPlanningSession>;
  eventUpdates?: Partial<PartyEvent>;
  nextStage?: PlanningStage;
  isPlanComplete?: boolean;
}

const WORD_NUMBERS: Record<string, number> = {
  one: 1, a: 1, an: 1, two: 2, couple: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  dozen: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50,
};

export function parseNumberFromText(text: string): number | null {
  const clean = text.toLowerCase().trim();
  const digitMatch = clean.match(/(\d+)/);
  if (digitMatch) {
    return parseInt(digitMatch[1], 10);
  }
  for (const [word, val] of Object.entries(WORD_NUMBERS)) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(clean)) {
      return val;
    }
  }
  return null;
}

/**
 * Determine next missing essential planning field
 */
export function getNextMissingField(session: StructuredPlanningSession, event: PartyEvent): {
  field: 'details' | 'age_group' | 'guests' | 'budget' | 'theme' | 'items' | 'complete';
  prompt: string;
  spokenPrompt: string;
  suggestedPrompts: string[];
} {
  // 1. Check if guest count is known
  if (!session.guestCount && (!event.guestCount || event.guestCount <= 0)) {
    return {
      field: 'guests',
      prompt: "How many guests are you expecting for the celebration?",
      spokenPrompt: "How many guests are you expecting for the celebration?",
      suggestedPrompts: ["12 guests", "20 guests", "Just family (8 people)"],
    };
  }

  // 2. Check if budget is known
  if (!session.budget && (!event.budget || event.budget <= 0)) {
    return {
      field: 'budget',
      prompt: "What is your total budget for this party in Indian Rupees?",
      spokenPrompt: "What is your total budget for this party?",
      suggestedPrompts: ["₹5,000", "₹7,000", "₹10,000"],
    };
  }

  // 3. Check if age group / style is known
  if (!session.ageGroup) {
    return {
      field: 'age_group',
      prompt: "What kind of birthday celebration are you planning: a children's party, an adult birthday, or something else?",
      spokenPrompt: "Is this celebration for a child, an adult, or all ages?",
      suggestedPrompts: ["Adult birthday", "Children's birthday party", "Family celebration"],
    };
  }

  // 4. Check if theme is known
  if (!session.theme) {
    return {
      field: 'theme',
      prompt: "Great! Do you have a theme in mind, or would you like me to suggest one?",
      spokenPrompt: "Do you have a theme in mind, or would you like me to suggest one?",
      suggestedPrompts: ["Suggest something colorful", "Superhero theme", "Bollywood Retro", "No theme, keep it simple"],
    };
  }

  // 5. Check if items/supplies have been confirmed
  if (!session.completedStages.includes('items_and_supplies')) {
    return {
      field: 'items',
      prompt: `I'll suggest a ${session.theme || 'festive'} celebration! Would you like help with decorations, food, drinks, cake, and party supplies?`,
      spokenPrompt: `Would you like help with decorations, food, drinks, cake, and party supplies?`,
      suggestedPrompts: ["Yes, all of them", "Just cake and drinks", "Add two bottles of sparkling water"],
    };
  }

  // 6. Plan is complete
  const totalCost = calculateTotalCost(event.shoppingItems);
  const remaining = event.budget - totalCost;
  return {
    field: 'complete',
    prompt: `Your birthday plan is ready! You have ${event.shoppingItems.filter(i => !i.isRemoved).length} items totaling ${formatCurrency(totalCost)} against your ${formatCurrency(event.budget)} budget (${remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `over by ${formatCurrency(Math.abs(remaining))}`}).\n\nWould you like to change anything, add more items, review the budget, or finish planning?`,
    spokenPrompt: `Your birthday plan is ready! Would you like to change anything, add more items, review the budget, or finish planning?`,
    suggestedPrompts: [
      "Add two bottles of sparkling water",
      "Change my budget to ₹7,000",
      "Remove balloons",
      "How much money do I have left?",
    ],
  };
}

/**
 * Main Controller: Processes user speech or text through step-by-step conversation state machine
 */
export function processConversationalTurn(
  userInput: string,
  session: StructuredPlanningSession,
  activeEvent: PartyEvent
): ControllerResult {
  const lower = userInput.toLowerCase().trim();

  // -------------------------------------------------------------
  // RULE 0: VALIDATION & ERROR CHECKS (Invalid budgets, negative quantities)
  // -------------------------------------------------------------
  if (/(?:budget|amount).*?(?:-\d+|negative)/i.test(lower) || /-\s*(?:₹|rs\.?|inr)?\s*\d+/i.test(lower)) {
    return {
      executedAction: false,
      reply: "The party budget cannot be negative. Please specify a positive budget in Rupees (e.g., 'Change my budget to ₹7,000').",
      spokenReply: "The party budget cannot be negative. Please specify a positive budget in Rupees.",
      suggestedPrompts: ["Change my budget to ₹7,000", "Show me my remaining budget"],
    };
  }

  if (/(?:add|buy|need)\s+(?:-\d+|zero|0)\s+/i.test(lower)) {
    return {
      executedAction: false,
      reply: "Item quantities must be positive. For example, say 'Add two bottles of sparkling water'.",
      spokenReply: "Item quantities must be positive. Please specify at least one item.",
      suggestedPrompts: ["Add two bottles of sparkling water", "Add snacks for 12 guests"],
    };
  }

  // -------------------------------------------------------------
  // RULE 1: AMBIGUOUS QUERY RESOLUTION (Clarification questions)
  // -------------------------------------------------------------
  if (lower === 'water' || lower === 'bottled water' || lower === 'sparkling water') {
    return {
      executedAction: true,
      actionType: 'clarify_item',
      reply: "Would you like to add Bottled Water (₹35 each) or Sparkling Water (₹70 each) to your shopping list? You can say 'Add 2 bottles of sparkling water' or 'Add 10 bottles of water'.",
      spokenReply: "Would you like to add Bottled Water or Sparkling Water to your shopping list?",
      suggestedPrompts: ["Add two bottles of sparkling water", "Add 10 bottles of water", "View Drinks Aisle"],
    };
  }

  if (lower === 'budget' || lower === 'my budget' || lower === 'the budget') {
    const totalCost = calculateTotalCost(activeEvent.shoppingItems);
    const rem = activeEvent.budget - totalCost;
    return {
      executedAction: true,
      actionType: 'query_budget',
      reply: `Your active budget is ${formatCurrency(activeEvent.budget)} (estimated spend: ${formatCurrency(totalCost)}, remaining: ${formatCurrency(rem)}). Would you like to review your budget breakdown or change your budget ceiling?`,
      spokenReply: `Your active budget is ${activeEvent.budget} rupees with ${rem} rupees remaining. Would you like to change it or view details?`,
      suggestedPrompts: ["Show me my remaining budget", "Change my budget to ₹7,000", "How much will the party cost?"],
    };
  }

  if (lower === 'decorations' || lower === 'decor' || lower === 'balloons') {
    return {
      executedAction: true,
      actionType: 'clarify_decorations',
      reply: "Would you like decoration recommendations for your celebration theme, or would you like to view the Decorations aisle in your shopping list?",
      spokenReply: "Would you like decoration recommendations, or would you like to view the decorations aisle?",
      suggestedPrompts: ["Suggest decorations for a children's birthday", "View Decorations Aisle"],
    };
  }

  // -------------------------------------------------------------
  // RULE 2: SPECIFIC ACTION - ADD SPARKLING WATER OR OTHER ITEMS
  // E.g. "Add two bottles of sparkling water"
  // -------------------------------------------------------------
  const isSparklingWater = /sparkling\s*water/i.test(lower);
  const addMatch = lower.match(/(?:please\s+)?(?:add|include|buy|need)\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a|an)\s+(?:bottles?\s+of\s+)?([a-zA-Z\s]+?)(?:for\s+(?:₹|rs\.?|inr)?\s*(\d+))?$/i);

  if (isSparklingWater || addMatch) {
    let qty = 1;
    let rawItem = 'sparkling water';

    if (isSparklingWater) {
      rawItem = 'sparkling water';
      // Look for quantity word or number
      const qMatch = lower.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|a|an)\s+(?:bottles?\s+of\s+)?sparkling/i);
      if (qMatch) {
        const rawQ = qMatch[1].toLowerCase();
        qty = /^\d+$/.test(rawQ) ? parseInt(rawQ, 10) : (WORD_NUMBERS[rawQ] || 1);
      } else {
        qty = 2; // Default to 2 if mentioned as "bottles of sparkling water"
      }
    } else if (addMatch) {
      const rawQ = addMatch[1].toLowerCase();
      qty = /^\d+$/.test(rawQ) ? parseInt(rawQ, 10) : (WORD_NUMBERS[rawQ] || 1);
      rawItem = addMatch[2].trim();
    }

    const isSparkling = /sparkling/i.test(rawItem);
    const isOrdinaryWater = /water/i.test(rawItem) && !isSparkling;
    const unitPrice = isSparkling ? 70 : (isOrdinaryWater ? 35 : 50);
    const category: ShoppingCategory = (isSparkling || isOrdinaryWater || /juice|drink|soda/i.test(rawItem))
      ? 'Drinks'
      : (/balloon|light|banner|candle/i.test(rawItem) ? 'Decorations' : 'Food');

    const formattedName = isSparkling ? 'Sparkling Water (750ml bottle)' : (isOrdinaryWater ? 'Bottled Natural Spring Water' : rawItem.charAt(0).toUpperCase() + rawItem.slice(1));

    // Check if item already exists
    const existingIndex = activeEvent.shoppingItems.findIndex(i =>
      !i.isRemoved && (
        isSparkling ? /sparkling/i.test(i.name) : (isOrdinaryWater ? (/water/i.test(i.name) && !/sparkling/i.test(i.name)) : i.name.toLowerCase().includes(rawItem))
      )
    );

    let updatedList = [...activeEvent.shoppingItems];
    if (existingIndex >= 0) {
      const ex = updatedList[existingIndex];
      const newQty = ex.recommendedQuantity + qty;
      updatedList[existingIndex] = {
        ...ex,
        recommendedQuantity: newQty,
        estimatedTotalPrice: newQty * ex.estimatedUnitPrice,
      };
    } else {
      const newItem: ShoppingItem = {
        id: `shp-alexa-${Date.now()}`,
        name: formattedName,
        category,
        recommendedQuantity: qty,
        unit: isSparkling || isOrdinaryWater ? 'bottles' : 'units',
        estimatedUnitPrice: unitPrice,
        estimatedTotalPrice: qty * unitPrice,
        priority: 'Essential',
        reason: 'Added via Alexa Assistant',
        isCustom: true,
      };
      updatedList = [newItem, ...updatedList];
    }

    const newTotal = calculateTotalCost(updatedList);
    const newRemaining = activeEvent.budget - newTotal;

    return {
      executedAction: true,
      actionType: 'add_item',
      reply: `Done! I've added ${qty} ${qty === 1 ? 'bottle' : 'bottles'} of ${isSparkling ? 'sparkling water' : formattedName} to your shopping list. Your estimated total has been updated.`,
      spokenReply: `Done! I've added ${qty} ${qty === 1 ? 'bottle' : 'bottles'} of ${isSparkling ? 'sparkling water' : formattedName} to your shopping list. Your estimated total has been updated.`,
      updatedDataSummary: `Item Added: ${qty}x ${formattedName} (@ ₹${unitPrice})\nNew Shopping Total: ${formatCurrency(newTotal)}\nRemaining Budget: ${formatCurrency(newRemaining)}`,
      suggestedPrompts: ["How much money do I have left?", "Remove balloons", "View shopping list"],
      eventUpdates: { shoppingItems: updatedList },
    };
  }

  // -------------------------------------------------------------
  // RULE 3: SPECIFIC ACTION - REMOVE BALLOONS OR OTHER ITEMS
  // E.g. "Remove balloons", "Remove the balloons", "Remove balloons from my shopping list"
  // -------------------------------------------------------------
  if (lower.startsWith('remove ') || lower.startsWith('delete ') || lower.includes('remove balloon') || lower.includes('take off')) {
    const isBalloons = /balloon/i.test(lower);
    const cleaned = lower
      .replace(/^(?:please\s+)?(?:remove|delete|take\s+off)\s+(?:the\s+)?/i, '')
      .replace(/\s+from\s+(?:my\s+)?(?:shopping\s+)?list/i, '')
      .trim();

    const targetItem = activeEvent.shoppingItems.find(i => {
      if (i.isRemoved) return false;
      if (isBalloons) return /balloon/i.test(i.name);
      return i.name.toLowerCase().includes(cleaned) || cleaned.includes(i.name.toLowerCase());
    });

    if (targetItem) {
      const updatedList = activeEvent.shoppingItems.map(i =>
        i.id === targetItem.id ? { ...i, isRemoved: true } : i
      );
      const newTotal = calculateTotalCost(updatedList);
      const newRemaining = activeEvent.budget - newTotal;

      return {
        executedAction: true,
        actionType: 'remove_item',
        reply: `Done! I've removed "${targetItem.name}" from your shopping list. Your estimated total has been recalculated.`,
        spokenReply: `Done! I've removed ${targetItem.name} from your shopping list.`,
        updatedDataSummary: `Removed: ${targetItem.name}\nNew Shopping Total: ${formatCurrency(newTotal)}\nRemaining Budget: ${formatCurrency(newRemaining)}`,
        suggestedPrompts: ["How much money do I have left?", "Change my budget to ₹7,000", "View shopping list"],
        eventUpdates: { shoppingItems: updatedList },
      };
    } else {
      return {
        executedAction: true,
        actionType: 'remove_item_not_found',
        reply: `I couldn't find "${cleaned || 'that item'}" on your active shopping list. You can view your current list to see all items.`,
        spokenReply: `I couldn't find that item on your active shopping list.`,
        suggestedPrompts: ["View shopping list", "How much money do I have left?"],
      };
    }
  }

  // -------------------------------------------------------------
  // RULE 4: SPECIFIC ACTION - CHANGE BUDGET
  // E.g. "Change my budget to ₹7,000", "Set budget to 7000"
  // (Executed before generic budget queries)
  // -------------------------------------------------------------
  if (/(?:change|set|increase|update|make)\s+(?:my\s+|the\s+)?budget|budget\s*(?:to|at|is|=)/i.test(lower)) {
    const budgetMatch = lower.match(/(?:(?:change|set|increase|update|make)\s+(?:my\s+|the\s+)?budget|budget\s*(?:to|at|is|=))\s*(?:to\s+)?(?:₹|rs\.?|inr)?\s*([\d,]+)/i);
    if (budgetMatch) {
      const newBudget = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(newBudget) && newBudget > 0) {
        const currentTotal = calculateTotalCost(activeEvent.shoppingItems);
        const newRemaining = newBudget - currentTotal;

        return {
          executedAction: true,
          actionType: 'change_budget',
          reply: `Done! I've updated your budget to ${formatCurrency(newBudget)}. Your remaining budget has been recalculated.`,
          spokenReply: `Done! I've updated your budget to ${newBudget} rupees.`,
          updatedDataSummary: `New Allocated Budget: ${formatCurrency(newBudget)}\nCurrent Spending: ${formatCurrency(currentTotal)}\nRemaining: ${formatCurrency(newRemaining)} (${newRemaining >= 0 ? 'Within budget' : 'Over budget'})`,
          suggestedPrompts: ["How much money do I have left?", "Add two bottles of sparkling water", "View budget breakdown"],
          eventUpdates: { budget: newBudget },
          sessionUpdates: { budget: newBudget },
        };
      }
    }
  }

  // -------------------------------------------------------------
  // RULE 5: QUERY - HOW MUCH MONEY DO I HAVE LEFT? / REMAINING BUDGET
  // -------------------------------------------------------------
  if (
    lower.includes('how much money do i have left') ||
    lower.includes('how much do i have left') ||
    lower.includes('money left') ||
    lower.includes('remaining budget') ||
    lower.includes('how much will the party cost') ||
    lower.includes('party cost')
  ) {
    const totalCost = calculateTotalCost(activeEvent.shoppingItems);
    const rem = activeEvent.budget - totalCost;
    const isOver = rem < 0;

    const explanation = isOver
      ? `You have spent ${formatCurrency(totalCost)} against your ${formatCurrency(activeEvent.budget)} budget. You are currently over budget by ${formatCurrency(Math.abs(rem))}.`
      : `You have ${formatCurrency(rem)} left of your ${formatCurrency(activeEvent.budget)} budget (estimated shopping total: ${formatCurrency(totalCost)}).`;

    return {
      executedAction: true,
      actionType: 'budget_inquiry',
      reply: explanation,
      spokenReply: isOver
        ? `You are over your budget by ${Math.abs(rem)} rupees.`
        : `You have ${rem} rupees remaining of your ${activeEvent.budget} rupees budget.`,
      updatedDataSummary: `Allocated Budget: ${formatCurrency(activeEvent.budget)}\nCurrent Shopping: ${formatCurrency(totalCost)}\nRemaining: ${formatCurrency(rem)}`,
      suggestedPrompts: ["Change my budget to ₹7,000", "Optimize budget", "View Shopping List"],
      navigatedTo: 'Budget',
    };
  }

  // -------------------------------------------------------------
  // RULE 6: ACTION - ADD ENOUGH SNACKS FOR 12 GUESTS
  // -------------------------------------------------------------
  if (/add\s+(?:enough\s+)?snacks?\s+for\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(?:guests?|people)/i.test(lower) || (lower.includes('add snacks') && lower.includes('guests'))) {
    const num = parseNumberFromText(lower) || activeEvent.guestCount || 12;
    const snackUnitPrice = 50; // ₹50 per guest serving
    const totalSnackCost = num * snackUnitPrice;

    const snackItem: ShoppingItem = {
      id: `shp-alexa-snacks-${Date.now()}`,
      name: `Party Snack Platter & Savory Bites (for ${num} guests)`,
      category: 'Food',
      recommendedQuantity: num,
      unit: 'servings',
      estimatedUnitPrice: snackUnitPrice,
      estimatedTotalPrice: totalSnackCost,
      priority: 'Essential',
      reason: `Provisioned for ${num} guests (~₹50 per guest)`,
      isCustom: true,
    };

    const updatedList = [snackItem, ...activeEvent.shoppingItems];
    const newTotal = calculateTotalCost(updatedList);
    const newRemaining = activeEvent.budget - newTotal;

    return {
      executedAction: true,
      actionType: 'add_snacks',
      reply: `Done! I've added party snack platters for ${num} guests (${formatCurrency(totalSnackCost)} at ₹${snackUnitPrice}/guest) to your shopping list.`,
      spokenReply: `Done! I've added party snacks for ${num} guests to your shopping list.`,
      updatedDataSummary: `Added: Snack Platters for ${num} guests\nCost: ${formatCurrency(totalSnackCost)}\nNew Shopping Total: ${formatCurrency(newTotal)}\nRemaining Budget: ${formatCurrency(newRemaining)}`,
      suggestedPrompts: ["Add two bottles of sparkling water", "How much money do I have left?", "View shopping list"],
      eventUpdates: { shoppingItems: updatedList },
    };
  }

  // -------------------------------------------------------------
  // RULE 7: ACTION - SUGGEST DECORATIONS
  // -------------------------------------------------------------
  if (lower.includes('suggest decoration') || lower.includes('decoration suggestion') || lower.includes('decorations for')) {
    return {
      executedAction: true,
      actionType: 'suggest_decorations',
      reply: "Here are popular decoration ideas tailored for your party:\n• Themed Balloon Garland & Happy Birthday Foil Banner (est. ₹550)\n• Warm LED Fairy String Lights (est. ₹350)\n• Confetti Table Centerpieces (est. ₹250)\n• Fun Photo Booth Backdrop Kit (est. ₹480)\n\nWould you like me to add any of these to your shopping list?",
      spokenReply: "I recommend a balloon garland, fairy lights, and a photo booth backdrop. Would you like me to add any of these to your list?",
      suggestedPrompts: ["Add fairy lights", "Add balloon garland", "View Decorations Aisle"],
    };
  }

  // -------------------------------------------------------------
  // RULE 8: MULTI-ENTITY EXTRACTION - "Plan a birthday party for 12 guests with a budget of ₹5,000"
  // -------------------------------------------------------------
  const isPlanningUtterance =
    (/plan.*(?:birthday|party|celebration)|create.*(?:birthday|party|celebration)/i.test(lower) ||
    (lower.includes('birthday') && (lower.includes('guest') || lower.includes('budget'))));

  if (isPlanningUtterance) {
    const guestMatch = lower.match(/(\d+)\s*(?:people|guests|attendees|persons)?/i);
    const budgetMatch = lower.match(/(?:₹|rs\.?\s*|rupees?\s*|inr\s*)([\d,]+)/i) ||
                        lower.match(/budget\s*(?:of|to|is)?\s*(?:₹|rs\.?\s*|inr\s*)?([\d,]+)/i);

    const parsedGuests = guestMatch ? parseInt(guestMatch[1], 10) : undefined;
    const parsedBudget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ''), 10) : undefined;

    // Detect celebrant name if mentioned (e.g. "Rahul's birthday", "for Priya")
    const nameMatch = lower.match(/(?:plan|for)\s+([A-Za-z]+)(?:'s)?\s+(?:birthday|party)/i);
    const celebrant = nameMatch ? nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1) : session.celebrant;

    // Detect style if mentioned (adult, children, kids)
    let ageGroup = session.ageGroup;
    if (lower.includes('adult') || lower.includes('grown')) ageGroup = 'Adults (18+)';
    else if (lower.includes('child') || lower.includes('kid')) ageGroup = 'Kids (0-12)';

    // Detect theme if mentioned
    let theme = session.theme;
    if (lower.includes('superhero')) theme = 'Superhero Adventure';
    else if (lower.includes('retro')) theme = 'Retro 90s Disco';
    else if (lower.includes('color')) theme = 'Colorful Fiesta';

    const sessionUpdates: Partial<StructuredPlanningSession> = {
      celebrant,
      guestCount: parsedGuests || session.guestCount,
      budget: parsedBudget || session.budget,
      ageGroup,
      theme,
      completedStages: Array.from(new Set([
        ...session.completedStages,
        ...(parsedGuests ? ['guest_count' as PlanningStage] : []),
        ...(parsedBudget ? ['budget' as PlanningStage] : []),
        ...(ageGroup ? ['celebration_details' as PlanningStage] : []),
      ])),
    };

    const finalGuests = parsedGuests || session.guestCount || activeEvent.guestCount;
    const finalBudget = parsedBudget || session.budget || activeEvent.budget;
    const eventName = celebrant ? `${celebrant}'s Birthday Celebration` : `Birthday Party for ${finalGuests} Guests`;

    // Generate starter shopping list if starting new plan
    const starterItems = generateDefaultShoppingListForEvent('Birthday Party', theme || 'Celebration', finalGuests, false);
    const totalCost = calculateTotalCost(starterItems);
    const remaining = finalBudget - totalCost;

    const eventUpdates: Partial<PartyEvent> = {
      name: eventName,
      type: 'Birthday Party',
      guestCount: finalGuests,
      budget: finalBudget,
      theme: theme || 'Celebration',
      shoppingItems: starterItems,
    };

    // Determine what to ask next without repeating what was just provided!
    const updatedSession: StructuredPlanningSession = {
      ...session,
      ...sessionUpdates,
    };

    const next = getNextMissingField(updatedSession, { ...activeEvent, ...eventUpdates } as PartyEvent);

    return {
      executedAction: true,
      actionType: 'configure_party',
      reply: `Great! I've set up your birthday celebration for ${finalGuests} guests with a budget of ${formatCurrency(finalBudget)}. I've already staged a matching starter shopping list.\n\n${next.prompt}`,
      spokenReply: `Great! I've set up your birthday celebration for ${finalGuests} guests with a budget of ${finalBudget} rupees. ${next.spokenPrompt}`,
      updatedDataSummary: `Event: ${eventName}\nTarget Guests: ${finalGuests}\nAllocated Budget: ${formatCurrency(finalBudget)}\nStarter Items: ${starterItems.length} items (${formatCurrency(totalCost)})\nRemaining Budget: ${formatCurrency(remaining)}`,
      suggestedPrompts: next.suggestedPrompts,
      sessionUpdates,
      eventUpdates,
      nextStage: next.field === 'complete' ? 'review_ready' : undefined,
    };
  }

  // -------------------------------------------------------------
  // RULE 9: PROGRESSIVE STEP-BY-STEP CONVERSATION FLOW
  // Handle answers to current missing field
  // -------------------------------------------------------------

  // If responding to theme (e.g. "Suggest something colorful", "superhero", "colorful")
  if (lower.includes('color') || lower.includes('superhero') || lower.includes('retro') || lower.includes('simple') || lower.includes('bollywood') || lower.includes('tropical')) {
    const selectedTheme = lower.includes('color') ? 'Colorful Celebration' :
      (lower.includes('superhero') ? 'Superhero Adventure' :
      (lower.includes('retro') ? 'Retro 90s Disco' :
      (lower.includes('bollywood') ? 'Bollywood Glam' : 'Tropical Neon Fiesta')));

    const sessionUpdates: Partial<StructuredPlanningSession> = {
      theme: selectedTheme,
      completedStages: Array.from(new Set([...session.completedStages, 'theme_style' as PlanningStage])),
    };

    const next = getNextMissingField({ ...session, ...sessionUpdates }, activeEvent);

    return {
      executedAction: true,
      actionType: 'set_theme',
      reply: `I'll organize a ${selectedTheme}! ${next.prompt}`,
      spokenReply: `I'll organize a ${selectedTheme}! ${next.spokenPrompt}`,
      suggestedPrompts: next.suggestedPrompts,
      sessionUpdates,
      eventUpdates: { theme: selectedTheme },
    };
  }

  // If answering "Yes", "Yes all of them" to the supplies question
  if (/^(?:yes|sure|please|all|all\s+of\s+them|yep|yeah|sounds\s+good)/i.test(lower)) {
    const updatedStages = Array.from(new Set([...session.completedStages, 'items_and_supplies' as PlanningStage]));
    const next = getNextMissingField({ ...session, completedStages: updatedStages }, activeEvent);

    return {
      executedAction: true,
      actionType: 'confirm_supplies',
      reply: `Wonderful! I have organized your complete shopping list with cake, mocktails, festive tableware, and colorful decorations.\n\n${next.prompt}`,
      spokenReply: `Wonderful! Your complete shopping list is ready. ${next.spokenPrompt}`,
      suggestedPrompts: next.suggestedPrompts,
      sessionUpdates: { completedStages: updatedStages, isCompleted: true },
      nextStage: 'review_ready',
      isPlanComplete: true,
    };
  }

  // If answering guest count alone (e.g. "12 guests", "20")
  const directGuestNum = parseNumberFromText(lower);
  if (directGuestNum && (lower.includes('guest') || lower.includes('people') || directGuestNum <= 200)) {
    const sessionUpdates: Partial<StructuredPlanningSession> = {
      guestCount: directGuestNum,
      completedStages: Array.from(new Set([...session.completedStages, 'guest_count' as PlanningStage])),
    };
    const next = getNextMissingField({ ...session, ...sessionUpdates }, { ...activeEvent, guestCount: directGuestNum });

    return {
      executedAction: true,
      actionType: 'set_guests',
      reply: `Noted: ${directGuestNum} guests. ${next.prompt}`,
      spokenReply: `Noted, ${directGuestNum} guests. ${next.spokenPrompt}`,
      suggestedPrompts: next.suggestedPrompts,
      sessionUpdates,
      eventUpdates: { guestCount: directGuestNum },
    };
  }

  // If answering budget alone (e.g. "₹5,000", "5000", "7000 rupees")
  const directBudgetMatch = lower.match(/(?:₹|rs\.?\s*|inr\s*)?([\d,]+)(?:\s*(?:rupees?|inr))?/i);
  if (directBudgetMatch) {
    const directBudget = parseInt(directBudgetMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(directBudget) && directBudget >= 500) {
      const sessionUpdates: Partial<StructuredPlanningSession> = {
        budget: directBudget,
        completedStages: Array.from(new Set([...session.completedStages, 'budget' as PlanningStage])),
      };
      const next = getNextMissingField({ ...session, ...sessionUpdates }, { ...activeEvent, budget: directBudget });

      return {
        executedAction: true,
        actionType: 'set_budget',
        reply: `Budget set to ${formatCurrency(directBudget)}. ${next.prompt}`,
        spokenReply: `Budget set to ${directBudget} rupees. ${next.spokenPrompt}`,
        suggestedPrompts: next.suggestedPrompts,
        sessionUpdates,
        eventUpdates: { budget: directBudget },
      };
    }
  }

  // Fallback: Check what field is still missing and prompt naturally
  const nextMissing = getNextMissingField(session, activeEvent);
  return {
    executedAction: false,
    reply: `I understand! Let's continue shaping your party: ${nextMissing.prompt}`,
    spokenReply: nextMissing.spokenPrompt,
    suggestedPrompts: nextMissing.suggestedPrompts,
  };
}
