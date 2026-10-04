import 'dotenv/config';
const asInt = (value, fallback) => { const n = Number.parseInt(value, 10); return Number.isFinite(n) ? n : fallback; };
export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: asInt(process.env.PORT, 4000),
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/civicconnect',
  dbPoolMax: asInt(process.env.DB_POOL_MAX, 10),
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxUploadMb: asInt(process.env.MAX_UPLOAD_MB, 8),
});
if (env.nodeEnv === 'production' && env.jwtSecret === 'development-only-change-me') throw new Error('JWT_SECRET must be set in production.');
