import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../application/RegisterUserUseCase';
import { UpdateUserUseCase } from '../application/UpdateUserUseCase';
import { DeleteUserUseCase } from '../application/DeleteUserUseCase';

export class UserController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private updateUseCase: UpdateUserUseCase,
    private deleteUseCase: DeleteUserUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      await this.registerUseCase.execute(req.body);
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.updateUseCase.execute(Number(id), req.body);
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(Number(id));
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}