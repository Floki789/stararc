// Import crypto directly since we need UserEncryptionService functionality
const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

// UserEncryptionService methods replicated for debugging
class UserEncryptionService {
  static getMasterKey() {
    const masterKey = process.env.ADMIN_USER_DATA_ENCRYPTION_KEY;
    if (!masterKey) {
      throw new Error('ADMIN_USER_DATA_ENCRYPTION_KEY environment variable is required');
    }
    return Buffer.from(masterKey, 'utf8').slice(0, 32);
  }

  static decryptWithMasterKey(encryptedData) {
    const IV_LENGTH = 12;
    const TAG_LENGTH = 16;

    try {
      // Decode base64
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract components (no salt for master key)
      const iv = combined.slice(0, IV_LENGTH);
      const encrypted = combined.slice(IV_LENGTH, -TAG_LENGTH);
      const authTag = combined.slice(-TAG_LENGTH);
      
      // Get master key
      const key = this.getMasterKey();
      
      // Create decipher
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted.trim();
    } catch (error) {
      throw new Error('Failed to decrypt admin data - check master key');
    }
  }
}

async function debugLegalFields() {
  const pool = new Pool({
    user: process.env.DB_USER || 'sam',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'stararc',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('🔍 Debugging legal document fields for user ID 7...\n');

    const result = await pool.query(`
      SELECT 
        id, 
        email_verified, 
        created_at,
        admin_encrypted_terms_accepted_at,
        admin_encrypted_terms_version,
        admin_encrypted_terms_ip_address,
        admin_encrypted_privacy_accepted_at,
        admin_encrypted_privacy_version,
        admin_encrypted_privacy_ip_address
      FROM users 
      WHERE id = 7
    `);

    if (result.rows.length === 0) {
      console.log('❌ User with ID 7 not found');
      return;
    }

    const user = result.rows[0];
    console.log(`📋 User ID: ${user.id}`);
    console.log(`📧 Email Verified: ${user.email_verified}`);
    console.log(`🕐 Created At: ${user.created_at}`);
    console.log('\n🔓 Decrypted Legal Document Data:');
    console.log('==================================');

    // Decrypt Terms fields
    if (user.admin_encrypted_terms_accepted_at) {
      try {
        const termsAcceptedAt = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_terms_accepted_at);
        console.log(`✅ Terms Accepted At: ${termsAcceptedAt}`);
      } catch (e) {
        console.log(`❌ Failed to decrypt Terms Accepted At: ${e.message}`);
      }
    }

    if (user.admin_encrypted_terms_version) {
      try {
        const termsVersion = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_terms_version);
        console.log(`📄 Terms Version: ${termsVersion}`);
      } catch (e) {
        console.log(`❌ Failed to decrypt Terms Version: ${e.message}`);
      }
    }

    if (user.admin_encrypted_terms_ip_address) {
      try {
        const termsIpAddress = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_terms_ip_address);
        console.log(`🌐 Terms IP Address: ${termsIpAddress}`);
      } catch (e) {
        console.log(`❌ Failed to decrypt Terms IP Address: ${e.message}`);
      }
    }

    console.log('\n---');

    // Decrypt Privacy fields  
    if (user.admin_encrypted_privacy_accepted_at) {
      try {
        const privacyAcceptedAt = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_privacy_accepted_at);
        console.log(`✅ Privacy Accepted At: ${privacyAcceptedAt}`);
      } catch (e) {
        console.log(`❌ Failed to decrypt Privacy Accepted At: ${e.message}`);
      }
    }

    if (user.admin_encrypted_privacy_version) {
      try {
        const privacyVersion = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_privacy_version);
        console.log(`📄 Privacy Version: ${privacyVersion}`);
      } catch (e) {
        console.log(`❌ Failed to decrypt Privacy Version: ${e.message}`);
      }
    }

    if (user.admin_encrypted_privacy_ip_address) {
      try {
        const privacyIpAddress = UserEncryptionService.decryptWithMasterKey(user.admin_encrypted_privacy_ip_address);
        console.log(`🌐 Privacy IP Address: ${privacyIpAddress}`);
      } catch (e) {
        console.log(`❌ Failed to decrypt Privacy IP Address: ${e.message}`);
      }
    }

    console.log('\n🎉 Decryption complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

debugLegalFields();