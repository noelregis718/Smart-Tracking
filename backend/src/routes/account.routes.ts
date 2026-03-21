import { Router } from 'express';
import { getAccounts, createAccount, deleteAccount } from '../controllers/account.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate as any, getAccounts as any);
router.post('/', authenticate as any, createAccount as any);
router.delete('/:id', authenticate as any, deleteAccount as any);

export default router;
