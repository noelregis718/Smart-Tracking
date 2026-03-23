import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getExpenses = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { account: true },
      orderBy: { date: 'desc' },
    });
    res.json(expenses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { title, amount, category, date, accountId } = req.body;

  try {
    // Ensure the user exists in our local database (Clerk Sync)
    // We'll use a placeholder email derived from the userId if we don't have it
    // since we made the email unique but the password and name optional.
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.local`, // Fallback email for Clerk users
        name: 'Clerk User',
      },
    });

    const expense = await prisma.expense.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        userId,
        accountId: accountId || null,
      },
    });
    res.status(201).json(expense);
  } catch (error: any) {
    console.error('CREATE EXPENSE ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;

  try {
    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense || expense.userId !== userId) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;
  const { title, amount, category, date, accountId } = req.body;

  try {
    const expense = await prisma.expense.findUnique({ where: { id } });

    if (!expense || expense.userId !== userId) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        title: title !== undefined ? title : expense.title,
        amount: amount !== undefined ? parseFloat(amount) : expense.amount,
        category: category !== undefined ? category : expense.category,
        date: date ? new Date(date) : expense.date,
        accountId: accountId !== undefined ? (accountId || null) : expense.accountId,
      },
    });
    res.json(updatedExpense);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
