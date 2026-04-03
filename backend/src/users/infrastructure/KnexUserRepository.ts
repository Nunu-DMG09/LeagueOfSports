import db from '../../shared/infrastructure/database';
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';

export class KnexUserRepository implements UserRepository {
  async findByNickname(nickname: string): Promise<User | null> {
    return await db('usuarios').where({ nickname }).first() || null;
  }

  async findById(id: number): Promise<User | null> {
    return await db('usuarios').where({ id_usuario: id }).first() || null;
  }

  async save(user: Partial<User>): Promise<void> {
    await db('usuarios').insert(user);
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    await db('usuarios').where({ id_usuario: id }).update(user);
  }

  async delete(id: number): Promise<void> {
    await db('usuarios').where({ id_usuario: id }).delete();
  }

  async findAll(): Promise<any[]> {
    // Traemos los usuarios sin la contraseña por seguridad
    return await db('usuarios')
      .select('id_usuario', 'nickname', 'elo', 'puntos_totales', 'estado', 'fecha_registro')
      .orderBy('puntos_totales', 'desc');
  }
}