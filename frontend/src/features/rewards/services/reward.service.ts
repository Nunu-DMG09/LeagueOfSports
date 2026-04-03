import { api } from '../../../shared/services/api';

export const rewardService = {
  getAll: async () => {
    const { data } = await api.get('/rewards');
    return data;
  },
  create: async (rewardData: any) => {
    const { data } = await api.post('/rewards', rewardData);
    return data;
  },
  redeem: async (idRecompensa: number, idUsuario: number) => {
    const { data } = await api.post(`/rewards/${idRecompensa}/redeem`, { id_usuario: idUsuario });
    return data;
  }
};