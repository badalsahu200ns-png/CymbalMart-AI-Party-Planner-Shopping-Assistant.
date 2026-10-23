import React, { useState, useEffect } from 'react';
import { PartyProvider, useParty } from './context/PartyContext';
import { NavbarHeader } from './components/NavbarHeader';
import { SidebarNav } from './components/SidebarNav';
import { ToastContainer } from './components/ToastContainer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { WelcomePlanningDialog } from './components/WelcomePlanningDialog';
import { BirthdayLogo } from './components/BirthdayLogo';
import { ProductShowcaseModal } from './components/ProductShowcaseModal';

// Reference Screens & Canonical Views
import { CelebrationStartHub } from './components/CelebrationStartHub'; // Screen A (My Hub)
import { EventPlanningWorkspaceView } from './components/EventPlanningWorkspaceView'; // Screen B (Planning)
import { ShoppingDashboardView } from './components/ShoppingDashboardView'; // Screen C (Shopping)
import { ReportsBudgetView } from './components/ReportsBudgetView'; // Screen D (Reports)
import { CelebrationsView } from './components/CelebrationsView';
import { SuppliersView } from './components/SuppliersView';
import { SettingsView } from './components/SettingsView';
import { FeedbackView } from './components/FeedbackView';

// Existing Canonical Views
import { PartyPlannerView } from './components/PartyPlannerView';
import { BudgetView } from './components/BudgetView';
import { GuestListView } from './components/GuestListView';
import { InvitationsView } from './components/InvitationsView';
import { VenueView } from './components/VenueView';
import { CalendarView } from './components/CalendarView';

import { ExternalLink, SlidersHorizontal, ShieldCheck, Film, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentTab, setCurrentTab, startAlexaPlanningSession } = useParty();
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);

  // Check initial session visit for Startup Choice modal
  useEffect(() => {
    try {
      const alreadyWelcomed = sessionStorage.getItem('cymbalmart_session_welcomed');
      if (!alreadyWelcomed) {
        setIsWelcomeOpen(true);
      }
    } catch {
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
    setCurrentTab('my-hub');
  };

  const handleOpenWelcome = () => {
    setIsWelcomeOpen(true);
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      // 10 Official Reference Sidebar Items
      case 'my-hub':
      case 'dashboard':
        return <CelebrationStartHub />;

      case 'events':
        return <PartyPlannerView />;

      case 'planning':
      case 'planner':
        return <EventPlanningWorkspaceView />;

      case 'celebrations':
        return <CelebrationsView />;

      case 'shopping':
        return <ShoppingDashboardView />;

      case 'suppliers':
        return <SuppliersView />;

      case 'budgets':
      case 'budget':
        return <BudgetView />;

      case 'reports':
      case 'final-review':
        return <ReportsBudgetView />;

      case 'settings':
        return <SettingsView />;

      case 'feedback':
        return <FeedbackView />;

      // Legacy view aliases
      case 'guests':
        return <GuestListView />;
      case 'invitations':
        return <InvitationsView />;
      case 'venue':
        return <VenueView />;
      case 'calendar':
        return <CalendarView />;

      default:
        return <CelebrationStartHub />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Universal Sticky Top Header */}
      <NavbarHeader
        onOpenWelcome={handleOpenWelcome}
        onOpenShowcase={() => setIsShowcaseOpen(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Canonical 10-Item Sidebar Navigation */}
        <SidebarNav
          onOpenWelcome={handleOpenWelcome}
          onOpenShowcase={() => setIsShowcaseOpen(true)}
        />

        {/* Dynamic Canonical Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" id="main-content">
          {renderActiveTab()}
        </main>
      </div>

      {/* Premium Consumer Footer with Badal Kumar Sahu Attribution */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white text-slate-600 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <BirthdayLogo variant="compact" />
            <div className="text-xs text-slate-500 border-l sm:border-slate-200 sm:pl-4">
              <p className="font-bold text-slate-800">
                CymbalMart AI Party Planner
              </p>
              <p>Plan smarter. Shop with purpose. Celebrate more.</p>
            </div>
          </div>

          {/* Attribution & Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            {/* 10s Demo Button */}
            <button
              onClick={() => setIsShowcaseOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-emerald-600" />
              <span>Watch 10s Product Demo</span>
            </button>

            {/* Portfolio Link */}
            <a
              href="https://badalsahu200ns-png.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Creator Badal Kumar Sahu Portfolio"
            >
              <span>Badal Kumar Sahu (Portfolio)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/badalsahu200ns"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Connect on LinkedIn"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/badalsahu200ns-png"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="View GitHub Repository"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>CymbalMart AI Party Planner • Conversational Intelligence, Retail Optimization &amp; Event Logistics.</span>
          </div>
          <div>
            Built with React 19, Tailwind CSS, TypeScript &amp; Google Gemini API.
          </div>
        </div>
      </footer>

      {/* 10-Second Video Showcase Modal */}
      <ProductShowcaseModal
        isOpen={isShowcaseOpen}
        onClose={() => setIsShowcaseOpen(false)}
      />

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
