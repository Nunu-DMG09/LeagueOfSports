import bcrypt from 'bcryptjs';
import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: number, userData: Partial<User>) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('Usuario no encontrado');

    // Si el usuario envió una nueva contraseña, la encriptamos
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.userRepository.update(id, userData);
  }
}