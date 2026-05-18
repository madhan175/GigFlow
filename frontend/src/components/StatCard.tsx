import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string; // Tailwind background/text styling
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, description }) => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Decorative gradient corner glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{value}</h4>
        </div>
        <div className={`p-3.5 rounded-xl ${colorClass} transition duration-300 group-hover:rotate-6`}>
          {icon}
        </div>
      </div>
      {description && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3.5 flex items-center gap-1">
          {description}
        </p>
      )}
    </div>
  );
};
