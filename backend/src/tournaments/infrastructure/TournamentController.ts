import { Request, Response } from 'express';
import { CreateTournamentUseCase } from '../application/CreateTournamentUseCase';
import { RegisterTeamUseCase } from '../application/RegisterTeamUseCase';
import { TournamentRepository } from '../domain/TournamentRepository';

export class TournamentController {
  constructor(
    private createUseCase: CreateTournamentUseCase,
    private registerTeamUseCase: RegisterTeamUseCase,
    private tournamentRepository: TournamentRepository
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

  async getAll(req: Request, res: Response) {
    try {
      const tournaments = await this.registerTeamUseCase['repository'].findAll();
      res.json(tournaments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id_torneo } = req.params;
      const tournament = await this.registerTeamUseCase['repository'].findById(Number(id_torneo));
      if (!tournament) return res.status(404).json({ error: 'Torneo no encontrado' });
      res.json(tournament);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTeams(req: Request, res: Response) {
    try {
      const { id_torneo } = req.params;
      // Usamos el método getTeamsInTournament que creamos en el repositorio anteriormente
      const teams = await (this.registerTeamUseCase['repository'] as any).getTeamsInTournament(Number(id_torneo));
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeTeam(req: Request, res: Response) {
    try {
      const tournamentId = Number(req.params.id);
      const teamId = Number(req.params.teamId);
      
      await this.tournamentRepository.removeTeam(tournamentId, teamId);
      res.json({ message: 'Equipo expulsado del torneo exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  
}