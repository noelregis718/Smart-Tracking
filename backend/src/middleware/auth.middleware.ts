import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export interface AuthRequest extends Request {
  userId?: string;
  auth?: {
    userId: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Try Custom JWT first
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      // If custom JWT is present but invalid, we don't fall back, we fail.
      return res.status(401).json({ error: 'Unauthorized: Invalid custom token' });
    }
  }

  // 2. Fallback to Clerk Auth (attached by ClerkExpressWithAuth middleware)
  if (req.auth && req.auth.userId) {
    req.userId = req.auth.userId;
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized: No valid session found' });
};
