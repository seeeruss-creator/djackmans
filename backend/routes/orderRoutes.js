import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

export function createOrderRoutes(controller) {
  const router = Router();
  router.use(authenticate);
  router.get('/check-order-number', controller.checkOrderNumber);
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}
