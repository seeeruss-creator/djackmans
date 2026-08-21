import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { createOrderRoutes } from './routes/orderRoutes.js';
import { RentOrderController } from './controllers/RentOrderController.js';
import { CustomizationOrderController } from './controllers/CustomizationOrderController.js';
import { RepairOrderController } from './controllers/RepairOrderController.js';
import { DryCleaningOrderController } from './controllers/DryCleaningOrderController.js';
import { ensureDatabaseReady } from './config/ensureSchema.js';
import { isPostgres } from './config/db.js';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Netlify rewrites /api/* to the function; ensure routes still match /api/...
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
    }
    next();
  });

  // Warm schema / default admin on cold start (non-blocking).
  // Skip auto-bootstrap when using local MySQL without an explicit DB config —
  // otherwise cold starts hang waiting for a missing MySQL server.
  const shouldBootstrap =
    isPostgres ||
    Boolean(process.env.DB_HOST || process.env.DB_USER || process.env.DB_NAME);
  if (shouldBootstrap) {
    ensureDatabaseReady().catch((err) => {
      console.error('Startup DB ensure failed:', err.message);
    });
  }

  app.get('/api/health', async (req, res) => {
    let db = isPostgres ? 'postgres' : 'mysql';
    if (shouldBootstrap) {
      try {
        await ensureDatabaseReady();
      } catch (err) {
        db = `error: ${err.message}`;
      }
    } else {
      db = 'mysql (not configured)';
    }
    res.json({ success: true, message: 'API is running', db });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/rent-orders', createOrderRoutes(RentOrderController));
  app.use('/api/customization-orders', createOrderRoutes(CustomizationOrderController));
  app.use('/api/repair-orders', createOrderRoutes(RepairOrderController));
  app.use('/api/dry-cleaning-orders', createOrderRoutes(DryCleaningOrderController));

  app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || err.statusCode || 500;
    if (status === 400 && err.type === 'entity.parse.failed') {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON body.',
      });
    }
    res.status(status >= 400 && status < 600 ? status : 500).json({
      success: false,
      message: status === 500 ? 'Internal server error.' : err.message || 'Request failed.',
    });
  });

  return app;
}
