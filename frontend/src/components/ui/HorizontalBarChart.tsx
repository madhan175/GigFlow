import React from 'react';

export interface BarItem {
  label: string;
  count: number;
  percent: number;
  color: string;
}

interface HorizontalBarChartProps {
  title: string;
  items: BarItem[];
  maxCount?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ title, items, maxCount }) => {
  const max = maxCount ?? Math.max(...items.map((i) => i.count), 1);

  return (
    <div className="crm-card rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <select className="text-xs bg-[#151b28] border border-white/10 rounded-lg px-2 py-1 text-slate-400">
          <option>Show Count</option>
        </select>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">{item.label}</span>
              <span className="text-slate-300 font-semibold">
                {item.count.toLocaleString()} <span className="text-slate-500">({item.percent}%)</span>
              </span>
            </div>
            <div className="h-2 bg-[#1a2234] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 mt-4 px-1">
        <span>0</span>
        <span>{Math.round(max * 0.25)}</span>
        <span>{Math.round(max * 0.5)}</span>
        <span>{Math.round(max * 0.75)}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
