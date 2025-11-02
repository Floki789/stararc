/**
 * Script to fix ApexChild authentication keys
 * This decrypts the StarArc auth keys and updates the Spaceship database
 */

const { Pool } = require('pg');
const crypto = require('crypto');

// Database connections
const stararcPool = new Pool({
  connectionString: 'postgresql://sam@localhost:5432/stararc'
});

const spaceshipPool = new Pool({
  connectionString: 'postgresql://sam@localhost:5432/spaceship_portfolio'
});

const MASTER_ENCRYPTION_KEY = '83e2dec399b2a5b2382d9835cc6958f1bced48d088714a14e08f26fc158b11f2';
const SPACESHIP_HMAC_SECRET = '12c54087b1f404ee5499423ddfc618732f6dee73bcffc9c9a2517fd3e7df337f';

// Function to decrypt auth key
function decryptAuthKey(encryptedData, masterKey) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', 
    Buffer.from(masterKey.padEnd(32, '0').slice(0, 32)), 
    Buffer.from(encryptedData.iv, 'hex')
  );
  
  let authKey = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  authKey += decipher.final('utf8');
  
  return authKey;
}

// Function to hash auth key with HMAC
function hashAuthKey(authKey) {
  return crypto.createHmac('sha256', SPACESHIP_HMAC_SECRET)
    .update(authKey)
    .digest('hex');
}

async function fixApexChildAuth() {
  try {
    console.log('🔍 Starting ApexChild auth fix...');
    
    // Get all ApexChild users with spaceship keys from StarArc
    const stararcUsers = await stararcPool.query(`
      SELECT id, email, client_name, spaceship_auth_key, parent_user_id
      FROM users 
      WHERE subscription_plan = 'Core' 
      AND parent_user_id IS NOT NULL 
      AND spaceship_auth_key IS NOT NULL
    `);
    
    console.log(`📊 Found ${stararcUsers.rows.length} ApexChild users with spaceship keys`);
    
    for (const user of stararcUsers.rows) {
      console.log(`\n🔄 Processing user ${user.id} (${user.email})...`);
      
      try {
        // Decrypt the auth key
        const encryptedData = JSON.parse(user.spaceship_auth_key);
        const authKey = decryptAuthKey(encryptedData, MASTER_ENCRYPTION_KEY);
        
        // Generate the correct hash
        const correctHash = hashAuthKey(authKey);
        
        console.log(`🔑 Generated hash: ${correctHash.substring(0, 20)}...`);
        
        // Update Spaceship database
        const updateResult = await spaceshipPool.query(`
          UPDATE users 
          SET auth_key_hash = $1, 
              parent_stararc_user_id = $2
          WHERE id = $3
        `, [correctHash, user.parent_user_id, user.id]);
        
        if (updateResult.rowCount > 0) {
          console.log(`✅ Updated Spaceship user ${user.id}`);
        } else {
          console.log(`❌ No matching Spaceship user found for ID ${user.id}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing user ${user.id}:`, error.message);
      }
    }
    
    console.log('\n🎉 ApexChild auth fix completed!');
    
  } catch (error) {
    console.error('❌ Script error:', error);
  } finally {
    await stararcPool.end();
    await spaceshipPool.end();
  }
}

// Run the fix
fixApexChildAuth();