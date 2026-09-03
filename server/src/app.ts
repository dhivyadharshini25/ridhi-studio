import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import servicesRoutes from './routes/servicesRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import enquiriesRoutes from './routes/enquiriesRoutes';
import bookingsRoutes from './routes/bookingsRoutes';
import projectsRoutes from './routes/projectsRoutes';
import quotesRoutes from './routes/quotesRoutes';
import notificationsRoutes from './routes/notificationsRoutes';
import contactRoutes from './routes/contactRoutes';
import testimonialsRoutes from './routes/testimonialsRoutes';
import filesRoutes from './routes/filesRoutes';
import usersRoutes from './routes/usersRoutes';
import paymentsRoutes from './routes/paymentsRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting, tighter on auth endpoints to slow brute-force attempts.
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use(globalLimiter);
app.use('/api/auth', authLimiter);

app.get('/api/health', (_req, res) => res.json({ success: true, message: 'RiDhi Studio API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/admin', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/settings', settingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
