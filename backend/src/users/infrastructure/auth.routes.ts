import { Router } from 'express';
import { KnexUserRepository } from './KnexUserRepository';
import { LoginUserUseCase } from '../application/LoginUserUseCase';
import { AuthController } from './AuthController';

const router = Router();

// Inyección de dependencias manual (Wiring)
const userRepository = new KnexUserRepository();
const loginUserUseCase = new LoginUserUseCase(userRepository);
const authController = new AuthController(loginUserUseCase);

// IMPORTANTE: bind(authController) para no perder el contexto de 'this'
router.post('/login', authController.login.bind(authController));

export default router;