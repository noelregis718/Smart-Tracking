import { LeftToBudget, RecurringPayments } from '../components/budget/BudgetSummary';
import { SpendingByCategory } from '../components/budget/SpendingByCategory';
import { LoanBook, Investments } from '../components/budget/WealthTracking';

export const Budget = () => {
    return (
        <div style={{
            maxWidth: '1600px',
            display: 'flex',
            gap: '2rem',
            minHeight: '100vh'
        }}>
            {/* Main Content (4 / 5) */}
            <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: 'calc(-0.5rem + 3mm)' }}>
                <div id="spending-analysis">
                    <SpendingByCategory />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div id="loan-details" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <LoanBook />
                    </div>
                    <div id="investment-portfolio" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Investments />
                    </div>
                </div>
            </div>

            {/* Sidebar (1 / 5) */}
            <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: 'calc(-0.5rem + 3mm)' }}>
                <div id="budget-summary">
                    <LeftToBudget />
                </div>
                <div id="monthly-subscriptions" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <RecurringPayments />
                </div>
            </div>
        </div>
    );
};
