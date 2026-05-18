import React from 'react';
import { Calendar, Filter, Target, Phone, AlertTriangle } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';
import { Sparkline } from '../ui/Sparkline';
import { HorizontalBarChart } from '../ui/HorizontalBarChart';
import {
  MOCK_KPI,
  MOCK_LEADS_BY_STATUS,
  MOCK_LEADS_BY_SOURCE,
} from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  const { stats } = useLeads();

  const useLive = stats.total > 0;
  const conversionRate = useLive ? ((stats.qualified / stats.total) * 100).toFixed(1) : '18.6';
  const contactRate = useLive ? ((stats.contacted / stats.total) * 100).toFixed(1) : '32.7';
  const lostRate = useLive ? ((stats.lost / stats.total) * 100).toFixed(1) : '9.3';

  const kpis = useLive
    ? [
        { ...MOCK_KPI[0], value: `${conversionRate}%` },
        { ...MOCK_KPI[1], value: `${contactRate}%` },
        { ...MOCK_KPI[2], value: `${lostRate}%` },
      ]
    : MOCK_KPI;

  const statusBars = useLive
    ? [
        { label: 'New', count: stats.new, percent: stats.total ? +((stats.new / stats.total) * 100).toFixed(1) : 0, color: 'bg-sky-500' },
        { label: 'Contacted', count: stats.contacted, percent: stats.total ? +((stats.contacted / stats.total) * 100).toFixed(1) : 0, color: 'bg-violet-500' },
        { label: 'Qualified', count: stats.qualified, percent: stats.total ? +((stats.qualified / stats.total) * 100).toFixed(1) : 0, color: 'bg-purple-400' },
        { label: 'Lost', count: stats.lost, percent: stats.total ? +((stats.lost / stats.total) * 100).toFixed(1) : 0, color: 'bg-rose-400' },
      ]
    : MOCK_LEADS_BY_STATUS;

  const sourceBars = useLive
    ? [
        { label: 'Website', count: stats.website, percent: stats.total ? +((stats.website / stats.total) * 100).toFixed(1) : 0, color: 'bg-sky-500' },
        { label: 'Instagram', count: stats.instagram, percent: stats.total ? +((stats.instagram / stats.total) * 100).toFixed(1) : 0, color: 'bg-purple-400' },
        { label: 'Referral', count: stats.referral, percent: stats.total ? +((stats.referral / stats.total) * 100).toFixed(1) : 0, color: 'bg-violet-500' },
      ]
    : MOCK_LEADS_BY_SOURCE;

  const iconMap = {
    target: Target,
    phone: Phone,
    alert: AlertTriangle,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track key metrics and gain insights into your sales performance.
            {!useLive && (
              <span className="text-violet-400 ml-1">(Showing demo data — add leads or run seed)</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151b28] border border-white/10 text-xs text-slate-300"
          >
            <Calendar size={14} className="text-slate-500" />
            May 12 – Jun 11, 2024
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151b28] border border-white/10 text-xs text-slate-300"
          >
            <Filter size={14} className="text-slate-500" />
            All Pipelines
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = iconMap[kpi.icon as keyof typeof iconMap];
          return (
            <div key={kpi.label} className="crm-card rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{kpi.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                  <Icon size={18} />
                </div>
              </div>
              <Sparkline data={kpi.sparkline} trend={kpi.trend} className="mb-2" />
              <p className={`text-xs font-medium ${kpi.trend === 'up' && kpi.label !== 'Lost Rate' ? 'text-emerald-400' : kpi.label === 'Lost Rate' ? 'text-emerald-400' : 'text-emerald-400'}`}>
                {kpi.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <HorizontalBarChart title="Leads by Status" items={statusBars} />
        <HorizontalBarChart title="Leads by Source" items={sourceBars} />
      </div>
    </div>
  );
};
