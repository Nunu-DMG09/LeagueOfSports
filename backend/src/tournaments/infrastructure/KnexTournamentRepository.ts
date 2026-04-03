import db from '../../shared/infrastructure/database';
import { Tournament, TournamentTeam } from '../domain/Tournament';
import { TournamentRepository } from '../domain/TournamentRepository';

export class KnexTournamentRepository implements TournamentRepository {
  async create(tournament: Tournament): Promise<number> {
    const [id] = await db('torneos').insert(tournament);
    return id;
  }

  async findById(id: number): Promise<Tournament | null> {
    return await db('torneos').where({ id_torneo: id }).first() || null;
  }

  async registerTeam(registration: TournamentTeam): Promise<void> {
    await db('torneo_equipos').insert(registration);
  }

  async isTeamRegistered(tournamentId: number, teamId: number): Promise<boolean> {
    const registry = await db('torneo_equipos')
      .where({ id_torneo: tournamentId, id_equipo: teamId })
      .first();
    return !!registry;
  }

  async findAll(): Promise<any[]> {
    return await db('torneos').orderBy('fecha_inicio', 'desc');
  }

  async getTeamsInTournament(idTorneo: number): Promise<any[]> {
    return await db('torneo_equipos')
      .join('equipos', 'torneo_equipos.id_equipo', 'equipos.id_equipo')
      .select('equipos.id_equipo', 'equipos.nombre', 'equipos.logo_url', 'torneo_equipos.estado_inscripcion')
      .where('torneo_equipos.id_torneo', idTorneo);
  }
}