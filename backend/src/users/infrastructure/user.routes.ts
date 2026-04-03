import { Router } from 'express';
import { KnexUserRepository } from './KnexUserRepository';
import { RegisterUserUseCase } from '../application/RegisterUserUseCase';
import { UpdateUserUseCase } from '../application/UpdateUserUseCase';
import { DeleteUserUseCase } from '../application/DeleteUserUseCase';
import { UserController } from './UserController';

const router = Router();
const repo = new KnexUserRepository();

const controller = new UserController(
  new RegisterUserUseCase(repo),
  new UpdateUserUseCase(repo),
  new DeleteUserUseCase(repo)
);
router.get('/', controller.getAll.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;