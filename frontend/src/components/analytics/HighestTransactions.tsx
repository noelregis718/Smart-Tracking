import React from 'react';
import { useExpenses } from '../../context/ExpensesContext';

const HighestTransactions: React.FC = () => {
    const { expenses, loading } = useExpenses();
    const currency = '₹';

    if (loading) return <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>Loading highest transactions...</div>;

    const topTransactions = [...expenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topTransactions.map((transaction) => (
                <div key={transaction.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: '1px solid #f8fafc'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{transaction.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {transaction.category} • {new Date(transaction.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>
                        {currency}{transaction.amount.toLocaleString()}
                    </div>
                </div>
            ))}
            {topTransactions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    No transactions found.
                </div>
            )}
        </div>
    );
};

export default HighestTransactions;
