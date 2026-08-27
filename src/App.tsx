import React from 'react';
import { PartyProvider, useParty } from './context/PartyContext';
import { NavbarHeader } from './components/NavbarHeader';
import { SidebarNav } from './components/SidebarNav';
import { ToastContainer } from './components/ToastContainer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

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

const MainLayout: React.FC = () => {
  const { currentTab } = useParty();

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Universal Sticky Top Header */}
      <NavbarHeader />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Canonical Sidebar Navigation */}
        <SidebarNav />

        {/* Dynamic Canonical Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>
      </div>

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
