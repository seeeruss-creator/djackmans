import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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
import pool, { isPostgres, isMysqlConfigured } from './config/db.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const isRailway = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_NAME);

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Netlify only: function receives /auth/login — rewrite to /api/auth/login
  if (!isRailway) {
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api')) {
        req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
      }
      next();
    });
  }

  // Warm schema / default admin on cold start (non-blocking).
  // Skip auto-bootstrap when using local MySQL without an explicit DB config —
  // otherwise cold starts hang waiting for a missing MySQL server.
  const shouldBootstrap = isPostgres || isMysqlConfigured();
  if (shouldBootstrap) {
    ensureDatabaseReady().catch((err) => {
      console.error('Startup DB ensure failed:', err.message);
    });
  }

  app.get('/', (req, res) => {
    res.json({ success: true, message: 'D Jackman API is running' });
  });

  app.get('/api/health', async (req, res) => {
    let db = isPostgres ? 'postgres' : 'mysql';
    if (shouldBootstrap) {
      try {
        await Promise.race([
          pool.query('SELECT 1'),
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database ping timed out')), 4000);
          }),
        ]);
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

  // Railway / production: serve Vite build (frontend + API on one URL)
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

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
