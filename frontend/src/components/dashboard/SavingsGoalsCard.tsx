import { Card } from '../Card';
import { Target } from 'lucide-react';
import {
    RadialBarChart,
    RadialBar,
    ResponsiveContainer,
    PolarAngleAxis
} from 'recharts';

const data = [
    { name: 'Home', value: 12, fill: '#ef4444' },
    { name: 'Bike', value: 40, fill: '#f59e0b' },
    { name: 'Paris Trip', value: 30, fill: '#3b82f6' },
    { name: 'Setup', value: 6.25, fill: '#94a3b8' },
];

export const SavingsGoalsCard = () => {
    return (
        <Card style={{ padding: '1.5rem', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                <div style={{
                    background: '#f1f5f9',
                    padding: '6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Target size={18} style={{ color: '#1e293b' }} />
                </div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Goals</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minHeight: '180px' }}>
                <div style={{ width: '55%', height: '180px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%"
                            cy="80%"
                            innerRadius="50%"
                            outerRadius="140%"
                            barSize={12}
                            data={data}
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
                    <div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '2px' }}>Home</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>$204,508</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '2px' }}>Bike</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>$1,500</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '2px' }}>Paris Trip</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>$4,000</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '2px' }}>Setup</div>
                        <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#1e293b' }}>$800</div>
                    </div>
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
                {data.map((goal) => (
                    <div key={goal.name}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: goal.fill }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>{goal.name}</span>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{goal.value}%</div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
