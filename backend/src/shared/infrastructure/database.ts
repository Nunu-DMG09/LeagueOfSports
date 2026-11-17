
import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: process.env.DB_SSL === 'true'
      ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      }
      : undefined,
  },
  pool: {
    min: 0,
    max: 7,
  },
});

export default db;
