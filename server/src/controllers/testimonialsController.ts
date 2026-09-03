import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

export const listTestimonials = asyncHandler(async (req: Request, res: Response) => {
  const publishedOnly = req.query.all !== 'true';
  const { rows } = await pool.query(
    `SELECT * FROM testimonials ${publishedOnly ? 'WHERE is_published = true AND is_approved = true' : ''} ORDER BY created_at DESC`
  );
  res.json({ success: true, testimonials: rows });
});

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { customerName, message, rating } = req.body;
  if (!customerName || !message) throw new ApiError(400, 'Name and message are required');
  const { rows } = await pool.query(
    `INSERT INTO testimonials (customer_name, message, rating) VALUES ($1,$2,$3) RETURNING *`,
    [customerName, message, rating || null]
  );
  res.status(201).json({ success: true, testimonial: rows[0] });
});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { customerName, message, rating, isApproved, isPublished } = req.body;
  const { rows } = await pool.query(
    `UPDATE testimonials SET
       customer_name = COALESCE($1, customer_name), message = COALESCE($2, message),
       rating = COALESCE($3, rating), is_approved = COALESCE($4, is_approved),
       is_published = COALESCE($5, is_published)
     WHERE id = $6 RETURNING *`,
    [customerName, message, rating, isApproved, isPublished, req.params.id]
  );
  if (!rows[0]) throw new ApiError(404, 'Testimonial not found');
  res.json({ success: true, testimonial: rows[0] });
});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { rowCount } = await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
  if (!rowCount) throw new ApiError(404, 'Testimonial not found');
  res.json({ success: true, message: 'Deleted' });
});
