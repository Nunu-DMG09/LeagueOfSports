import { MatchRepository } from '../domain/MatchRepository';
import { PlayerStats } from '../domain/Match';

export class RegisterPlayerStatsUseCase {
  constructor(private repository: MatchRepository) {}

  async execute(data: PlayerStats) {
    const alreadyRegistered = await this.repository.hasPlayerStatsInMatch(data.id_partida, data.id_usuario);
    if (alreadyRegistered) {
      throw new Error('Las estadísticas de este jugador ya fueron registradas para esta partida');
    }
    await this.repository.savePlayerStats(data);
  }
}