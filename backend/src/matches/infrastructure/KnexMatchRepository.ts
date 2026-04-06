import db from '../../shared/infrastructure/database';
import { Match, PlayerStats } from '../domain/Match';
import { MatchRepository } from '../domain/MatchRepository';

export class KnexMatchRepository implements MatchRepository {
  async createMatch(match: Match): Promise<number> {
    return await db.transaction(async (trx) => {
      // 1. Insertamos la partida en la base de datos
      const [id] = await trx('partidas').insert(match);

      // 2. MAGIA: Al crear la primera partida, el torneo pasa a 'en_curso'
      // Solo actualizamos si el torneo está en estado 'pendiente'
      await trx('torneos')
        .where({ id_torneo: match.id_torneo, estado: 'pendiente' })
        .update({ estado: 'en_curso' });

      return id;
    });
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

      // 2. Obtener los datos de la partida
      const match = await trx('partidas').where({ id_partida: matchId }).first();
      if (!match) throw new Error('Partida no encontrada durante la asignación de puntos');

      // 3. Obtener los IDs de los usuarios
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

      // 4. ASIGNACIÓN DE PUNTOS
      // (+2 a los ganadores)
      if (ganadores.length > 0) {
        await trx('usuarios')
          .whereIn('id_usuario', ganadores)
          .increment('puntos_totales', 2);
      }

      // (-3 a los perdedores)
      if (perdedores.length > 0) {
        await trx('usuarios')
          .whereIn('id_usuario', perdedores)
          .decrement('puntos_totales', 3);

        // Restauramos a 0 si alguien quedó en negativo
        await trx('usuarios')
          .whereIn('id_usuario', perdedores)
          .where('puntos_totales', '<', 0)
          .update({ puntos_totales: 0 });
      }

      // 5. ACTUALIZAR ESTADO DE LOS EQUIPOS (Campeón / Descalificado)
      const loserTeamId = winnerTeamId === match.id_equipo_azul ? match.id_equipo_rojo : match.id_equipo_azul;

      // El ganador pasa a 'campeón'
      await trx('equipos')
        .where({ id_equipo: winnerTeamId })
        .update({ estado: 'campeón' });

      // El perdedor pasa a 'descalificado'
      await trx('equipos')
        .where({ id_equipo: loserTeamId })
        .update({ estado: 'descalificado' });

      // 6. VERIFICAR SI EL TORNEO HA FINALIZADO
      // Buscamos todas las partidas de este torneo
      const tournamentMatches = await trx('partidas').where({ id_torneo: match.id_torneo });
      
      // Si TODAS las partidas tienen un ganador (ninguna es null), el torneo terminó.
      const allFinished = tournamentMatches.length > 0 && tournamentMatches.every(m => m.id_equipo_ganador !== null);

      if (allFinished) {
        await trx('torneos')
          .where({ id_torneo: match.id_torneo })
          .update({ estado: 'finalizado' });
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

  async deleteMatch(matchId: number): Promise<void> {
    // Solo borramos la partida si no tiene un ganador (es decir, si no ha finalizado)
    const match = await db('partidas').where({ id_partida: matchId }).first();
    
    if (!match) throw new Error('La partida no existe');
    if (match.id_equipo_ganador) throw new Error('No puedes eliminar una partida que ya finalizó');

    await db('partidas').where({ id_partida: matchId }).del();
  }
}