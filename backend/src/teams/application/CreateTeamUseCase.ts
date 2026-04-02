import { TeamRepository } from '../domain/TeamRepository';
import { Team } from '../domain/Team';

export class CreateTeamUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(teamData: Team) {
    const existing = await this.teamRepository.findByName(teamData.nombre);
    if (existing) throw new Error('Ya existe un equipo con ese nombre');

    const newTeamId = await this.teamRepository.createTeam(teamData);
    return newTeamId;
  }
}