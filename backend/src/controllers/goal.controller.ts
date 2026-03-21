import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getGoals = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    // Ensure the user exists in our local database (Clerk Sync)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.local`,
        name: 'Clerk User',
      },
    });

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { title, targetAmount, currentAmount, targetDate, color, status } = req.body;

  try {
    // Ensure the user exists in our local database (Clerk Sync)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@clerk.local`,
        name: 'Clerk User',
      },
    });

    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = parseFloat(currentAmount || '0');

    if (isNaN(parsedTarget)) {
      return res.status(400).json({ error: 'Invalid target amount' });
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount: parsedTarget,
        currentAmount: parsedCurrent,
        targetDate,
        color,
        status: status || 'Ahead',
        userId,
      },
    });
    res.status(201).json(goal);
  } catch (error: any) {
    console.error('CREATE GOAL ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;
  const { title, targetAmount, currentAmount, targetDate, color, status } = req.body;

  try {
    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : undefined,
        currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : undefined,
        targetDate,
        color,
        status,
      },
    });
    res.json(updatedGoal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const id = req.params.id as string;

  try {
    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal || goal.userId !== userId) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await prisma.goal.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
