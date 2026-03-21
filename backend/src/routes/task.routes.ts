import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate as any, getTasks as any);
router.post('/', authenticate as any, createTask as any);
router.put('/:id', authenticate as any, updateTask as any);
router.delete('/:id', authenticate as any, deleteTask as any);

export default router;
