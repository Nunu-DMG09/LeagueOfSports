import db from '../../shared/infrastructure/database';
import { Match, PlayerStats } from '../domain/Match';
import { MatchRepository } from '../domain/MatchRepository';

export class KnexMatchRepository implements MatchRepository {
  async createMatch(match: Match): Promise<number> {
    const [id] = await db('partidas').insert(match);
    return id;
  }

  async updateMatchResult(matchId: number, winnerTeamId: number, duration: number): Promise<void> {
    await db('partidas')
      .where({ id_partida: matchId })
      .update({
        id_equipo_ganador: winnerTeamId,
        duracion_minutos: duration
      });
  }

  async savePlayerStats(stats: PlayerStats): Promise<void> {
    await db('estadisticas_partida').insert(stats);
  }

  async hasPlayerStatsInMatch(matchId: number, userId: number): Promise<boolean> {
    const result = await db('estadisticas_partida')
      .where({ id_partida: matchId, id_usuario: userId })
      .first();
    return !!result;
  }
}