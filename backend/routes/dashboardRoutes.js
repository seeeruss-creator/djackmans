import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);
router.get('/stats', DashboardController.stats);
router.get('/reports', DashboardController.reports);

export default router;
