import { pool } from './database.js';

export async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    const { rows } = await client.query('SELECT version FROM schema_migrations ORDER BY version');
    const applied = new Set(rows.map((row) => row.version));

    if (!applied.has(1)) {
      await client.query(`
        CREATE TABLE users (
          id TEXT PRIMARY KEY,
          role TEXT NOT NULL CHECK (role IN ('citizen','authority','worker')),
          name TEXT NOT NULL,
          email TEXT UNIQUE,
          mobile TEXT UNIQUE,
          username TEXT UNIQUE,
          employee_id TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          phone TEXT,
          area TEXT,
          worker_id TEXT UNIQUE,
          department TEXT,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE complaints (
          id TEXT PRIMARY KEY,
          citizen_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          category TEXT NOT NULL CHECK (category IN ('road','light','garbage','water','other')),
          description TEXT NOT NULL,
          location TEXT NOT NULL,
          lat DOUBLE PRECISION,
          lng DOUBLE PRECISION,
          photo_url TEXT,
          status TEXT NOT NULL CHECK (status IN ('submitted','review','assigned','progress','resolved','rejected')),
          priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High')),
          worker_id TEXT REFERENCES users(id) ON DELETE SET NULL,
          assigned_by TEXT REFERENCES users(id) ON DELETE SET NULL,
          assigned_at TIMESTAMPTZ,
          expected_by TIMESTAMPTZ,
          note TEXT,
          completed_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE complaint_photos (
          id TEXT PRIMARY KEY,
          complaint_id TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
          worker_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL CHECK (type IN ('progress','completion')),
          url TEXT NOT NULL,
          caption TEXT,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE notifications (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          complaint_id TEXT REFERENCES complaints(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          read_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE INDEX idx_complaints_citizen ON complaints(citizen_id, created_at DESC);
        CREATE INDEX idx_complaints_worker ON complaints(worker_id, status, created_at DESC);
        CREATE INDEX idx_complaints_status ON complaints(status, created_at DESC);
        CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
        CREATE INDEX idx_photos_complaint ON complaint_photos(complaint_id, created_at ASC);
        CREATE INDEX idx_users_role_active ON users(role, active);
      `);
      await client.query('INSERT INTO schema_migrations(version) VALUES($1)', [1]);
    }

    await client.query('COMMIT');
    console.log('PostgreSQL migrations are up to date.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  try {
    await migrate();
  } finally {
    await pool.end();
  }
}
