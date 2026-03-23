import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import api from '../../lib/api';
import { useAuth } from '@clerk/clerk-react';

interface Income {
    id: string;
    title: string;
    amount: number;
    category: string;
    source: string | null;
    date: string;
}

const INCOME_CATEGORIES = [
    { name: 'Salary', color: '#6366f1' },
    { name: 'Freelance', color: '#10b981' },
    { name: 'Dividend', color: '#f59e0b' },
    { name: 'Bonus', color: '#ec4899' },
    { name: 'Other', color: '#94a3b8' }
];

const IncomeSources: React.FC = () => {
    const { getToken } = useAuth();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Salary');
    const [source, setSource] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await api.get('/income', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncomes(response.data);
        } catch (error) {
            console.error('Failed to fetch incomes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleAddIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount) return;

        try {
            const token = await getToken();
            await api.post('/income', {
                title,
                amount: parseFloat(amount),
                category,
                source: source || null,
                date: date
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setTitle('');
            setAmount('');
            setCategory('Salary');
            setSource('');
            setDate(new Date().toISOString().split('T')[0]);
            setIsAdding(false);
            fetchIncomes();
        } catch (error) {
            console.error('Failed to add income:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = await getToken();
            await api.delete(`/income/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchIncomes();
        } catch (error) {
            console.error('Failed to delete income:', error);
        }
    };

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    return (
        <AnalyticsCard style={{ height: '440px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>
                    Income Sources
                </h3>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-premium-shine"
                    style={{
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        borderRadius: '6px',
                        ...(isAdding ? { background: '#f1f5f9', color: '#64748b', boxShadow: 'none' } : {})
                    }}
                >
                    {isAdding ? <X size={14} /> : <Plus size={14} />}
                    {isAdding ? 'Cancel' : 'Add Income'}
                </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
                {isAdding ? (
                    <form onSubmit={handleAddIncome} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Label</label>
                                <input 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Monthly Salary"
                                    required
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Amount (INR)</label>
                                <input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    required
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', background: 'white' }}
                                >
                                    {INCOME_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                <input 
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', background: 'white' }}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="btn-premium-shine"
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.85rem',
                                width: '100%',
                                fontSize: '13px',
                                borderRadius: '6px',
                            }}
                        >
                            Save Income Source
                        </button>
                    </form>
                ) : (
                    <div style={{ padding: '1.25rem' }}>
                        {loading && incomes.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading sources...</div>
                        ) : incomes.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', textAlign: 'center', border: '2px dashed #f1f5f9', borderRadius: '12px' }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '700' }}>No income sources yet</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8' }}>Add your first revenue stream to start tracking.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {incomes.map(inc => {
                                    return (
                                        <div key={inc.id} style={{
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            background: '#f8fafc',
                                            border: '1px solid #f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'transform 0.2s ease',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>{inc.title}</div>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>{inc.source || 'Direct Deposit'}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#10b981' }}>+₹{inc.amount.toLocaleString()}</div>
                                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>{inc.category}</div>
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(inc.id)}
                                                    style={{ border: 'none', background: 'none', color: '#ef4444', opacity: 0.5, cursor: 'pointer', padding: '4px' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Total Monthly Revenue</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e293b' }}>₹{totalIncome.toLocaleString()}</span>
            </div>
        </AnalyticsCard>
    );
};

export default IncomeSources;
