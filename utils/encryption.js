const crypto = require('crypto');

// AES-256 encryption key (must be 32 bytes)
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || 'default32byteencryptionkey123456', 'utf8').slice(0, 32); // Ensure 32 bytes
const ALGORITHM = 'aes-256-cbc';

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Store IV with encrypted data
}

// Decrypt function
function decrypt(encryptedText) {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};