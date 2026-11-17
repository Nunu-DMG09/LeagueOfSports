
import 'dotenv/config';
import app from './app';
import db from './src/shared/infrastructure/database';

const PORT = Number(process.env.PORT || 4000);

const startServer = async () => {
  try {
    // Verificar la conexión con MySQL o TiDB Cloud
    await db.raw('SELECT 1');

    console.log('✅ Conexión a la base de datos exitosa.');

    // Compatible con localhost y Render
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
      console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
