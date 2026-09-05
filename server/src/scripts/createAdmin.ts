/**
 * Creates (or promotes) an admin account.
 * Usage: npm run create-admin -- admin@ridhistudio.com StrongPass123 "Studio Admin"
 */
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import pool from '../config/db';

async function main() {
  const [, , email, password, fullName] = process.argv;
  if (!email || !password) {
    console.error('Usage: npm run create-admin -- <email> <password> "<full name>"');
    process.exit(1);
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);

  if (existing.rows[0]) {
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `UPDATE users
      SET role = 'ADMIN', password_hash = $1, is_active = true
      WHERE id = $2`,
      [passwordHash, existing.rows[0].id]
    );

    console.log(`Existing user ${email} promoted to ADMIN and password updated.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'ADMIN') RETURNING id`,
      [email.toLowerCase(), passwordHash]
    );
    await pool.query(`INSERT INTO profiles (user_id, full_name) VALUES ($1, $2)`, [
      rows[0].id,
      fullName || 'Studio Admin',
    ]);
    console.log(`Admin account created: ${email}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
