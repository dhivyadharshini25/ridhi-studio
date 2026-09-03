import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { notify, notifyAdmins } from '../utils/notify';

export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { serviceId, details, budget, preferredDeadline, preferredContactMethod } = req.body;
  if (!details) throw new ApiError(400, 'Please describe your project');

  const { rows } = await pool.query(
    `INSERT INTO enquiries (customer_id, service_id, details, budget, preferred_deadline, preferred_contact_method)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.user!.userId, serviceId || null, details, budget || null, preferredDeadline || null, preferredContactMethod || null]
  );
  const enquiry = rows[0];

  await notifyAdmins('New enquiry received', `A new enquiry was submitted.`, `/admin/enquiries/${enquiry.id}`);
  res.status(201).json({ success: true, enquiry });
});

// Customers see only their own enquiries; admins see all (with optional filters).
export const listEnquiries = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  const { status, search } = req.query as { status?: string; search?: string };

  const conditions: string[] = [];
  const params: any[] = [];

  if (!isAdmin) {
    params.push(req.user!.userId);
    conditions.push(`e.customer_id = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`e.status = $${params.length}`);
  }
  if (search && isAdmin) {
    params.push(`%${search}%`);
    conditions.push(`(p.full_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT e.*, s.title AS service_title, u.email AS customer_email, p.full_name AS customer_name
     FROM enquiries e
     LEFT JOIN services s ON s.id = e.service_id
     LEFT JOIN users u ON u.id = e.customer_id
     LEFT JOIN profiles p ON p.user_id = e.customer_id
     ${where}
     ORDER BY e.created_at DESC`,
    params
  );
  res.json({ success: true, enquiries: rows });
});

export const getEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT e.*, s.title AS service_title, u.email AS customer_email, p.full_name AS customer_name, p.phone AS customer_phone
     FROM enquiries e
     LEFT JOIN services s ON s.id = e.service_id
     LEFT JOIN users u ON u.id = e.customer_id
     LEFT JOIN profiles p ON p.user_id = e.customer_id
     WHERE e.id = $1`,
    [req.params.id]
  );
  const enquiry = rows[0];
  if (!enquiry) throw new ApiError(404, 'Enquiry not found');
  if (req.user!.role !== 'ADMIN' && enquiry.customer_id !== req.user!.userId) {
    throw new ApiError(403, 'You cannot view this enquiry');
  }
  res.json({ success: true, enquiry });
});

// Admin-only: change status / add notes.
export const updateEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  const { rows } = await pool.query(
    `UPDATE enquiries SET status = COALESCE($1, status), admin_notes = COALESCE($2, admin_notes), updated_at = now()
     WHERE id = $3 RETURNING *`,
    [status, adminNotes, req.params.id]
  );
  const enquiry = rows[0];
  if (!enquiry) throw new ApiError(404, 'Enquiry not found');

  if (status) {
    await notify(enquiry.customer_id, 'Enquiry status updated', `Your enquiry is now "${status}".`, `/dashboard/enquiries/${enquiry.id}`);
  }
  res.json({ success: true, enquiry });
});

// Admin-only: convert an approved enquiry into a project.
export const convertToProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, deadline } = req.body;
  const { rows: enqRows } = await pool.query('SELECT * FROM enquiries WHERE id = $1', [req.params.id]);
  const enquiry = enqRows[0];
  if (!enquiry) throw new ApiError(404, 'Enquiry not found');

  const { rows } = await pool.query(
    `INSERT INTO projects (customer_id, enquiry_id, service_id, title, deadline)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [enquiry.customer_id, enquiry.id, enquiry.service_id, title || 'New Project', deadline || null]
  );
  await pool.query(`UPDATE enquiries SET status = 'APPROVED', updated_at = now() WHERE id = $1`, [enquiry.id]);
  await notify(enquiry.customer_id, 'Your project has started', 'Your enquiry has been converted into a project.', `/dashboard/projects/${rows[0].id}`);

  res.status(201).json({ success: true, project: rows[0] });
});
