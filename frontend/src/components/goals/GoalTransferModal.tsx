import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface GoalTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: { id: string; name: string; balance: number }[];
    goals: { id: string; title: string; currentAmount: number; targetAmount: number }[];
    onSuccess: () => void;
    currency?: string;
}

const ModernSelect = ({ 
    label, 
    value, 
    options, 
    onChange, 
    renderOption,
    placeholder = 'Select an option'
}: { 
    label: string; 
    value: string; 
    options: any[]; 
    onChange: (val: string) => void; 
    renderOption: (opt: any) => React.ReactNode;
    placeholder?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.id === value);

    return (
        <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>{label}</label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: selectedOption ? '#1e293b' : '#94a3b8',
                    transition: 'all 0.2s'
                }}
            >
                <span>{selectedOption ? selectedOption.name || selectedOption.title : placeholder}</span>
                <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    zIndex: 2100,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {options.map((opt) => (
                        <div 
                            key={opt.id}
                            onClick={() => {
                                onChange(opt.id);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                background: value === opt.id ? '#f8fafc' : 'white',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseOut={(e) => e.currentTarget.style.background = value === opt.id ? '#f8fafc' : 'white'}
                        >
                            {renderOption(opt)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const GoalTransferModal: React.FC<GoalTransferModalProps> = ({
    isOpen,
    onClose,
    accounts,
    goals,
    onSuccess,
    currency = '₹'
}) => {
    useAuth();
    const [fromAccountId, setFromAccountId] = useState('');
    const [toGoalId, setToGoalId] = useState('');
    const [amount, setAmount] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (accounts.length > 0) setFromAccountId(accounts[0].id);
            if (goals.length > 0) setToGoalId(goals[0].id);
            setAmount('');
            setError(null);
        }
    }, [isOpen, accounts, goals]);

    if (!isOpen) return null;

    const selectedAccount = accounts.find(a => a.id === fromAccountId);
    const selectedGoal = goals.find(g => g.id === toGoalId);

    const handleSave = async () => {
        if (!fromAccountId || !toGoalId || !amount) {
            setError('Please fill in all fields');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (selectedAccount && parsedAmount > selectedAccount.balance) {
            setError(`Insufficient funds. You only have ${currency}${selectedAccount.balance.toLocaleString()} in this account.`);
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await api.post('/goals/transfer', {
                accountId: fromAccountId,
                goalId: toGoalId,
                amount: parsedAmount
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Transfer failed. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                background: 'white',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Create goal transfer</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div style={{ 
                        padding: '1rem', 
                        background: '#fef2f2', 
                        border: '1px solid #fee2e2', 
                        borderRadius: '6px', 
                        color: '#b91c1c', 
                        fontSize: '0.875rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <ModernSelect 
                        label="From Account"
                        value={fromAccountId}
                        options={accounts}
                        onChange={setFromAccountId}
                        renderOption={(acc) => (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{acc.name}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{currency}{acc.balance.toLocaleString()}</span>
                            </div>
                        )}
                    />

                    <ModernSelect 
                        label="To Goal"
                        value={toGoalId}
                        options={goals}
                        onChange={setToGoalId}
                        renderOption={(goal) => (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{goal.title}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                            </div>
                        )}
                    />

                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Amount to Transfer</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: '700' }}>{currency}</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '700'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>New Balance</span>
                            <span style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: '700' }}>
                                {currency}{selectedAccount ? (selectedAccount.balance - (parseFloat(amount) || 0)).toLocaleString() : '0'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>New Goal Total</span>
                            <span style={{ fontSize: '0.75rem', color: '#1e293b', fontWeight: '700' }}>
                                {currency}{selectedGoal ? (selectedGoal.currentAmount + (parseFloat(amount) || 0)).toLocaleString() : '0'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                    <button onClick={onClose} style={{
                        padding: '0.625rem 1.5rem',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        fontWeight: '600',
                        color: '#64748b',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}>Cancel</button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-premium-shine" 
                        style={{ 
                            padding: '0.625rem 2rem', 
                            borderRadius: '4px', 
                            border: 'none', 
                            color: 'white', 
                            fontWeight: '800', 
                            cursor: isSaving ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            opacity: isSaving ? 0.7 : 1
                        }}
                    >
                        {isSaving ? 'Processing...' : 'Transfer Funds'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalTransferModal;
