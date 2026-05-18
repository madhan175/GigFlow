import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from '../services/api';
import { Lead, PaginationMeta } from '../types';
import { LeadStatus, LeadSource } from '../components/LeadModal';
import { useDebounce } from '../hooks/useDebounce';

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  lost: number;
  website: number;
  instagram: number;
  referral: number;
}

interface LeadsContextType {
  leads: Lead[];
  stats: LeadStats;
  pagination: PaginationMeta;
  loading: boolean;
  error: string | null;
  searchVal: string;
  setSearchVal: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sourceFilter: string;
  setSourceFilter: (v: string) => void;
  sortOrder: string;
  setSortOrder: (v: string) => void;
  currentPage: number;
  setCurrentPage: (v: number | ((p: number) => number)) => void;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  fetchLeads: () => Promise<void>;
  handleSaveLead: (data: { name: string; email: string; status: LeadStatus; source: LeadSource }) => Promise<void>;
  handleDeleteLead: (id: string) => Promise<void>;
  handleExportCSV: () => Promise<void>;
  handleClearFilters: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  selectedLead: Lead | null;
  setSelectedLead: (l: Lead | null) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (v: boolean) => void;
  detailLead: Lead | null;
  setDetailLead: (l: Lead | null) => void;
  handleOpenCreateModal: () => void;
  handleOpenEditModal: (lead: Lead) => void;
  handleOpenDetails: (lead: Lead) => void;
}

const defaultStats: LeadStats = {
  total: 0, new: 0, contacted: 0, qualified: 0, lost: 0,
  website: 0, instagram: 0, referral: 0,
};

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ total: 0, page: 1, limit: 10, pages: 1 });
  const [stats, setStats] = useState<LeadStats>(defaultStats);
  const [searchVal, setSearchVal] = useState('');
  const debouncedSearch = useDebounce(searchVal, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 10,
        sort: sortOrder,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (sourceFilter !== 'all') params.source = sourceFilter;

      const res = await API.get('/leads', { params });
      if (res.data?.status === 'success') {
        setLeads(res.data.data.leads);
        setPagination(res.data.pagination);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const message =
        axiosErr.response?.status === 401
          ? 'Session expired or invalid. Please log out and sign in again.'
          : axiosErr.response?.data?.message || 'Failed to retrieve leads. Is the backend running on port 5000?';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    const interval = setInterval(fetchLeads, 30000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter, sourceFilter, sortOrder]);

  const handleSaveLead = async (leadData: { name: string; email: string; status: LeadStatus; source: LeadSource }) => {
    if (selectedLead) {
      await API.put(`/leads/${selectedLead._id}`, leadData);
    } else {
      await API.post('/leads', leadData);
    }
    await fetchLeads();
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this lead?')) return;
    try {
      await API.delete(`/leads/${leadId}`);
      if (isDetailOpen && detailLead?._id === leadId) setIsDetailOpen(false);
      await fetchLeads();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Error occurred during deletion.';
      alert(message);
    }
  };

  const handleExportCSV = async () => {
    const params: Record<string, string> = { sort: sortOrder };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (sourceFilter !== 'all') params.source = sourceFilter;

    const response = await API.get('/leads/export/csv', { params, responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFilters = () => {
    setSearchVal('');
    setStatusFilter('all');
    setSourceFilter('all');
    setSortOrder('latest');
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => { setSelectedLead(null); setIsModalOpen(true); };
  const handleOpenEditModal = (lead: Lead) => { setSelectedLead(lead); setIsModalOpen(true); };
  const handleOpenDetails = (lead: Lead) => { setDetailLead(lead); setIsDetailOpen(true); };

  return (
    <LeadsContext.Provider
      value={{
        leads, stats, pagination, loading, error,
        searchVal, setSearchVal, statusFilter, setStatusFilter,
        sourceFilter, setSourceFilter, sortOrder, setSortOrder,
        currentPage, setCurrentPage, showFilters, setShowFilters,
        fetchLeads, handleSaveLead, handleDeleteLead, handleExportCSV, handleClearFilters,
        isModalOpen, setIsModalOpen, selectedLead, setSelectedLead,
        isDetailOpen, setIsDetailOpen, detailLead, setDetailLead,
        handleOpenCreateModal, handleOpenEditModal, handleOpenDetails,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
};
