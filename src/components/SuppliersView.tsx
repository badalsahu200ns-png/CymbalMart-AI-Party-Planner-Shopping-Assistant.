import React, { useState } from 'react';
import { CURATED_SUPPLIERS } from '../data/suppliersData';
import { Supplier } from '../types';
import { formatCurrency } from '../utils/calculations';
import {
  Store,
  Star,
  MapPin,
  Phone,
  Mail,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookedSupplierIds, setBookedSupplierIds] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Venue', 'Catering', 'Decor & Flowers', 'Bakery', 'Photography', 'Music & DJ'];

  const filteredSuppliers = CURATED_SUPPLIERS.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleBook = (id: string) => {
    setBookedSupplierIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Store className="w-3.5 h-3.5" />
          <span>Curated Partner Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Suppliers &amp; Venues
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Hand-vetted venues, artisanal caterers, floral decorators, and entertainment specialists.
        </p>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const isBooked = !!bookedSupplierIds[supplier.id];

          return (
            <div
              key={supplier.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={supplier.imageUrl}
                  alt={supplier.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
                  {supplier.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-900/90 text-white flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{supplier.rating}</span>
                  <span className="text-slate-400 text-[10px]">({supplier.reviewsCount})</span>
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {supplier.name}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 shrink-0">
                      {supplier.priceRange}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{supplier.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5 mb-4">
                    {supplier.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-[11px]">Est. package from:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {formatCurrency(supplier.estimatedPrice || 10000)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBook(supplier.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isBooked
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isBooked ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Supplier Inquired</span>
                        </>
                      ) : (
                        <span>Inquire / Book</span>
                      )}
                    </button>

                    <a
                      href={`tel:${supplier.contactPhone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Call Supplier"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
