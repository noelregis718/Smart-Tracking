import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';
import { Card } from '../Card';
import { Info, ChevronDown } from 'lucide-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

interface Expense {
    id: string;
    amount: number;
    date: string;
}

export const NetWorthCard = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = await getToken();
                setAuthToken(token);
                const response = await api.get('/expenses');
                setExpenses(response.data);
            } catch (error) {
                console.error('Failed to fetch expenses for chart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, [getToken]);

    const chartData = useMemo(() => {
        const grouped: Record<string, number> = {};
        expenses.forEach(exp => {
            const dateStr = new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            grouped[dateStr] = (grouped[dateStr] || 0) + exp.amount;
        });

        const sortedEntries = Object.entries(grouped).sort((a, b) => 
            new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );

        return sortedEntries.map(([date, value]) => ({ date, value }));
    }, [expenses]);

    const totalAmount = useMemo(() => {
        return expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }, [expenses]);

    if (loading) return <Card style={{ padding: '2rem', textAlign: 'center' }}>Updating financial summary...</Card>;

    return (
        <Card style={{ padding: '1.5rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', letterSpacing: '0.05em' }}>TOTAL EXPENSES</span>
                        <Info size={14} style={{ color: '#64748b', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>₹{totalAmount.toLocaleString()}</h2>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Dropdown label="Overview" />
                    <Dropdown label="Real-time" />
                </div>
            </div>

            <div style={{ height: '280px', width: '100%', marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const Dropdown = ({ label }: { label: string }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#1e293b',
        cursor: 'pointer',
        background: 'white'
    }}>
        {label}
        <ChevronDown size={16} style={{ color: '#64748b' }} />
    </div>
);
