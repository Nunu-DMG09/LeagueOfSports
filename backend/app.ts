import express from 'express';
import cors from 'cors';
import authRoutes from './src/users/infrastructure/auth.routes';
import userRoutes from './src/users/infrastructure/user.routes';

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Montar rutas
// Grita su arquitectura: Todas las rutas de auth bajo /api/auth
app.use('/api/auth', authRoutes);
// Rutas de usuarios bajo /api/users
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'League of Sports API is running' });
});

export default app;