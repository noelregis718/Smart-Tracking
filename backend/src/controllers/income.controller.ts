import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getIncomes = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const incomes = await prisma.income.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(incomes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createIncome = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { title, amount, category, source, date } = req.body;

  try {
    const income = await prisma.income.create({
      data: {
        title,
        amount: parseFloat(amount),
        category,
        source: source || null,
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });
    res.status(201).json(income);
  } catch (error: any) {
    console.error('CREATE INCOME ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteIncome = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;

  try {
    const income = await prisma.income.findUnique({ where: { id } });

    if (!income || income.userId !== userId) {
      return res.status(404).json({ error: 'Income source not found' });
    }

    await prisma.income.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateIncome = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;
  const { title, amount, category, source, date } = req.body;

  try {
    const income = await prisma.income.findUnique({ where: { id } });

    if (!income || income.userId !== userId) {
      return res.status(404).json({ error: 'Income source not found' });
    }

    const updatedIncome = await prisma.income.update({
      where: { id },
      data: {
        title: title !== undefined ? title : income.title,
        amount: amount !== undefined ? parseFloat(amount) : income.amount,
        category: category !== undefined ? category : income.category,
        source: source !== undefined ? (source || null) : income.source,
        date: date ? new Date(date) : income.date,
      },
    });
    res.json(updatedIncome);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
