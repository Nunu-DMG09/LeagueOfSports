import app from './app';
import dotenv from 'dotenv';
import db from './src/shared/infrastructure/database';

dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Verificar conexión a la BD antes de levantar el servidor
    await db.raw('SELECT 1');
    console.log('📦 Conectado a la base de datos MySQL exitosamente.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();