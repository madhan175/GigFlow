import React from 'react';
import {
  LayoutDashboard, Users, Contact, Handshake, CheckSquare, Calendar,
  FileText, BarChart3, Zap, Settings, Crown, Headphones, Sparkles,
} from 'lucide-react';
import { DashboardPage } from '../../pages/Dashboard';

interface NavItem {
  id?: DashboardPage;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  soon?: boolean;
}

interface AppSidebarProps {
  activePage: DashboardPage;
  onNavigate: (page: DashboardPage) => void;
  userRole?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ activePage, onNavigate, userRole }) => {
  const mainNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'leads', label: 'Leads', icon: <Users size={18} /> },
    { label: 'Contacts', icon: <Contact size={18} />, soon: true },
    { label: 'Deals', icon: <Handshake size={18} />, soon: true },
    { label: 'Tasks', icon: <CheckSquare size={18} />, soon: true },
    { label: 'Calendar', icon: <Calendar size={18} />, soon: true },
    { label: 'Reports', icon: <FileText size={18} />, soon: true },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { label: 'Automation', icon: <Zap size={18} />, soon: true },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} />, adminOnly: true },
  ];

  const handleClick = (item: NavItem) => {
    if (item.soon || !item.id) return;
    if (item.adminOnly && userRole !== 'admin') return;
    onNavigate(item.id);
  };

  return (
    <aside className="w-[240px] bg-[#0d111c] border-r border-white/5 flex flex-col shrink-0 h-screen sticky top-0 hidden lg:flex">
      <div className="p-5 flex items-center gap-3 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <p className="text-sm font-bold text-white">SalesFlow CRM</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {mainNav.map((item) => {
          if (item.adminOnly && userRole !== 'admin') return null;
          const active = item.id === activePage;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              disabled={item.soon}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? 'bg-violet-600/15 text-violet-300 border border-violet-500/25'
                  : item.soon
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.soon && <span className="ml-auto text-[9px] text-slate-600 uppercase">Soon</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 space-y-3 border-t border-white/5">
        <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-3">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Crown size={16} />
            <span className="text-xs font-bold">SalesFlow Pro</span>
          </div>
          <p className="text-[10px] text-slate-500">Active plan · Unlimited leads</p>
        </div>
        <button type="button" className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300">
          <Headphones size={14} />
          Need help? Contact Support
        </button>
      </div>
    </aside>
  );
};
