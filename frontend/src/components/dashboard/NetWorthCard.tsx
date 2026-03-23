import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';
import { Card } from '../Card';
import { Info } from 'lucide-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

interface Transaction { // Covers both Expenses and Income
    id: string;
    amount: number;
    date: string;
    category: string;
}

interface Account { balance: number; }
interface Investment { amount: number; }
interface Loan { total: number; amount: number; }

export const NetWorthCard = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [income, setIncome] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = await getToken();
                setAuthToken(token);
                const [expRes, incRes, accs, invs, loansRes] = await Promise.all([
                    api.get('/expenses'),
                    api.get('/income'),
                    api.get('/accounts'),
                    api.get('/investments'),
                    api.get('/loans')
                ]);
                setExpenses(expRes.data);
                setIncome(incRes.data);
                setAccounts(accs.data);
                setInvestments(invs.data);
                setLoans(loansRes.data);
            } catch (error) {
                console.error('Failed to fetch data for net worth:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { chartData, currentNetWorth, oneMonthChange, changePercent } = useMemo(() => {
        // 1. Current Net Worth logic
        const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0) + 
                           investments.reduce((sum, i) => sum + i.amount, 0);
        const totalLiabilities = loans.reduce((sum, l) => sum + (l.total - l.amount), 0);
        const currentNW = totalAssets - totalLiabilities;

        // 2. Historical Reconstruction (Reverse from today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Group transactions by local date
        const historyMap: Record<string, number> = {};
        expenses.forEach((tx: any) => {
            const d = new Date(tx.date);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            historyMap[dateStr] = (historyMap[dateStr] || 0) - tx.amount;
        });
        income.forEach((tx: any) => {
            const d = new Date(tx.date);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            historyMap[dateStr] = (historyMap[dateStr] || 0) + tx.amount;
        });

        const historicalPoints = [];
        let runningNW = currentNW;

        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            
            historicalPoints.push({
                date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                value: Math.round(runningNW),
                fullDate: d
            });

            // To get YESTERDAY'S net worth from today's, we reverse today's transactions
            // YesterdayNW = TodayNW - TodayNetChange
            const todayNetChange = historyMap[dateStr] || 0;
            runningNW -= todayNetChange;
        }

        const reversedPoints = historicalPoints.reverse();
        const startNW = reversedPoints[0].value;
        const diffNW = currentNW - startNW;
        const pctNW = startNW !== 0 ? (diffNW / startNW) * 100 : 0;

        return { 
            chartData: reversedPoints, 
            currentNetWorth: currentNW, 
            oneMonthChange: diffNW,
            changePercent: pctNW
        };
    }, [expenses, income, accounts, investments, loans]);

    if (loading) return <Card style={{ padding: '2rem', textAlign: 'center' }}>Building your wealth profile...</Card>;

    const isPositive = oneMonthChange >= 0;

    return (
        <Card style={{ padding: '1.5rem', background: 'white' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' }}>NET WORTH</span>
                            <Info size={14} style={{ color: '#64748b', cursor: 'pointer' }} />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
                            ₹{currentNetWorth.toLocaleString('en-IN')}
                        </h2>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '4px' }}>
                        <span style={{ 
                            color: isPositive ? '#10b981' : '#ef4444', 
                            fontWeight: '700',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {isPositive ? '↑' : '↓'} ₹{Math.abs(oneMonthChange).toLocaleString('en-IN')} ({Math.abs(changePercent).toFixed(1)}%)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                            Last 30 Days
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ height: '300px', width: '100%', marginLeft: '-10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: '500' }}
                            minTickGap={40}
                            dy={10}
                        />
                        <YAxis
                            hide={true} // Cleaner "Premium" look like the image
                            domain={['dataMin - 5000', 'dataMax + 5000']}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            formatter={(value: number | undefined) => [`₹${(value || 0).toLocaleString()}`, 'Net Worth']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#wealthGradient)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
