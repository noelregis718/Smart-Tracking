import { useState, useEffect } from 'react';
import { Card } from '../Card';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';

interface Transaction {
    id: string;
    amount: number;
    category: string;
    title: string;
}

const DEFAULT_CATEGORIES = [
    "Food & Dining", "Shopping", "Transportation", "Utilities", "Entertainment", "Health", "Others"
];

export const TransactionStatCards = () => {
    const { getToken } = useAuth();
    const [stats, setStats] = useState([
        { title: 'Total Transactions', amount: '0', bg: 'white' },
        { title: 'Average Amount', amount: '₹0.00', bg: 'white' },
        { title: 'Top Category', amount: 'None', bg: 'white' }
    ]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const [expRes, budRes, recRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/budgets'),
                api.get('/recurring')
            ]);

            const txs: Transaction[] = expRes.data;
            const budgets = budRes.data;
            const recurring = recRes.data;

            const activeRecurring = recurring.filter((r: any) => r.status === 'Active');

            if (txs.length === 0 && activeRecurring.length === 0) {
                setLoading(false);
                return;
            }

            const allProperCategories = new Set([
                ...DEFAULT_CATEGORIES,
                ...budgets.map((b: any) => b.category)
            ]);

            const categoryMap: Record<string, number> = {};
            const categoryHighestItem: Record<string, { name: string, amount: number }> = {};
            let totalSum = 0;

            // Manual Expenses
            txs.forEach(tx => {
                let cat = tx.category;
                if (!cat || !allProperCategories.has(cat)) cat = 'Others';
                if (cat === 'Income') return;
                
                categoryMap[cat] = (categoryMap[cat] || 0) + tx.amount;
                totalSum += tx.amount;

                if (!categoryHighestItem[cat] || tx.amount > categoryHighestItem[cat].amount) {
                    categoryHighestItem[cat] = { name: tx.title, amount: tx.amount };
                }
            });

            // Active Recurring
            activeRecurring.forEach((rec: any) => {
                let cat = rec.category;
                if (!cat || !allProperCategories.has(cat)) cat = 'Others';
                if (cat === 'Income') return;

                categoryMap[cat] = (categoryMap[cat] || 0) + rec.amount;
                totalSum += rec.amount;

                if (!categoryHighestItem[cat] || rec.amount > categoryHighestItem[cat].amount) {
                    categoryHighestItem[cat] = { name: rec.name, amount: rec.amount };
                }
            });

            // Stats
            const totalEntries = txs.filter(t => t.category !== 'Income').length + activeRecurring.length;
            const avgAmount = totalSum / (totalEntries || 1);

            let topCat = 'None';
            if (Object.keys(categoryMap).length > 0) {
                topCat = Object.entries(categoryMap).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
                
                // If Top Category is "Others", show the specific highest item for clarity
                if (topCat === 'Others' && categoryHighestItem['Others']) {
                    topCat = `Others - ${categoryHighestItem['Others'].name}`;
                }
            }

            setStats([
                { title: 'Total Transactions', amount: totalEntries.toString(), bg: 'white' },
                { title: 'Average Amount', amount: `₹${Math.round(avgAmount).toLocaleString()}`, bg: 'white' },
                { title: 'Top Category', amount: topCat, bg: 'white' }
            ]);
        } catch (error) {
            console.error('Failed to fetch transaction stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [getToken]);

    if (loading) return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>Loading stats...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {stats.map((stat, index) => (
                <Card key={index} style={{ padding: '1.25rem', background: stat.bg, borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>{stat.title}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>{stat.amount}</h3>
                    </div>
                </Card>
            ))}
        </div>
    );
};
