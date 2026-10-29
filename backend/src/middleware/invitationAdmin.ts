import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export function requireInvitationAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const user = req.user as any;
  const adminEmail = (process.env.INVITATION_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'info@stararc.one').trim().toLowerCase();
  if (!user?.email_verified || (user.role !== 'admin' && user.email?.trim().toLowerCase() !== adminEmail)) {
    res.status(403).json({ error: 'Administrator access required.' });
    return;
  }
  next();
}
