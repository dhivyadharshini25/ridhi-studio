import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import pool from '../config/db';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Verifies the JWT and attaches { userId, role } to req.user.
// Also re-checks the account is still active on every request, so a
// disabled account is locked out immediately, not just at next login.
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);

    const { rows } = await pool.query(
      'SELECT id, role, is_active FROM users WHERE id = $1',
      [payload.userId]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ success: false, message: 'Account not found' });
    if (!user.is_active) return res.status(403).json({ success: false, message: 'Account is disabled' });

    req.user = { userId: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Role-based access control — never trust a frontend-only role check.
export function requireRole(...roles: Array<'CUSTOMER' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to do this' });
    }
    next();
  };
}
