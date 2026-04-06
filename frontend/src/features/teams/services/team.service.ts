import { api } from '../../../shared/services/api';

export const teamService = {
  getAll: async () => {
    const { data } = await api.get('/teams');
    return data;
  },
  create: async (teamData: { nombre: string; logo_url?: string }) => {
    const { data } = await api.post('/teams', teamData);
    return data;
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
};