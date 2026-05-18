import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#070b14]">
    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/25 blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none" />
    <div className="absolute top-[20%] right-[15%] w-72 h-72 rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

    <div className="auth-dot-grid absolute top-8 left-8 opacity-40" />
    <div className="auth-dot-grid absolute bottom-12 right-12 opacity-30" />

    <div className="w-full max-w-[420px] relative z-10">
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-2xl shadow-black/40 p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Sparkles size={22} className="text-white" />
            </div>
            <div className="text-left">
              <span className="block text-lg font-bold text-white leading-tight">SalesFlow</span>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-widest uppercase">CRM</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-sm text-slate-400 mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);
