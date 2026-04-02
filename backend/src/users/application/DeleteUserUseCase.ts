import { UserRepository } from '../domain/UserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado');
    await this.userRepository.delete(id);
  }
}