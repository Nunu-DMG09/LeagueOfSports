import { Request, Response } from 'express';
import { CreateTournamentUseCase } from '../application/CreateTournamentUseCase';
import { RegisterTeamUseCase } from '../application/RegisterTeamUseCase';

export class TournamentController {
  constructor(
    private createUseCase: CreateTournamentUseCase,
    private registerTeamUseCase: RegisterTeamUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const id = await this.createUseCase.execute(req.body);
      res.status(201).json({ message: 'Torneo creado exitosamente', id_torneo: id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async registerTeam(req: Request, res: Response) {
    try {
      const { id_torneo } = req.params;
      const registrationData = { ...req.body, id_torneo: Number(id_torneo) };
      await this.registerTeamUseCase.execute(registrationData);
      res.status(201).json({ message: 'Equipo inscrito en el torneo exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}