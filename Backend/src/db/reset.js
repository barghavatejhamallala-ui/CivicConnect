import { query, pool } from './database.js';
await query('DROP TABLE IF EXISTS notifications, complaint_photos, complaints, users, schema_migrations CASCADE');
console.log('PostgreSQL schema reset. Run npm run migrate then npm run seed.');
await pool.end();
