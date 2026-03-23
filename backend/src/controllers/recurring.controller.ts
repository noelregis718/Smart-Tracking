import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getRecurringPayments = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
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

export const createRecurringPayment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { name, amount, category, status, billingDay } = req.body;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const newRecurring = await prisma.recurringPayment.create({
            data: {
                name: name as string,
                amount: parseFloat(amount as string),
                category: category as string,
                status: (status as string) || 'Active',
                billingDay: parseInt(billingDay as string) || 1,
                userId: userId as string
            }
        });
        res.status(201).json(newRecurring);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create recurring payment' });
    }
};

export const updateRecurringPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, amount, category, status, billingDay } = req.body;

        const updated = await prisma.recurringPayment.update({
            where: { id: id as string },
            data: {
                name: name as string,
                amount: amount ? parseFloat(amount as string) : undefined,
                category: category as string,
                status: status as string,
                billingDay: billingDay ? parseInt(billingDay as string) : undefined
            }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recurring payment' });
    }
};

export const deleteRecurringPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.recurringPayment.delete({ where: { id: id as string } });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recurring payment' });
    }
};

export const acknowledgePayment = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { month } = req.body; // e.g. "2026-03"

        const updated = await prisma.recurringPayment.update({
            where: { id: id as string },
            data: { lastPaidMonth: month }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to acknowledge payment' });
    }
};
