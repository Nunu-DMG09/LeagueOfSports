import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../domain/UserRepository';

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(nickname: string, password_plain: string) {
    const user = await this.userRepository.findByNickname(nickname);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Tu base de datos tiene contraseñas encriptadas con bcrypt, validamos:
    const isValidPassword = await bcrypt.compare(password_plain, user.password!);

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar Token
    const secret = process.env.JWT_SECRET || 'secret_fallback';
    const expiresIn = parseInt(process.env.JWT_EXP || '3600');

    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        roleId: user.id_rol,
        nickname: user.nickname 
      },
      secret,
      { expiresIn }
    );

    // Retornamos la info sin el hash de la contraseña
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
}