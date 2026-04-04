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

// ¡LA NUEVA RUTA BLINDADA!
router.get('/stats/ranking', controller.getRanking.bind(controller));

router.get('/tournament/:id_torneo', controller.getByTournament.bind(controller));
router.get('/:id_partida', controller.getById.bind(controller));
router.put('/:id_partida/finish', controller.finish.bind(controller));
router.post('/:id_partida/stats', controller.registerStats.bind(controller));
router.post('/', controller.create.bind(controller));

export default router;