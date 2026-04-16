import { Router } from 'express';
import crypto from 'crypto';
import { pool } from '../database/connection';
import { UserEncryptionService } from '../services/userEncryptionService';
import { EmailService } from '../services/emailService';

const emailService = new EmailService();

const router = Router();

// GET /api/public/genesis-members — publicly accessible, no auth required
router.get('/genesis-members', async (_req, res): Promise<any> => {
  try {
    const result = await pool.query(
      `SELECT admin_encrypted_genesis_hall_of_fame_name
       FROM users
       WHERE admin_encrypted_genesis_hall_of_fame_name IS NOT NULL
       ORDER BY id ASC`
    );

    const members: string[] = [];
    for (const row of result.rows) {
      try {
        const name = UserEncryptionService.decryptWithMasterKey(
          row.admin_encrypted_genesis_hall_of_fame_name
        );
        if (name) members.push(name);
      } catch {
        // skip users with corrupt/unreadable encryption
      }
    }

    return res.json({ members });
  } catch (error) {
    console.error('Error fetching genesis members:', error);
    return res.status(500).json({ error: 'Failed to load genesis members' });
  }
});

// In-memory store for pending newsletter confirmations
// Map<token, { email: string; expiresAt: number }>
const pendingConfirmations = new Map<string, { email: string; expiresAt: number }>();

// Clean up expired tokens every hour
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of pendingConfirmations.entries()) {
    if (data.expiresAt < now) pendingConfirmations.delete(token);
  }
}, 60 * 60 * 1000);

// POST /api/public/newsletter/signup
router.post('/newsletter/signup', async (req, res): Promise<any> => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email required' });
    }
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed) || trimmed.length > 254) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Prevent token flooding: remove any existing pending token for this email
    for (const [token, data] of pendingConfirmations.entries()) {
      if (data.email === trimmed) pendingConfirmations.delete(token);
    }

    const token = crypto.randomBytes(32).toString('hex');
    pendingConfirmations.set(token, {
      email: trimmed,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await emailService.sendNewsletterConfirmation(trimmed, token);

    return res.json({ ok: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/public/newsletter/confirm/:token
router.get('/newsletter/confirm/:token', async (req, res): Promise<any> => {
  const { token } = req.params;

  const html = (success: boolean, message: string) => `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>StarArc Newsletter</title>
      <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; border-radius: 12px; padding: 40px; max-width: 440px; text-align: center; }
        h2 { margin: 0 0 12px; font-size: 22px; color: ${success ? '#34d399' : '#f87171'}; }
        p { color: #94a3b8; line-height: 1.6; }
        a { display: inline-block; margin-top: 24px; padding: 10px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>${success ? '✓ Anmeldung bestätigt' : 'Ungültiger Link'}</h2>
        <p>${message}</p>
        <a href="${process.env.FRONTEND_URL || 'https://stararc.one'}">Zurück zu StarArc →</a>
      </div>
    </body>
    </html>
  `;

  // Validate token format
  if (!/^[0-9a-f]{64}$/.test(token)) {
    return res.status(400).send(html(false, 'Dieser Bestätigungslink ist ungültig.'));
  }

  const entry = pendingConfirmations.get(token);
  if (!entry) {
    return res.status(400).send(html(false, 'Dieser Link ist abgelaufen oder wurde bereits verwendet.'));
  }
  if (entry.expiresAt < Date.now()) {
    pendingConfirmations.delete(token);
    return res.status(400).send(html(false, 'Dieser Link ist abgelaufen. Bitte melde dich erneut an.'));
  }

  const { email } = entry;
  pendingConfirmations.delete(token);

  // Add contact to Brevo
  try {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const listId = parseInt(process.env.BREVO_NEWSLETTER_LIST_ID || '0', 10);

    if (!brevoApiKey || !listId) {
      console.error('Newsletter: BREVO_API_KEY or BREVO_NEWSLETTER_LIST_ID not configured');
      return res.status(500).send(html(false, 'Konfigurationsfehler. Bitte kontaktiere uns.'));
    }

    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!brevoRes.ok && brevoRes.status !== 204) {
      const body = await brevoRes.text();
      console.error('Brevo API error:', brevoRes.status, body);
      return res.status(500).send(html(false, 'Fehler bei der Anmeldung. Bitte versuche es später erneut.'));
    }

    console.log(`✅ Newsletter: ${email} added to Brevo list ${listId}`);
    return res.send(html(true, 'Du bist jetzt für den StarArc-Newsletter angemeldet.'));
  } catch (error) {
    console.error('Newsletter confirm error:', error);
    return res.status(500).send(html(false, 'Interner Fehler. Bitte versuche es später erneut.'));
  }
});

export default router;
