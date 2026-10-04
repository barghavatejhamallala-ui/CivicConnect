import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { AppError } from './http.js';

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try { return jwt.verify(token, env.jwtSecret); }
  catch { throw new AppError(401, 'Invalid or expired authentication token.'); }
}
