import { TeamRepository } from '../domain/TeamRepository';
import { TeamMember } from '../domain/Team';

export class AddTeamMemberUseCase {
  constructor(private teamRepository: TeamRepository) {}

  async execute(memberData: TeamMember) {
    const team = await this.teamRepository.findById(memberData.id_equipo);
    if (!team) throw new Error('El equipo no existe');

    const isAlreadyInATeam = await this.teamRepository.isUserInAnyTeam(memberData.id_usuario);
    if (isAlreadyInATeam) {
      throw new Error('El jugador ya pertenece a un equipo y no puede unirse a otro simultáneamente.');
    }

    // Podrías agregar más lógica aquí (ej. verificar que el usuario no esté en otro equipo activo)
    await this.teamRepository.addMember(memberData);
  }
}