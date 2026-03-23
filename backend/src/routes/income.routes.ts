import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getIncomes, createIncome, deleteIncome, updateIncome } from '../controllers/income.controller';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

router.get('/', getIncomes);
router.post('/', createIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
