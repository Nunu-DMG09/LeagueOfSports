import { Team, TeamMember } from './Team';

export interface TeamRepository {
  findByName(name: string): Promise<Team | null>;
  findById(id: number): Promise<Team | null>;
  createTeam(team: Team): Promise<number>; // Devuelve el ID del equipo creado
  addMember(member: TeamMember): Promise<void>;
  getMembersByTeam(teamId: number): Promise<any[]>; // Traerá info del usuario también
  isUserInAnyTeam(userId: number): Promise<boolean>;
}