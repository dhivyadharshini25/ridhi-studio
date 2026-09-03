import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

// Admin-only endpoints for managing customers.
export const listCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query as { search?: string };
  const params: any[] = [];
  let where = `WHERE u.role = 'CUSTOMER'`;
  if (search) {
    params.push(`%${search}%`);
    where += ` AND (p.full_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`;
  }
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.is_active, u.created_at, p.full_name, p.phone
     FROM users u LEFT JOIN profiles p ON p.user_id = u.id
     ${where} ORDER BY u.created_at DESC`,
    params
  );
  res.json({ success: true, customers: rows });
});

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.is_active, u.created_at, p.full_name, p.phone, p.address
     FROM users u LEFT JOIN profiles p ON p.user_id = u.id WHERE u.id = $1 AND u.role = 'CUSTOMER'`,
    [req.params.id]
  );
  const customer = rows[0];
  if (!customer) throw new ApiError(404, 'Customer not found');

  const [enquiries, bookings, projects] = await Promise.all([
    pool.query('SELECT * FROM enquiries WHERE customer_id = $1 ORDER BY created_at DESC', [req.params.id]),
    pool.query('SELECT * FROM bookings WHERE customer_id = $1 ORDER BY created_at DESC', [req.params.id]),
    pool.query('SELECT * FROM projects WHERE customer_id = $1 ORDER BY created_at DESC', [req.params.id]),
  ]);

  res.json({
    success: true,
    customer,
    enquiries: enquiries.rows,
    bookings: bookings.rows,
    projects: projects.rows,
  });
});

export const setCustomerActive = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.body;
  const { rows } = await pool.query(
    `UPDATE users SET is_active = $1 WHERE id = $2 AND role = 'CUSTOMER' RETURNING id, is_active`,
    [!!isActive, req.params.id]
  );
  if (!rows[0]) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, customer: rows[0] });
});

// Admin dashboard summary stats.
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [customers, enquiries, activeProjects, completedProjects, pendingBookings, revenue] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS count FROM users WHERE role = 'CUSTOMER'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM enquiries WHERE status = 'NEW'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM projects WHERE status NOT IN ('COMPLETED','CANCELLED')`),
    pool.query(`SELECT COUNT(*)::int AS count FROM projects WHERE status = 'COMPLETED'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM bookings WHERE status = 'PENDING'`),
    pool.query(`SELECT COALESCE(SUM(amount), 0)::numeric AS total FROM payments WHERE status = 'PAID'`),
  ]);

  res.json({
    success: true,
    stats: {
      totalCustomers: customers.rows[0].count,
      newEnquiries: enquiries.rows[0].count,
      activeProjects: activeProjects.rows[0].count,
      completedProjects: completedProjects.rows[0].count,
      pendingBookings: pendingBookings.rows[0].count,
      revenue: Number(revenue.rows[0].total),
    },
  });
});
