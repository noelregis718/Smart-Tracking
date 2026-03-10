import { Plus } from 'lucide-react';

export const LoanBook = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Loan Book</h3>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#f1f5f9',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}>
                    <Plus size={14} /> Add Loan
                </button>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
            }}>
                <LoanEntry name="Auto Loan" amount={12500} total={15000} color="#0ea5e9" />
                <LoanEntry name="Student Loan" amount={28400} total={40000} color="#f59e0b" />
                <LoanEntry name="Personal Loan" amount={1200} total={5000} color="#22c55e" last />
            </div>
        </div>
    );
};

export const Investments = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            height: '100%'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Investments</h3>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#f1f5f9',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#64748b',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}>
                    <Plus size={14} /> Add Entry
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
            }}>
                <InvestmentCard
                    title="Stock Portfolio"
                    amount={42500}
                    change={+4.2}
                />
                <InvestmentCard
                    title="Crypto Wallet"
                    amount={8200}
                    change={-1.5}
                />
            </div>
        </div>
    );
};

const LoanEntry = ({ name, amount, total, color, last }: { name: string, amount: number, total: number, color: string, last?: boolean }) => {
    const percentage = (amount / total) * 100;

    return (
        <div style={{
            paddingBottom: last ? 0 : '0.75rem',
            borderBottom: last ? 'none' : '1px solid #f1f5f9'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{name}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>₹{amount.toLocaleString()} <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '0.75rem' }}>/ ₹{total.toLocaleString()}</span></span>
            </div>
            <div style={{
                height: '6px',
                background: '#f1f5f9',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
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

const InvestmentCard = ({ title, amount, change }: { title: string, amount: number, change: number }) => {
    const isPositive = change > 0;

    return (
        <div style={{
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{title}</span>
            </div>

            <div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                    ₹{amount.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: isPositive ? '#16a34a' : '#dc2626'
                    }}>
                        {isPositive ? '+' : ''}{change}%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>All time</span>
                </div>
            </div>
        </div>
    );
};
