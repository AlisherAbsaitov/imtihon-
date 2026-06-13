import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Body parser
app.use(express.json());

// Logger (faqat dev rejimda batafsil)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// CORS — faqat ruxsat etilgan frontend domeniga
// Texnik topshiriq Deploy 6-band: CORS to'g'ri sozlangan
const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // origin yo'q = server-to-server (Postman, mobil) — ruxsat
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('CORS: bu domenga ruxsat yo\'q'));
    },
    credentials: true,
  })
);

// Auth route'lariga rate limit (brute-force himoyasi)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 50,
  message: { success: false, message: 'Juda ko\'p urinish. Birozdan keyin qayta urining.' },
});
app.use('/api/auth', authLimiter);

// Health check
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Server ishlamoqda 🚀', time: new Date() })
);

// API route'lar
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// 404 + error handler (oxirida bo'lishi shart)
app.use(notFound);
app.use(errorHandler);

export default app;
