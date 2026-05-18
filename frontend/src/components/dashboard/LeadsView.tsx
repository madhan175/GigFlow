import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../context/LeadsContext';
import { Lead } from '../../types';
import {
  Plus, Search, FileDown, SlidersHorizontal, Layers,
  ChevronLeft, ChevronRight, Trash2, Edit3, Eye,
  ShieldCheck, UserCheck2, Users,
} from 'lucide-react';

const statusClass = (status: string) => {
  const map: Record<string, string> = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400',
    contacted: 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400',
    qualified: 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400',
    lost: 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400',
  };
  return map[status] || map.new;
};

export const LeadsView: React.FC = () => {
  const { user } = useAuth();
  const {
    leads, pagination, loading, error,
    searchVal, setSearchVal, statusFilter, setStatusFilter,
    sourceFilter, setSourceFilter, sortOrder, setSortOrder,
    currentPage, setCurrentPage, showFilters, setShowFilters,
    fetchLeads, handleExportCSV, handleClearFilters,
    handleOpenCreateModal, handleOpenEditModal, handleOpenDetails, handleDeleteLead,
  } = useLeads();

  const renderRow = (lead: Lead) => (
    <tr key={lead._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition">
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center font-bold text-xs">
            {lead.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">{lead.name}</span>
        </div>
      </td>
      <td className="px-6 py-3.5 text-slate-500 text-xs">{lead.email}</td>
      <td className="px-6 py-3.5">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusClass(lead.status)}`}>
          {lead.status}
        </span>
      </td>
      <td className="px-6 py-3.5 text-xs capitalize">{lead.source}</td>
      <td className="px-6 py-3.5 text-slate-400 text-xs">
        {new Date(lead.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-3.5 text-right">
        <div className="flex justify-end gap-1">
          <button onClick={() => handleOpenDetails(lead)} className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Eye size={14} /></button>
          <button onClick={() => handleOpenEditModal(lead)} className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Edit3 size={14} /></button>
          {user?.role === 'admin' ? (
            <button onClick={() => handleDeleteLead(lead._id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"><Trash2 size={14} /></button>
          ) : (
            <button disabled className="p-1.5 text-slate-300 cursor-not-allowed"><Trash2 size={14} /></button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white">Leads Pipeline</h3>
          <p className="text-sm text-slate-400 mt-1">Manage and filter all your leads</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleExportCSV().catch(() => alert('Export failed'))} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <FileDown size={14} /> Export CSV
          </button>
          <button onClick={handleOpenCreateModal} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl">
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>
          <div className="crm-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-wrap gap-3">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-200">All Leads</h4>
              <div className="flex gap-2">
                <div className="relative w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl">
                  <SlidersHorizontal size={13} /> Filters
                </button>
              </div>
            </div>

            {error && <p className="p-8 text-center text-red-500 text-sm">{error}</p>}
            {loading && (
              <div className="py-16 flex justify-center">
                <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              </div>
            )}
            {!loading && !error && leads.length === 0 && (
              <div className="py-16 text-center">
                <Layers size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-500">No leads match your filters</p>
              </div>
            )}
            {!loading && !error && leads.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{leads.map(renderRow)}</tbody>
                </table>
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-400">
              <span>Page {pagination.page} of {pagination.pages} ({pagination.total} total)</span>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40 flex items-center gap-1"><ChevronLeft size={13} /> Prev</button>
                <button disabled={currentPage === pagination.pages} onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 border rounded-lg disabled:opacity-40 flex items-center gap-1">Next <ChevronRight size={13} /></button>
              </div>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h5 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><SlidersHorizontal size={14} className="text-violet-500" /> Filters</h5>
              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400">Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold">
                  <option value="all">All</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400">Source</label>
                <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold">
                  <option value="all">All</option>
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase text-slate-400">Sort</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold">
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleClearFilters} className="flex-1 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-xl">Reset</button>
                <button onClick={fetchLeads} className="flex-1 py-2 text-xs bg-violet-600 text-white rounded-xl font-bold">Apply</button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-3">
              <h5 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><ShieldCheck size={14} className="text-violet-500" /> Access</h5>
              <div className="flex gap-2 text-[10px]">
                <UserCheck2 size={14} className="text-red-500 shrink-0" />
                <p><strong>Admin</strong> — full access including delete</p>
              </div>
              <div className="flex gap-2 text-[10px]">
                <Users size={14} className="text-emerald-500 shrink-0" />
                <p><strong>Sales</strong> — create & edit only</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
