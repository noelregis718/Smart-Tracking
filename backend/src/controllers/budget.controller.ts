import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const budgets = await (prisma.budget as any).findMany({
      where: { userId },
    });
    res.json(budgets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const upsertBudget = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { category, limit } = req.body;

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

    const budget = await (prisma.budget as any).upsert({
      where: {
        userId_category: { userId, category },
      },
      update: {
        limit: parseFloat(limit),
      },
      create: {
        category,
        limit: parseFloat(limit),
      },
    });
    res.status(200).json(budget);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkUpsertBudgets = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { budgets } = req.body; // Array of { category, limit }

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

    const results = await Promise.all(
      budgets.map((b: any) => 
        (prisma.budget as any).upsert({
          where: {
            userId_category: { userId, category: b.category },
          },
          update: {
            limit: parseFloat(b.limit),
          },
          create: {
            category: b.category,
            limit: parseFloat(b.limit),
            userId,
          },
        })
      )
    );
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { category } = req.body;

  try {
    await (prisma.budget as any).delete({
      where: {
        userId_category: { userId, category },
      },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
