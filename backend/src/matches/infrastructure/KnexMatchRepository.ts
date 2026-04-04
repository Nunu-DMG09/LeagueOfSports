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

  async getGlobalRanking(): Promise<any[]> {
    return await db('usuarios as u')
      .leftJoin('estadisticas_partida as ep', 'u.id_usuario', 'ep.id_usuario')
      .select(
        'u.id_usuario',
        'u.nickname',
        'u.elo',
        db.raw('SUM(COALESCE(ep.kills, 0)) as total_kills'),
        db.raw('SUM(COALESCE(ep.deaths, 0)) as total_deaths'),
        db.raw('SUM(COALESCE(ep.assists, 0)) as total_assists'),
        'u.puntos_totales'
      )
      .groupBy('u.id_usuario')
      .orderBy('u.puntos_totales', 'desc')
      .limit(10);
  }

  async findByTournament(tournamentId: number): Promise<any[]> {
    return await db('partidas as p')
      .join('equipos as ea', 'p.id_equipo_azul', 'ea.id_equipo')
      .join('equipos as er', 'p.id_equipo_rojo', 'er.id_equipo')
      .leftJoin('equipos as eg', 'p.id_equipo_ganador', 'eg.id_equipo')
      .select(
        'p.*',
        'ea.nombre as equipo_azul_nombre',
        'er.nombre as equipo_rojo_nombre',
        'eg.nombre as equipo_ganador_nombre'
      )
      .where('p.id_torneo', tournamentId)
      .orderBy('p.fecha_partida', 'desc');
  }

  async findById(matchId: number): Promise<any> {
    return await db('partidas as p')
      .join('equipos as ea', 'p.id_equipo_azul', 'ea.id_equipo')
      .join('equipos as er', 'p.id_equipo_rojo', 'er.id_equipo')
      .select('p.*', 'ea.nombre as equipo_azul_nombre', 'er.nombre as equipo_rojo_nombre')
      .where('p.id_partida', matchId)
      .first();
  }
}