import { useState, useEffect, useMemo } from 'react';
import { Info } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';

interface Budget {
    category: string;
    limit: number;
}

export const LeftToBudget = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Summary' | 'Income' | 'Expenses'>('Expenses');

    const fetchData = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const [expRes, budRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/budgets')
            ]);
            setExpenses(expRes.data);
            setBudgets(budRes.data);
        } catch (error) {
            console.error('Failed to fetch budget summary data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [getToken]);

    const stats = useMemo(() => {
        const groups = {
            Fixed: { spent: 0, budget: 0, categories: ['Utilities', 'Health'] },
            Flexible: { spent: 0, budget: 0, categories: ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment'] },
            'Non-Monthly': { spent: 0, budget: 0, categories: ['Others'] }
        };

        expenses.forEach(exp => {
            if (groups.Fixed.categories.includes(exp.category)) groups.Fixed.spent += exp.amount;
            else if (groups.Flexible.categories.includes(exp.category)) groups.Flexible.spent += exp.amount;
            else groups['Non-Monthly'].spent += exp.amount;
        });

        budgets.forEach(b => {
            if (groups.Fixed.categories.includes(b.category)) groups.Fixed.budget += b.limit;
            else if (groups.Flexible.categories.includes(b.category)) groups.Flexible.budget += b.limit;
            else groups['Non-Monthly'].budget += b.limit;
        });

        const totalSpent = Object.values(groups).reduce((acc, curr) => acc + curr.spent, 0);
        const totalBudget = Object.values(groups).reduce((acc, curr) => acc + curr.budget, 0);

        return {
            groups: Object.entries(groups).map(([name, data]) => ({
                name,
                ...data,
                remaining: data.budget - data.spent
            })),
            totalLeft: Math.max(0, totalBudget - totalSpent)
        };
    }, [expenses, budgets]);

    if (loading) return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>Loading summary...</div>
        </div>
    );

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateX(-4mm)'
        }}>
            {/* Header Banner */}
            <div style={{
                background: '#f0fdf4',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #dcfce7'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#166534', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                    ₹{stats.totalLeft.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#15803d', fontSize: '0.9rem', fontWeight: '600' }}>
                    Left to budget <Info size={16} />
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '1rem 0.5rem 0',
                gap: '1rem'
            }}>
                <Tab label="Summary" active={activeTab === 'Summary'} onClick={() => setActiveTab('Summary')} />
                <Tab label="Income" active={activeTab === 'Income'} onClick={() => setActiveTab('Income')} />
                <Tab label="Expenses" active={activeTab === 'Expenses'} onClick={() => setActiveTab('Expenses')} />
            </div>

            {/* Category Breakdown */}
            <div style={{ padding: '1rem', flex: 1 }}>
                {activeTab === 'Expenses' ? (
                    stats.groups.map((group, index) => (
                        <BudgetCategoryRow
                            key={group.name}
                            label={group.name}
                            budget={group.budget}
                            spent={group.spent}
                            remaining={group.remaining}
                            color="#22c55e"
                            last={index === stats.groups.length - 1}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '2rem 0' }}>
                        No data available for {activeTab}
                    </div>
                )}
            </div>
        </div>
    );
};

export const RecurringPayments = () => {
    return (
        <div style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            transform: 'translateX(-2mm)'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Recurring Payments</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>14</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Active subscriptions</div>
                </div>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>₹1,240</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Monthly total</div>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                    <span>Subscription Budget Utilization</span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>68%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '68%', height: '100%', background: '#8b5cf6', borderRadius: '3px' }} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RecurringRow label="SaaS Tools" count={6} amount={840} />
                <RecurringRow label="Cloud Services" count={3} amount={320} />
                <RecurringRow label="Memberships" count={5} amount={80} last />
            </div>
        </div>
    );
};

// Keep backward-compat export
export const BudgetSummary = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <LeftToBudget />
        <RecurringPayments />
    </div>
);

const Tab = ({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        style={{
            fontSize: '0.8rem',
            fontWeight: '600',
            color: active ? '#1e293b' : '#64748b',
            padding: '6px 14px',
            borderRadius: '100px',
            background: active ? '#f1f5f9' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
        }}
    >
        {label}
    </div>
);

const BudgetCategoryRow = ({ label, budget, spent, remaining, color, overlayColor, overlayWidth, last }: {
    label: string,
    budget: number,
    spent: number,
    remaining: number,
    color: string,
    overlayColor?: string,
    overlayWidth?: string,
    last?: boolean
}) => {
    const percentage = (spent / budget) * 100;

    return (
        <div style={{
            marginBottom: last ? 0 : '1rem',
            paddingBottom: last ? 0 : '1rem',
            borderBottom: last ? 'none' : '1px solid #f1f5f9'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>₹{budget.toLocaleString()} budget</span>
            </div>

            <div style={{
                height: '6px',
                background: '#f1f5f9',
                borderRadius: '3px',
                position: 'relative',
                marginBottom: '6px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: color,
                    borderRadius: '3px'
                }} />
                {overlayColor && (
                    <div style={{
                        position: 'absolute',
                        left: `${percentage}%`,
                        top: 0,
                        width: overlayWidth || '6px',
                        height: '100%',
                        background: overlayColor,
                    }} />
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>₹{spent.toLocaleString()} spent</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: overlayColor || '#15803d' }}>₹{remaining.toLocaleString()}</span> remaining
                </span>
            </div>
        </div>
    );
};

const RecurringRow = ({ label, count, amount, last }: { label: string, count: number, amount: number, last?: boolean }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: last ? 'none' : '1px solid #f1f5f9'
    }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{label} ({count})</span>
        <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: '700' }}>₹{amount}/mo</span>
    </div>
);
