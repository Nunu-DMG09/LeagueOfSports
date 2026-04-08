import { Team, TeamMember } from './Team';

export interface TeamRepository {
  findByName(name: string): Promise<Team | null>;
  findById(id: number): Promise<Team | null>;
  createTeam(team: Team): Promise<number>; 
  addMember(member: TeamMember): Promise<void>;
  getMembersByTeam(teamId: number): Promise<any[]>; 
  isUserInAnyTeam(userId: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  removeMember(teamId: number, userId: number): Promise<void>;
  updateTeam(id: number, data: any): Promise<void>;
  deleteTeam(id: number): Promise<void>;
}