import { Router } from 'express';
import { getBudgets, upsertBudget, deleteBudget, bulkUpsertBudgets } from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate as any, getBudgets as any);
router.post('/', authenticate as any, upsertBudget as any);
router.post('/bulk', authenticate as any, bulkUpsertBudgets as any);
router.delete('/', authenticate as any, deleteBudget as any);

export default router;
