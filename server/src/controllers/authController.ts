import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { signToken } from '../utils/jwt';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function publicUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    fullName: row.full_name,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0].message);
  }
  const { fullName, email, phone, password } = parsed.data;

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length) throw new ApiError(409, 'An account with this email already exists');

  const passwordHash = await bcrypt.hash(password, 12);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, 'CUSTOMER') RETURNING id, email, role, created_at`,
      [email.toLowerCase(), passwordHash]
    );
    const user = userResult.rows[0];
    await client.query(
      `INSERT INTO profiles (user_id, full_name, phone) VALUES ($1, $2, $3)`,
      [user.id, fullName, phone]
    );
    await client.query('COMMIT');

    const token = signToken({ userId: user.id, role: user.role });
    res.status(201).json({
      success: true,
      token,
      user: publicUser({ ...user, full_name: fullName, phone }),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Email and password are required');
  const { email, password } = parsed.data;

  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.role, u.password_hash, u.is_active, u.created_at,
            p.full_name, p.phone, p.avatar_url
     FROM users u LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.email = $1`,
    [email.toLowerCase()]
  );
  const user = rows[0];
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (!user.is_active) throw new ApiError(403, 'This account has been disabled. Contact support.');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const token = signToken({ userId: user.id, role: user.role });
  res.json({ success: true, token, user: publicUser(user) });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.role, u.created_at, p.full_name, p.phone, p.avatar_url, p.address
     FROM users u LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.id = $1`,
    [req.user!.userId]
  );
  if (!rows[0]) throw new ApiError(404, 'User not found');
  res.json({ success: true, user: publicUser(rows[0]) });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, address } = req.body;
  await pool.query(
    `UPDATE profiles SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone),
     address = COALESCE($3, address) WHERE user_id = $4`,
    [fullName, phone, address, req.user!.userId]
  );
  res.json({ success: true, message: 'Profile updated' });
});

// Forgot password: issues a single-use reset token valid for a limited time.
// In production, email this link — here we return it directly in dev mode
// so the flow is testable without an email provider configured.
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, 'Email is required');

  const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  // Always respond success to avoid leaking which emails are registered.
  if (!rows[0]) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresMinutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 30);
  const expires = new Date(Date.now() + expiresMinutes * 60 * 1000);

  await pool.query('UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3', [
    token,
    expires,
    rows[0].id,
  ]);

  // TODO: send `token` via email using EMAIL_* env vars instead of returning it.
  const payload: any = { success: true, message: 'If that email exists, a reset link has been sent.' };
  if (process.env.NODE_ENV !== 'production') payload.devResetToken = token;
  res.json(payload);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8) {
    throw new ApiError(400, 'A valid token and an 8+ character password are required');
  }

  const { rows } = await pool.query(
    'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > now()',
    [token]
  );
  if (!rows[0]) throw new ApiError(400, 'This reset link is invalid or has expired');

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
    [passwordHash, rows[0].id]
  );
  res.json({ success: true, message: 'Password updated. You can now log in.' });
});
