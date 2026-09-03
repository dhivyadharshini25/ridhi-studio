import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { notify } from '../utils/notify';

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  const params: any[] = [];
  let where = '';
  if (!isAdmin) {
    params.push(req.user!.userId);
    where = `WHERE pr.customer_id = $1`;
  }
  const { rows } = await pool.query(
    `SELECT pr.*, s.title AS service_title, p.full_name AS customer_name
     FROM projects pr
     LEFT JOIN services s ON s.id = pr.service_id
     LEFT JOIN profiles p ON p.user_id = pr.customer_id
     ${where} ORDER BY pr.created_at DESC`,
    params
  );
  res.json({ success: true, projects: rows });
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT pr.*, s.title AS service_title, p.full_name AS customer_name
     FROM projects pr
     LEFT JOIN services s ON s.id = pr.service_id
     LEFT JOIN profiles p ON p.user_id = pr.customer_id
     WHERE pr.id = $1`,
    [req.params.id]
  );
  const project = rows[0];
  if (!project) throw new ApiError(404, 'Project not found');
  if (req.user!.role !== 'ADMIN' && project.customer_id !== req.user!.userId) {
    throw new ApiError(403, 'You cannot view this project');
  }

  const updates = await pool.query(
    `SELECT * FROM project_updates WHERE project_id = $1 ORDER BY created_at ASC`,
    [req.params.id]
  );
  res.json({ success: true, project, updates: updates.rows });
});

export const updateProjectStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, deadline } = req.body;
  const { rows } = await pool.query(
    `UPDATE projects SET status = COALESCE($1, status), deadline = COALESCE($2, deadline) WHERE id = $3 RETURNING *`,
    [status, deadline, req.params.id]
  );
  const project = rows[0];
  if (!project) throw new ApiError(404, 'Project not found');

  if (status) {
    await notify(project.customer_id, 'Project status updated', `Your project "${project.title}" is now "${status}".`, `/dashboard/projects/${project.id}`);
  }
  res.json({ success: true, project });
});

export const addProjectUpdate = asyncHandler(async (req: Request, res: Response) => {
  const { message, isDeliverable, fileUrl } = req.body;
  if (!message) throw new ApiError(400, 'Update message is required');

  const { rows: projRows } = await pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
  const project = projRows[0];
  if (!project) throw new ApiError(404, 'Project not found');

  const { rows } = await pool.query(
    `INSERT INTO project_updates (project_id, author_id, message, is_deliverable, file_url)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [req.params.id, req.user!.userId, message, !!isDeliverable, fileUrl || null]
  );

  if (req.user!.role === 'ADMIN') {
    await notify(
      project.customer_id,
      isDeliverable ? 'New deliverable uploaded' : 'New project update',
      message,
      `/dashboard/projects/${project.id}`
    );
  }
  res.status(201).json({ success: true, update: rows[0] });
});
