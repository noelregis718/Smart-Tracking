import { TransactionStatCards } from '../components/transactions/TransactionStatCards';
import { TransactionsOverview } from '../components/transactions/TransactionsOverview';
import { AccountOverview } from '../components/transactions/AccountOverview';
import { RecentTransactionsTable } from '../components/dashboard/RecentTransactionsTable';

export const Transactions = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top row: Stat Cards */}
            <div id="transaction-stats">
                <TransactionStatCards />
            </div>

            {/* Middle row: Overview Chart and Accounts */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '1.5rem',
                alignItems: 'stretch'
            }}>
                <div id="activity-chart">
                    <TransactionsOverview />
                </div>
                <div id="account-overview-sidebar">
                    <AccountOverview />
                </div>
            </div>

            {/* Bottom row: Recent Transactions Table */}
            <div id="full-history">
                <RecentTransactionsTable />
            </div>
        </div>
    );
};
