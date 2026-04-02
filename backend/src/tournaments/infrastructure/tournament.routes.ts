import { Router } from 'express';
import { KnexTournamentRepository } from './KnexTournamentRepository';
import { CreateTournamentUseCase } from '../application/CreateTournamentUseCase';
import { RegisterTeamUseCase } from '../application/RegisterTeamUseCase';
import { TournamentController } from './TournamentController';

const router = Router();
const repo = new KnexTournamentRepository();

const controller = new TournamentController(
  new CreateTournamentUseCase(repo),
  new RegisterTeamUseCase(repo)
);

router.post('/', controller.create.bind(controller));
router.post('/:id_torneo/register-team', controller.registerTeam.bind(controller));

export default router;