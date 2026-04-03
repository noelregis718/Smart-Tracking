import { LeftToBudget, RecurringPayments } from '../components/budget/BudgetSummary';
import { SpendingByCategory } from '../components/budget/SpendingByCategory';
import { LoanBook, Investments } from '../components/budget/WealthTracking';

export const Budget = () => {
    return (
        <div style={{
            maxWidth: '1600px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 0.8fr',
            gap: '2rem',
            minHeight: '100vh',
            marginTop: 'calc(-0.5rem + 3mm)'
        }}>
            {/* Top Row: Analysis on the left, Summary on the right */}
            <div id="spending-analysis" style={{ gridColumn: 'span 2' }}>
                <SpendingByCategory />
            </div>
            <div id="budget-summary">
                <LeftToBudget />
            </div>

            {/* Bottom Row: All tracking boxes forced into vertical alignment */}
            <div id="loan-details">
                <LoanBook />
            </div>
            <div id="investment-portfolio">
                <Investments />
            </div>
            <div id="monthly-subscriptions">
                <RecurringPayments />
            </div>
        </div>
    );
};
