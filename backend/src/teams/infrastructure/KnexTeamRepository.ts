import db from '../../shared/infrastructure/database';
import { Team, TeamMember } from '../domain/Team';
import { TeamRepository } from '../domain/TeamRepository';

export class KnexTeamRepository implements TeamRepository {
  async findByName(name: string): Promise<Team | null> {
    return await db('equipos').where({ nombre: name }).first() || null;
  }

  async findById(id: number): Promise<Team | null> {
    return await db('equipos').where({ id_equipo: id }).first() || null;
  }

  async createTeam(team: Team): Promise<number> {
    const [id] = await db('equipos').insert(team);
    return id;
  }

  async addMember(member: TeamMember): Promise<void> {
    await db('equipo_miembros').insert(member);
  }

  async getMembersByTeam(teamId: number): Promise<any[]> {
   
    return await db('equipo_miembros')
      .join('usuarios', 'equipo_miembros.id_usuario', 'usuarios.id_usuario')
      .select('usuarios.id_usuario', 'usuarios.nickname', 'usuarios.elo', 'equipo_miembros.rol_en_equipo')
      .where('equipo_miembros.id_equipo', teamId);
  }

  async isUserInAnyTeam(userId: number): Promise<boolean> {
    const member = await db('equipo_miembros').where({ id_usuario: userId }).first();
    return !!member; 
  }

  async findAll(): Promise<any[]> {
    return await db('equipos').orderBy('fecha_creacion', 'desc');
  }

  async removeMember(teamId: number, userId: number): Promise<void> {
    // Borramos la relación entre el equipo y el usuario
    const deletedRows = await db('equipo_miembros')
      .where({ id_equipo: teamId, id_usuario: userId })
      .del();

    if (deletedRows === 0) {
      throw new Error('El invocador no pertenece a este equipo');
    }
  }

  async updateTeam(id: number, teamData: any): Promise<void> {
    await db('equipos').where({ id_equipo: id }).update(teamData);
  }

  async deleteTeam(id: number): Promise<void> {
    await db.transaction(async (trx) => {
      // 1. Verificamos si el equipo ya tiene partidas jugadas/programadas
      const hasMatches = await trx('partidas').where('id_equipo_azul', id).orWhere('id_equipo_rojo', id).first();
      if (hasMatches) {
        throw new Error('No se puede eliminar un equipo con historial de partidas.');
      }

      // 2. Borramos sus relaciones (miembros y torneos)
      await trx('equipo_miembros').where({ id_equipo: id }).del();
      await trx('torneo_equipos').where({ id_equipo: id }).del();
      
      // 3. Borramos el equipo
      await trx('equipos').where({ id_equipo: id }).del();
    });
  }
}