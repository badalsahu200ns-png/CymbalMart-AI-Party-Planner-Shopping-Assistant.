import React, { useState } from 'react';
import { useParty } from '../context/PartyContext';
import { DEFAULT_PLANNING_TASKS } from '../data/planningTasks';
import { CURATED_SUPPLIERS } from '../data/suppliersData';
import { PlanningTask } from '../types';
import { formatCurrency } from '../utils/calculations';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle2,
  Circle,
  Plus,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckSquare,
  AlertCircle,
  Building,
} from 'lucide-react';

export const EventPlanningWorkspaceView: React.FC = () => {
  const {
    activeEvent,
    updateActiveEvent,
    setCurrentTab,
    totalShoppingCost,
    remainingBudget,
    guestMetrics,
    partyAnalysis,
    addGuest,
    resendInvitation,
    updateGuestRSVP,
  } = useParty();

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'planning' | 'pending' | 'milestones'>('planning');
  const [tasks, setTasks] = useState<PlanningTask[]>(DEFAULT_PLANNING_TASKS);
  const [taskFilter, setTaskFilter] = useState<string>('All');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<PlanningTask['category']>('Venue & Logistics');

  // Toggle task completed
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: PlanningTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: 'Custom added event planning task.',
      category: newTaskCategory,
      dueDate: activeEvent.eventDate,
      completed: false,
      priority: 'Medium',
      assignedTo: 'Badal Kumar Sahu',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  // Filter tasks based on workspace sub-tab
  const filteredTasks = tasks.filter((t) => {
    if (activeWorkspaceTab === 'pending') return !t.completed;
    if (activeWorkspaceTab === 'milestones') return t.completed;
    if (taskFilter !== 'All') return t.category === taskFilter;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  // Calculate event countdown days
  const calculateDaysLeft = () => {
    try {
      const eventTime = new Date(activeEvent.eventDate).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 14;
    }
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Event Overview Hero Bar */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wide">
                {activeEvent.type}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {daysLeft > 0 ? `${daysLeft} Days to Go` : 'Event Day!'}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                Theme: {activeEvent.theme}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeEvent.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {activeEvent.eventDate} ({activeEvent.startTime} - {activeEvent.endTime})
              </span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {activeEvent.venue.name}, {activeEvent.venue.city}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] uppercase font-bold text-slate-400">Budget Progress</span>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {formatCurrency(totalShoppingCost)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                of {formatCurrency(activeEvent.budget)} budget
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Confirmed RSVPs</span>
              <div className="text-base font-black text-emerald-700 mt-0.5">
                {guestMetrics.confirmed} <span className="text-xs font-semibold text-slate-500">/ {guestMetrics.total}</span>
              </div>
              <span className="text-[11px] text-emerald-800 font-medium">
                {guestMetrics.total > 0 ? Math.round((guestMetrics.confirmed / guestMetrics.total) * 100) : 0}% attending
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tasks Completed</span>
              <div className="text-base font-black text-slate-900 mt-0.5">
                {completedCount} <span className="text-xs font-semibold text-slate-500">/ {tasks.length}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {Math.round((completedCount / tasks.length) * 100)}% done
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Tabs: Planning, Pending, Milestones */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveWorkspaceTab('planning')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeWorkspaceTab === 'planning'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Planning ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeWorkspaceTab === 'pending'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending ({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('milestones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeWorkspaceTab === 'milestones'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Milestones ({completedCount})</span>
        </button>
      </div>

      {/* Split Columns: Checklists & Guests on Left, Suggested Suppliers on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Tasks & RSVPs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Checklist Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeWorkspaceTab === 'planning' && 'Event Planning Checklists'}
                  {activeWorkspaceTab === 'pending' && 'Pending Decisions & Actions'}
                  {activeWorkspaceTab === 'milestones' && 'Celebration Milestones Achieved'}
                </h3>
                <p className="text-xs text-slate-500">
                  Check off items as arrangements are finalized for your party.
                </p>
              </div>

              {activeWorkspaceTab === 'planning' && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={taskFilter}
                    onChange={(e) => setTaskFilter(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:border-emerald-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Venue & Logistics">Venue &amp; Logistics</option>
                    <option value="Food & Beverage">Food &amp; Beverage</option>
                    <option value="Decor & Atmosphere">Decor &amp; Atmosphere</option>
                    <option value="Guests & RSVPs">Guests &amp; RSVPs</option>
                    <option value="Shopping & Supplies">Shopping &amp; Supplies</option>
                  </select>
                </div>
              )}
            </div>

            {/* Quick Add Task Input */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add custom task (e.g. Confirm audio technician arrival)..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Task Item List */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No tasks matching the selected filter.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-emerald-400 shadow-2xs'
                    }`}
                  >
                    <button
                      type="button"
                      className={`mt-0.5 rounded-lg transition-colors ${
                        task.completed ? 'text-emerald-600' : 'text-slate-300 hover:text-emerald-500'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-bold leading-tight ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                        <span>Due: {task.dueDate}</span>
                        <span>•</span>
                        <span>Assigned to: {task.assignedTo || 'Badal'}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Guest Roster & RSVP Status Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Guest Roster &amp; RSVPs</h3>
                <p className="text-xs text-slate-500">
                  Live tracking for invitations, headcounts, and dietary preferences.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('guests')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Full Roster →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Confirmed</span>
                <div className="text-base font-black text-emerald-700">
                  {guestMetrics.confirmed}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-800">Pending</span>
                <div className="text-base font-black text-amber-700">
                  {guestMetrics.pending}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Declined</span>
                <div className="text-base font-black text-slate-700">
                  {guestMetrics.declined}
                </div>
              </div>
            </div>

            {/* Quick Guest List View */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {activeEvent.guests.slice(0, 5).map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px]">
                      {guest.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{guest.name}</div>
                      <div className="text-[10px] text-slate-400">{guest.email || 'WhatsApp invite'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        guest.rsvpStatus === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : guest.rsvpStatus === 'Maybe'
                          ? 'bg-amber-100 text-amber-800'
                          : guest.rsvpStatus === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {guest.rsvpStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Suggested Venues and Curated Suppliers */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Suggested Suppliers</h3>
                <p className="text-xs text-slate-500">Curated for {activeEvent.name}</p>
              </div>
              <button
                onClick={() => setCurrentTab('suppliers')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                All →
              </button>
            </div>

            <div className="space-y-3">
              {CURATED_SUPPLIERS.slice(0, 3).map((sup) => (
                <div
                  key={sup.id}
                  className="rounded-xl border border-slate-200 overflow-hidden group hover:border-emerald-400 transition-all bg-white"
                >
                  <div className="h-28 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={sup.imageUrl}
                      alt={sup.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                      {sup.category}
                    </span>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white">
                      ★ {sup.rating}
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {sup.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {sup.location} • {sup.priceRange}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">
                        ₹{(sup.estimatedPrice || 10000).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => setCurrentTab('suppliers')}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shopping Overview Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl border border-emerald-200 p-5">
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Shopping List Synced
            </h4>
            <p className="text-xs text-slate-600 mb-3">
              {activeEvent.shoppingItems.length} curated grocery &amp; decor supplies ready for checkout.
            </p>
            <button
              onClick={() => setCurrentTab('shopping')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer text-center"
            >
              Go to Shopping Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
