import { Router } from 'express';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All expense routes are protected by the authenticate middleware
router.get('/', authenticate as any, getExpenses as any);
router.post('/', authenticate as any, createExpense as any);
router.delete('/:id', authenticate as any, deleteExpense as any);

export default router;
