import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { notifyAdmins } from '../utils/notify';

export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) throw new ApiError(400, 'Name, email and message are required');

  const { rows } = await pool.query(
    `INSERT INTO contact_messages (name, email, phone, message) VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, email, phone || null, message]
  );
  // await notifyAdmins('New contact message', `${name} sent a message.`);
  await notifyAdmins(
    'New contact message',
    `${name} sent a message.\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nMessage: ${message}`
  );
  res.status(201).json({ success: true, message: 'Thanks for reaching out — we will get back to you soon.', data: rows[0] });
});

export const listContactMessages = asyncHandler(async (_req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  res.json({ success: true, messages: rows });
});

export const updateContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { isRead } = req.body;
  const { rows } = await pool.query(
    'UPDATE contact_messages SET is_read = COALESCE($1, is_read) WHERE id = $2 RETURNING *',
    [isRead, req.params.id]
  );
  if (!rows[0]) throw new ApiError(404, 'Message not found');
  res.json({ success: true, data: rows[0] });
});

export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { rowCount } = await pool.query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
  if (!rowCount) throw new ApiError(404, 'Message not found');
  res.json({ success: true, message: 'Deleted' });
});
