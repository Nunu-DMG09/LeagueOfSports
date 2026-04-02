import bcrypt from 'bcryptjs';
import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Partial<User>) {
    const existing = await this.userRepository.findByNickname(userData.nickname!);
    if (existing) throw new Error('El nickname ya está en uso');

    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    await this.userRepository.save({ ...userData, password: hashedPassword });
  }
}