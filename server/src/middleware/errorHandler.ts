import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/asyncHandler';

// Centralized error handler — every response has a consistent shape and
// raw backend/DB errors are never leaked to the client.
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'That record already exists.' });
  }
  // Postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Related record not found.' });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: 'Route not found' });
}
