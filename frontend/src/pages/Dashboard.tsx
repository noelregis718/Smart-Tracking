import React, { useState } from 'react';
import { useExpenses } from '../context/ExpensesContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { DollarSign, TrendingDown, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export const Dashboard = () => {
    const { expenses, addExpense, deleteExpense } = useExpenses();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '', date: '' });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const income = 5000; // Mock income
    const balance = income - totalExpenses;

    const data = [
        { name: 'Food', value: expenses.filter(e => e.category === 'Food').reduce((a, c) => a + c.amount, 0) },
        { name: 'Transport', value: expenses.filter(e => e.category === 'Transport').reduce((a, c) => a + c.amount, 0) },
        { name: 'Entertainment', value: expenses.filter(e => e.category === 'Entertainment').reduce((a, c) => a + c.amount, 0) },
        { name: 'Bills', value: expenses.filter(e => e.category === 'Bills').reduce((a, c) => a + c.amount, 0) },
    ].filter(d => d.value > 0);

    const COLORS = ['#4f46e5', '#22c55e', '#ef4444', '#f59e0b'];

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExpense.title || !newExpense.amount) return;
        addExpense({
            title: newExpense.title,
            amount: parseFloat(newExpense.amount),
            category: newExpense.category || 'Other',
            date: newExpense.date || new Date().toISOString().split('T')[0]
        });
        setNewExpense({ title: '', amount: '', category: '', date: '' });
        setShowAddModal(false);
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Overview</h1>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Balance</span>
                        <div style={{ padding: '8px', background: '#e0e7ff', borderRadius: '50%', color: 'var(--primary)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${balance.toFixed(2)}</div>
                    <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                        <TrendingUp size={16} style={{ marginRight: '4px' }} /> +2.5% vs last month
                    </div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Income</span>
                        <div style={{ padding: '8px', background: '#dcfce7', borderRadius: '50%', color: 'var(--success)' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${income.toFixed(2)}</div>
                </Card>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Total Expenses</span>
                        <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '50%', color: 'var(--danger)' }}>
                            <TrendingDown size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${totalExpenses.toFixed(2)}</div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Transactions */}
                <Card style={{ gridColumn: 'span 1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Transactions</h3>
                        <Button onClick={() => setShowAddModal(true)} style={{ padding: '8px', borderRadius: '50%' }}>
                            <Plus size={20} />
                        </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {expenses.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No transactions yet.</p>
                        ) : (
                            expenses.map(expense => (
                                <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1.25rem' }}>
                                                {expense.category === 'Food' ? '🍔' : expense.category === 'Transport' ? '🚗' : expense.category === 'Entertainment' ? '🎬' : '📄'}
                                            </span>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{expense.title}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{expense.date}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontWeight: 'bold', color: 'var(--danger)' }}>-${expense.amount.toFixed(2)}</div>
                                        <button onClick={() => deleteExpense(expense.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Charts */}
                <Card style={{ gridColumn: 'span 1' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Spending by Category</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {data.map((entry, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Add Expense Modal */}
            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <Card style={{ width: '100%', maxWidth: '400px', animation: 'scaleIn 0.2s ease' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add New Expense</h3>
                        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Input
                                placeholder="Title (e.g., Grocery)"
                                value={newExpense.title}
                                onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                                required
                            />
                            <Input
                                type="number"
                                placeholder="Amount"
                                value={newExpense.amount}
                                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                required
                            />
                            <select
                                className="input"
                                value={newExpense.category}
                                onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}

                            >
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Bills">Bills</option>
                                <option value="Other">Other</option>
                            </select>
                            <Input
                                type="date"
                                value={newExpense.date}
                                onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                required
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>Cancel</Button>
                                <Button type="submit" style={{ flex: 1 }}>Add Expense</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};
