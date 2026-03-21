import { Router } from 'express';
import { getInvestments, createInvestment, deleteInvestment } from '../controllers/investment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate as any, getInvestments as any);
router.post('/', authenticate as any, createInvestment as any);
router.delete('/:id', authenticate as any, deleteInvestment as any);

export default router;
