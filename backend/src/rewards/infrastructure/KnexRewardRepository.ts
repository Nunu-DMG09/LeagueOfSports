import db from '../../shared/infrastructure/database';

export class KnexRewardRepository {
  async findAll(): Promise<any[]> {
    return await db('recompensas').orderBy('costo_puntos', 'asc');
  }

  async create(reward: any): Promise<number> {
    const [id] = await db('recompensas').insert(reward);
    return id;
  }

  // La magia transaccional: Canjear premio
  async redeemReward(userId: number, rewardId: number): Promise<void> {
    await db.transaction(async (trx) => {
      // 1. Obtener premio y usuario
      const reward = await trx('recompensas').where({ id_recompensa: rewardId }).first();
      const user = await trx('usuarios').where({ id_usuario: userId }).first();

      if (!reward) throw new Error('Premio no encontrado');
      if (reward.stock <= 0) throw new Error('Premio agotado (Sin stock)');
      if (user.puntos_totales < reward.costo_puntos) throw new Error('Puntos insuficientes');

      // 2. Restar puntos al usuario
      await trx('usuarios')
        .where({ id_usuario: userId })
        .decrement('puntos_totales', reward.costo_puntos);

      // 3. Restar 1 al stock del premio
      await trx('recompensas')
        .where({ id_recompensa: rewardId })
        .decrement('stock', 1);

      // 4. Registrar en el historial de puntos
      await trx('historial_puntos').insert({
        id_usuario: userId,
        tipo_movimiento: 'egreso',
        cantidad_puntos: reward.costo_puntos,
        motivo: `Canje en tienda: ${reward.nombre_recompensa}`,
        id_referencia: rewardId
      });
    });
  }
}