import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NotificationsPanel } from '../dashboard/NotificationsPanel';

interface AppHeaderProps {
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  notificationsOpen,
  onToggleNotifications,
  onCloseNotifications,
}) => {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <header className="h-16 border-b border-white/5 bg-[#0b0e14]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-end px-6 gap-4">
      <button type="button" className="p-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition">
        <Search size={18} />
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={onToggleNotifications}
          className="p-2.5 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition relative"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-violet-600 text-white rounded-full px-1">
            3
          </span>
        </button>
        <NotificationsPanel open={notificationsOpen} onClose={onCloseNotifications} />
      </div>

      <button
        type="button"
        className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-white leading-tight">{user?.name ?? 'User'}</p>
          <p className="text-[11px] text-slate-500 capitalize">{user?.role ?? 'sales'}</p>
        </div>
        <ChevronDown size={16} className="text-slate-500" />
      </button>
    </header>
  );
};
