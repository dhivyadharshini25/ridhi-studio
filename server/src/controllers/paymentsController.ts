import { Request, Response } from 'express';
import crypto from 'crypto';
import pool from '../config/db';
import { asyncHandler, ApiError } from '../utils/asyncHandler';

// ---------------------------------------------------------------------------
// Razorpay integration point.
//
// RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET live only in server/.env — never send
// the secret to the frontend. The frontend only ever receives `keyId` and the
// `orderId`, which it hands to the Razorpay Checkout widget.
//
// To go live: `npm install razorpay` in /server, then replace the
// `createRazorpayOrderStub` function below with a real call, e.g.:
//
//   import Razorpay from 'razorpay';
//   const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
//   const order = await rzp.orders.create({ amount: amountInPaise, currency: 'INR', receipt });
//
// Signature verification below is already production-correct.
// ---------------------------------------------------------------------------

function createRazorpayOrderStub(amountInPaise: number, receipt: string) {
  // Placeholder until RAZORPAY_KEY_ID/SECRET are set — returns a fake order id
  // so the rest of the flow (DB row, checkout UI) can be built and tested end-to-end.
  return { id: `order_stub_${crypto.randomBytes(8).toString('hex')}`, amount: amountInPaise, currency: 'INR', receipt };
}

export const createPaymentOrder = asyncHandler(async (req: Request, res: Response) => {
  const { amount, projectId, bookingId } = req.body;
  if (!amount || Number(amount) <= 0) throw new ApiError(400, 'A valid amount is required');

  const amountInPaise = Math.round(Number(amount) * 100);
  const receipt = `rcpt_${Date.now()}`;

  const order = process.env.RAZORPAY_KEY_ID
    ? createRazorpayOrderStub(amountInPaise, receipt) // swap for real Razorpay SDK call, see note above
    : createRazorpayOrderStub(amountInPaise, receipt);

  const { rows } = await pool.query(
    `INSERT INTO payments (customer_id, project_id, booking_id, amount, order_id, status)
     VALUES ($1,$2,$3,$4,$5,'CREATED') RETURNING *`,
    [req.user!.userId, projectId || null, bookingId || null, amount, order.id]
  );

  res.status(201).json({
    success: true,
    payment: rows[0],
    razorpay: { orderId: order.id, amount: amountInPaise, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID || null },
  });
});

// Called by the frontend after Razorpay Checkout completes. Verifies the
// signature server-side before ever marking a payment as PAID.
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, paymentId, signature } = req.body;
  if (!orderId || !paymentId || !signature) throw new ApiError(400, 'Missing payment verification fields');

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new ApiError(501, 'Payment gateway is not configured yet. Add RAZORPAY_KEY_SECRET to enable live payments.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expectedSignature !== signature) {
    await pool.query(`UPDATE payments SET status = 'FAILED' WHERE order_id = $1`, [orderId]);
    throw new ApiError(400, 'Payment verification failed');
  }

  const { rows } = await pool.query(
    `UPDATE payments SET status = 'PAID', transaction_id = $1, paid_at = now() WHERE order_id = $2 RETURNING *`,
    [paymentId, orderId]
  );
  res.json({ success: true, payment: rows[0] });
});

export const listPayments = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  const params: any[] = [];
  let where = '';
  if (!isAdmin) {
    params.push(req.user!.userId);
    where = 'WHERE customer_id = $1';
  }
  const { rows } = await pool.query(`SELECT * FROM payments ${where} ORDER BY created_at DESC`, params);
  res.json({ success: true, payments: rows });
});
