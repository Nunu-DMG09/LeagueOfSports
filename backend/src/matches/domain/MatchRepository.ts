import { Match, PlayerStats } from './Match';

export interface MatchRepository {
  createMatch(match: Match): Promise<number>;
  updateMatchResult(matchId: number, winnerTeamId: number, duration: number): Promise<void>;
  savePlayerStats(stats: PlayerStats): Promise<void>;
  hasPlayerStatsInMatch(matchId: number, userId: number): Promise<boolean>;
  
  getGlobalRanking(): Promise<any[]>;
  findByTournament(tournamentId: number): Promise<any[]>;
  findById(matchId: number): Promise<any>;
  deleteMatch(matchId: number): Promise<void>;
}