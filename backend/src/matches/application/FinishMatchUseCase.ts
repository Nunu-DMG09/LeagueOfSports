import { MatchRepository } from '../domain/MatchRepository';

export class FinishMatchUseCase {
  constructor(private repository: MatchRepository) {}

  async execute(matchId: number, winnerTeamId: number, duration: number) {
    if (duration <= 0) {
      throw new Error('La duración de la partida debe ser mayor a 0');
    }
    await this.repository.updateMatchResult(matchId, winnerTeamId, duration);
  }
}