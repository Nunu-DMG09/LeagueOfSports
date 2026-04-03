import { Match, PlayerStats } from './Match';

export interface MatchRepository {
  createMatch(match: Match): Promise<number>;
  updateMatchResult(matchId: number, winnerTeamId: number, duration: number): Promise<void>;
  savePlayerStats(stats: PlayerStats): Promise<void>;
  hasPlayerStatsInMatch(matchId: number, userId: number): Promise<boolean>;
}