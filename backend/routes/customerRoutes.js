import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.get('/', CustomerController.list);
router.get('/:id', CustomerController.get);
router.post('/', CustomerController.create);
router.put('/:id', CustomerController.update);
router.delete('/:id', CustomerController.remove);

export default router;
