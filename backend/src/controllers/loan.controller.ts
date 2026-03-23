import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLoans = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const loans = await prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(loans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createLoan = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { name, amount, total } = req.body;

  try {
    // Ensure the user exists (Sync)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.local`,
        name: 'Clerk User',
      },
    });

    const loan = await prisma.loan.create({
      data: {
        name,
        amount: parseFloat(amount || 0),
        total: parseFloat(total || 0),
        userId,
      },
    });
    res.status(201).json(loan);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLoan = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;

  try {
    const loan = await prisma.loan.findUnique({ where: { id } });

    if (!loan || loan.userId !== userId) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await prisma.loan.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
