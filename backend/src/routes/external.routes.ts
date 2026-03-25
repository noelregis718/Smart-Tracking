import { Router } from 'express';
import { getExchangeRates } from '../controllers/external.controller';

const router = Router();

// Public proxy for exchange rates (no auth needed for conversion tool)
router.get('/exchange-rates', getExchangeRates as any);

export default router;
