import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import pool from './config/db';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pool.query('SELECT 1'); // fail fast if the database isn't reachable
    app.listen(PORT, () => {
      console.log(`RiDhi Studio API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database. Check DATABASE_URL in server/.env');
    console.error(err);
    process.exit(1);
  }
}

start();
