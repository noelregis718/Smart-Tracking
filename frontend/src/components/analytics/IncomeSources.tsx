import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ModernSelect } from '../ModernSelect';
import { DatePicker } from '../DatePicker';

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
    const { user } = useAuth();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Salary');
    const [source, setSource] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/income');
            setIncomes(response.data);
        } catch (error) {
            console.error('Failed to fetch incomes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, [user]);

    // Click outside handler for modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((isAdding || isEditing) && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                // If the click is on the overlay itself, close it
                const target = event.target as HTMLElement;
                if (target.classList.contains('modal-overlay')) {
                    setIsAdding(false);
                    setIsEditing(false);
                    resetForm();
                }
            }
        };
        if (isAdding || isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAdding, isEditing]);

    const resetForm = () => {
        setTitle('');
        setAmount('');
        setCategory('Salary');
        setSource('');
        setDate(new Date().toISOString().split('T')[0]);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount) return;

        try {
            const data = {
                title,
                amount: parseFloat(amount),
                category,
                source: source || null,
                date: date
            };

            if (isEditing && editingId) {
                await api.put(`/income/${editingId}`, data);
            } else {
                await api.post('/income', data);
            }
            
            resetForm();
            setIsAdding(false);
            setIsEditing(false);
            fetchIncomes();
        } catch (error) {
            console.error('Failed to save income:', error);
        }
    };

    const handleEditClick = (inc: Income) => {
        setEditingId(inc.id);
        setTitle(inc.title);
        setAmount(inc.amount.toString());
        setCategory(inc.category);
        setSource(inc.source || '');
        setDate(inc.date.split('T')[0]);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/income/${id}`);
            fetchIncomes();
        } catch (error) {
            console.error('Failed to delete income:', error);
        }
    };

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    return (
        <AnalyticsCard style={{ height: '440px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>
                    Income Sources
                </h3>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="btn-premium-shine"
                    style={{
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        borderRadius: '6px'
                    }}
                >
                    <Plus size={14} /> Add Income
                </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
                <div style={{ padding: '1.25rem' }}>
                    {loading && incomes.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Loading sources...</div>
                    ) : incomes.length === 0 ? (
                        <div style={{ padding: '3rem 2rem', textAlign: 'center', border: '2px dashed #f1f5f9', borderRadius: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', fontWeight: '700' }}>No income sources yet</h4>
                            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8' }}>Add your first income stream to start tracking.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {incomes.map(inc => {
                                return (
                                    <div key={inc.id} 
                                        onClick={() => handleEditClick(inc)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            background: '#f8fafc',
                                            border: '1px solid #f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f1f5f9';
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.borderColor = '#f1f5f9';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
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
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Total Monthly Income</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e293b' }}>₹{totalIncome.toLocaleString()}</span>
            </div>

            {/* Modal Overlay: Add/Edit Income */}
            {(isAdding || isEditing) && (
                <div 
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                >
                    <div 
                        ref={modalRef}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '450px',
                            borderRadius: '8px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '800', color: '#1e293b' }}>
                                {isEditing ? 'Edit Income Source' : 'Add Income Source'}
                            </h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                {isEditing && (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this income source?')) {
                                                handleDelete(editingId!);
                                                setIsEditing(false);
                                                resetForm();
                                            }
                                        }}
                                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        title="Delete Source"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        setIsAdding(false);
                                        setIsEditing(false);
                                        resetForm();
                                    }} 
                                    style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '24px' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                                    <ModernSelect
                                        value={category}
                                        options={INCOME_CATEGORIES.map(c => ({ id: c.name, label: c.name }))}
                                        onChange={(val) => setCategory(val)}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                    <DatePicker 
                                        value={date}
                                        onChange={(newDate) => setDate(newDate)}
                                        style={{ height: 'auto' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
                                <button 
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.85rem',
                                        borderRadius: '6px',
                                        border: '1.5px solid #e2e8f0',
                                        background: 'white',
                                        color: '#64748b',
                                        fontSize: '13px',
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="btn-premium-shine"
                                    style={{
                                        flex: 2,
                                        padding: '0.85rem',
                                        fontSize: '13px',
                                        borderRadius: '6px',
                                    }}
                                >
                                    {isEditing ? 'Update Income Source' : 'Save Income Source'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AnalyticsCard>
    );
};

export default IncomeSources;
