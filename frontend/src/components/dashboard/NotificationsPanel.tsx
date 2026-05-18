import React, { useRef, useEffect } from 'react';
import { useLeads } from '../../context/LeadsContext';
import { Bell, X } from 'lucide-react';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  const { leads } = useLeads();
  const panelRef = useRef<HTMLDivElement>(null);

  const newLeads = leads.filter((l) => l.status === 'new').slice(0, 8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-violet-500" />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifications</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
          <X size={14} />
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {newLeads.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs text-slate-400">No new leads right now.</p>
        ) : (
          newLeads.map((lead) => (
            <div key={lead._id} className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{lead.name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{lead.email}</p>
              <span className="inline-block mt-1 text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                new lead
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
