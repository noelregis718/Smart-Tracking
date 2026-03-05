import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { supabase } from './lib/supabase';

dotenv.config();

const app = express();

// Global Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth() as any);

interface AuthRequest extends Request {
    auth: {
        userId: string;
    };
}

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Smart Expense Tracker API is running');
});

// Get all expenses
app.get('/api/expenses', (async (req: AuthRequest, res: Response) => {
    const { userId } = req.auth;
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
}) as any);

// Create expense
app.post('/api/expenses', (async (req: AuthRequest, res: Response) => {
    const { userId } = req.auth;
    const { title, amount, category, date } = req.body;

    const { data, error } = await supabase
        .from('expenses')
        .insert([{
            user_id: userId,
            title,
            amount,
            category,
            date: date || new Date().toISOString().split('T')[0]
        }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
}) as any);

// Delete expense
app.delete('/api/expenses/:id', (async (req: AuthRequest, res: Response) => {
    const { userId } = req.auth;
    const { id } = req.params;

    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
}) as any);

// Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('GLOBAL ERROR HANDLER CAUGHT AN ERROR:');
    console.error(err);
    res.status(500).json({
        error: 'Global error handler caught something',
        details: err.message || err
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
