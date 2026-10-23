import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { ShoppingCategory, ShoppingItem, Priority } from '../types';
import { formatCurrency } from '../utils/calculations';
import {
  ShoppingCart,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Sparkles,
  Tag,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
  Filter,
  Check,
  Search,
} from 'lucide-react';

// Product photography dictionary by item name/category
const PRODUCT_IMAGES: Record<string, string> = {
  // Cake & Desserts
  'Artisan Mango Passionfruit 2-Tier Cake': 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=500&q=80',
  'Classic Tropical Vanilla Buttercream Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
  'Cake & Desserts': 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=80',

  // Drinks
  'Fresh Coconut & Sparkling Citrus Mocktail Mixers': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80',
  'Drinks': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',

  // Food
  'Gourmet Vegetable Slider Platters (50 pcs)': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80',
  'Paneer Tikka & Exotic Veg Skewer Grill Trays': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=500&q=80',
  'Food': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80',

  // Decorations
  'Neon Glow Garland & LED Palm Fairy Lights Kit': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80',
  'Standard Warm White Fairy String Lights': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80',
  'Decorations': 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80',

  // Tableware
  'Tableware': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=500&q=80',

  // Entertainment
  'Entertainment': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80',

  // Guest Supplies
  'Guest Supplies': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=500&q=80',
};

const getProductImage = (item: ShoppingItem): string => {
  if (item.imageUrl) return item.imageUrl;
  if (PRODUCT_IMAGES[item.name]) return PRODUCT_IMAGES[item.name];
  if (PRODUCT_IMAGES[item.category]) return PRODUCT_IMAGES[item.category];
  return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80';
};

export const ShoppingDashboardView: React.FC = () => {
  const {
    activeEvent,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    updateShoppingItemQuantity,
    removeShoppingItem,
    restoreShoppingItem,
    replaceWithAlternative,
    addShoppingItem,
    setCurrentTab,
  } = useParty();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [checkedItemIds, setCheckedItemIds] = useState<Record<string, boolean>>({});
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  // Categories list for filtering
  const categories: Array<ShoppingCategory | 'All'> = [
    'All',
    'Food',
    'Drinks',
    'Cake & Desserts',
    'Decorations',
    'Tableware',
    'Entertainment',
    'Guest Supplies',
  ];

  // Filter items
  const activeItems = activeEvent.shoppingItems.filter((i) => !i.isRemoved);
  const removedItems = activeEvent.shoppingItems.filter((i) => i.isRemoved);

  const displayedItems = activeItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate estimated total savings from alternatives
  const totalPotentialSavings = activeItems.reduce((acc, item) => {
    return acc + (item.optionalAlternative ? item.optionalAlternative.estimatedSavings : 0);
  }, 0);

  // Toggle checklist item
  const handleToggleCheck = (id: string) => {
    setCheckedItemIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveShoppingList = () => {
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  // Circular Spending Progress Calculations
  const budgetUtilization = activeEvent.budget > 0
    ? Math.min(Math.round((totalShoppingCost / activeEvent.budget) * 100), 100)
    : 0;

  // SVG Circular Gauge parameters
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (budgetUtilization / 100) * circumference;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner: Header + Circular Spending Progress Indicator */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Smart Retail Planning</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shopping Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Curated grocery, cake, beverages, and party supplies tailored to your {activeEvent.guestCount} guests.
            </p>

            {/* Savings Callout */}
            {totalPotentialSavings > 0 && (
              <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                <TrendingDown className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Potential savings available: <strong>₹{totalPotentialSavings.toLocaleString('en-IN')}</strong> by opting for smart bulk alternatives.
                </span>
              </div>
            )}
          </div>

          {/* Screen C Circular Spending Progress Ring */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/90 p-5 rounded-2xl border border-slate-200/80">
            {/* SVG Circular Ring */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Emerald Gradient Stroke Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={isOverBudget ? '#EF4444' : '#10B981'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Inside Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {budgetUtilization}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                  Budget Used
                </span>
              </div>
            </div>

            {/* Budget Numbers */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Spent</span>
                <div className="text-lg font-black text-slate-900 leading-tight">
                  {formatCurrency(totalShoppingCost)}
                </div>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Target Budget</span>
                <div className="text-sm font-bold text-slate-600">
                  {formatCurrency(activeEvent.budget)}
                </div>
              </div>
              <div className="pt-1">
                {isOverBudget ? (
                  <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[11px]">
                    Over by ₹{(totalShoppingCost - activeEvent.budget).toLocaleString('en-IN')}
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    ₹{remainingBudget.toLocaleString('en-IN')} remaining
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search within shopping list */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search shopping items..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Screen C: Shopping Items Checklist with Photography */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Procurement Checklist ({displayedItems.length} items)
            </h2>
            <p className="text-xs text-slate-500">
              Check off items as you shop in-store or add them directly to your CymbalMart cart.
            </p>
          </div>

          {/* Action Buttons: Add to Cart / Save List */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveShoppingList}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              {isSavedMessage ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>List Saved!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart / Save List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Item Rows */}
        <div className="space-y-3">
          {displayedItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No items found in category &quot;{selectedCategory}&quot;.
            </div>
          ) : (
            displayedItems.map((item) => {
              const isChecked = !!checkedItemIds[item.id];
              const imageUrl = getProductImage(item);

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-2xl border transition-all ${
                    isChecked
                      ? 'bg-slate-50/80 border-slate-200/80 opacity-70'
                      : 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                  }`}
                >
                  {/* Left: Checkbox + Product Photo + Details */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleCheck(item.id)}
                      className="shrink-0 text-slate-300 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Product Photo Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Name & Category Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold ${
                            isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                            item.priority === 'Essential'
                              ? 'bg-rose-50 text-rose-700'
                              : item.priority === 'Recommended'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.reason}
                      </p>

                      {/* Alternative Saving Pill */}
                      {item.optionalAlternative && (
                        <button
                          onClick={() => replaceWithAlternative(item.id)}
                          className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          <Tag className="w-3 h-3 text-emerald-600" />
                          <span>
                            Alternative available: {item.optionalAlternative.name} (Save ₹{item.optionalAlternative.estimatedSavings})
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity controls + Unit Price + Total Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                      <button
                        onClick={() =>
                          updateShoppingItemQuantity(
                            item.id,
                            Math.max(1, item.recommendedQuantity - 1)
                          )
                        }
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 min-w-[28px] text-center">
                        {item.recommendedQuantity} {item.unit}
                      </span>
                      <button
                        onClick={() =>
                          updateShoppingItemQuantity(
                            item.id,
                            item.recommendedQuantity + 1
                          )
                        }
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Unit Price & Total Price */}
                    <div className="text-right min-w-[80px]">
                      <div className="text-sm font-black text-slate-900">
                        {formatCurrency(item.estimatedTotalPrice)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatCurrency(item.estimatedUnitPrice)} / {item.unit}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeShoppingItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Removed Items Drawer if any */}
        {removedItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Removed Items ({removedItems.length})
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {removedItems.map((rem) => (
                <button
                  key={rem.id}
                  onClick={() => restoreShoppingItem(rem.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Restore {rem.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
