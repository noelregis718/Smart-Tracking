import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [
      income,
      budgets,
      accounts,
      loans,
      investments,
      goals,
      expenses,
      recurring
    ] = await Promise.all([
      prisma.income.findMany({ where: { userId } }),
      prisma.budget.findMany({ where: { userId } }),
      prisma.account.findMany({ where: { userId } }),
      prisma.loan.findMany({ where: { userId } }),
      prisma.investment.findMany({ where: { userId } }),
      prisma.goal.findMany({ where: { userId } }),
      prisma.expense.findMany({ where: { userId } }),
      prisma.recurringPayment.findMany({ where: { userId } })
    ]);

    res.json({
      income,
      budgets,
      accounts,
      loans,
      investments,
      goals,
      expenses,
      recurring
    });
  } catch (error: any) {
    console.error('Failed to fetch dashboard summary:', error);
    res.status(500).json({ error: error.message });
  }
};
