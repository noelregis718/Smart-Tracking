import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    getRecurringPayments,
    createRecurringPayment,
    updateRecurringPayment,
    deleteRecurringPayment,
    acknowledgePayment
} from '../controllers/recurring.controller';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

router.get('/', getRecurringPayments);
router.post('/', createRecurringPayment);
router.put('/:id', updateRecurringPayment);
router.delete('/:id', deleteRecurringPayment);
router.post('/:id/acknowledge', acknowledgePayment);

export default router;
