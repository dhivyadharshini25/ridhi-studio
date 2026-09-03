import pool from '../config/db';

// Central place that creates notifications so every controller triggers
// them the same way instead of duplicating INSERT statements.
export async function notify(recipientId: string, title: string, message?: string, link?: string) {
  await pool.query(
    `INSERT INTO notifications (recipient_id, title, message, link) VALUES ($1,$2,$3,$4)`,
    [recipientId, title, message || null, link || null]
  );
}

// Notify every admin (used for "new enquiry", "new booking", etc.)
export async function notifyAdmins(title: string, message?: string, link?: string) {
  const { rows } = await pool.query(`SELECT id FROM users WHERE role = 'ADMIN'`);
  await Promise.all(rows.map((u) => notify(u.id, title, message, link)));
}
