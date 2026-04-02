import { TournamentRepository } from '../domain/TournamentRepository';
import { TournamentTeam } from '../domain/Tournament';

export class RegisterTeamUseCase {
  constructor(private repository: TournamentRepository) {}

  async execute(data: TournamentTeam) {
    const tournament = await this.repository.findById(data.id_torneo);
    if (!tournament) throw new Error('El torneo no existe');
    if (tournament.estado !== 'pendiente') throw new Error('El torneo ya comenzó o finalizó');

    const isRegistered = await this.repository.isTeamRegistered(data.id_torneo, data.id_equipo);
    if (isRegistered) throw new Error('El equipo ya está inscrito en este torneo');

    await this.repository.registerTeam(data);
  }
}