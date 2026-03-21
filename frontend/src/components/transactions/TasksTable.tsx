import { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Plus, X, ChevronDown, Trash2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';

interface Expense {
    id: string;
    title: string;
    category: string;
    amount: number;
    date: string;
}

export const TasksTable = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        title: '',
        date: new Date().toISOString(),
        category: 'Food',
        amount: ''
    });

    const fetchExpenses = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [getToken]);

    const handleAddExpense = async () => {
        if (!newExpense.title || !newExpense.amount) return;

        try {
            const token = await getToken();
            setAuthToken(token);
            await api.post('/expenses', {
                title: newExpense.title,
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
                date: newExpense.date
            });
            setIsModalOpen(false);
            setNewExpense({ title: '', date: new Date().toISOString(), category: 'Food', amount: '' });
            fetchExpenses();
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.delete(`/expenses/${id}`);
            setExpenses(expenses.filter(e => e.id !== id));
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    const categories = ['Food', 'Transport', 'Rent', 'Shopping', 'Health', 'Other'];

    if (loading) return <Card style={{ padding: '2rem', textAlign: 'center' }}>Loading your financial data...</Card>;

    return (
        <Card style={{ padding: '0', background: 'white', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Recent Expenses</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-premium-shine"
                    style={{
                        padding: '6px 16px',
                        fontSize: '0.875rem'
                    }}
                >
                    <Plus size={16} /> Add Expense
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Title</th>
                            <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Category</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right', width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No expenses found.</td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 24px' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>{expense.title}</span>
                                    </td>
                                    <td style={{ padding: '12px 24px', textAlign: 'center' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            padding: '4px 12px',
                                            background: '#f1f5f9',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#64748b'
                                        }}>
                                            {expense.category}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#475569' }}>
                                        {new Date(expense.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                                        ₹{expense.amount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                        <Trash2 size={16} onClick={() => handleDeleteExpense(expense.id)} style={{ color: '#ef4444', cursor: 'pointer', opacity: 0.7 }} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Add Expense</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>TITLE</label>
                                <input type="text" value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} placeholder="e.g. Grocery" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>AMOUNT (INR)</label>
                                <input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>CATEGORY</label>
                                <div onClick={() => setIsCategoryOpen(!isCategoryOpen)} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{newExpense.category}</span>
                                    <ChevronDown size={18} />
                                </div>
                                {isCategoryOpen && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 10 }}>
                                        {categories.map(c => (
                                            <div key={c} onClick={() => { setNewExpense({ ...newExpense, category: c }); setIsCategoryOpen(false); }} style={{ padding: '10px 12px', cursor: 'pointer' }}>{c}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                              <button onClick={handleAddExpense} className="btn-premium-shine" style={{ marginTop: '1rem', padding: '12px', fontWeight: '700' }}>Save Expense</button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
