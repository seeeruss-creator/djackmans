import api from './axios.js';
const BASE = '/repair-orders';
export const RepairOrderApi = {
  list: (params) => api.get(BASE, { params }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
  checkOrderNumber: (order_number, exclude_id) => api.get(`${BASE}/check-order-number`, { params: { order_number, exclude_id } }),
};
