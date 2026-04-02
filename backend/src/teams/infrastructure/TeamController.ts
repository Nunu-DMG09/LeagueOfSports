import { Request, Response } from 'express';
import { CreateTeamUseCase } from '../application/CreateTeamUseCase';
import { AddTeamMemberUseCase } from '../application/AddTeamMemberUseCase';
import { KnexTeamRepository } from './KnexTeamRepository';

export class TeamController {
  constructor(
    private createTeamUseCase: CreateTeamUseCase,
    private addMemberUseCase: AddTeamMemberUseCase,
    private repository: KnexTeamRepository // Lo inyectamos para un Get rápido
  ) {}

  async create(req: Request, res: Response) {
    try {
      const id = await this.createTeamUseCase.execute(req.body);
      res.status(201).json({ message: 'Equipo creado', id_equipo: id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addMember(req: Request, res: Response) {
    try {
      const { id_equipo } = req.params;
      const memberData = { ...req.body, id_equipo: Number(id_equipo) };
      await this.addMemberUseCase.execute(memberData);
      res.status(201).json({ message: 'Miembro agregado al equipo' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMembers(req: Request, res: Response) {
    try {
      const { id_equipo } = req.params;
      const members = await this.repository.getMembersByTeam(Number(id_equipo));
      res.json(members);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}