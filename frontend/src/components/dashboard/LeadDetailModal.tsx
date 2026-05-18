import React from 'react';
import { Lead } from '../../types';
import { X, Mail, Edit3 } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onEdit: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onEdit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
        <X size={16} />
      </button>
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-5">Lead Details</h4>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/30 text-violet-600 flex items-center justify-center font-black text-xl">
          {lead.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{lead.name}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Mail size={13} />{lead.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</span>
          <span className="text-xs font-bold capitalize">{lead.status}</span>
        </div>
        <div>
          <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Source</span>
          <span className="text-xs font-bold capitalize">{lead.source}</span>
        </div>
      </div>
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
        <div className="flex justify-between"><span>Created:</span><span>{new Date(lead.createdAt).toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Updated:</span><span>{new Date(lead.updatedAt).toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Created By:</span><span>{lead.createdBy?.name || 'N/A'}</span></div>
      </div>
      <button
        onClick={onEdit}
        className="mt-6 w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
      >
        <Edit3 size={13} /> Edit Lead
      </button>
    </div>
  </div>
);
