import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler } from '../utils/asyncHandler';

export const getPublicSettings = asyncHandler(async (_req: Request, res: Response) => {
  const { rows } = await pool.query(`SELECT key, value FROM settings`);
  const settings: Record<string, any> = {};
  rows.forEach((r) => (settings[r.key] = r.value));
  res.json({ success: true, settings });
});

export const updateSetting = asyncHandler(async (req: Request, res: Response) => {
  const { value } = req.body;
  await pool.query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2`,
    [req.params.key, JSON.stringify(value)]
  );
  res.json({ success: true });
});
