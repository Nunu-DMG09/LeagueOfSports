import { Request, Response } from 'express';
import { KnexRewardRepository } from './KnexRewardRepository';

export class RewardController {
  constructor(private repository: KnexRewardRepository) {}

  async getAll(req: Request, res: Response) {
    try {
      const rewards = await this.repository.findAll();
      res.json(rewards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      await this.repository.create(req.body);
      res.status(201).json({ message: 'Recompensa creada' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async redeem(req: Request, res: Response) {
    try {
      const { id_recompensa } = req.params;
      const { id_usuario } = req.body;
      await this.repository.redeemReward(Number(id_usuario), Number(id_recompensa));
      res.json({ message: '¡Canje realizado con éxito!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}