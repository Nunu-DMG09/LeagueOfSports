import { TournamentRepository } from '../domain/TournamentRepository';
import { Tournament } from '../domain/Tournament';

export class CreateTournamentUseCase {
  constructor(private repository: TournamentRepository) {}

  async execute(data: Tournament) {
    // Aquí podrías agregar validaciones, ej: que la fecha de inicio no sea en el pasado
    return await this.repository.create(data);
  }
}