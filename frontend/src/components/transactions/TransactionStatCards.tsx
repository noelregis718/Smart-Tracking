import { Card } from '../Card';

export const TransactionStatCards = () => {
    const stats = [
        {
            title: 'Total Transactions',
            amount: '1,284',
            bg: 'white'
        },
        {
            title: 'Average Amount',
            amount: '$245.50',
            bg: 'white'
        },
        {
            title: 'Top Category',
            amount: 'Food & Dining',
            bg: 'white'
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {stats.map((stat, index) => (
                <Card key={index} style={{ padding: '1.25rem', background: stat.bg, borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>{stat.title}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>{stat.amount}</h3>
                    </div>
                </Card>
            ))}
        </div>
    );
};
