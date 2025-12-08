import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../database/connection';
import { User } from '../types';

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; email: string; role: string };
    
    // Get user from database
    const userQuery = `
      SELECT id, admin_encrypted_email, admin_encrypted_alias, 
             email_verified, role, created_at, last_login,
             subscription_plan
      FROM users 
      WHERE id = $1
    `;
    
    const userResult = await pool.query(userQuery, [decoded.id]);
    
    if (userResult.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.'
      });
      return;
    }

    req.user = userResult.rows[0] as User;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token.'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired. Please log in again.'
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Authentication failed.'
    });
  }
};

export const requireEmailVerification = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.emailVerified) {
    res.status(403).json({
      success: false,
      error: 'Email verification required. Please verify your email address.'
    });
    return;
  }
  
  next();
};