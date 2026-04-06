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
}