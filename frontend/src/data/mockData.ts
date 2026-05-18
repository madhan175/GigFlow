/** Rich demo analytics (matches premium CRM UI when DB is empty or for charts) */

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@salesflow.io', password: 'demo123456' },
  sales: { email: 'sales@salesflow.io', password: 'demo123456' },
};

export const MOCK_KPI = [
  {
    label: 'Conversion Rate',
    value: '18.6%',
    trend: 'up' as const,
    change: '↑ 12.4% vs Apr 12 – May 11, 2024',
    sparkline: [12, 14, 13, 16, 15, 18, 17, 19, 18, 18.6],
    icon: 'target',
  },
  {
    label: 'Contact Rate',
    value: '32.7%',
    trend: 'up' as const,
    change: '↑ 8.7% vs Apr 12 – May 11, 2024',
    sparkline: [22, 24, 26, 25, 28, 30, 29, 31, 32, 32.7],
    icon: 'phone',
  },
  {
    label: 'Lost Rate',
    value: '9.3%',
    trend: 'down' as const,
    change: '↓ 2.1% vs Apr 12 – May 11, 2024',
    sparkline: [14, 13, 12, 11, 10, 11, 10, 9.5, 9.8, 9.3],
    icon: 'alert',
  },
];

export const MOCK_LEADS_BY_STATUS = [
  { label: 'New', count: 512, percent: 25.6, color: 'bg-sky-500' },
  { label: 'Contacted', count: 436, percent: 21.8, color: 'bg-violet-500' },
  { label: 'Qualified', count: 362, percent: 18.1, color: 'bg-purple-400' },
  { label: 'Proposal', count: 267, percent: 13.3, color: 'bg-amber-400' },
  { label: 'Negotiation', count: 206, percent: 10.3, color: 'bg-orange-500' },
  { label: 'Won', count: 128, percent: 6.4, color: 'bg-emerald-500' },
  { label: 'Lost', count: 89, percent: 4.5, color: 'bg-rose-400' },
];

export const MOCK_LEADS_BY_SOURCE = [
  { label: 'Website', count: 487, percent: 29.3, color: 'bg-sky-500' },
  { label: 'Referral', count: 342, percent: 20.6, color: 'bg-violet-500' },
  { label: 'Instagram', count: 298, percent: 17.9, color: 'bg-purple-400' },
  { label: 'Email Campaign', count: 256, percent: 15.4, color: 'bg-amber-400' },
  { label: 'Cold Call', count: 154, percent: 9.2, color: 'bg-orange-500' },
  { label: 'Social Media', count: 97, percent: 5.8, color: 'bg-emerald-500' },
  { label: 'Other', count: 31, percent: 1.9, color: 'bg-rose-400' },
];

export const MOCK_RECENT_ACTIVITY = [
  { name: 'Priya Nair', action: 'Qualified lead', time: '2m ago', status: 'qualified' },
  { name: 'Rahul Sharma', action: 'New lead from Website', time: '15m ago', status: 'new' },
  { name: 'Ananya Patel', action: 'Contacted via email', time: '1h ago', status: 'contacted' },
  { name: 'Vikram Singh', action: 'Deal marked Won', time: '3h ago', status: 'won' },
];
