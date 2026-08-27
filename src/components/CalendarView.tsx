import React from 'react';
import { useParty } from '../context/PartyContext';
import { getGoogleCalendarUrl, generateICSFile, formatTime12h } from '../utils/calculations';
import {
  Calendar as CalendarIcon,
  Clock,
  Download,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  MapPin,
  Users,
  BellRing,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { activeEvent, reminderInfo, addToast } = useParty();

  const googleCalUrl = getGoogleCalendarUrl(activeEvent);

  const handleDownloadIcs = () => {
    const icsString = generateICSFile(activeEvent);
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeEvent.name.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Downloaded .ics calendar file!', 'success');
  };

  // Generate suggested party run-of-show schedule
  const parseHour = (timeStr: string) => {
    const [h, m] = (timeStr || '18:00').split(':').map((x) => parseInt(x, 10));
    return h + (m || 0) / 60;
  };

  const startHour = parseHour(activeEvent.startTime);

  const formatOffsetTime = (baseHour: number, offsetMinutes: number) => {
    const totalMinutes = Math.round(baseHour * 60 + offsetMinutes);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const padH = h.toString().padStart(2, '0');
    const padM = m.toString().padStart(2, '0');
    return formatTime12h(`${padH}:${padM}`);
  };

  const scheduleMilestones = [
    {
      time: formatOffsetTime(startHour, -60),
      title: 'Host & Vendor Arrival / Setup',
      desc: 'Decorations setup, catering staging, and audio soundcheck.',
      icon: Clock,
      tag: 'Preparation',
    },
    {
      time: formatOffsetTime(startHour, 0),
      title: 'Guest Welcome & Signature Mocktails',
      desc: 'Doors open, background acoustic music, initial hospitality greeting.',
      icon: Users,
      tag: 'Arrivals',
    },
    {
      time: formatOffsetTime(startHour, 60),
      title: 'Appetizers & Social Games',
      desc: 'Warm starters served, photo booth activity, group conversations.',
      icon: Sparkles,
      tag: 'Activities',
    },
    {
      time: formatOffsetTime(startHour, 120),
      title: 'Celebration Moment & Cake Cutting',
      desc: 'Host speech, main event toast, and ceremonial dessert cutting.',
      icon: CheckCircle2,
      tag: 'Highlight',
    },
    {
      time: formatOffsetTime(startHour, 180),
      title: 'Dinner & Music Session',
      desc: 'Main course feast served and energetic music set.',
      icon: Sparkles,
      tag: 'Dining',
    },
    {
      time: formatOffsetTime(startHour, 240),
      title: 'Farewell & Return Gifts',
      desc: 'Thank you guest favors distributed and orderly closure.',
      icon: CheckCircle2,
      tag: 'Conclusion',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <span>Calendar & Run of Show Schedule</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Canonical schedule for "{activeEvent.name}". Sync to Google Calendar or export universal .ics files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={googleCalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/30"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Add to Google Calendar</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handleDownloadIcs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export .ICS File</span>
          </button>
        </div>
      </div>

      {/* Quick Event Summary Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1">
          <span className="text-slate-400 font-medium">Event Date</span>
          <div className="text-base font-bold text-white">{activeEvent.eventDate}</div>
        </div>
        <div className="space-y-1">
          <span className="text-slate-400 font-medium">Event Window</span>
          <div className="text-base font-bold text-white">
            {formatTime12h(activeEvent.startTime)} - {formatTime12h(activeEvent.endTime)}
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-slate-400 font-medium">1-Hour Alert</span>
          <div className="text-base font-bold text-amber-300">
            {reminderInfo.reminderTimeStr}
          </div>
        </div>
      </div>

      {/* Interactive Run of Show Timeline */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Curated Event Run of Show</span>
        </h2>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
          {scheduleMilestones.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative flex items-start gap-4 group">
                <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 shrink-0 z-10 group-hover:scale-110 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-300">{item.time}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
