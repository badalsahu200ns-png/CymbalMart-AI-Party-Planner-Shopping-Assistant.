import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { formatTime12h } from '../utils/calculations';
import {
  Mail,
  Send,
  Sparkles,
  Copy,
  Check,
  Share2,
  Users,
  MessageSquare,
  RefreshCw,
  QrCode,
  PartyPopper,
  MapPin,
  Calendar,
} from 'lucide-react';

export const InvitationsView: React.FC = () => {
  const {
    activeEvent,
    selectedGuestForInvite,
    setSelectedGuestForInvite,
    resendInvitation,
    generateInvitationForGuest,
    addToast,
  } = useParty();

  const [activeGuestId, setActiveGuestId] = useState<string>(() => {
    return selectedGuestForInvite?.id || activeEvent.guests[0]?.id || '';
  });

  const [copied, setCopied] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const activeGuest = activeEvent.guests.find((g) => g.id === activeGuestId) || activeEvent.guests[0];

  const handleCopyInviteText = () => {
    if (!activeGuest) return;
    const text = activeGuest.personalizedMessage || activeGuest.personalizedInviteText || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('Invitation message copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateInvite = async () => {
    if (!activeGuest) return;
    setIsGeneratingAi(true);
    await generateInvitationForGuest(activeGuest.id);
    setIsGeneratingAi(false);
    addToast(`Regenerated custom invitation for ${activeGuest.name}!`, 'success');
  };

  const handleDispatch = (guestId: string) => {
    resendInvitation(guestId);
  };

  const handleDispatchAll = () => {
    activeEvent.guests.forEach((g) => {
      resendInvitation(g.id);
    });
    addToast(`Dispatched invitations to all ${activeEvent.guests.length} guests!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-purple-600" />
            <span>Invitations &amp; RSVP Delivery</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Canonical invitations center for "{activeEvent.name}". AI-crafted personalized cards and delivery tracking.
          </p>
        </div>

        {activeEvent.guests.length > 0 && (
          <button
            onClick={handleDispatchAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/20 shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Invitations to All ({activeEvent.guests.length})</span>
          </button>
        )}
      </div>

      {activeEvent.guests.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">No Guests in Event Roster</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please add guests in the Guest List section first to generate personalized invitations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guest Selector Sidebar */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Guest ({activeEvent.guests.length})
            </h2>

            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {activeEvent.guests.map((guest) => {
                const isSelected = guest.id === activeGuest?.id;
                return (
                  <button
                    key={guest.id}
                    onClick={() => {
                      setActiveGuestId(guest.id);
                      setSelectedGuestForInvite(guest);
                    }}
                    className={`w-full p-3 rounded-2xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{guest.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                        {guest.invitationStatus} • RSVP: {guest.rsvpStatus}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : guest.invitationSent
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {guest.invitationSent ? 'Sent' : 'Draft'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Invitation Preview Card */}
          <div className="lg:col-span-2 space-y-4">
            {activeGuest && (
              <div className="p-6 rounded-3xl bg-white border border-purple-200 shadow-xl space-y-6">
                {/* Visual Invitation Top Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-purple-100">
                      Official Event Invitation
                    </span>
                    <PartyPopper className="w-5 h-5 text-amber-300 animate-bounce" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                    {activeEvent.name}
                  </h2>
                  <p className="text-xs text-purple-100">
                    Theme: <strong>{activeEvent.theme}</strong>
                  </p>
                </div>

                {/* Key Logistics Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="text-slate-500 text-[10px]">Date &amp; Time</div>
                      <div className="font-bold text-slate-900">
                        {activeEvent.eventDate} at {formatTime12h(activeEvent.startTime)}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-slate-500 text-[10px]">Venue Location</div>
                      <div className="font-bold text-slate-900 truncate">
                        {activeEvent.venue.name}, {activeEvent.venue.city}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personalized Message Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                      <span>Personalized Message for {activeGuest.name}</span>
                    </label>

                    <button
                      onClick={handleRegenerateInvite}
                      disabled={isGeneratingAi}
                      className="text-xs text-purple-700 hover:text-purple-800 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAi ? 'Crafting...' : 'AI Rewrite'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-mono">
                    {activeGuest.personalizedMessage || activeGuest.personalizedInviteText}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Status: <strong className="text-purple-700">{activeGuest.invitationStatus}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyInviteText}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>

                    <button
                      onClick={() => handleDispatch(activeGuest.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-all shadow-md shadow-purple-600/20 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Invitation</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
