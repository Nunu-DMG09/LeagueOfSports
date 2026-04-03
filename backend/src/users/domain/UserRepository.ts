import { User } from './User';

export interface UserRepository {
  findByNickname(nickname: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  save(user: Partial<User>): Promise<void>;
  update(id: number, user: Partial<User>): Promise<void>;
  delete(id: number): Promise<void>;
  findAll(): Promise<any[]>;
}