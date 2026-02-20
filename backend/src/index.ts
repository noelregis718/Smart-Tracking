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

import { createConsent, createDataSession, fetchData } from './services/setu';
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
// Setu Routes
app.post('/api/setu/consent', (async (req: AuthRequest, res: Response) => {
    try {
        console.log('=== Setu Consent Request Start ===');
        console.log('Raw req.auth:', req.auth);

        const { mobileNumber } = req.body;
        console.log('Mobile Number:', mobileNumber);
        console.log('Auth userId:', req.auth?.userId);

        if (!mobileNumber) {
            return res.status(400).json({ error: 'Mobile number is required' });
        }

        const consent = await createConsent(mobileNumber);
        console.log('Setu Consent Service Response:', JSON.stringify(consent, null, 2));

        if (!consent || !consent.id) {
            console.error('Invalid consent response from Setu');
            return res.status(500).json({ error: 'Failed to create consent with Setu' });
        }

        console.log('Setu Consent Created:', consent.id);

        // Store consent in Supabase
        const { error } = await supabase
            .from('setu_connections')
            .upsert({
                user_id: req.auth.userId,
                consent_id: consent.id,
                status: 'PENDING'
            });

        if (error) {
            console.error('Supabase Upsert Error:', error);
            throw error;
        }

        res.json(consent);
    } catch (error: any) {
        console.error('--- 500 Error Caught in /api/setu/consent ---');
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
        res.status(500).json({ error: error.message });
    }
}) as any);

app.post('/api/setu/webhook', (async (req: Request, res: Response) => {
    try {
        const { type, consentId, dataSessionId } = req.body;
        console.log('Setu Webhook Received:', type, consentId);

        if (type === 'CONSENT_STATUS_UPDATE' && req.body.data?.status === 'ACTIVE') {
            // Update consent status in DB
            await supabase
                .from('setu_connections')
                .update({ status: 'ACTIVE' })
                .eq('consent_id', consentId);

            // Trigger data session creation
            const session = await createDataSession(consentId);
            await supabase
                .from('setu_connections')
                .update({ session_id: session.id })
                .eq('consent_id', consentId);
        }

        if (type === 'SESSION_STATUS_UPDATE' && req.body.data?.status === 'COMPLETED') {
            // Fetch the actual data
            const financialData = await fetchData(dataSessionId);

            // Get user_id associated with this session
            const { data: connection } = await supabase
                .from('setu_connections')
                .select('user_id')
                .eq('session_id', dataSessionId)
                .single();

            if (connection?.user_id && financialData?.FinancialInformation?.Accounts) {
                const accounts = financialData.FinancialInformation.Accounts;
                const expensesToInsert = [];

                for (const account of accounts) {
                    if (account.Transactions?.Transaction) {
                        for (const tx of account.Transactions.Transaction) {
                            expensesToInsert.push({
                                user_id: connection.user_id,
                                title: tx.narration || 'Bank Transaction',
                                amount: parseFloat(tx.amount),
                                category: 'Bank', // Categorization can be improved later
                                date: tx.currentDate ? tx.currentDate.split('T')[0] : new Date().toISOString().split('T')[0],
                                external_id: tx.reference // To avoid duplicates
                            });
                        }
                    }
                }

                if (expensesToInsert.length > 0) {
                    await supabase.from('expenses').upsert(expensesToInsert, { onConflict: 'external_id' });
                }
            }

            // Mark session as delivered in DB
            await supabase
                .from('setu_connections')
                .update({ status: 'DELIVERED' })
                .eq('session_id', dataSessionId);

            console.log('Financial data processed and stored for session:', dataSessionId);
        }

        res.sendStatus(200);
    } catch (error: any) {
        console.error('Webhook Error:', error.message);
        res.sendStatus(500);
    }
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
