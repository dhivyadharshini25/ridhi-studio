import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 100`,
    [req.user!.userId]
  );
  res.json({ success: true, notifications: rows });
});

export const markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `UPDATE notifications SET is_read = true WHERE id = $1 AND recipient_id = $2 RETURNING *`,
    [req.params.id, req.user!.userId]
  );
  if (!rows[0]) throw new ApiError(404, 'Notification not found');
  res.json({ success: true, notification: rows[0] });
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await pool.query(`UPDATE notifications SET is_read = true WHERE recipient_id = $1`, [req.user!.userId]);
  res.json({ success: true });
});
