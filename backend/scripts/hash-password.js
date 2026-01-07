// Simple bcrypt hash generator (ESM)
import bcrypt from 'bcryptjs';

// Edit this password before running or pass via env: SEED_PASSWORD
const password = process.env.SEED_PASSWORD || 'SecurePass123!';

(async () => {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('Plain Password:', password);
    console.log('Hashed Password:', hash);
  } catch (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
})();
