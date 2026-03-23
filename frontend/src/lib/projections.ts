/**
 * Financial Projections Utility
 * 
 * This module provides the logic for calculating future spending trends
 * based on historical expense data and recurring monthly commitments.
 */

interface Expense {
    amount: number;
    date: string;
    category: string;
}

interface RecurringPayment {
    amount: number;
    status: string;
}

export interface ProjectionPoint {
    date: string;
    value: number;
    dailyAmount: number;
    isProjected: boolean;
}

/**
 * Calculates a financial projection based on a 30-day average trend.
 * 
 * @param historicalExpenses - List of all past expenses
 * @param recurringPayments - List of active recurring subscriptions
 * @param projectionDays - Number of days to project into the future (7, 15, 30, 90, 180)
 * @returns An array of ProjectionPoint objects spanning from the earliest history to the future date.
 */
export const calculateProjections = (
    historicalExpenses: Expense[],
    historicalIncome: Expense[],
    recurringPayments: RecurringPayment[],
    projectionDays: number
): ProjectionPoint[] => {
    if (historicalExpenses.length === 0 && historicalIncome.length === 0) return [];

    // 1. Group historical data by date
    const dailyHistory: Record<string, { income: number; expense: number }> = {};
    
    historicalExpenses.forEach(item => {
        const d = new Date(item.date);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!dailyHistory[dateStr]) dailyHistory[dateStr] = { income: 0, expense: 0 };
        dailyHistory[dateStr].expense += item.amount;
    });

    historicalIncome.forEach(item => {
        const d = new Date(item.date);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!dailyHistory[dateStr]) dailyHistory[dateStr] = { income: 0, expense: 0 };
        dailyHistory[dateStr].income += item.amount;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Calculate baseline trends (30-day window)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const last30Expenses = historicalExpenses.filter(item => new Date(item.date) >= thirtyDaysAgo);
    const last30Income = historicalIncome.filter(item => new Date(item.date) >= thirtyDaysAgo);
    
    const totalIncome30 = last30Income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense30 = last30Expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const dailyIncomeTrend = totalIncome30 / 30;
    const dailyVariableTrend = totalExpense30 / 30;

    // Fixed recurring expenses
    const activeRecurring = recurringPayments.filter(r => r.status === 'Active');
    const monthlyFixed = activeRecurring.reduce((sum, r) => sum + r.amount, 0);
    const dailyFixed = monthlyFixed / 30;

    const projectedDailyBurn = dailyFixed + dailyVariableTrend;
    const projectedDailyNet = dailyIncomeTrend - projectedDailyBurn;

    // 4. Build return array
    const result: ProjectionPoint[] = [];
    let netCumulative = 0;

    // Initial value for grouping/snapshotting
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayActual = dailyHistory[todayStr] || { income: 0, expense: 0 };
    netCumulative = todayActual.income - todayActual.expense;

    result.push({
        date: today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        value: Math.round(netCumulative),
        dailyAmount: Math.round(netCumulative),
        isProjected: false
    });

    let step = 1;
    if (projectionDays >= 180) step = 30;
    else if (projectionDays >= 90) step = 7;
    else if (projectionDays >= 30) step = 2;
    
    for (let i = 1; i <= projectionDays; i++) {
        const projDate = new Date(today);
        projDate.setDate(today.getDate() + i);
        netCumulative += projectedDailyNet;

        if (i % step === 0 || i === projectionDays) {
            result.push({
                date: projDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
                value: Math.round(netCumulative),
                dailyAmount: Math.round(projectedDailyNet * step),
                isProjected: true
            });
        }
    }

    return result;
};
