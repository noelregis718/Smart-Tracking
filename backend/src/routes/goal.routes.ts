import { Router } from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal, transferToGoal } from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All goal routes are protected by the authenticate middleware
router.get('/', authenticate as any, getGoals as any);
router.post('/', authenticate as any, createGoal as any);
router.post('/transfer', authenticate as any, transferToGoal as any);
router.put('/:id', authenticate as any, updateGoal as any);
router.delete('/:id', authenticate as any, deleteGoal as any);

export default router;
