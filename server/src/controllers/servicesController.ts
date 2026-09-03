import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const activeOnly = req.query.all !== 'true'; // admin can pass ?all=true to see inactive too
  const { rows } = await pool.query(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM services s LEFT JOIN service_categories c ON c.id = s.category_id
     ${activeOnly ? 'WHERE s.is_active = true' : ''}
     ORDER BY s.sort_order ASC, s.created_at DESC`
  );
  res.json({ success: true, services: rows });
});

export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT s.*, c.name AS category_name FROM services s
     LEFT JOIN service_categories c ON c.id = s.category_id
     WHERE s.slug = $1`,
    [req.params.slug]
  );
  if (!rows[0]) throw new ApiError(404, 'Service not found');
  res.json({ success: true, service: rows[0] });
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, shortDescription, categoryId, imageUrl, startingPrice, deliveryEstimate } = req.body;
  if (!title) throw new ApiError(400, 'Title is required');
  const slug = slugify(title);
  const { rows } = await pool.query(
    `INSERT INTO services (title, slug, description, short_description, category_id, image_url, starting_price, delivery_estimate)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, slug, description, shortDescription, categoryId || null, imageUrl, startingPrice || null, deliveryEstimate]
  );
  res.status(201).json({ success: true, service: rows[0] });
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, shortDescription, categoryId, imageUrl, startingPrice, deliveryEstimate, isActive, sortOrder } = req.body;
  const { rows } = await pool.query(
    `UPDATE services SET
       title = COALESCE($1, title),
       slug = COALESCE($2, slug),
       description = COALESCE($3, description),
       short_description = COALESCE($4, short_description),
       category_id = COALESCE($5, category_id),
       image_url = COALESCE($6, image_url),
       starting_price = COALESCE($7, starting_price),
       delivery_estimate = COALESCE($8, delivery_estimate),
       is_active = COALESCE($9, is_active),
       sort_order = COALESCE($10, sort_order)
     WHERE id = $11 RETURNING *`,
    [title, title ? slugify(title) : null, description, shortDescription, categoryId, imageUrl, startingPrice, deliveryEstimate, isActive, sortOrder, req.params.id]
  );
  if (!rows[0]) throw new ApiError(404, 'Service not found');
  res.json({ success: true, service: rows[0] });
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  // Soft-delete by deactivating, since services may be referenced by past enquiries/projects.
  const { rows } = await pool.query(
    `UPDATE services SET is_active = false WHERE id = $1 RETURNING id`,
    [req.params.id]
  );
  if (!rows[0]) throw new ApiError(404, 'Service not found');
  res.json({ success: true, message: 'Service deactivated' });
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM service_categories ORDER BY sort_order');
  res.json({ success: true, categories: rows });
});
