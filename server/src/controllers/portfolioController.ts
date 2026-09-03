import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

export const listPortfolio = asyncHandler(async (req: Request, res: Response) => {
  const publishedOnly = req.query.all !== 'true';
  const category = req.query.category as string | undefined;

  const conditions: string[] = [];
  const params: any[] = [];
  if (publishedOnly) conditions.push('p.is_published = true');
  if (category && category !== 'all') {
    params.push(category);
    conditions.push(`c.slug = $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM portfolio_projects p LEFT JOIN portfolio_categories c ON c.id = p.category_id
     ${where} ORDER BY p.created_at DESC`,
    params
  );
  res.json({ success: true, projects: rows });
});

export const getPortfolioItem = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM portfolio_projects WHERE id = $1', [req.params.id]);
  if (!rows[0]) throw new ApiError(404, 'Project not found');
  res.json({ success: true, project: rows[0] });
});

export const createPortfolioItem = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, categoryId, coverImageUrl, galleryUrls, isPublished } = req.body;
  if (!title) throw new ApiError(400, 'Title is required');
  const { rows } = await pool.query(
    `INSERT INTO portfolio_projects (title, description, category_id, cover_image_url, gallery_urls, is_published)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, categoryId || null, coverImageUrl, galleryUrls || [], !!isPublished]
  );
  res.status(201).json({ success: true, project: rows[0] });
});

export const updatePortfolioItem = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, categoryId, coverImageUrl, galleryUrls, isPublished } = req.body;
  const { rows } = await pool.query(
    `UPDATE portfolio_projects SET
       title = COALESCE($1, title), description = COALESCE($2, description),
       category_id = COALESCE($3, category_id), cover_image_url = COALESCE($4, cover_image_url),
       gallery_urls = COALESCE($5, gallery_urls), is_published = COALESCE($6, is_published)
     WHERE id = $7 RETURNING *`,
    [title, description, categoryId, coverImageUrl, galleryUrls, isPublished, req.params.id]
  );
  if (!rows[0]) throw new ApiError(404, 'Project not found');
  res.json({ success: true, project: rows[0] });
});

export const deletePortfolioItem = asyncHandler(async (req: Request, res: Response) => {
  const { rowCount } = await pool.query('DELETE FROM portfolio_projects WHERE id = $1', [req.params.id]);
  if (!rowCount) throw new ApiError(404, 'Project not found');
  res.json({ success: true, message: 'Project deleted' });
});

export const listPortfolioCategories = asyncHandler(async (_req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM portfolio_categories ORDER BY name');
  res.json({ success: true, categories: rows });
});
