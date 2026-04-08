import { useState, useEffect, useMemo } from 'react';
import { Info, ChevronDown, Plus } from 'lucide-react';
import { SpendingPacing } from './SpendingPacing';
import { SavingsBoost } from './SavingsBoost';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface Budget {
    category: string;
    limit: number;
}

interface RecurringPayment {
    id: string;
    name: string;
    amount: number;
    category: string;
    status: string;
    billingDay: number;
    lastPaidMonth?: string;
}

// --- Helper Components ---

function Tab({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            style={{
                fontSize: '0.8rem',
                fontWeight: '600',
                color: active ? '#1e293b' : '#64748b',
                padding: '6px 14px',
                borderRadius: '4px',
                background: active ? '#f1f5f9' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            {label}
        </div>
    );
}

function BudgetCategoryRow({ label, budget, spent, remaining, color, overlayColor, overlayWidth, last }: {
    label: string,
    budget: number,
    spent: number,
    remaining: number,
    color: string,
    overlayColor?: string,
    overlayWidth?: string,
    last?: boolean
}) {
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
}

function RecurringRow({ label, count, amount, last }: { label: string, count: number, amount: number, last?: boolean }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: last ? 'none' : '1px solid #f1f5f9'
        }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{label} ({count})</span>
            <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: '700' }}>₹{amount.toLocaleString()}/mo</span>
        </div>
    );
}

function IncomeRow({ label, amount, date, last }: { label: string, amount: number, date: string, last?: boolean }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: last ? 'none' : '1px solid #f1f5f9'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{label}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(date).toLocaleDateString()}</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10b981' }}>₹{amount.toLocaleString()}</span>
        </div>
    );
}

function SummaryRow({ label, amount, type }: { label: string, amount: number, type: 'income' | 'expense' | 'net' | 'budget' }) {
    const color = type === 'income' ? '#10b981' : type === 'expense' ? '#ef4444' : type === 'budget' ? '#2563eb' : (amount >= 0 ? '#10b981' : '#ef4444');

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: 'none'
        }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{label}</span>
            <span style={{ fontSize: '1rem', fontWeight: '800', color }}>₹{Math.abs(amount).toLocaleString()}</span>
        </div>
    );
}

export const LeftToBudget = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [income, setIncome] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Summary' | 'Income' | 'Expenses'>('Expenses');

    const fetchData = async () => {
        try {
            const [expRes, budRes, incRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/budgets'),
                api.get('/income')
            ]);
            setExpenses(expRes.data);
            setBudgets(budRes.data);
            setIncome(incRes.data);
        } catch (error) {
            console.error('Failed to fetch budget summary data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const stats = useMemo(() => {
        const groups = {
            Fixed: { spent: 0, budget: 0, categories: ['Utilities', 'Health'] },
            Flexible: { spent: 0, budget: 0, categories: ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment'] },
            'Non-Monthly': { spent: 0, budget: 0, categories: ['Others'] }
        };

        expenses.forEach(exp => {
            if (exp.category === 'Income') return;
            if (groups.Fixed.categories.includes(exp.category)) groups.Fixed.spent += exp.amount;
            else if (groups.Flexible.categories.includes(exp.category)) groups.Flexible.spent += exp.amount;
            else groups['Non-Monthly'].spent += exp.amount;
        });

        budgets.forEach(b => {
            if (b.category === 'Income') return;
            if (groups.Fixed.categories.includes(b.category)) groups.Fixed.budget += b.limit;
            else if (groups.Flexible.categories.includes(b.category)) groups.Flexible.budget += b.limit;
            else groups['Non-Monthly'].budget += b.limit;
        });

        const totalSpent = Object.values(groups).reduce((acc, curr) => acc + curr.spent, 0);
        const totalBudget = Object.values(groups).reduce((acc, curr) => acc + curr.budget, 0);
        const totalIncomeValue = income.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            groups: Object.entries(groups).map(([name, data]) => ({
                name,
                ...data,
                remaining: data.budget - data.spent
            })),
            totalLeft: Math.max(0, totalBudget - totalSpent),
            totalIncome: totalIncomeValue,
            totalSpent,
            totalBudget
        };
    }, [expenses, budgets, income]);

    if (loading) return (
        <div style={{ background: 'white', borderRadius: '4px', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '600' }}>Loading summary...</div>
        </div>
    );

    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
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
                    Left to budget
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
                    <>
                        {stats.groups.map((group, index) => (
                            <BudgetCategoryRow
                                key={group.name}
                                label={group.name}
                                budget={group.budget}
                                spent={group.spent}
                                remaining={group.remaining}
                                color="#22c55e"
                                last={index === stats.groups.length - 1}
                            />
                        ))}
                    </>
                ) : activeTab === 'Income' ? (
                    <div>
                        {income.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '1rem 0' }}>No income records found.</div>
                        ) : (
                            income.map((inc, index) => (
                                <IncomeRow 
                                    key={inc.id}
                                    label={inc.title || inc.category}
                                    amount={inc.amount}
                                    date={inc.date}
                                    last={index === income.length - 1}
                                />
                            ))
                        )}
                    </div>
                ) : activeTab === 'Summary' ? (
                    <div>
                        <SummaryRow label="Total Income" amount={stats.totalIncome} type="income" />
                        <SummaryRow label="Total Budget" amount={stats.totalBudget} type="budget" />
                        <SummaryRow label="Total Expenses" amount={stats.totalSpent} type="expense" />
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                            <SummaryRow 
                                label="Net Cash Flow" 
                                amount={stats.totalIncome - stats.totalSpent} 
                                type="net" 
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '2rem 0' }}>
                        No data available for {activeTab}
                    </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                        Smart insights
                    </div>
                    <SpendingPacing totalSpent={stats.totalSpent} totalBudget={stats.totalBudget} />
                    <SavingsBoost totalLeft={stats.totalLeft} />
                </div>
            </div>
        </div>
    );
};

export const RecurringPayments = () => {
    const { user } = useAuth();
    const [recurring, setRecurring] = useState<RecurringPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<RecurringPayment | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        category: 'SaaS Tools',
        status: 'Active',
        billingDay: '1'
    });

    const allCategories = useMemo(() => {
        const defaults = ['SaaS Tools', 'Cloud Services', 'Memberships', 'Entertainment', 'Utilities', 'Others'];
        return Array.from(new Set([...defaults, ...recurring.map(r => r.category)]));
    }, [recurring]);

    const fetchRecurring = async () => {
        try {
            const response = await api.get('/recurring');
            setRecurring(response.data);
        } catch (error) {
            console.error('Failed to fetch recurring payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecurring();
    }, [user]);

    const handleSave = async () => {
        try {
            if (editingItem) {
                await api.put(`/recurring/${editingItem.id}`, formData);
            } else {
                await api.post('/recurring', formData);
            }
            fetchRecurring();
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ name: '', amount: '', category: 'SaaS Tools', status: 'Active', billingDay: '1' });
        } catch (error) {
            console.error('Failed to save recurring payment:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this recurring payment?')) return;
        try {
            await api.delete(`/recurring/${id}`);
            fetchRecurring();
        } catch (error) {
            console.error('Failed to delete recurring payment:', error);
        }
    };

    const totals = useMemo(() => {
        const active = recurring.filter(r => r.status === 'Active');
        const monthlyTotal = active.reduce((acc, curr) => acc + curr.amount, 0);
        
        // Group by category for the rows
        const grouped = allCategories.map(cat => ({
            label: cat,
            count: recurring.filter(r => r.category === cat).length,
            amount: recurring.filter(r => r.category === cat && r.status === 'Active').reduce((acc, curr) => acc + curr.amount, 0)
        })).filter(g => g.count > 0);

        // Calculate utilization based on total budget or a default limit (e.g., 2000)
        const budgetLimit = 2000; // This could be made dynamic later
        const utilization = Math.min(100, Math.round((monthlyTotal / budgetLimit) * 100));

        return {
            activeCount: active.length,
            monthlyTotal,
            utilization,
            grouped
        };
    }, [recurring]);

    if (loading) return null;

    return (
        <div style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: '4px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            minHeight: '260px',
            height: '100%'
        }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Recurring Payments</h3>
                <button 
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ name: '', amount: '', category: 'SaaS Tools', status: 'Active', billingDay: '1' });
                        setIsModalOpen(true);
                    }}
                    className="btn-premium-shine"
                    style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem'
                    }}
                >
                    <Plus size={14} /> Manage
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>{totals.activeCount}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Active subscriptions</div>
                </div>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>₹{totals.monthlyTotal.toLocaleString()}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Monthly total</div>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                    <span>Subscription Budget Utilization</span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>{totals.utilization}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: `${totals.utilization}%`, height: '100%', background: '#8b5cf6', borderRadius: '3px' }} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {totals.grouped.map((group, idx) => (
                    <RecurringRow 
                        key={group.label} 
                        label={group.label} 
                        count={group.count} 
                        amount={group.amount} 
                        last={idx === totals.grouped.length - 1} 
                    />
                ))}
                {totals.grouped.length === 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '1rem 0', fontStyle: 'italic' }}>
                        No recurring payments added yet.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div 
                    onClick={() => { setIsModalOpen(false); setEditingItem(null); }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '20px'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '500px',
                        borderRadius: '4px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
                                {editingItem ? 'Edit' : 'Add'} Recurring Payment
                            </h3>
                            <button 
                                onClick={() => { setIsModalOpen(false); setEditingItem(null); }}
                                style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div style={{ 
                            padding: '1.5rem', 
                            maxHeight: '75vh', 
                            overflowY: 'auto', 
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {/* Name Input */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                        placeholder="e.g. Netflix"
                                    />
                                </div>

                                {/* Amount and Status Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Monthly Amount (₹)</label>
                                        <input 
                                            type="number"
                                            value={formData.amount}
                                            onChange={e => setFormData({...formData, amount: e.target.value})}
                                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Billing Day (1-31)</label>
                                        <input 
                                            type="number"
                                            min="1"
                                            max="31"
                                            value={formData.billingDay}
                                            onChange={e => setFormData({...formData, billingDay: e.target.value})}
                                            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                            placeholder="1"
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</label>
                                        <div style={{ position: 'relative' }}>
                                            <div 
                                                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsCategoryOpen(false); }}
                                                style={{ 
                                                    padding: '0.75rem', 
                                                    borderRadius: '4px', 
                                                    border: '1px solid #e2e8f0', 
                                                    fontSize: '0.875rem', 
                                                    background: 'white',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <span style={{ color: formData.status === 'Active' ? '#22c55e' : '#64748b', fontWeight: '700' }}>
                                                    {formData.status}
                                                </span>
                                                <ChevronDown size={16} style={{ color: '#94a3b8', transform: isStatusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                            </div>
                                            {isStatusOpen && (
                                                <div style={{ 
                                                    position: 'absolute', 
                                                    top: '100%', 
                                                    left: 0, 
                                                    right: 0, 
                                                    zIndex: 100, 
                                                    background: 'white', 
                                                    border: '1px solid #e2e8f0', 
                                                    borderRadius: '4px', 
                                                    marginTop: '4px',
                                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                                }}>
                                                    <div 
                                                        onClick={() => { setFormData({...formData, status: 'Active'}); setIsStatusOpen(false); }}
                                                        style={{ 
                                                            padding: '10px 12px', 
                                                            fontSize: '0.875rem', 
                                                            cursor: 'pointer',
                                                            color: '#22c55e',
                                                            fontWeight: formData.status === 'Active' ? '700' : 'normal',
                                                            background: formData.status === 'Active' ? '#f0fdf4' : 'transparent'
                                                        }}
                                                    >
                                                        Active
                                                    </div>
                                                    <div 
                                                        onClick={() => { setFormData({...formData, status: 'Paused'}); setIsStatusOpen(false); }}
                                                        style={{ 
                                                            padding: '10px 12px', 
                                                            fontSize: '0.875rem', 
                                                            cursor: 'pointer',
                                                            color: '#ef4444',
                                                            fontWeight: formData.status === 'Paused' ? '700' : 'normal',
                                                            background: formData.status === 'Paused' ? '#fef2f2' : 'transparent'
                                                        }}
                                                    >
                                                        Paused
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Category Row (Full Width for better dropdown room) */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                                    <div style={{ position: 'relative' }}>
                                        <div 
                                            onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsStatusOpen(false); }}
                                            style={{ 
                                                padding: '0.75rem', 
                                                borderRadius: '4px', 
                                                border: '1px solid #e2e8f0', 
                                                fontSize: '0.875rem', 
                                                background: 'white',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>{formData.category}</span>
                                            <ChevronDown size={16} style={{ color: '#94a3b8', transform: isCategoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </div>
                                        {isCategoryOpen && (
                                            <div style={{ 
                                                position: 'absolute', 
                                                top: '100%', 
                                                left: 0, 
                                                right: 0, 
                                                zIndex: 100, 
                                                background: 'white', 
                                                border: '1px solid #e2e8f0', 
                                                borderRadius: '4px', 
                                                marginTop: '4px',
                                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                maxHeight: '200px',
                                                overflowY: 'auto'
                                            }}>
                                                {allCategories.map(c => (
                                                    <div 
                                                        key={c} 
                                                        onClick={() => { setFormData({...formData, category: c}); setIsCategoryOpen(false); }}
                                                        style={{ 
                                                            padding: '10px 12px', 
                                                            fontSize: '0.875rem', 
                                                            cursor: 'pointer',
                                                            background: formData.category === c ? '#f1f5f9' : 'transparent',
                                                            color: formData.category === c ? '#2563eb' : '#1e293b',
                                                            fontWeight: formData.category === c ? '700' : 'normal'
                                                        }}
                                                    >
                                                        {c}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {recurring.length > 0 && !editingItem && (
                                    <div style={{ marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Subscriptions</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {recurring.map(r => (
                                                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{r.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{r.amount.toLocaleString()} • {r.status}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '12px' }}>
                                                        <button 
                                                            onClick={() => { setEditingItem(r); setFormData({ name: r.name, amount: r.amount.toString(), category: r.category, status: r.status, billingDay: r.billingDay.toString() }); }} 
                                                            style={{ border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(r.id)} 
                                                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => { setIsModalOpen(false); setEditingItem(null); }}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="btn-premium-shine"
                                style={{ padding: '0.625rem 1.5rem', borderRadius: '4px', fontSize: '0.875rem' }}
                            >
                                {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Due Reminder Modal is handled by the wrapper now */}
        </div>
    );
};

// --- Reminder Component ---

const DuePaymentReminder = ({ recurring, onAcknowledge }: { recurring: RecurringPayment[], onAcknowledge: () => void }) => {
    const [duePayments, setDuePayments] = useState<RecurringPayment[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const today = new Date();
        const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const day = today.getDate();

        const due = recurring.filter(r => 
            r.status === 'Active' && 
            day >= r.billingDay && 
            r.lastPaidMonth !== currentMonth
        );

        if (due.length > 0) {
            setDuePayments(due);
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [recurring]);

    const handleAcknowledge = async (id: string) => {
        try {
            const today = new Date();
            const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
            await api.post(`/recurring/${id}/acknowledge`, { month: currentMonth });
            onAcknowledge();
        } catch (error) {
            console.error('Failed to acknowledge payment:', error);
        }
    };

    if (!isOpen || duePayments.length === 0) return null;

    return (
        <div 
            onClick={() => setIsOpen(false)}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3000,
                padding: '20px'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                background: 'white',
                width: '100%',
                maxWidth: '450px',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    background: '#fef2f2',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                }}>
                    <Info size={32} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Upcoming Payments Due</h3>
                <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>The following subscriptions are due for payment. Please acknowledge them once paid.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
                    {duePayments.map(p => (
                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{p.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{p.amount.toLocaleString()} • Due on {p.billingDay}{p.billingDay === 1 ? 'st' : p.billingDay === 2 ? 'nd' : p.billingDay === 3 ? 'rd' : 'th'}</div>
                            </div>
                            <button 
                                onClick={() => handleAcknowledge(p.id)}
                                style={{ 
                                    padding: '6px 12px', 
                                    borderRadius: '6px', 
                                    border: 'none', 
                                    background: '#1e293b', 
                                    color: 'white', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '600', 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
                            >
                                Acknowledge
                            </button>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setIsOpen(false)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                >
                    Dismiss for now
                </button>
            </div>
        </div>
    );
};

// --- Default Export Wrapper ---

export const BudgetSummary = () => {
    const { user } = useAuth();
    const [recurring, setRecurring] = useState<RecurringPayment[]>([]);

    const fetchRecurring = async () => {
        try {
            const response = await api.get('/recurring');
            setRecurring(response.data);
        } catch (error) {
            console.error('Failed to fetch recurring payments:', error);
        }
    };

    useEffect(() => {
        fetchRecurring();
    }, [user]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <LeftToBudget />
            <RecurringPayments />
            <DuePaymentReminder recurring={recurring} onAcknowledge={fetchRecurring} />
        </div>
    );
};
