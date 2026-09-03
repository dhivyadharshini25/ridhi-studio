import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw new ApiError(400, 'No file uploaded');

  const { projectId, enquiryId } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO files (owner_id, project_id, enquiry_id, storage_path, file_name, file_type, file_size)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.user!.userId, projectId || null, enquiryId || null, file.filename, file.originalname, file.mimetype, file.size]
  );
  res.status(201).json({ success: true, file: rows[0] });
});

export const listMyFiles = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  const { projectId, enquiryId } = req.query as { projectId?: string; enquiryId?: string };

  const conditions: string[] = [];
  const params: any[] = [];
  if (!isAdmin) {
    params.push(req.user!.userId);
    conditions.push(`owner_id = $${params.length}`);
  }
  if (projectId) {
    params.push(projectId);
    conditions.push(`project_id = $${params.length}`);
  }
  if (enquiryId) {
    params.push(enquiryId);
    conditions.push(`enquiry_id = $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(`SELECT * FROM files ${where} ORDER BY created_at DESC`, params);
  res.json({ success: true, files: rows });
});

// Serves the actual file bytes, but only to the owner or an admin — the
// storage path itself is never guessable/public.
export const downloadFile = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM files WHERE id = $1', [req.params.id]);
  const file = rows[0];
  if (!file) throw new ApiError(404, 'File not found');
  if (req.user!.role !== 'ADMIN' && file.owner_id !== req.user!.userId) {
    throw new ApiError(403, 'You cannot access this file');
  }
  const fullPath = path.join(UPLOAD_DIR, file.storage_path);
  if (!fs.existsSync(fullPath)) throw new ApiError(404, 'File missing from storage');
  res.download(fullPath, file.file_name);
});

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM files WHERE id = $1', [req.params.id]);
  const file = rows[0];
  if (!file) throw new ApiError(404, 'File not found');
  if (req.user!.role !== 'ADMIN' && file.owner_id !== req.user!.userId) {
    throw new ApiError(403, 'You cannot delete this file');
  }
  const fullPath = path.join(UPLOAD_DIR, file.storage_path);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  await pool.query('DELETE FROM files WHERE id = $1', [req.params.id]);
  res.json({ success: true, message: 'File deleted' });
});
