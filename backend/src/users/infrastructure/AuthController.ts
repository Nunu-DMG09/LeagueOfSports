import { Request, Response } from 'express';
import { LoginUserUseCase } from '../application/LoginUserUseCase';

export class AuthController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { nickname, password } = req.body;

      if (!nickname || !password) {
        res.status(400).json({ error: 'Faltan credenciales' });
        return;
      }

      const result = await this.loginUserUseCase.execute(nickname, password);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Error de autenticación' });
    }
  }
}