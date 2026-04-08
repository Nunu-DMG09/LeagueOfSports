import { api } from '../../../shared/services/api';

export const teamService = {
  getAll: async () => {
    const { data } = await api.get('/teams');
    return data;
  },

  create: async (data: FormData) => {
   
    const response = await api.post('/teams', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getMembers: async (idEquipo: number) => {
    const { data } = await api.get(`/teams/${idEquipo}/members`);
    return data;
  },
  addMember: async (idEquipo: number, memberData: any) => {
    const { data } = await api.post(`/teams/${idEquipo}/members`, memberData);
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/teams/${id}`);
    return data;  
  },

  removeMember: async (idEquipo: number, idUsuario: number) => {
    const { data } = await api.delete(`/teams/${idEquipo}/members/${idUsuario}`);
    return data;
  },

  update: async (id: number, data: FormData) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
  },
};