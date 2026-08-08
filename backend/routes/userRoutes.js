import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);

router.get('/', UserController.list);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

export default router;
