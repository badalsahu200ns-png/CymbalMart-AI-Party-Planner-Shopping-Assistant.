import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { ShoppingCategory, Priority, ShoppingItem } from '../types';
import { SHOPPING_CATEGORIES, formatCurrency } from '../utils/calculations';
import {
  ShoppingCart,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Tag,
  IndianRupee,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ShoppingListView: React.FC = () => {
  const {
    activeEvent,
    totalShoppingCost,
    remainingBudget,
    isOverBudget,
    addShoppingItem,
    updateShoppingItemQuantity,
    removeShoppingItem,
    restoreShoppingItem,
    toggleItemPriority,
    replaceWithAlternative,
    isAddItemFormOpen,
    setIsAddItemFormOpen,
  } = useParty();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRemoved, setShowRemoved] = useState(false);

  // New Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ShoppingCategory>('Food');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState(100);
  const [newItemPriority, setNewItemPriority] = useState<Priority>('Essential');
  const [newItemReason, setNewItemReason] = useState('');

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addShoppingItem({
      name: newItemName.trim(),
      category: newItemCategory,
      recommendedQuantity: newItemQuantity,
      unit: newItemUnit.trim() || 'units',
      estimatedUnitPrice: newItemUnitPrice,
      priority: newItemPriority,
      reason: newItemReason.trim() || 'Custom item added by host',
    });

    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnitPrice(100);
    setNewItemReason('');
    setIsAddItemFormOpen(false);
  };

  const filteredItems = activeEvent.shoppingItems.filter((item) => {
    if (!showRemoved && item.isRemoved) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'All' && item.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Financial Live Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-emerald-600" />
            <span>Shopping List &amp; Aisle Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Canonical shopping items for "{activeEvent.name}". Single Source of Truth updates budget and metrics instantly.
          </p>
        </div>

        <button
          onClick={() => setIsAddItemFormOpen(!isAddItemFormOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAddItemFormOpen ? 'Close Form' : 'Add Item'}</span>
        </button>
      </div>

      {/* Live Budget Sync Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
          <span className="text-slate-500 font-medium">Estimated Items Total:</span>
          <div className="text-lg font-display font-black text-slate-900 mt-0.5">
            {formatCurrency(totalShoppingCost)}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
          <span className="text-slate-500 font-medium">Allocated Budget:</span>
          <div className="text-lg font-display font-black text-slate-900 mt-0.5">
            {formatCurrency(activeEvent.budget)}
          </div>
        </div>
        <div
          className={`p-3.5 rounded-2xl border ${
            isOverBudget
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <span className="font-medium">Remaining Budget:</span>
          <div className="text-lg font-display font-black mt-0.5">
            {isOverBudget
              ? `OVER by ${formatCurrency(Math.abs(remainingBudget))}`
              : `${formatCurrency(remainingBudget)} left`}
          </div>
        </div>
      </div>

      {/* Add Item Canonical Form Drawer */}
      {isAddItemFormOpen && (
        <form
          onSubmit={handleAddItemSubmit}
          className="p-6 rounded-3xl bg-white border-2 border-emerald-400 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add New Shopping Item</span>
            </h2>
            <span className="text-xs text-slate-500">Canonical Shopping Creator</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Item Name *</label>
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Biodegradable Bamboo Straws"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Aisle / Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as ShoppingCategory)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {SHOPPING_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Priority</label>
              <select
                value={newItemPriority}
                onChange={(e) => setNewItemPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Essential">Essential</option>
                <option value="Recommended">Recommended</option>
                <option value="Optional">Optional</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Quantity</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Unit Label</label>
              <input
                type="text"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                placeholder="units, packs, kg, bottles"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Estimated Unit Price (₹)</label>
              <input
                type="number"
                min="0"
                value={newItemUnitPrice}
                onChange={(e) => setNewItemUnitPrice(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Estimated Total</label>
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-emerald-700 font-bold">
                {formatCurrency(newItemQuantity * newItemUnitPrice)}
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Reason / Usage Note</label>
              <input
                type="text"
                value={newItemReason}
                onChange={(e) => setNewItemReason(e.target.value)}
                placeholder="e.g. Refreshing welcome drink for guests"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddItemFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none font-medium text-xs"
            >
              <option value="All">All Categories</option>
              {SHOPPING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none font-medium text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="Essential">Essential</option>
              <option value="Recommended">Recommended</option>
              <option value="Optional">Optional</option>
            </select>
          </div>

          {/* Search Box */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-slate-800 text-xs">
            <input
              type="checkbox"
              checked={showRemoved}
              onChange={(e) => setShowRemoved(e.target.checked)}
              className="rounded bg-slate-100 border-slate-300 text-blue-600 focus:ring-0"
            />
            <span>Show removed ({activeEvent.shoppingItems.filter((i) => i.isRemoved).length})</span>
          </label>
        </div>
      </div>

      {/* Item Table / Cards */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <ShoppingCart className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No items match your filter</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or click "Add Item" above.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isRemoved = Boolean(item.isRemoved);
            const lineTotal = item.recommendedQuantity * item.estimatedUnitPrice;

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isRemoved
                    ? 'bg-slate-50/70 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isRemoved ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </span>

                      {/* Category Badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.category}
                      </span>

                      {/* Priority Badge */}
                      <button
                        type="button"
                        onClick={() => toggleItemPriority(item.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
                          item.priority === 'Essential'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : item.priority === 'Recommended'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.priority}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{item.reason}</p>

                    {/* Optional Alternative Banner */}
                    {item.optionalAlternative && !isRemoved && (
                      <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>
                            Alternative: <strong>{item.optionalAlternative.name}</strong> (Save ₹
                            {item.optionalAlternative.estimatedSavings * item.recommendedQuantity})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => replaceWithAlternative(item.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shrink-0"
                        >
                          Switch &amp; Save
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Quantity & Cost Controls */}
                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Stepper */}
                    {!isRemoved ? (
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateShoppingItemQuantity(
                              item.id,
                              Math.max(0.5, item.recommendedQuantity - (item.unit === 'kg' ? 0.5 : 1))
                            )
                          }
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-900 px-2 min-w-[50px] text-center">
                          {item.recommendedQuantity} {item.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateShoppingItemQuantity(
                              item.id,
                              item.recommendedQuantity + (item.unit === 'kg' ? 0.5 : 1)
                            )
                          }
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Removed</span>
                    )}

                    {/* Total Price */}
                    <div className="text-right min-w-[80px]">
                      <div className={`text-sm font-black ${isRemoved ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {formatCurrency(lineTotal)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        @{formatCurrency(item.estimatedUnitPrice)}/{item.unit}
                      </div>
                    </div>

                    {/* Remove/Restore Button */}
                    <div>
                      {isRemoved ? (
                        <button
                          type="button"
                          onClick={() => restoreShoppingItem(item.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Restore item"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeShoppingItem(item.id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
