import { useState, useEffect } from 'react';
import { Card } from '../Card';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';
import { Plus } from 'lucide-react';

interface Account {
    id: string;
    name: string;
    balance: number;
}

export const AccountOverview = () => {
    const { getToken } = useAuth();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAccOpen, setIsAccOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [accFormData, setAccFormData] = useState({ name: '', balance: '' });

    const fetchAccounts = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
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
    }, [getToken]);

    const handleAccSave = async () => {
        if (!accFormData.name) return;
        setIsSaving(true);
        try {
            const token = await getToken();
            setAuthToken(token);
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
        <Card style={{ padding: '1.25rem', background: 'white', borderRadius: '6px', height: '100%' }}>
            {/* Modal Overlay: Add Account */}
            {isAccOpen && (
                <div style={{
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
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
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
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Initial Balance (₹)</label>
                                <input 
                                    type="number"
                                    value={accFormData.balance}
                                    onChange={e => setAccFormData({...accFormData, balance: e.target.value})}
                                    placeholder="0.00"
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsAccOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleAccSave}
                                disabled={isSaving}
                                style={{ 
                                    padding: '0.625rem 1.25rem', 
                                    borderRadius: '6px', 
                                    border: 'none', 
                                    background: isSaving ? '#94a3b8' : '#1e293b', 
                                    color: 'white', 
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
                    accounts.map(acc => (
                        <div key={acc.id} style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '6px',
                            border: '1px solid #f1f5f9',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>₹{acc.balance.toLocaleString()}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>INR</div>
                            </div>
                            <div style={{
                                background: '#f8fafc',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#1e293b' }}>{acc.name}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};
