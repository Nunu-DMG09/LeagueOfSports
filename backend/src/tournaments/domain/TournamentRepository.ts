import { Tournament, TournamentTeam } from './Tournament';

export interface TournamentRepository {
  create(tournament: Tournament): Promise<number>;
  findById(id: number): Promise<Tournament | null>;
  registerTeam(registration: TournamentTeam): Promise<void>;
  isTeamRegistered(tournamentId: number, teamId: number): Promise<boolean>;
  findAll(): Promise<any[]>;
  removeTeam(tournamentId: number, teamId: number): Promise<void>;
}