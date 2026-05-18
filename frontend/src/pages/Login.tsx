import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from 'lucide-react';
interface LoginProps {
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    let ok = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email.');
      ok = false;
    } else setEmailError('');
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      ok = false;
    } else setPasswordError('');
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      await login(email, password);
    } catch (err: unknown) {
      setApiError((err as Error).message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-11 py-3 rounded-xl border border-white/10 bg-black/30 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition text-sm';

  return (
    <AuthLayout title="Welcome Back!" subtitle="Sign in to continue to your account">
      {apiError && (
        <div className="flex gap-2 p-3 mb-5 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="sr-only">Email address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`${inputClass} ${emailError ? 'border-red-500/50' : ''}`}
            />
          </div>
          {emailError && <p className="text-xs text-red-400 mt-1">{emailError}</p>}
        </div>

        <div>
          <label className="sr-only">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`${inputClass} ${passwordError ? 'border-red-500/50' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-white/20 bg-black/30 text-violet-600 focus:ring-violet-500"
            />
            Remember me
          </label>
          <button type="button" className="text-violet-400 hover:text-violet-300 font-medium">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/25 disabled:opacity-50 transition"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-transparent text-slate-500">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-slate-400">
        New to SalesFlow CRM?{' '}
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-0.5"
        >
          Sign Up Free <ArrowRight size={14} />
        </button>
      </p>
    </AuthLayout>
  );
};
