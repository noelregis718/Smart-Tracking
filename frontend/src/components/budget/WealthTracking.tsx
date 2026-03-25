import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface Loan {
    id: string;
    name: string;
    amount: number; // Paid
    total: number;
}

export const LoanBook = () => {
    useAuth();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIdOpen, setIsIdOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ name: '', amount: '', total: '' });

    const fetchLoans = async () => {
        try {
            const response = await api.get('/loans');
            setLoans(response.data);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleSave = async () => {
        if (!formData.name || !formData.total) return;
        setIsSaving(true);
        try {
            await api.post('/loans', formData);
            await fetchLoans();
            setIsIdOpen(false);
            setFormData({ name: '', amount: '', total: '' });
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save loan info');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this loan?')) return;
        try {
            await api.delete(`/loans/${id}`);
            await fetchLoans();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };
    if (loading) return <div style={{ background: 'white', borderRadius: '4px', padding: '1.25rem' }}>Loading loans...</div>;

    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%',
            minHeight: '260px',
            position: 'relative'
        }}>
            {/* Modal */}
            {isIdOpen && (
                <div 
                    onClick={() => setIsIdOpen(false)}
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
                        zIndex: 2000,
                        padding: '20px'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '4px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Add New Loan</h3>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Loan Name</label>
                                <input 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Car Loan, Student Debt"
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Paid So Far (₹)</label>
                                    <input 
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        placeholder="0.00"
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Total Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={formData.total}
                                        onChange={e => setFormData({...formData, total: e.target.value})}
                                        placeholder="0.00"
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsIdOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn-premium-shine"
                                style={{ 
                                    padding: '0.625rem 1.25rem', 
                                    fontSize: '0.875rem'
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Add Loan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Loan Book</h3>
                    <button 
                        onClick={() => setIsIdOpen(true)}
                        className="btn-premium-shine"
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem'
                        }}
                    >
                        <Plus size={14} /> Add Loan
                    </button>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                {loans.length === 0 ? (
                    <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>No loans tracked yet</div>
                ) : (
                    loans.map((loan, idx) => (
                        <LoanEntry 
                            key={loan.id}
                            id={loan.id}
                            name={loan.name} 
                            amount={loan.amount} 
                            total={loan.total} 
                            color={['#0ea5e9', '#f59e0b', '#22c55e', '#8b5cf6'][idx % 4]} 
                            last={idx === loans.length - 1}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export const Investments = () => {
    useAuth();
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIdOpen, setIsIdOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({ title: '', amount: '', change: '' });

    const fetchInvestments = async () => {
        try {
            const response = await api.get('/investments');
            setInvestments(response.data);
        } catch (error) {
            console.error('Failed to fetch investments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const handleSave = async () => {
        if (!formData.title || !formData.amount) return;
        setIsSaving(true);
        try {
            await api.post('/investments', formData);
            await fetchInvestments();
            setIsIdOpen(false);
            setFormData({ title: '', amount: '', change: '' });
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save investment info');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this investment?')) return;
        try {
            await api.delete(`/investments/${id}`);
            await fetchInvestments();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (loading) return <div style={{ background: 'white', borderRadius: '4px', padding: '1.25rem' }}>Loading investments...</div>;

    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%',
            position: 'relative'
        }}>
            {/* Modal */}
            {isIdOpen && (
                <div 
                    onClick={() => setIsIdOpen(false)}
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
                        zIndex: 2000,
                        padding: '20px'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '4px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Add New Investment</h3>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Investment Title</label>
                                <input 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Stock Portfolio, Crypto"
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        placeholder="0.00"
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>% Change</label>
                                    <input 
                                        type="number"
                                        value={formData.change}
                                        onChange={e => setFormData({...formData, change: e.target.value})}
                                        placeholder="+ / - 0.00"
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsIdOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="btn-premium-shine"
                                style={{ 
                                    padding: '0.625rem 1.25rem', 
                                    fontSize: '0.875rem'
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Add Investment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Investments</h3>
                    <button 
                        onClick={() => setIsIdOpen(true)}
                        className="btn-premium-shine"
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem'
                        }}
                    >
                        <Plus size={14} /> Add Entry
                    </button>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                {investments.length === 0 ? (
                    <div style={{ gridColumn: 'span 2', padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>No investments added yet</div>
                ) : (
                    investments.map(inv => (
                        <InvestmentCard
                            key={inv.id}
                            id={inv.id}
                            title={inv.title}
                            amount={inv.amount}
                            change={inv.change}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const LoanEntry = ({ id, name, amount, total, color, last, onDelete }: { id: string, name: string, amount: number, total: number, color: string, last?: boolean, onDelete: (id: string) => void }) => {
    const percentage = total > 0 ? (amount / total) * 100 : 0;

    return (
        <div style={{
            paddingBottom: last ? 0 : '0.75rem',
            borderBottom: last ? 'none' : '1px solid #f1f5f9',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'flex-start' }}>
                <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{name}</span>
                    <button 
                        onClick={() => onDelete(id)}
                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 8px', fontSize: '0.75rem', opacity: 0.6 }}
                        title="Delete Loan"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>₹{amount.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '0.75rem' }}>/ ₹{total.toLocaleString()}</span></span>
            </div>
            <div style={{
                height: '6px',
                background: '#f1f5f9',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${Math.min(percentage, 100)}%`,
                    height: '100%',
                    background: color,
                    borderRadius: '3px'
                }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>{percentage.toFixed(0)}% Paid</span>
            </div>
        </div>
    );
};

const InvestmentCard = ({ id, title, amount, change, onDelete }: { id: string, title: string, amount: number, change: number, onDelete: (id: string) => void }) => {
    const isPositive = change >= 0;

    return (
        <div style={{
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #f1f5f9',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <div style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: '700', 
                        color: isPositive ? '#16a34a' : '#ef4444',
                        background: isPositive ? '#f0fdf4' : '#fef2f2',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                    }}>
                        {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(change)}%
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.025em' }}>All time</span>
                </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>
                    ₹{amount.toLocaleString()}
                </div>
                <button 
                    onClick={() => onDelete(id)}
                    style={{ 
                        border: 'none', 
                        background: 'none', 
                        color: '#cbd5e1', 
                        cursor: 'pointer', 
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

interface Investment {
    id: string;
    title: string;
    amount: number;
    change: number;
}
