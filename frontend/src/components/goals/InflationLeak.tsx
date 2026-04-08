import { useMemo } from 'react';

interface InflationLeakProps {
    totalAvailable: number;
}

export const InflationLeak = ({ totalAvailable }: InflationLeakProps) => {
    const leakData = useMemo(() => {
        const INFLATION_RATE = 0.065; // 6.5% annual
        const SAVINGS_RATE = 0.035; // 3.5% average savings interest
        const annualLoss = totalAvailable * (INFLATION_RATE - SAVINGS_RATE);
        const monthlyLoss = annualLoss / 12;

        if (totalAvailable === 0) return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "Future Value Ready",
            message: "When you have available funds, I'll help you track their purchasing power here."
        };

        if (totalAvailable > 150000) return {
            color: '#ef4444',
            bg: '#fef2f2',
            title: "High Inflation Leak",
            message: `Keeping ₹${totalAvailable.toLocaleString()} unallocated is costing you approx. ₹${Math.round(annualLoss).toLocaleString()} per year in purchasing power.`
        };

        if (totalAvailable > 75000) return {
            color: '#f97316',
            bg: '#fff7ed',
            title: "Idle Cash Warning",
            message: `Your available ₹${totalAvailable.toLocaleString()} is losing ₹${Math.round(monthlyLoss).toLocaleString()} every month it sits unassigned to the right goal.`
        };

        if (totalAvailable < 5000) return {
            color: '#22c55e',
            bg: '#f0fdf4',
            title: "Efficient Capital",
            message: "Great job keeping your idle cash low! Most of your wealth is likely working for you elsewhere."
        };

        if (annualLoss > 5000) return {
            color: '#f59e0b',
            bg: '#fffbeb',
            title: "Purchasing Power Alert",
            message: `At 6.5% inflation, this balance will buy ₹${Math.round(annualLoss).toLocaleString()} less value by this time next year.`
        };

        if (SAVINGS_RATE > 0.04) return { // Simplified condition
            color: '#3b82f6',
            bg: '#eff6ff',
            title: "Rate Comparison",
            message: "Your current bank interest is doing a decent job, but inflation is still taking a small bite out of these funds."
        };

        if (totalAvailable > 25000) return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "Opportunity Cost",
            message: `The ₹${Math.round(monthlyLoss).toLocaleString()} monthly 'leak' could be covered by moving these funds to a higher-yield investment goal.`
        };

        if (totalAvailable > 10000) return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "Inflation Guard",
            message: "Small amounts leak too! Consider funding your shorter-term goals today to protect this money's current value."
        };

        if (annualLoss < 500) return {
            color: '#10b981',
            bg: '#ecfdf5',
            title: "Safe Balance Range",
            message: "Your current available balance is in a safe range where inflation impact is minimal for now."
        };

        return {
            color: '#6366f1',
            bg: '#eef2ff',
            title: "Money Wisdom",
            message: "Inflation never sleeps. Putting your available ₹" + totalAvailable.toLocaleString() + " into goals today is the best way to beat it."
        };
    }, [totalAvailable]);

    return (
        <div style={{
            background: leakData.bg,
            padding: '1rem',
            borderRadius: '12px',
            border: `1px solid ${leakData.color}20`,
            marginTop: '1rem'
        }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '700', color: leakData.color }}>{leakData.title}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', fontWeight: '500' }}>
                {leakData.message}
            </p>
        </div>
    );
};
