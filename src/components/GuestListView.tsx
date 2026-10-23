import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { RSVPStatus, InvitationStatus, ReminderStatus } from '../types';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Utensils,
  BellRing,
} from 'lucide-react';

export const GuestListView: React.FC = () => {
  const {
    activeEvent,
    guestMetrics,
    addGuest,
    updateGuest,
    deleteGuest,
    updateGuestRSVP,
    resendInvitation,
    recalculateShoppingForConfirmedGuests,
    isAddGuestFormOpen,
    setIsAddGuestFormOpen,
    setSelectedGuestForInvite,
    setCurrentTab,
    addToast,
  } = useParty();

  const [rsvpFilter, setRsvpFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Guest Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [plusOnes, setPlusOnes] = useState(0);

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addGuest({
      name,
      email: email || undefined,
      phone: phone || undefined,
      dietaryNotes: dietaryNotes || undefined,
      plusOnes,
    });

    if (res.success) {
      setName('');
      setEmail('');
      setPhone('');
      setDietaryNotes('');
      setPlusOnes(0);
      setIsAddGuestFormOpen(false);
    }
  };

  const filteredGuests = activeEvent.guests.filter((g) => {
    if (rsvpFilter !== 'All' && g.rsvpStatus !== rsvpFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        (g.phone && g.phone.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Guest List &amp; RSVP Manager</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Canonical guest roster for "{activeEvent.name}". Single Source of Truth updates invite status and catering counts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddGuestFormOpen(!isAddGuestFormOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAddGuestFormOpen ? 'Close Form' : 'Add Guest'}</span>
          </button>
        </div>
      </div>

      {/* Guest Metrics & Guest-Aware Shopping Recalculator Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
          <div className="text-xs text-slate-500 font-medium">Total Roster</div>
          <div className="text-2xl font-display font-black text-slate-900 mt-1">
            {guestMetrics.total}{' '}
            <span className="text-xs font-normal text-slate-500">/ {activeEvent.guestCount} target</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
          <div className="text-xs font-medium">Confirmed RSVPs</div>
          <div className="text-2xl font-display font-black mt-1">
            {guestMetrics.confirmed} <span className="text-xs font-normal">guests</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
          <div className="text-xs font-medium">Pending / Maybe</div>
          <div className="text-2xl font-display font-black mt-1">
            {guestMetrics.pending + guestMetrics.maybe} <span className="text-xs font-normal">awaiting</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col justify-between">
          <div className="text-[11px] text-blue-900 font-medium">
            Guest-Aware Shopping Sync
          </div>
          <button
            onClick={recalculateShoppingForConfirmedGuests}
            className="mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-[11px] font-bold text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Recalculate Shopping List</span>
          </button>
        </div>
      </div>

      {/* Add Guest Drawer Form */}
      {isAddGuestFormOpen && (
        <form
          onSubmit={handleAddGuestSubmit}
          className="p-6 rounded-3xl bg-white border-2 border-indigo-400 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Add Guest to Roster</span>
            </h2>
            <span className="text-xs text-slate-500">Automatic duplicate prevention enabled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 00000"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Dietary Restrictions &amp; Notes</label>
              <input
                type="text"
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                placeholder="e.g. Vegan, nut allergy, Jain food"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Plus Ones</label>
              <input
                type="number"
                min="0"
                max="5"
                value={plusOnes}
                onChange={(e) => setPlusOnes(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddGuestFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/20"
            >
              Add Guest
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Confirmed', 'Pending', 'Maybe', 'Declined'].map((tab) => (
            <button
              key={tab}
              onClick={() => setRsvpFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                rsvpFilter === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guest by name or contact..."
          className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
        />
      </div>

      {/* Guest Roster Cards */}
      <div className="space-y-3">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No guests found</p>
            <p className="text-xs text-slate-500">Add guests using the button above to begin invitations.</p>
          </div>
        ) : (
          filteredGuests.map((guest) => {
            return (
              <div
                key={guest.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  {/* Guest Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{guest.name}</span>
                      {guest.plusOnes ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                          +{guest.plusOnes} guest
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {guest.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {guest.email}
                        </span>
                      )}
                      {guest.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {guest.phone}
                        </span>
                      )}
                      {guest.dietaryNotes && (
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Utensils className="w-3 h-3" />
                          {guest.dietaryNotes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RSVP & Quick Controls */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* RSVP Status Selector */}
                    <select
                      value={guest.rsvpStatus}
                      onChange={(e) => updateGuestRSVP(guest.id, e.target.value as RSVPStatus)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors focus:outline-none ${
                        guest.rsvpStatus === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : guest.rsvpStatus === 'Declined'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : guest.rsvpStatus === 'Maybe'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Maybe">Maybe</option>
                      <option value="Declined">Declined</option>
                    </select>

                    {/* Go to Invitation */}
                    <button
                      onClick={() => {
                        setSelectedGuestForInvite(guest);
                        setCurrentTab('invitations');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 border border-indigo-200 transition-colors"
                      title="Generate / View Invitation"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteGuest(guest.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove guest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Reminder & Delivery Footnote */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <BellRing className="w-3 h-3 text-amber-600" />
                    <span>
                      1-Hour Reminder: <strong className="text-slate-700">{guest.reminderStatus}</strong> for {activeEvent.eventDate}
                    </span>
                  </div>

                  <div>
                    Invite status: <span className="font-semibold text-slate-700">{guest.invitationStatus}</span>
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
