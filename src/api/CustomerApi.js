import api from './axios.js';
export const CustomerApi = {
  list: (search = '') => api.get('/customers', { params: { search } }),
  get: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};
