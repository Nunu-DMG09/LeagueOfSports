import { Request, Response } from 'express';
import { CreateMatchUseCase } from '../application/CreateMatchUseCase';
import { FinishMatchUseCase } from '../application/FinishMatchUseCase';
import { RegisterPlayerStatsUseCase } from '../application/RegisterPlayerStatsUseCase';

export class MatchController {
  constructor(
    private createMatchUseCase: CreateMatchUseCase,
    private finishMatchUseCase: FinishMatchUseCase,
    private registerStatsUseCase: RegisterPlayerStatsUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const id = await this.createMatchUseCase.execute(req.body);
      res.status(201).json({ message: 'Partida registrada', id_partida: id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async finish(req: Request, res: Response) {
    try {
      const { id_partida } = req.params;
      const { id_equipo_ganador, duracion_minutos } = req.body;
      await this.finishMatchUseCase.execute(Number(id_partida), id_equipo_ganador, duracion_minutos);
      res.json({ message: 'Resultado de la partida actualizado' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async registerStats(req: Request, res: Response) {
    try {
      const { id_partida } = req.params;
      const statsData = { ...req.body, id_partida: Number(id_partida) };
      await this.registerStatsUseCase.execute(statsData);
      res.status(201).json({ message: 'Estadísticas del jugador registradas exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByTournament(req: Request, res: Response) {
    try {
      const { id_torneo } = req.params;
      const matches = await (this.createMatchUseCase['repository']).findByTournament(Number(id_torneo));
      res.json(matches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const { id_partida } = req.params;
      if (isNaN(Number(id_partida))) {
         return res.status(400).json({ error: 'ID inválido' });
      }
      const match = await (this.createMatchUseCase['repository']).findById(Number(id_partida));
      if (!match) return res.status(404).json({ error: 'Partida no encontrada' });
      res.json(match);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRanking(req: Request, res: Response) {
    try {
      const ranking = await (this.createMatchUseCase['repository']).getGlobalRanking();
      res.json(ranking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}