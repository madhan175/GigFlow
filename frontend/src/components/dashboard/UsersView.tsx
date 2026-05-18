import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { User } from '../../types';
import { UserCheck, Shield, Users } from 'lucide-react';

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/auth/users');
        if (res.data?.status === 'success') {
          setUsers(res.data.data.users);
        }
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          || 'Failed to load users.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Users</h3>
        <p className="text-sm text-slate-400 mt-1">All registered team members (admin only)</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading && (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        )}
        {error && <p className="p-8 text-center text-red-500 text-sm font-semibold">{error}</p>}
        {!loading && !error && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.role === 'admin'
                        ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                    }`}>
                      {u.role === 'admin' ? <Shield size={10} /> : <Users size={10} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && users.length === 0 && (
          <p className="py-12 text-center text-slate-400 text-sm">No users found.</p>
        )}
      </div>
    </div>
  );
};
