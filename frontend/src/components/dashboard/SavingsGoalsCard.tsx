import { useState, useEffect } from 'react';
import { Card } from '../Card';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis
} from 'recharts';

interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    color: string;
}

export const SavingsGoalsCard = () => {
    useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(res.data);
        } catch (error) {
            console.error('Failed to fetch goals for dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const chartData = goals.map(goal => ({
        name: goal.title,
        value: Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)),
        fill: goal.color,
        displayAmount: goal.targetAmount
    })).slice(0, 4); // Keep top 4 for the layout

    if (loading) return <Card style={{ padding: '1.5rem', background: 'white', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading goals...</Card>;

    return (
        <Card style={{ padding: '1.5rem', background: 'white', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Goals</h2>
            </div>

            {goals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.875rem' }}>
                    No active goals. Start saving today!
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minHeight: '180px' }}>
                        <div style={{ width: '55%', height: '180px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="80%"
                                    innerRadius="50%"
                                    outerRadius="140%"
                                    barSize={12}
                                    data={chartData}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <PolarAngleAxis
                                        type="number"
                                        domain={[0, 100]}
                                        angleAxisId={0}
                                        tick={false}
                                    />
                                    <RadialBar
                                        background={{ fill: '#f1f5f9' }}
                                        dataKey="value"
                                        cornerRadius={10}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', width: '45%' }}>
                            {chartData.map((goal) => (
                                <div key={goal.name}>
                                    <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{goal.name}</div>
                                    <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>₹{goal.displayAmount.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.75rem',
                        marginTop: '1.5rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid #f1f5f9'
                    }}>
                        {chartData.map((goal) => (
                            <div key={goal.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: goal.fill }}></div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{goal.name}</span>
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{goal.value}%</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </Card>
    );
};
