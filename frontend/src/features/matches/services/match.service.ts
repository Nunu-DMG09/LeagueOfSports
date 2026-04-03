import { api } from '../../../shared/services/api';

export const matchService = {
  getByTournament: async (idTorneo: number) => {
    const { data } = await api.get(`/matches/tournament/${idTorneo}`);
    return data;
  },
  create: async (matchData: { id_torneo: number, id_equipo_azul: number, id_equipo_rojo: number }) => {
    const { data } = await api.post('/matches', matchData);
    return data;
  },
  registerStats: async (idPartida: number, statsData: any) => {
    const { data } = await api.post(`/matches/${idPartida}/stats`, statsData);
    return data;
  },
  finish: async (idPartida: number, finishData: { id_equipo_ganador: number, duracion_minutos: number }) => {
    const { data } = await api.put(`/matches/${idPartida}/finish`, finishData);
    return data;
  },
  
  getById: async (idPartida: number) => {
    const { data } = await api.get(`/matches/${idPartida}`);
    return data;
  },
};