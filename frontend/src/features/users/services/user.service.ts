import { api } from '../../../shared/services/api';

export const userService = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  },
  create: async (userData: any) => {
    const { data } = await api.post('/users', userData);
    return data;
  },
  update: async (id: number, userData: any) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  }
};