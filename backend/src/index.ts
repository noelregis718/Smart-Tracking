import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import accountRoutes from './routes/account.routes';
import loanRoutes from './routes/loan.routes';
import investmentRoutes from './routes/investment.routes';
import budgetRoutes from './routes/budget.routes';
import goalRoutes from './routes/goal.routes';
import recurringRoutes from './routes/recurring.routes';
import taskRoutes from './routes/task.routes';

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
  res.send('Smart Expense Tracker API (v2) is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recurring', recurringRoutes);
app.use('/api/tasks', taskRoutes);

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

// Explicitly keep the process alive as some environments exit prematurely
setInterval(() => {}, 1000 * 60 * 60);
