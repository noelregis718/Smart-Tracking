import { useMemo } from 'react';

interface SpendingPacingProps {
    totalSpent: number;
    totalBudget: number;
}

export const SpendingPacing = ({ totalSpent, totalBudget }: SpendingPacingProps) => {
    const pacingData = useMemo(() => {
        const today = new Date();
        const dayOfMonth = today.getDate();
        const totalDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        const timePercent = (dayOfMonth / totalDays) * 100;
        const budgetPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

        // 10 Conditions based on Date and Pacing
        if (totalBudget === 0) return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "No Budget Set",
            message: "Plan your monthly budget to see your spending pace here!"
        };

        if (dayOfMonth === totalDays) return {
            color: '#0ea5e9',
            bg: '#f0f9ff',
            title: "Last Day Strategy",
            message: budgetPercent > 100 ? "Final day check: You've exceeded your budget, but you can reset fresh tomorrow!" : "Great finish! You've successfully managed your budget through the entire month."
        };

        if (dayOfMonth < 7 && budgetPercent < 10) return {
            color: '#22c55e',
            bg: '#f0fdf4',
            title: "Early Month: Power Start",
            message: "Excellent discipline! You've spent very little so far. This is the perfect start."
        };

        if (dayOfMonth < 7 && budgetPercent > 35) return {
            color: '#f59e0b',
            bg: '#fffbeb',
            title: "Early Month: High Burn",
            message: "Watch out! You've used over 35% of your budget in the first week. Try to slow down."
        };

        if (dayOfMonth < 7) return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "Early Month: Steady Pace",
            message: "You're at a normal pace for the first week. Keep an eye on non-essential spending."
        };

        if (dayOfMonth >= 7 && dayOfMonth <= 20 && budgetPercent < 30) return {
            color: '#22c55e',
            bg: '#f0fdf4',
            title: "Mid-Month: Safe Zone",
            message: "You're well below your time-progress! You've got plenty of breathing room for the rest of the month."
        };

        if (dayOfMonth >= 7 && dayOfMonth <= 20 && budgetPercent > 75) return {
            color: '#ef4444',
            bg: '#fef2f2',
            title: "Mid-Month: High Alert",
            message: "You've spent more than 75% already! It's time to cut back on discretionary items to make it to month-end."
        };

        if (dayOfMonth >= 7 && dayOfMonth <= 20) return {
            color: '#3b82f6',
            bg: '#eff6ff',
            title: "Mid-Month: On Track",
            message: `Your spending (${Math.round(budgetPercent)}%) is roughly in line with the month's progress (${Math.round(timePercent)}%).`
        };

        if (dayOfMonth > 20 && budgetPercent < 60) return {
            color: '#10b981',
            bg: '#ecfdf5',
            title: "Late Month: Surplus Alert",
            message: "Fantastic pacing! You have a large surplus as you enter the final stretch. Consider boosting your savings."
        };

        if (dayOfMonth > 20 && budgetPercent >= 80 && budgetPercent <= 98) return {
            color: '#f97316',
            bg: '#fff7ed',
            title: "Late Month: Tight Grip",
            message: "Money is getting tight for the final week. Focus only on essentials until the month resets."
        };

        if (budgetPercent >= 100) return {
            color: '#ef4444',
            bg: '#fef2f2',
            title: "Over Budget Range",
            message: "You've exceeded your total planned budget. Review your categories to see where the leak is!"
        };

        return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "Budget Status",
            message: "Keep tracking your daily expenses to improve your personalized pacing advice."
        };
    }, [totalSpent, totalBudget]);

    return (
        <div style={{
            background: pacingData.bg,
            padding: '1rem',
            borderRadius: '12px',
            border: `1px solid ${pacingData.color}20`,
            marginTop: '1.25rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: pacingData.color }}>{pacingData.title}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', fontWeight: '500' }}>
                {pacingData.message}
            </p>
        </div>
    );
};
