import { api } from '../../../shared/services/api';

export const tournamentService = {
  getAll: async () => {
    const { data } = await api.get('/tournaments');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get(`/tournaments/${id}`);
    return data;
  },
  getRegisteredTeams: async (idTorneo: number) => {
    const { data } = await api.get(`/tournaments/${idTorneo}/teams`);
    return data;
  },
  create: async (tournamentData: any) => {
    const { data } = await api.post('/tournaments', tournamentData);
    return data;
  },
  registerTeam: async (idTorneo: number, teamId: number) => {
    const { data } = await api.post(`/tournaments/${idTorneo}/register-team`, { id_equipo: teamId });
    return data;
  }
};