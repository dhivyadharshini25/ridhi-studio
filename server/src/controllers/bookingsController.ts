import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { notify, notifyAdmins } from '../utils/notify';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const {
    serviceId, appointmentDate, appointmentTime, notes,
    eventDate, sareeCount, sareeType, pickupDeliveryOption,
  } = req.body;

  if (!appointmentDate || !appointmentTime) {
    throw new ApiError(400, 'Appointment date and time are required');
  }

  // Prevent obvious double-booking: same date+time slot already taken (not cancelled).
  const conflict = await pool.query(
    `SELECT id FROM bookings WHERE appointment_date = $1 AND appointment_time = $2 AND status != 'CANCELLED'`,
    [appointmentDate, appointmentTime]
  );
  if (conflict.rows.length) {
    throw new ApiError(409, 'That time slot is already booked. Please choose another.');
  }

  const { rows } = await pool.query(
    `INSERT INTO bookings (customer_id, service_id, appointment_date, appointment_time, notes, event_date, saree_count, saree_type, pickup_delivery_option)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.user!.userId, serviceId || null, appointmentDate, appointmentTime, notes || null, eventDate || null, sareeCount || null, sareeType || null, pickupDeliveryOption || null]
  );
  const booking = rows[0];
  await notifyAdmins('New booking received', `A new booking was submitted for ${appointmentDate}.`, `/admin/bookings/${booking.id}`);
  res.status(201).json({ success: true, booking });
});

export const listBookings = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  const { status } = req.query as { status?: string };

  const conditions: string[] = [];
  const params: any[] = [];
  if (!isAdmin) {
    params.push(req.user!.userId);
    conditions.push(`b.customer_id = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`b.status = $${params.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows } = await pool.query(
    `SELECT b.*, s.title AS service_title, p.full_name AS customer_name, u.email AS customer_email
     FROM bookings b
     LEFT JOIN services s ON s.id = b.service_id
     LEFT JOIN users u ON u.id = b.customer_id
     LEFT JOIN profiles p ON p.user_id = b.customer_id
     ${where} ORDER BY b.appointment_date, b.appointment_time`,
    params
  );
  res.json({ success: true, bookings: rows });
});

export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  const { status, appointmentDate, appointmentTime } = req.body;
  const { rows } = await pool.query(
    `UPDATE bookings SET
       status = COALESCE($1, status),
       appointment_date = COALESCE($2, appointment_date),
       appointment_time = COALESCE($3, appointment_time)
     WHERE id = $4 RETURNING *`,
    [status, appointmentDate, appointmentTime, req.params.id]
  );
  const booking = rows[0];
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (status) {
    await notify(booking.customer_id, 'Booking update', `Your booking is now "${status}".`, `/dashboard/bookings/${booking.id}`);
  }
  res.json({ success: true, booking });
});
