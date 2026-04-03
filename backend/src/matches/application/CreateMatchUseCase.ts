import { MatchRepository } from '../domain/MatchRepository';
import { Match } from '../domain/Match';

export class CreateMatchUseCase {
  constructor(private repository: MatchRepository) {}

  async execute(data: Match) {
    if (data.id_equipo_azul === data.id_equipo_rojo) {
      throw new Error('Un equipo no puede jugar contra sí mismo');
    }
    return await this.repository.createMatch(data);
  }
}