import React, { useState, useEffect } from 'react';
import { PartyProvider, useParty } from './context/PartyContext';
import { NavbarHeader } from './components/NavbarHeader';
import { SidebarNav } from './components/SidebarNav';
import { ToastContainer } from './components/ToastContainer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { WelcomePlanningDialog } from './components/WelcomePlanningDialog';
import { BirthdayLogo } from './components/BirthdayLogo';

// Canonical Views
import { DashboardView } from './components/DashboardView';
import { PartyPlannerView } from './components/PartyPlannerView';
import { ShoppingListView } from './components/ShoppingListView';
import { BudgetView } from './components/BudgetView';
import { GuestListView } from './components/GuestListView';
import { InvitationsView } from './components/InvitationsView';
import { VenueView } from './components/VenueView';
import { CalendarView } from './components/CalendarView';
import { FinalReviewView } from './components/FinalReviewView';
import { ExternalLink, SlidersHorizontal, Heart, Sparkles, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentTab, setCurrentTab, setIsAssistantOpen, startAlexaPlanningSession } = useParty();
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Check initial session visit for Startup Choice modal
  useEffect(() => {
    try {
      const alreadyWelcomed = sessionStorage.getItem('cymbalmart_session_welcomed');
      if (!alreadyWelcomed) {
        setIsWelcomeOpen(true);
      }
    } catch {
      // If sessionStorage is unavailable, show welcome modal
      setIsWelcomeOpen(true);
    }
  }, []);

  const handleSelectAlexaPlan = () => {
    try {
      sessionStorage.setItem('cymbalmart_session_welcomed', 'true');
    } catch {
      // ignore
    }
    setIsWelcomeOpen(false);
    startAlexaPlanningSession();
  };

  const handleSelectManualPlan = () => {
    try {
      sessionStorage.setItem('cymbalmart_session_welcomed', 'true');
    } catch {
      // ignore
    }
    setIsWelcomeOpen(false);
    setCurrentTab('planner');
  };

  const handleOpenWelcome = () => {
    setIsWelcomeOpen(true);
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'planner':
        return <PartyPlannerView />;
      case 'shopping':
        return <ShoppingListView />;
      case 'budget':
        return <BudgetView />;
      case 'guests':
        return <GuestListView />;
      case 'invitations':
        return <InvitationsView />;
      case 'venue':
        return <VenueView />;
      case 'calendar':
        return <CalendarView />;
      case 'final-review':
        return <FinalReviewView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Universal Sticky Top Header */}
      <NavbarHeader onOpenWelcome={handleOpenWelcome} />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Canonical Sidebar Navigation */}
        <SidebarNav onOpenWelcome={handleOpenWelcome} />

        {/* Dynamic Canonical Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" id="main-content">
          {renderActiveTab()}
        </main>
      </div>

      {/* Premium Consumer Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white text-slate-600 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <BirthdayLogo variant="compact" />
            <div className="text-xs text-slate-500 border-l sm:border-slate-200 sm:pl-4">
              <p className="font-semibold text-slate-700">
                CymbalMart PLANNER – Birthday
              </p>
              <p>Smart Event &amp; Shopping Assistant • Alexa-Inspired Experience</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <button
              onClick={handleOpenWelcome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              title="Change planning mode"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>Switch Planning Mode</span>
            </button>

            <a
              href="/creator.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              title="Meet the creator Badal Kumar Sahu"
            >
              <span>Created by Badal Kumar Sahu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Simulated Alexa-style voice and conversational shopping assistant. All party data is client-managed.</span>
          </div>
          <div>
            Built with React 19, Tailwind CSS, and Google Gemini API.
          </div>
        </div>
      </footer>

      {/* Startup Choice Welcome Dialog */}
      <WelcomePlanningDialog
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onSelectAlexaPlan={handleSelectAlexaPlan}
        onSelectManualPlan={handleSelectManualPlan}
      />

      {/* AI Assistant Controller Drawer */}
      <AIAssistantDrawer />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <PartyProvider>
      <MainLayout />
    </PartyProvider>
  );
}

export default App;
