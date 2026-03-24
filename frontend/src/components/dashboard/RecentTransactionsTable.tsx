import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Card } from '../Card';
import {
    MoreVertical
} from 'lucide-react';
import { ModernSelect } from '../ModernSelect';
import { DatePicker } from '../DatePicker';





interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
}

interface Account {
    id: string;
    name: string;
    balance: number;
}

export const RecentTransactionsTable = ({ 
    title = "Recent Expenses",
    addButtonLabel = "Add Expense"
}: { 
    title?: string,
    addButtonLabel?: string
}) => {
    useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIdOpen, setIsIdOpen] = useState(false);
    const [isAccOpen, setIsAccOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        accountId: ''
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: '',
        accountId: ''
    });

    const [accFormData, setAccFormData] = useState({
        name: '',
        balance: ''
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [expRes, accRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/accounts')
            ]);
            setTransactions(expRes.data);
            setAccounts(accRes.data);
            // Pre-select first account if available
            if (accRes.data.length > 0 && !formData.accountId) {
                setFormData(prev => ({ ...prev, accountId: accRes.data[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const availableCategories = useMemo(() => {
        const defaults = [
            'Food & Dining', 'Shopping', 'Transportation', 
            'Bills & Utilities', 'Entertainment', 'Health & Fitness', 'Others'
        ];
        
        const normalize = (cat: string) => {
            const c = cat.trim();
            if (c === 'Bills' || c === 'Utilities' || c === 'Bills & Utilities') return 'Bills & Utilities';
            if (c === 'Other' || c === 'Others') return 'Others';
            if (c === 'Health' || c === 'Health & Fitness') return 'Health & Fitness';
            return c;
        };

        const discovered = transactions.map(t => normalize(t.category));
        return Array.from(new Set([...defaults, ...discovered])).sort();
    }, [transactions]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        if (!formData.title || !formData.amount) return;
        setIsSaving(true);
        try {
            await api.post('/expenses', formData);
            await fetchData();
            setIsIdOpen(false);
            setFormData({
                title: '',
                amount: '',
                category: 'Food & Dining',
                date: new Date().toISOString().split('T')[0],
                accountId: accounts[0]?.id || ''
            });
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save transaction');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAccSave = async () => {
        if (!accFormData.name) return;
        setIsSaving(true);
        try {
            await api.post('/accounts', accFormData);
            await fetchData();
            setIsAccOpen(false);
            setAccFormData({ name: '', balance: '' });
        } catch (error) {
            console.error('Account save failed:', error);
            alert('Failed to save account');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            await fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete transaction');
        }
    };

    const handleEditSave = async () => {
        if (!editFormData.title || !editFormData.amount) return;
        setIsSaving(true);
        try {
            await api.patch(`/expenses/${editFormData.id}`, editFormData);
            await fetchData();
            setIsEditOpen(false);
            setEditFormData({ id: '', title: '', amount: '', category: 'Food & Dining', date: '', accountId: '' });
        } catch (error) {
            console.error('Edit failed:', error);
            alert('Failed to update transaction');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <Card style={{ padding: '2rem', textAlign: 'center' }}>Loading transactions...</Card>;
    }
    return (
        <Card style={{ padding: '0', background: 'white', overflow: 'visible', height: '100%' }}>
            {/* Modal Overlay: Edit Transaction */}
            {isEditOpen && (
                <div 
                    onClick={() => setIsEditOpen(false)}
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
                }}>
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '450px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Edit Transaction</h3>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Title</label>
                                <input 
                                    value={editFormData.title}
                                    onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={editFormData.amount}
                                        onChange={e => setEditFormData({...editFormData, amount: e.target.value})}
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                    <DatePicker 
                                        value={editFormData.date.split('T')[0]}
                                        onChange={newDate => setEditFormData({...editFormData, date: newDate})}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                                    <ModernSelect
                                        value={editFormData.category}
                                        options={availableCategories.map(cat => ({ id: cat, label: cat }))}
                                        onChange={(val) => setEditFormData({ ...editFormData, category: val })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Account</label>
                                    <ModernSelect
                                        value={editFormData.accountId}
                                        options={accounts.map(acc => ({ id: acc.id, label: acc.name }))}
                                        onChange={(val) => setEditFormData({ ...editFormData, accountId: val })}
                                        placeholder="Select account"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsEditOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                             <button 
                                 onClick={handleEditSave}
                                 disabled={isSaving}
                                 className="btn-premium-shine"
                                 style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', borderRadius: '4px' }}
                             >
                                 {isSaving ? 'Saving...' : 'Update Transaction'}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay: Add Transaction */}
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
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '450px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Add Manual Transaction</h3>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Title</label>
                                <input 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Starbucks Coffee"
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
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                    <DatePicker 
                                        value={formData.date}
                                        onChange={newDate => setFormData({...formData, date: newDate})}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                                    <ModernSelect
                                        value={formData.category}
                                        options={availableCategories.map(cat => ({ id: cat, label: cat }))}
                                        onChange={(val) => setFormData({ ...formData, category: val })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Account</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <ModernSelect
                                            value={formData.accountId}
                                            options={accounts.map(acc => ({ id: acc.id, label: acc.name }))}
                                            onChange={(val) => setFormData({ ...formData, accountId: val })}
                                            placeholder="Select account"
                                        />
                                        <button 
                                            onClick={() => setIsAccOpen(true)}
                                            style={{ padding: '0 12px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontWeight: '700' }}
                                            title="Quick Add Account"
                                        >
                                            +
                                        </button>
                                    </div>
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
                                     fontSize: '0.875rem',
                                     borderRadius: '4px'
                                 }}
                             >
                                 {isSaving ? 'Saving...' : 'Add Transaction'}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay: Manage Accounts */}
            {isAccOpen && (
                <div 
                    onClick={() => setIsAccOpen(false)}
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
                    zIndex: 1100,
                    padding: '20px'
                }}>
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '450px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Manage Accounts</h3>
                            <button onClick={() => setIsAccOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8125rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Create New</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input 
                                        value={accFormData.name}
                                        onChange={e => setAccFormData({...accFormData, name: e.target.value})}
                                        placeholder="Account Name (e.g. HDFC Bank)"
                                        style={{ padding: '0.65rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="number"
                                            value={accFormData.balance}
                                            onChange={e => setAccFormData({...accFormData, balance: e.target.value})}
                                            placeholder="Initial Balance"
                                            style={{ flex: 1, padding: '0.65rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                        />
                                         <button 
                                             onClick={handleAccSave}
                                             disabled={isSaving}
                                             className="btn-premium-shine"
                                             style={{ padding: '0.65rem 1.25rem', fontSize: '0.8125rem', borderRadius: '4px' }}
                                         >
                                             {isSaving ? '...' : 'Add'}
                                         </button>
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.8125rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Your Accounts</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {accounts.length === 0 ? (
                                    <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>No accounts yet</div>
                                ) : (
                                    accounts.map(acc => (
                                        <div key={acc.id} style={{ padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{acc.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{acc.balance.toLocaleString()}</div>
                                            </div>
                                            <button 
                                                onClick={async () => {
                                                    if(confirm(`Delete account "${acc.name}"?`)) {
                                                        await api.delete(`/accounts/${acc.id}`);
                                                        await fetchData();
                                                    }
                                                }}
                                                style={{ padding: '6px', border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>{title}</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search anything"
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                background: '#f8fafc',
                                fontSize: '0.875rem',
                                width: '280px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button 
                        onClick={() => setIsIdOpen(true)}
                        className="btn-premium-shine"
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.875rem'
                        }}
                    >
                        {addButtonLabel}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>From / To</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Account</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>
                                Date & Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                    No transactions found. Start adding your expenses!
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{tx.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#475569' }}>
                                        {(tx as any).account?.name || 'Default Account'}
                                    </td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                                        ₹{tx.amount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '12px 24px' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '4px 10px',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '4px',
                                            fontSize: '0.8125rem',
                                            fontWeight: '500',
                                            color: '#1e293b'
                                        }}>
                                            <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                                            Success
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', position: 'relative' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#475569' }}>
                                                {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <MoreVertical 
                                                size={16} 
                                                style={{ color: '#94a3b8', cursor: 'pointer' }} 
                                                onClick={() => {
                                                    setSelectedTx(tx);
                                                    setIsOptionsOpen(true);
                                                }}
                                            />

                                            {isOptionsOpen && selectedTx?.id === tx.id && (
                                                <div 
                                                    onClick={() => setIsOptionsOpen(false)}
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
                                                }}>
                                                    <div 
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            background: 'white',
                                                            width: '100%',
                                                            maxWidth: '350px',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                                            padding: '1.5rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '1rem'
                                                        }}
                                                    >
                                                        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: '800', textAlign: 'center', color: '#1e293b' }}>Actions</h3>
                                                        <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>{tx.title}</p>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                setEditFormData({
                                                                    id: tx.id,
                                                                    title: tx.title,
                                                                    amount: tx.amount.toString() as any,
                                                                    category: tx.category,
                                                                    date: tx.date,
                                                                    accountId: (tx as any).accountId || ''
                                                                });
                                                                setIsEditOpen(true);
                                                                setIsOptionsOpen(false);
                                                            }}
                                                            className="btn-premium-shine"
                                                            style={{
                                                                padding: '14px',
                                                                borderRadius: '10px',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '700',
                                                                letterSpacing: '0.01em'
                                                            }}
                                                        >
                                                            Edit Transaction
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => {
                                                                handleDelete(tx.id);
                                                                setIsOptionsOpen(false);
                                                            }}
                                                            style={{
                                                                padding: '14px',
                                                                borderRadius: '10px',
                                                                fontSize: '0.9rem',
                                                                fontWeight: '700',
                                                                background: '#fff',
                                                                color: '#ef4444',
                                                                border: '2px solid #fef2f2',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                letterSpacing: '0.01em'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#fef2f2';
                                                                e.currentTarget.style.borderColor = '#fee2e2';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = '#fff';
                                                                e.currentTarget.style.borderColor = '#fef2f2';
                                                            }}
                                                        >
                                                            Delete Transaction
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => setIsOptionsOpen(false)}
                                                            style={{
                                                                marginTop: '0.5rem',
                                                                padding: '8px',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: '600',
                                                                color: '#94a3b8',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Close
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
