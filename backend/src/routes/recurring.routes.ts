import { Router } from 'express';
import {
    getRecurringPayments,
    createRecurringPayment,
    updateRecurringPayment,
    deleteRecurringPayment
} from '../controllers/recurring.controller';

const router = Router();

router.get('/', getRecurringPayments);
router.post('/', createRecurringPayment);
router.put('/:id', updateRecurringPayment);
router.delete('/:id', deleteRecurringPayment);

export default router;
