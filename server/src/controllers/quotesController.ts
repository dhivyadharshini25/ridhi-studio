import { Request, Response } from 'express';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';
import { notify } from '../utils/notify';

function generateQuoteNumber() {
  const y = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RQ-${y}-${rand}`;
}

// Admin-only.
export const createQuote = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, enquiryId, items, discount, additionalCharges, validUntil, notes } = req.body;
  if (!customerId || !Array.isArray(items) || !items.length) {
    throw new ApiError(400, 'A customer and at least one line item are required');
  }

  const itemsTotal = items.reduce((sum: number, it: any) => sum + Number(it.price || 0), 0);
  const total = itemsTotal + Number(additionalCharges || 0) - Number(discount || 0);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const quoteResult = await client.query(
      `INSERT INTO quotes (quote_number, customer_id, enquiry_id, discount, additional_charges, total, valid_until, notes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'SENT') RETURNING *`,
      [generateQuoteNumber(), customerId, enquiryId || null, discount || 0, additionalCharges || 0, total, validUntil || null, notes || null]
    );
    const quote = quoteResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO quote_items (quote_id, description, price) VALUES ($1,$2,$3)`,
        [quote.id, item.description, item.price]
      );
    }

    if (enquiryId) {
      await client.query(`UPDATE enquiries SET status = 'QUOTED', updated_at = now() WHERE id = $1`, [enquiryId]);
    }
    await client.query('COMMIT');

    await notify(customerId, 'You have a new quote', `Quote ${quote.quote_number} is ready for your review.`, `/dashboard/quotes/${quote.id}`);
    res.status(201).json({ success: true, quote });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

export const listQuotes = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  const params: any[] = [];
  let where = '';
  if (!isAdmin) {
    params.push(req.user!.userId);
    where = 'WHERE q.customer_id = $1';
  }
  const { rows } = await pool.query(
    `SELECT q.*, p.full_name AS customer_name FROM quotes q
     LEFT JOIN profiles p ON p.user_id = q.customer_id
     ${where} ORDER BY q.created_at DESC`,
    params
  );
  res.json({ success: true, quotes: rows });
});

export const getQuote = asyncHandler(async (req: Request, res: Response) => {
  const { rows } = await pool.query('SELECT * FROM quotes WHERE id = $1', [req.params.id]);
  const quote = rows[0];
  if (!quote) throw new ApiError(404, 'Quote not found');
  if (req.user!.role !== 'ADMIN' && quote.customer_id !== req.user!.userId) {
    throw new ApiError(403, 'You cannot view this quote');
  }
  const items = await pool.query('SELECT * FROM quote_items WHERE quote_id = $1', [req.params.id]);
  res.json({ success: true, quote, items: items.rows });
});

// Customer accepts/rejects; admin can edit/expire.
export const respondToQuote = asyncHandler(async (req: Request, res: Response) => {
  const { action } = req.body; // 'accept' | 'reject'
  if (!['accept', 'reject'].includes(action)) throw new ApiError(400, 'Invalid action');

  const { rows: existing } = await pool.query('SELECT * FROM quotes WHERE id = $1', [req.params.id]);
  const quote = existing[0];
  if (!quote) throw new ApiError(404, 'Quote not found');
  if (quote.customer_id !== req.user!.userId) throw new ApiError(403, 'You cannot respond to this quote');

  const newStatus = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
  const { rows } = await pool.query('UPDATE quotes SET status = $1 WHERE id = $2 RETURNING *', [newStatus, req.params.id]);

  await notify(quote.customer_id, 'Quote response recorded', `You ${action}ed quote ${quote.quote_number}.`);
  const admins = await pool.query(`SELECT id FROM users WHERE role = 'ADMIN'`);
  await Promise.all(admins.rows.map((a) => notify(a.id, 'Quote response received', `Quote ${quote.quote_number} was ${newStatus.toLowerCase()}.`)));

  res.json({ success: true, quote: rows[0] });
});
