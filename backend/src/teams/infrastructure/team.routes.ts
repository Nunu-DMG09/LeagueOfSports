import { Router } from 'express';
import { KnexTeamRepository } from './KnexTeamRepository';
import { CreateTeamUseCase } from '../application/CreateTeamUseCase';
import { AddTeamMemberUseCase } from '../application/AddTeamMemberUseCase';
import { TeamController } from './TeamController';

const router = Router();
const repo = new KnexTeamRepository();

const controller = new TeamController(
  new CreateTeamUseCase(repo),
  new AddTeamMemberUseCase(repo),
  repo
);

router.get('/', controller.getAll.bind(controller));
router.get('/:id_equipo', controller.getById.bind(controller));
router.post('/', controller.create.bind(controller));
router.post('/:id_equipo/members', controller.addMember.bind(controller));
router.get('/:id_equipo/members', controller.getMembers.bind(controller));

export default router;