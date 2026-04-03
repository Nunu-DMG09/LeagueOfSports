import { Router } from 'express';
import { KnexMatchRepository } from './KnexMatchRepository';
import { CreateMatchUseCase } from '../application/CreateMatchUseCase';
import { FinishMatchUseCase } from '../application/FinishMatchUseCase';
import { RegisterPlayerStatsUseCase } from '../application/RegisterPlayerStatsUseCase';
import { MatchController } from './MatchController';

const router = Router();
const repo = new KnexMatchRepository();

const controller = new MatchController(
  new CreateMatchUseCase(repo),
  new FinishMatchUseCase(repo),
  new RegisterPlayerStatsUseCase(repo)
);

router.post('/', controller.create.bind(controller));
router.put('/:id_partida/finish', controller.finish.bind(controller));
router.post('/:id_partida/stats', controller.registerStats.bind(controller));

export default router;