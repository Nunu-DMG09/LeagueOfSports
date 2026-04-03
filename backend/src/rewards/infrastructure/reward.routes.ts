import { Router } from 'express';
import { KnexRewardRepository } from './KnexRewardRepository';
import { RewardController } from './RewardController';

const router = Router();
const repository = new KnexRewardRepository();
const controller = new RewardController(repository);

router.get('/', controller.getAll.bind(controller));
router.post('/', controller.create.bind(controller));
router.post('/:id_recompensa/redeem', controller.redeem.bind(controller));

export default router;