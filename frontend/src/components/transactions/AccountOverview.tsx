import { useState, useEffect } from 'react';
import { Card } from '../Card';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Plus } from 'lucide-react';

interface Account {
    id: string;
    name: string;
    balance: number;
}

export const AccountOverview = () => {
    useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAccOpen, setIsAccOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [accFormData, setAccFormData] = useState({ name: '', balance: '' });

    const fetchAccounts = async () => {
        try {
            const response = await api.get('/accounts');
            setAccounts(response.data);
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleAccSave = async () => {
        if (!accFormData.name) return;
        setIsSaving(true);
        try {
            await api.post('/accounts', accFormData);
            await fetchAccounts();
            setIsAccOpen(false);
            setAccFormData({ name: '', balance: '' });
        } catch (error) {
            console.error('Account save failed:', error);
            alert('Failed to save account');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <Card style={{ padding: '1.25rem' }}>Loading accounts...</Card>;

    return (
        <Card style={{ padding: '1.25rem', background: 'white', borderRadius: '4px', height: '100%' }}>
            {/* Modal Overlay: Add Account */}
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
                    zIndex: 2000,
                    padding: '20px'
                }}>
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Add New Account</h3>
                            <button onClick={() => setIsAccOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Account Name</label>
                                <input 
                                    value={accFormData.name}
                                    onChange={e => setAccFormData({...accFormData, name: e.target.value})}
                                    placeholder="e.g. HDFC Bank, Cash, Savings"
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Initial Balance (₹)</label>
                                <input 
                                    type="number"
                                    value={accFormData.balance}
                                    onChange={e => setAccFormData({...accFormData, balance: e.target.value})}
                                    placeholder="0.00"
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsAccOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                             <button 
                                onClick={handleAccSave}
                                disabled={isSaving}
                                className="btn-premium-shine"
                                style={{ 
                                    padding: '0.625rem 1.5rem', 
                                    borderRadius: '4px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600', 
                                    cursor: isSaving ? 'not-allowed' : 'pointer' 
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Add Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal Overlay: View Account Details */}
            {isViewModalOpen && selectedAccount && (
                <div 
                    onClick={() => setIsViewModalOpen(false)}
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
                }}>
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '500px',
                            borderRadius: '4px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            position: 'relative'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Account Details</h3>
                            <button onClick={() => setIsViewModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ textAlign: 'center', color: '#10b981' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>₹{selectedAccount.balance.toLocaleString()}</div>
                            </div>
                            
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{selectedAccount.name}</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginTop: '0.25rem' }}>Current Balance (INR)</div>
                            </div>
                            
                            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>Active</div>
                                </div>
                                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Type</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>Bank Account</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setIsViewModalOpen(false)}
                                style={{ padding: '0.625rem 1.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Accounts</h2>
                <button 
                    onClick={() => setIsAccOpen(true)}
                    style={{ border: 'none', background: '#f1f5f9', color: '#1e293b', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                    <Plus size={16} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {accounts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>
                        No accounts added yet.
                    </div>
                ) : (
                    accounts.map((acc) => (
                        <div key={acc.id} style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
                        onClick={() => { setSelectedAccount(acc); setIsViewModalOpen(true); }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {acc.name}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                                            ₹{acc.balance.toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '600', color: '#94a3b8' }}>
                                            INR
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};
