import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRecurringPayments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const recurring = await prisma.recurringPayment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(recurring);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recurring payments' });
    }
};

export const createRecurringPayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).auth?.userId;
        const { name, amount, category, status } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const newRecurring = await prisma.recurringPayment.create({
            data: {
                name: name as string,
                amount: parseFloat(amount as string),
                category: category as string,
                status: (status as string) || 'Active',
                userId
            }
        });
        res.status(201).json(newRecurring);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create recurring payment' });
    }
};

export const updateRecurringPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, amount, category, status } = req.body;

        const updated = await prisma.recurringPayment.update({
            where: { id: id as string },
            data: {
                name: name as string,
                amount: amount ? parseFloat(amount as string) : undefined,
                category: category as string,
                status: status as string
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recurring payment' });
    }
};

export const deleteRecurringPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.recurringPayment.delete({ where: { id: id as string } });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recurring payment' });
    }
};
