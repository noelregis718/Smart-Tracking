import { useAuth } from '../context/AuthContext';
import { NetWorthCard } from '../components/dashboard/NetWorthCard';
import { RecentTransactionsTable } from '../components/dashboard/RecentTransactionsTable';

import { SavingsGoalsCard } from '../components/dashboard/SavingsGoalsCard';

export const Dashboard = () => {
    const { user } = useAuth();

    // Format date as "Wednesday, 26 Feb 2027"
    const formatDate = () => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date());
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-0.5rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '500', margin: 0 }}>
                    Welcome back, <span style={{ fontWeight: '700' }}>{user?.name || 'User'}</span>!
                </h1>
                <span style={{ fontSize: '1.15rem', color: 'black', fontWeight: '500' }}>
                    {formatDate()}
                </span>
            </div>

            <div id="net-worth-tracker" style={{ marginTop: '-0.5rem' }}>
                <NetWorthCard />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem' }}>
                <div id="recent-expenses" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <RecentTransactionsTable title="Recent Transactions" addButtonLabel="Add Transaction" />
                </div>
                <div id="savings-goals-preview" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <SavingsGoalsCard />
                </div>
            </div>

        </div>
    );
};
