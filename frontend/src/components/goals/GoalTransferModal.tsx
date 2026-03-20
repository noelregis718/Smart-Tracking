import React from 'react';
import { X, Calendar } from 'lucide-react';

interface GoalTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: string[];
    goals: string[];
    currency?: string;
}

const GoalTransferModal: React.FC<GoalTransferModalProps> = ({
    isOpen,
    onClose,
    accounts,
    goals,
    currency = '₹'
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
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
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '500px',
                padding: '2rem',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Create goal transfer</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>From</label>
                        <select style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            color: '#1e293b'
                        }}>
                            {accounts.map(acc => <option key={acc}>{acc}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>To</label>
                        <select style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            color: '#1e293b'
                        }}>
                            {goals.map(goal => <option key={goal}>{goal}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Amount</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>{currency}</span>
                            <input
                                type="text"
                                placeholder="Enter amount"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Date</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                defaultValue="12/14/2025"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none'
                                }}
                            />
                            <Calendar size={20} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Include in budget</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>When turned on, this goal transfer will be used in the actuals for your budget.</div>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '24px',
                            background: '#f97316',
                            borderRadius: '12px',
                            position: 'relative',
                            cursor: 'pointer'
                        }}>
                            <div style={{
                                width: '18px',
                                height: '18px',
                                background: 'white',
                                borderRadius: '50%',
                                position: 'absolute',
                                right: '3px',
                                top: '3px'
                            }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
                    <button onClick={onClose} style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>Cancel</button>
                    <button className="shine-button" style={{ 
                        padding: '0.75rem 1.75rem', 
                        borderRadius: '8px', 
                        border: 'none', 
                        background: '#2563eb', 
                        color: 'white', 
                        fontWeight: '800', 
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                    }}>
                        Save goal transfer
                        <style dangerouslySetInnerHTML={{ __html: `
                            .shine-button::after {
                                content: '';
                                position: absolute;
                                top: -50%;
                                left: -50%;
                                width: 200%;
                                height: 200%;
                                background: linear-gradient(
                                    to right,
                                    rgba(255, 255, 255, 0) 0%,
                                    rgba(255, 255, 255, 0.3) 50%,
                                    rgba(255, 255, 255, 0) 100%
                                );
                                transform: rotate(30deg);
                                animation: shine 3s infinite;
                            }
                            @keyframes shine {
                                0% {
                                    transform: translateX(-100%) rotate(30deg);
                                }
                                20%, 100% {
                                    transform: translateX(100%) rotate(30deg);
                                }
                            }
                        ` }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalTransferModal;
