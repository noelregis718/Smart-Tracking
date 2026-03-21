import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getInvestments = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const investments = await (prisma.investment as any).findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(investments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createInvestment = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { title, amount, change } = req.body;

  try {
    // Sync user
    await (prisma.user as any).upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.local`,
        name: 'Clerk User',
      },
    });

    const investment = await (prisma.investment as any).create({
      data: {
        title,
        amount: parseFloat(amount || 0),
        change: parseFloat(change || 0),
        userId,
      },
    });
    res.status(201).json(investment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInvestment = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;

  try {
    const investment = await (prisma.investment as any).findUnique({ where: { id } });

    if (!investment || investment.userId !== userId) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    await (prisma.investment as any).delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
