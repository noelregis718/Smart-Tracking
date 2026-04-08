import { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';

interface SavingsBoostProps {
    totalLeft: number;
}

interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
}

export const SavingsBoost = ({ totalLeft }: SavingsBoostProps) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await api.get('/goals');
                setGoals(res.data);
            } catch (error) {
                console.error('Failed to fetch goals for SavingsBoost:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const boost = useMemo(() => {
        if (loading) return null;

        if (goals.length === 0) return {
            color: '#8b5cf6',
            bg: '#f5f3ff',
            title: "First Step: Create a Goal",
            message: "You haven't set any savings goals yet. Having a target increases your chances of saving by 40%!"
        };

        if (totalLeft <= 0) return {
            color: '#64748b',
            bg: '#f1f5f9',
            title: "Balance Alert",
            message: "Your current budget doesn't have a surplus. Watch your expenses to keep your goals alive."
        };

        const topGoal = goals[0];
        const remaining = topGoal.targetAmount - topGoal.currentAmount;

        if (totalLeft >= remaining) return {
            color: '#eab308',
            bg: '#fefce8',
            title: "Goal Completion Possible!",
            message: `You can fully complete your '${topGoal.title}' goal today with your remaining budget of ₹${totalLeft.toLocaleString()}!`
        };

        if (totalLeft >= remaining * 0.5) return {
            color: '#0ea5e9',
            bg: '#f0f9ff',
            title: "Major Accelerator",
            message: `Your current surplus can cover over half of the remaining cost for '${topGoal.title}'. Finish line is in sight!`
        };

        if (remaining > 0 && totalLeft > 100) {
            const monthlyAvg = 1500; // Mock average
            const daysSaved = Math.round((totalLeft / monthlyAvg) * 30);
            if (daysSaved >= 7) return {
                color: '#3b82f6',
                bg: '#eff6ff',
                title: "Time Saver Insight",
                message: `Applying your ₹${totalLeft.toLocaleString()} surplus to '${topGoal.title}' would save you approximately ${daysSaved} days of waiting.`
            };
        }

        const emergencyFund = goals.find(g => g.title.toLowerCase().includes('emergency'));
        if (emergencyFund && (emergencyFund.currentAmount / emergencyFund.targetAmount) < 0.5) return {
            color: '#f97316',
            bg: '#fff7ed',
            title: "Safety First Priority",
            message: "Your Emergency Fund is under 50%. This month's surplus is best applied here for financial security."
        };

        const nearingGoal = goals.find(g => (g.currentAmount / g.targetAmount) >= 0.9 && (g.currentAmount / g.targetAmount) < 1);
        if (nearingGoal) return {
            color: '#d946ef',
            bg: '#fdf4ff',
            title: "Micro-Sprint Opportunity",
            message: `You're at 90%+ for '${nearingGoal.title}'. A small boost will complete this milestone this month!`
        };

        if (goals.length > 3) return {
            color: '#6366f1',
            bg: '#eef2ff',
            title: "Smart Balancer",
            message: "You have many active goals. Consider splitting your surplus 60/40 between your primary and secondary targets."
        };

        if (totalLeft > 5000) return {
            color: '#10b981',
            bg: '#ecfdf5',
            title: "High Savings Month",
            message: `With ₹${totalLeft.toLocaleString()} in surplus, you're on track to your highest monthly progress this year!`
        };

        if (totalLeft > 0) return {
            color: '#22c55e',
            bg: '#f0fdf4',
            title: "Momentum Insight",
            message: `Every bit helps! Your ₹${totalLeft.toLocaleString()} left to budget is a vote for your future self.`
        };

        return {
            color: '#64748b',
            bg: '#f8fafc',
            title: "Next Goal Step",
            message: "Keep managing your expenses to create a surplus and boost your savings goals."
        };
    }, [goals, totalLeft, loading]);

    if (loading || !boost) return null;

    return (
        <div style={{
            background: boost.bg,
            padding: '1rem',
            borderRadius: '12px',
            border: `1px solid ${boost.color}20`,
            marginTop: '0.75rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: boost.color }}>{boost.title}</h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.4', fontWeight: '500' }}>
                {boost.message}
            </p>
        </div>
    );
};
