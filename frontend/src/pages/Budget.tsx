import { LeftToBudget, RecurringPayments } from '../components/budget/BudgetSummary';
import { SpendingByCategory } from '../components/budget/SpendingByCategory';
import { LoanBook, Investments } from '../components/budget/WealthTracking';

export const Budget = () => {
    return (
        <div style={{
            padding: '2rem',
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            gap: '2rem'
        }}>
            {/* Main Content (4 / 5) */}
            <div style={{ flex: '4', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-1.5rem' }}>
                <SpendingByCategory />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <LoanBook />
                    <Investments />
                </div>
            </div>

            {/* Sidebar (1 / 5) */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-1.5rem' }}>
                <LeftToBudget />
                <RecurringPayments />
            </div>
        </div>
    );
};
