import { Router } from 'express';
import { getLoans, createLoan, deleteLoan } from '../controllers/loan.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate as any, getLoans as any);
router.post('/', authenticate as any, createLoan as any);
router.delete('/:id', authenticate as any, deleteLoan as any);

export default router;
