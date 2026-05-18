import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeadsProvider, useLeads } from '../context/LeadsContext';
import { LeadModal } from '../components/LeadModal';
import { DashboardHome } from '../components/dashboard/DashboardHome';
import { LeadsView } from '../components/dashboard/LeadsView';
import { AnalyticsView } from '../components/dashboard/AnalyticsView';
import { UsersView } from '../components/dashboard/UsersView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { LeadDetailModal } from '../components/dashboard/LeadDetailModal';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';

export type DashboardPage = 'dashboard' | 'leads' | 'analytics' | 'users' | 'settings';

const DashboardShell: React.FC = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState<DashboardPage>('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const {
    isModalOpen, setIsModalOpen, selectedLead, handleSaveLead,
    isDetailOpen, setIsDetailOpen, detailLead, handleOpenEditModal, handleOpenDetails, handleOpenCreateModal,
  } = useLeads();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="crm-shell min-h-screen flex text-slate-100">
      <AppSidebar activePage={activePage} onNavigate={setActivePage} userRole={user?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto bg-[#0d111c]">
          {(['dashboard', 'leads', 'analytics', 'settings'] as DashboardPage[]).map((id) => (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize whitespace-nowrap ${
                activePage === id ? 'bg-violet-600 text-white' : 'text-slate-500'
              }`}
            >
              {id}
            </button>
          ))}
        </div>

        <AppHeader
          notificationsOpen={notificationsOpen}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          onCloseNotifications={() => setNotificationsOpen(false)}
        />

        <main className="flex-1 p-6 overflow-auto">
          {activePage === 'dashboard' && (
            <DashboardHome
              onNavigateToLeads={() => setActivePage('leads')}
              onViewLead={(lead) => { setActivePage('leads'); handleOpenDetails(lead); }}
              onAddLead={handleOpenCreateModal}
            />
          )}
          {activePage === 'leads' && <LeadsView />}
          {activePage === 'analytics' && <AnalyticsView />}
          {activePage === 'users' && user?.role === 'admin' && <UsersView />}
          {activePage === 'users' && user?.role !== 'admin' && (
            <p className="text-red-400 text-sm">Admin access required.</p>
          )}
          {activePage === 'settings' && <SettingsView />}
        </main>
      </div>

      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} lead={selectedLead} />
      {isDetailOpen && detailLead && (
        <LeadDetailModal
          lead={detailLead}
          onClose={() => setIsDetailOpen(false)}
          onEdit={() => { setIsDetailOpen(false); handleOpenEditModal(detailLead); }}
        />
      )}
    </div>
  );
};

export const Dashboard: React.FC = () => (
  <LeadsProvider>
    <DashboardShell />
  </LeadsProvider>
);
