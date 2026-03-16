import { Router } from 'express';
import { pool } from '../database/connection';
import { UserEncryptionService } from '../services/userEncryptionService';

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

export default router;
