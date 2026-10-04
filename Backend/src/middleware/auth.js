import { verifyToken } from '../utils/auth.js';
import { AppError } from '../utils/http.js';
import { findUserById } from '../services/users.js';

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next(new AppError(401, 'Authentication required.'));
  try {
    const payload = verifyToken(header.slice(7));
    const user = await findUserById(payload.sub);
    if (!user || !user.active) throw new AppError(401, 'Account is not active.');
    req.user = user;
    next();
  } catch (error) {
    if (error?.name === 'JsonWebTokenError' || error?.name === 'TokenExpiredError' || error?.name === 'NotBeforeError') return next(new AppError(401, 'Session expired. Please sign in again.'));
    next(error);
  }
}

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) return next(new AppError(403, 'You do not have permission to perform this action.'));
  next();
};
