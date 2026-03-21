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
            const response = await api.get('/expenses');
            const txs: Transaction[] = response.data;

            if (txs.length === 0) {
                setLoading(false);
                return;
            }

            // Calculations
            const totalCount = txs.length;
            const totalSum = txs.reduce((acc, curr) => acc + curr.amount, 0);
            const avgAmount = totalSum / totalCount;

            const categoryMap: Record<string, number> = {};
            txs.forEach(tx => {
                categoryMap[tx.category] = (categoryMap[tx.category] || 0) + 1;
            });

            const topCat = Object.entries(categoryMap).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

            setStats([
                { title: 'Total Transactions', amount: totalCount.toString(), bg: 'white' },
                { title: 'Average Amount', amount: `₹${avgAmount.toFixed(2)}`, bg: 'white' },
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
                <Card key={index} style={{ padding: '1.25rem', background: stat.bg, borderRadius: '6px' }}>
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
