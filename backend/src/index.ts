import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth() as any);

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Smart Expense Tracker API (v2) is running with local PostgreSQL');
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`\x1b[32m✔ Server is running on port ${PORT}\x1b[0m`);
  console.log(`\x1b[36mℹ Ready to handle multi-user dashboards!\x1b[0m`);
});
