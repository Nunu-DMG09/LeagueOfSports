import express from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './src/users/infrastructure/auth.routes';
import userRoutes from './src/users/infrastructure/user.routes';
import teamRoutes from './src/teams/infrastructure/team.routes';
import tournamentRoutes from './src/tournaments/infrastructure/tournament.routes';
import matchRoutes from './src/matches/infrastructure/match.routes';

import rewardRoutes from './src/rewards/infrastructure/reward.routes';
import dashboardRoutes from './src/dashboard/infrastructure/dashboard.routes';

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Montar rutas
// Grita su arquitectura: Todas las rutas de auth bajo /api/auth
app.use('/api/auth', authRoutes);
// Rutas de usuarios bajo /api/users
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'League of Sports API is running' });
});

export default app;