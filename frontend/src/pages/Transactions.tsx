import { TransactionStatCards } from '../components/transactions/TransactionStatCards';
import { TransactionsOverview } from '../components/transactions/TransactionsOverview';
import { AccountOverview } from '../components/transactions/AccountOverview';
import { TasksTable } from '../components/transactions/TasksTable';

export const Transactions = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top row: Stat Cards */}
            <TransactionStatCards />

            {/* Middle row: Overview Chart and Accounts */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 320px',
                gap: '1.5rem',
                alignItems: 'stretch'
            }}>
                <TransactionsOverview />
                <AccountOverview />
            </div>

            {/* Bottom row: Tasks Table */}
            <TasksTable />
        </div>
    );
};
