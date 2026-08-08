import api from './axios.js';

export const DashboardApi = {
  stats: () => api.get('/dashboard/stats'),
  reports: (params) => api.get('/dashboard/reports', { params }),
};
