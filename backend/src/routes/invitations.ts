import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { pool } from '../database/connection';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { requireInvitationAdmin } from '../middleware/invitationAdmin';
import { InvitationService, InvitationError } from '../services/invitationService';
import { EmailService } from '../services/emailService';
import { verifyTurnstileToken } from '../utils/turnstile';

const router = Router();
const invitations = new InvitationService(pool);
const emailService = new EmailService();
const requestLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5,
  standardHeaders: true, legacyHeaders: false,
  message: { code: 'RATE_LIMIT', error: 'Too many access requests. Please try again later.' } });
const emailValidation = body('email').isString().isLength({ max: 254 }).isEmail().normalizeEmail();
const contactValidation = [emailValidation, body('name').isString().trim().isLength({ min: 1, max: 100 }),
  body('message').optional().isString().trim().isLength({ max: 1000 }),
  body('languageCode').optional().isIn(['de', 'en'])];

router.post('/request', requestLimiter, contactValidation, async (req: Request, res: Response): Promise<any> => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ code: 'VALIDATION', error: 'Please check your contact details.' });
  if (!await verifyTurnstileToken(req.body['cf-turnstile-response'], req.ip)) {
    return res.status(400).json({ code: 'BOT_CHECK', error: 'Bot verification failed.' });
  }
  try {
    const { email, name, message = '', languageCode = 'de' } = req.body;
    const id = await invitations.request(email, name, message, languageCode);
    if (id) {
      await emailService.sendAccessRequestNotification(email, name, message);
    }
    // Identical response for duplicate requests and existing accounts.
    return res.status(202).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Could not save access request.' });
  }
});

router.use('/admin', authMiddleware, requireInvitationAdmin, (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
router.get('/admin/me', (_req, res) => { res.json({ admin: true }); });
router.get('/admin', async (_req, res): Promise<any> => {
  try { return res.json({ requests: await invitations.list() }); }
  catch { return res.status(500).json({ error: 'Could not load access requests.' }); }
});

async function issueAndSend(id: number, adminId: number): Promise<any> {
  const invitation = await invitations.issue(id, adminId);
  let emailSent = true;
  try { await emailService.sendInvitation(invitation.email, invitation.code, invitation.link, invitation.language); }
  catch { emailSent = false; }
  // The admin can copy and send manually if SMTP fails; retry rotates credentials.
  return { code: invitation.code, link: invitation.link, emailSent };
}

router.post('/admin', contactValidation, async (req: AuthRequest, res: Response): Promise<any> => {
  if (!validationResult(req).isEmpty()) return res.status(400).json({ error: 'Please check your contact details.' });
  try {
    const { email, name, message = '', languageCode = 'de' } = req.body;
    const id = await invitations.request(email, name, message, languageCode);
    if (!id) return res.status(409).json({ error: 'An account or access request already exists for this email.' });
    return res.status(201).json(await issueAndSend(id, req.user!.id));
  } catch { return res.status(500).json({ error: 'Could not create invitation.' }); }
});

router.post('/admin/:id/:action', [param('id').isInt({ min: 1 }), param('action').isIn(['approve', 'reject', 'revoke'])],
  async (req: AuthRequest, res: Response): Promise<any> => {
    if (!validationResult(req).isEmpty()) return res.status(400).json({ error: 'Invalid action.' });
    try {
      const id = Number(req.params['id']);
      if (req.params['action'] === 'approve') return res.json(await issueAndSend(id, req.user!.id));
      await invitations.changeStatus(id, req.params['action'] === 'reject' ? 'rejected' : 'revoked', req.user!.id);
      return res.json({ success: true });
    } catch (error) {
      return res.status(error instanceof InvitationError ? 409 : 500).json({ error: 'Could not change invitation.' });
    }
  });

export default router;
