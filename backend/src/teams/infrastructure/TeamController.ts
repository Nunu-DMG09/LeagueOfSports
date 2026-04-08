import { Request, Response } from 'express';
import { CreateTeamUseCase } from '../application/CreateTeamUseCase';
import { AddTeamMemberUseCase } from '../application/AddTeamMemberUseCase';
import { KnexTeamRepository } from './KnexTeamRepository';
import { TeamRepository } from '../domain/TeamRepository';



export class TeamController {
  constructor(
    private createTeamUseCase: CreateTeamUseCase,
    private addMemberUseCase: AddTeamMemberUseCase,
    private teamRepository: TeamRepository 
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { nombre } = req.body;
      
      let logo_url: string | undefined = undefined;

      if (req.file) {
        logo_url = `/uploads/${req.file.filename}`;
      }

      await this.createTeamUseCase.execute({
        nombre,
        logo_url,
        estado: 'activo'
      });

      res.status(201).json({ message: 'Equipo creado exitosamente' });
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
      const members = await this.teamRepository.getMembersByTeam(Number(id_equipo));
      res.json(members);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const teams = await this.teamRepository.findAll();
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id_equipo } = req.params;
      const team = await this.teamRepository.findById(Number(id_equipo));
      if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      const teamId = Number(req.params.id);
      const userId = Number(req.params.userId);
      
      await this.teamRepository.removeMember(teamId, userId);
      
      res.json({ message: 'Jugador expulsado del equipo exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const teamId = Number(req.params.id_equipo);
      const { nombre, estado } = req.body;
      
      const dataToUpdate: any = { nombre, estado };
      
      // Si se subió un nuevo logo, lo actualizamos
      if (req.file) {
        dataToUpdate.logo_url = `/uploads/${req.file.filename}`;
      }

      await this.teamRepository.updateTeam(teamId, dataToUpdate);
      res.json({ message: 'Equipo actualizado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const teamId = Number(req.params.id_equipo);
      await this.teamRepository.deleteTeam(teamId);
      res.json({ message: 'Equipo eliminado exitosamente' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}