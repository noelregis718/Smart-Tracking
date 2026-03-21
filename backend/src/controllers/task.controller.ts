import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { goalId } = req.query;
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId,
        ...(goalId ? { goalId: goalId as string } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, goalId } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const task = await prisma.task.create({
      data: {
        title,
        goalId: goalId || null,
        userId: req.userId!
      }
    });
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await prisma.task.update({
      where: { id, userId: req.userId },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed })
      }
    });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id, userId: req.userId }
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
