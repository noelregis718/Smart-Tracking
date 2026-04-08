import React from 'react';
import { InflationLeak } from './InflationLeak';
import { TurboSimulation } from './TurboSimulation';

interface GoalSidebarProps {
    totalAvailable: number;
    accounts: {
        name: string;
        balance: number;
        color: string;
        logoColor?: string;
    }[];
    onCreateTransfer: () => void;
    currency?: string;
}

const GoalSidebar: React.FC<GoalSidebarProps> = ({
    totalAvailable,
    accounts,
    onCreateTransfer,
    currency = '₹'
}) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            height: '100%'
        }}>
            <div style={{ 
                background: '#e6f4ea', 
                borderRadius: '4px', 
                padding: '1.5rem', 
                textAlign: 'center' 
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534', marginBottom: '8px' }}>
                    {currency}{totalAvailable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600' }}>
                    Available for goals
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {accounts.map((account, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>{account.name}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>
                            {currency}{account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>

            <button 
                onClick={onCreateTransfer}
                className="shine-button"
                style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                    transition: 'all 0.2s ease'
                }}
            >
                Create goal transfer
                <style dangerouslySetInnerHTML={{ __html: `
                    .shine-button::after {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -60%;
                        width: 20%;
                        height: 200%;
                        background: linear-gradient(
                            to right,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.3) 50%,
                            rgba(255, 255, 255, 0) 100%
                        );
                        transform: rotate(25deg);
                        transition: all 0.6s ease;
                    }
                    .shine-button:hover::after {
                        left: 120%;
                    }
                ` }} />
            </button>

            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                    Smart insights
                </div>
                <InflationLeak totalAvailable={totalAvailable} />
                <TurboSimulation totalAvailable={totalAvailable} />
            </div>
        </div>
    );
};

export default GoalSidebar;
