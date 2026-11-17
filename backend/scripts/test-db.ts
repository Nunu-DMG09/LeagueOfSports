
import db from '../src/shared/infrastructure/database';

async function testDatabase() {
    try {
        console.log('Conectando con la base de datos...');

        await db.raw('SELECT 1');

        const [rows] = await db.raw(
            'SELECT COUNT(*) AS total FROM usuarios'
        );

        console.log('Conexión exitosa con TiDB');
        console.log('Usuarios registrados:', rows[0].total);
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exitCode = 1;
    } finally {
        await db.destroy();
    }
}

testDatabase();
