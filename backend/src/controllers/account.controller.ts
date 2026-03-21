import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAccounts = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const accounts = await (prisma.account as any).findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(accounts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { name, balance } = req.body;

  try {
    // Ensure the user exists (Sync)
    await (prisma.user as any).upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.local`,
        name: 'Clerk User',
      },
    });

    const account = await (prisma.account as any).create({
      data: {
        name,
        balance: parseFloat(balance || 0),
        userId,
      },
    });
    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;

  try {
    const account = await (prisma.account as any).findUnique({ where: { id } });

    if (!account || account.userId !== userId) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await (prisma.account as any).delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
