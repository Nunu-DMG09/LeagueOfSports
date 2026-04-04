import db from '../../shared/infrastructure/database';
import { Match, PlayerStats } from '../domain/Match';
import { MatchRepository } from '../domain/MatchRepository';

export class KnexMatchRepository implements MatchRepository {
  async createMatch(match: Match): Promise<number> {
    const [id] = await db('partidas').insert(match);
    return id;
  }

  async updateMatchResult(matchId: number, winnerTeamId: number, duration: number): Promise<void> {

    await db.transaction(async (trx) => {
      // 1. Guardar el resultado de la partida
      await trx('partidas')
        .where({ id_partida: matchId })
        .update({
          id_equipo_ganador: winnerTeamId,
          duracion_minutos: duration
        });

      const match = await trx('partidas').where({ id_partida: matchId }).first();
      if (!match) throw new Error('Partida no encontrada durante la asignación de puntos');

      const blueTeamMembers = await trx('equipo_miembros').where({ id_equipo: match.id_equipo_azul });
      const redTeamMembers = await trx('equipo_miembros').where({ id_equipo: match.id_equipo_rojo });

      const blueIds = blueTeamMembers.map(m => m.id_usuario);
      const redIds = redTeamMembers.map(m => m.id_usuario);

      let ganadores: number[] = [];
      let perdedores: number[] = [];

      if (winnerTeamId === match.id_equipo_azul) {
        ganadores = blueIds;
        perdedores = redIds;
      } else if (winnerTeamId === match.id_equipo_rojo) {
        ganadores = redIds;
        perdedores = blueIds;
      }

    
      if (ganadores.length > 0) {
        await trx('usuarios')
          .whereIn('id_usuario', ganadores)
          .increment('puntos_totales', 2);
      }

      if (perdedores.length > 0) {
        await trx('usuarios')
          .whereIn('id_usuario', perdedores)
          .decrement('puntos_totales', 3);
      }
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