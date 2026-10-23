import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { Venue } from '../types';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Car,
  FileText,
  Clock,
  BellRing,
  Save,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export const VenueView: React.FC = () => {
  const { activeEvent, updateActiveEvent, reminderInfo, addToast } = useParty();

  const [venueName, setVenueName] = useState(activeEvent.venue.name);
  const [address, setAddress] = useState(activeEvent.venue.address || '');
  const [city, setCity] = useState(activeEvent.venue.city || '');
  const [state, setState] = useState(activeEvent.venue.state || '');
  const [postalCode, setPostalCode] = useState(activeEvent.venue.postalCode || '');
  const [notes, setNotes] = useState(activeEvent.venue.notes || '');
  const [parkingNotes, setParkingNotes] = useState(activeEvent.venue.parkingNotes || '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(activeEvent.venue.googleMapsUrl || '');

  React.useEffect(() => {
    setVenueName(activeEvent.venue.name);
    setAddress(activeEvent.venue.address || '');
    setCity(activeEvent.venue.city || '');
    setState(activeEvent.venue.state || '');
    setPostalCode(activeEvent.venue.postalCode || '');
    setNotes(activeEvent.venue.notes || '');
    setParkingNotes(activeEvent.venue.parkingNotes || '');
    setGoogleMapsUrl(activeEvent.venue.googleMapsUrl || '');
  }, [activeEvent.venue]);

  const handleSaveVenue = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedVenue: Venue = {
      name: venueName.trim() || 'Event Venue',
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      notes: notes.trim(),
      parkingNotes: parkingNotes.trim(),
      googleMapsUrl:
        googleMapsUrl.trim() ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${venueName} ${address} ${city}`
        )}`,
    };

    updateActiveEvent({ venue: updatedVenue });
    addToast('Venue details & navigation saved!', 'success');
  };

  const currentMapsUrl =
    activeEvent.venue.googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${activeEvent.venue.name} ${activeEvent.venue.address || ''} ${activeEvent.venue.city || ''}`
    )}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-red-500" />
            <span>Venue &amp; Google Maps Navigation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Canonical venue and location details for "{activeEvent.name}". Single Source of Truth for guest maps and alerts.
          </p>
        </div>

        <a
          href={currentMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/20 shrink-0 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Open Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* 1-Hour Automated Arrival Reminder Status Card */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              1-Hour Arrival Reminder Service
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Scheduled for {reminderInfo.reminderTimeStr} on {activeEvent.eventDate}
            </div>
            <div className="text-xs text-slate-600">
              Dispatches automated venue address &amp; map directions to all confirmed guests 60 mins before start.
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-200/60 border border-amber-300 text-amber-900 text-xs font-bold shrink-0">
          ● Scheduled
        </div>
      </div>

      {/* Venue Edit Form */}
      <form onSubmit={handleSaveVenue} className="space-y-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-500" />
            <span>Location Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Venue Name *</label>
              <input
                type="text"
                required
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Skyline Palms Rooftop Terrace"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 74 Hill Road, Bandra West"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">State / Postal Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="400050"
                  className="w-28 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Google Maps Direct URL</label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Guest Arrival & Parking Notes */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <span>Parking &amp; Arrival Logistics for Guests</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Parking Notes</label>
              <textarea
                rows={2}
                value={parkingNotes}
                onChange={(e) => setParkingNotes(e.target.value)}
                placeholder="e.g. Valet parking available at basement entrance. Free for party guests."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Access &amp; Setup Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Elevator access to 8th floor rooftop. Setup allowed 2 hours prior."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Venue Details</span>
          </button>
        </div>
      </form>
    </div>
  );
};
