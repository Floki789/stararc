import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto';
import { Pool, PoolClient } from 'pg';
import { UserEncryptionService } from './userEncryptionService';

export class InvitationError extends Error {}

export function invitationHash(emailHash: string, credential: string): string {
  return createHash('sha256').update(`${emailHash}\0${credential.trim().toUpperCase()}`).digest('hex');
}

function matches(hash: string | null, candidate: string): boolean {
  return !!hash && hash.length === candidate.length && timingSafeEqual(Buffer.from(hash), Buffer.from(candidate));
}

export class InvitationService {
  constructor(private pool: Pool) {}

  async request(email: string, name: string, message: string, language: string): Promise<number | null> {
    const emailHash = UserEncryptionService.generateEmailHash(email);
    const result = await this.pool.query(
      `INSERT INTO access_requests (email_hash, encrypted_email, encrypted_name, encrypted_message, language_code)
       SELECT $1::text, $2, $3, $4, $5 WHERE NOT EXISTS (SELECT 1 FROM users WHERE email_hash = $1::text)
       ON CONFLICT (email_hash) DO NOTHING RETURNING id`,
      [emailHash, UserEncryptionService.encryptWithMasterKey(email),
        UserEncryptionService.encryptWithMasterKey(name), UserEncryptionService.encryptWithMasterKey(message), language]
    );
    return result.rows[0]?.id ?? null;
  }

  async list(): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT id, encrypted_email, encrypted_name, encrypted_message, language_code, status,
              failed_attempts, expires_at, created_at FROM access_requests ORDER BY created_at DESC LIMIT 500`
    );
    return result.rows.map(row => ({
      id: row.id, email: UserEncryptionService.decryptWithMasterKey(row.encrypted_email),
      name: UserEncryptionService.decryptWithMasterKey(row.encrypted_name),
      message: UserEncryptionService.decryptWithMasterKey(row.encrypted_message),
      language: row.language_code, status: row.status, failedAttempts: row.failed_attempts,
      expiresAt: row.expires_at, createdAt: row.created_at
    }));
  }

  async issue(id: number, adminId: number): Promise<{ email: string; language: string; code: string; link: string }> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query('SELECT * FROM access_requests WHERE id = $1 FOR UPDATE', [id]);
      const row = result.rows[0];
      if (!row || row.status === 'used') throw new InvitationError('Invitation cannot be issued');
      const words = ['NOVA', 'STAR', 'LUNA', 'ORBIT', 'ASTRO', 'SOLAR', 'KOMET', 'ATLAS'];
      const code = `${words[randomInt(words.length)]}-${randomInt(1000, 10000)}`;
      const token = randomBytes(32).toString('hex');
      await client.query(
        `UPDATE access_requests SET status = 'approved', code_hash = $2, token_hash = $3,
         expires_at = NOW() + INTERVAL '14 days', reviewed_by = $4, failed_attempts = 0, updated_at = NOW() WHERE id = $1`,
        [id, invitationHash(row.email_hash, code), invitationHash(row.email_hash, token), adminId]
      );
      await client.query('COMMIT');
      const email = UserEncryptionService.decryptWithMasterKey(row.encrypted_email);
      const fragment = new URLSearchParams({ invite: token, email }).toString();
      return { email, language: row.language_code, code,
        link: `${process.env.FRONTEND_URL || 'http://localhost:3003'}/register#${fragment}` };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally { client.release(); }
  }

  async changeStatus(id: number, status: 'rejected' | 'revoked', adminId: number): Promise<void> {
    const result = await this.pool.query(
      `UPDATE access_requests SET status = $2, code_hash = NULL, token_hash = NULL,
       reviewed_by = $3, updated_at = NOW() WHERE id = $1 AND status <> 'used' RETURNING id`,
      [id, status, adminId]
    );
    if (!result.rows.length) throw new InvitationError('Invitation cannot be changed');
  }

  // Called first inside the account-creation transaction. The row lock prevents reuse.
  async lockForRegistration(client: PoolClient, email: string, credential?: string): Promise<number> {
    if (!credential || credential.length > 100) throw new InvitationError('INVITATION_INVALID');
    const emailHash = UserEncryptionService.generateEmailHash(email);
    const result = await client.query(
      `SELECT id, code_hash, token_hash FROM access_requests WHERE email_hash = $1
       AND status = 'approved' AND expires_at > NOW() AND failed_attempts < 10 FOR UPDATE`, [emailHash]
    );
    const row = result.rows[0];
    if (!row) throw new InvitationError('INVITATION_INVALID');
    const hash = invitationHash(emailHash, credential);
    if (!matches(row.code_hash, hash) && !matches(row.token_hash, hash)) {
      await client.query('UPDATE access_requests SET failed_attempts = failed_attempts + 1 WHERE id = $1', [row.id]);
      throw new InvitationError('INVITATION_INVALID');
    }
    return row.id;
  }
}
