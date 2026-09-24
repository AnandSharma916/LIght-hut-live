import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';

import Category from './models/Category.js';
import { seedDatabase } from './scripts/seedData.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB and Auto-seed if empty
const initDB = async () => {
  await connectDB();
  try {
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      console.log('[Server] Fresh database detected. Auto-seeding lighting catalog & admin...');
      await seedDatabase(false);
    }
  } catch (err) {
    console.warn('[Server] Auto-seed check notice:', err.message);
  }
};
initDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows images to be displayed in frontend
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, server-to-server)
      if (!origin) return callback(null, true);

      // Check allowed list or Vercel domains or allow all in production/development
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        !process.env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiting on authentication and public inquiry submissions
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts
  message: { success: false, message: 'Too many authentication attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // max 20 inquiries per IP per hour
  message: { success: false, message: 'Too many inquiries submitted from this IP. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve local uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve public assets (categories, banners, certificates, catalog PDF)
app.use(express.static(path.join(__dirname, '../client/public')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'operational',
    service: 'LightHut Lighting Catalog API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/inquiries', inquiryLimiter, inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/catalog', catalogRoutes);

// Centralized Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] LightHut API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Server Error] Unhandled Rejection:', err);
});

// LightHut API Server - Live
export default app;
