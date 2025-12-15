require('dotenv').config();
const { UserEncryptionService } = require('./dist/services/userEncryptionService');

const encryptedEmail = '1rNLeZ4JgCuII58cRwfO9HOivDvVPFUasxCoYuT1XSzyvz0VcDKvjm0=';

try {
  console.log('Encrypted email:', encryptedEmail);
  console.log('Master key available:', process.env.ADMIN_USER_DATA_ENCRYPTION_KEY ? 'Yes' : 'No');
  
  const decryptedEmail = UserEncryptionService.decryptWithMasterKey(encryptedEmail);
  console.log('Decrypted email:', decryptedEmail);
} catch (error) {
  console.error('Decryption error:', error.message);
}