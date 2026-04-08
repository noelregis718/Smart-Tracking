import { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';

interface TurboSimulationProps {
    totalAvailable: number;
}

interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
}

export const TurboSimulation = ({ totalAvailable }: TurboSimulationProps) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await api.get('/goals');
                setGoals(res.data);
            } catch (error) {
                console.error('Failed to fetch goals for TurboSimulation:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const simulation = useMemo(() => {
        if (loading || goals.length === 0) return null;

        const mainGoal = goals[0];
        const remaining = mainGoal.targetAmount - mainGoal.currentAmount;
        
        // Let's assume an average monthly contribution of 5000 if not available
        const avgMonthly = 5000;
        const monthsSaved = Math.round(totalAvailable / avgMonthly);

        if (totalAvailable <= 0) return {
            color: '#64748b',
            bg: '#f1f5f9',
            title: "Simulate Results",
            message: "Add money to your accounts to see how much time you can save on your goals!"
        };

        if (totalAvailable >= remaining) return {
            color: '#eab308',
            bg: '#fefce8',
            title: "Turbo Finish!",
            message: `You have enough funds to **finish '${mainGoal.title}' right now**. This would save you ${Math.round(remaining / avgMonthly)} months of waiting.`
        };

        if (monthsSaved >= 12) return {
            color: '#0ea5e9',
            bg: '#f0f9ff',
            title: "Major Time Hack",
            message: `Committing this ₹${totalAvailable.toLocaleString()} would fast-forward your '${mainGoal.title}' progress by over **a full year**.`
        };

        if (monthsSaved >= 6) return {
            color: '#8b5cf6',
            bg: '#f5f3ff',
            title: "Turbo Acceleration",
            message: `Transferring these funds today skips **${monthsSaved} months** of future struggle for your '${mainGoal.title}' goal.`
        };

        const emergencyFund = goals.find(g => g.title.toLowerCase().includes('emergency'));
        if (emergencyFund && (emergencyFund.currentAmount / emergencyFund.targetAmount) < 0.3) return {
            color: '#f97316',
            bg: '#fff7ed',
            title: "Priority Simulation",
            message: `Moving ₹${totalAvailable.toLocaleString()} to 'Emergency Fund' would hit a critical 30% safety milestone instantly.`
        };

        if (goals.length > 2) {
            const split = Math.round(totalAvailable / goals.length);
            return {
                color: '#10b981',
                bg: '#ecfdf5',
                title: "Balanced Boost",
                message: `You could boost **all ${goals.length} goals** by ₹${split.toLocaleString()} each today and save approx. ${Math.round(monthsSaved / 2)} months on each.`
            };
        }

        if (totalAvailable > 25000) return {
            color: '#3b82f6',
            bg: '#eff6ff',
            title: "Quarterly Jump",
            message: `A single transfer today saves you ${monthsSaved} months of incremental saving. Hit your next milestone early!`
        };

        if (monthsSaved >= 1) return {
            color: '#22c55e',
            bg: '#f0fdf4',
            title: "One Month Leap",
            message: `Your ₹${totalAvailable.toLocaleString()} covers an entire month's worth of saving. Buy yourself 30 days of freedom!`
        };

        if (totalAvailable > 0) {
            const daysSaved = Math.round((totalAvailable / avgMonthly) * 30);
            return {
                color: '#64748b',
                bg: '#f8fafc',
                title: "Compound Momentum",
                message: `This surplus represents **${daysSaved} days** of future effort. Put it to work now to keep your motivation high.`
            };
        }

        return {
            color: '#6366f1',
            bg: '#eef2ff',
            title: "Goal Simulator",
            message: "Analyze how your current funds can accelerate your path to financial freedom."
        };
    }, [goals, totalAvailable, loading]);

    if (loading || !simulation) return null;

    return (
        <div style={{
            background: simulation.bg,
            padding: '1rem',
            borderRadius: '12px',
            border: `1px solid ${simulation.color}20`,
            marginTop: '0.75rem'
        }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '700', color: simulation.color }}>{simulation.title}</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', fontWeight: '500' }}>
                {simulation.message}
            </p>
        </div>
    );
};
