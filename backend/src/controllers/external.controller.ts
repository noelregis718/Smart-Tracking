import { Request, Response } from 'express';
import axios from 'axios';

let ratesCache: any = null;
let lastFetch: number = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (to avoid 429)

export const getExchangeRates = async (req: Request, res: Response) => {
  const now = Date.now();
  
  if (ratesCache && (now - lastFetch < CACHE_DURATION)) {
    return res.json(ratesCache);
  }

  try {
    const API_KEY = '85a16542fb34d22f5233e7b8706e29f7';
    const symbols = 'INR,USD,EUR,GBP,JPY,AUD,CAD,CHF,CNY,SGD,AED';
    const response = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}&symbols=${symbols}`);
    
    if (response.data.success) {
      ratesCache = response.data.rates;
      lastFetch = now;
      return res.json(ratesCache);
    } else {
      console.error('Exchange rates API error:', response.data.error);
      // Fallback if we have old cache
      if (ratesCache) return res.json(ratesCache);
      return res.status(500).json({ error: 'Failed to fetch external rates' });
    }
  } catch (error: any) {
    console.error('Failed to proxy exchange rates:', error.message);
    if (ratesCache) return res.json(ratesCache);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
