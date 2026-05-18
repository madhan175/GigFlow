import React from 'react';
import { useLeads } from '../../context/LeadsContext';
import { Lead } from '../../types';
import {
  Database, CheckCircle2, TrendingUp, Sparkles,
  Eye, Plus, RefreshCcw,
} from 'lucide-react';

interface DashboardHomeProps {
  onNavigateToLeads: () => void;
  onViewLead: (lead: Lead) => void;
  onAddLead: () => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigateToLeads,
  onViewLead,
  onAddLead,
}) => {
  const { stats, leads, loading, fetchLeads } = useLeads();
  const conversionRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(1) : '0.0';
  const recentLeads = leads.slice(0, 5);

  const cards = [
    { label: 'Total Leads', value: stats.total.toLocaleString(), icon: Database },
    { label: 'Qualified', value: stats.qualified.toLocaleString(), icon: CheckCircle2 },
    { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp },
    { label: 'New Leads', value: stats.new.toLocaleString(), icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            SalesFlow Intelligence Panel
          </h3>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">
            Live overview — refreshes every 30 seconds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLeads()}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
          <button
            onClick={onAddLead}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg"
          >
            <Plus size={14} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="crm-card p-5 rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                <h4 className="text-3xl font-extrabold text-white mt-1">{value}</h4>
              </div>
              <div className="p-3 bg-violet-50 dark:bg-violet-950/20 text-violet-600 rounded-xl">
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 crm-card rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Recent Leads</h4>
            <button onClick={onNavigateToLeads} className="text-xs font-bold text-violet-600 hover:underline">
              View all →
            </button>
          </div>
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : recentLeads.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">No leads yet. Add your first lead!</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentLeads.map((lead) => (
                <li key={lead._id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  </div>
                  <button
                    onClick={() => onViewLead(lead)}
                    className="p-2 text-slate-400 hover:text-violet-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Eye size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="crm-card rounded-2xl p-6 space-y-4">
          <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Pipeline Breakdown</h4>
          {[
            { label: 'New', count: stats.new, color: 'bg-emerald-500' },
            { label: 'Contacted', count: stats.contacted, color: 'bg-blue-500' },
            { label: 'Qualified', count: stats.qualified, color: 'bg-amber-500' },
            { label: 'Lost', count: stats.lost, color: 'bg-rose-500' },
          ].map(({ label, count, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-800 dark:text-slate-200">{count}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: stats.total ? `${(count / stats.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase">By Source</p>
            <div className="flex justify-between text-xs"><span>Website</span><span className="font-bold">{stats.website}</span></div>
            <div className="flex justify-between text-xs"><span>Instagram</span><span className="font-bold">{stats.instagram}</span></div>
            <div className="flex justify-between text-xs"><span>Referral</span><span className="font-bold">{stats.referral}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
