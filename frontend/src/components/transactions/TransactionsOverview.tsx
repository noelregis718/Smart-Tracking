import { Card } from '../Card';
import { NetWorthProjections } from '../dashboard/NetWorthProjections';

export const TransactionsOverview = () => {
    return (
        <Card style={{ padding: '1.25rem', background: 'white', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Overview Projections</h2>
            </div>

            <NetWorthProjections />
        </Card>
    );
};
