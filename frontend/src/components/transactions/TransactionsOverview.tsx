import { useState } from 'react';
import { Card } from '../Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const data = [
    { month: 'Jan', spent: 15000 },
    { month: 'Fev', spent: 25000 },
    { month: 'Mar', spent: 12000 },
    { month: 'Apr', spent: 22000 },
    { month: 'May', spent: 35000 },
    { month: 'Jun', spent: 18000 },
    { month: 'Jul', spent: 41528 },
    { month: 'Aug', spent: 22000 },
    { month: 'Sep', spent: 28000 },
    { month: 'Oct', spent: 25000 },
    { month: 'Nov', spent: 30000 },
    { month: 'Dec', spent: 28000 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#1a1a1a',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                marginBottom: '10px'
            }}>
                <span style={{ color: '#9ca3af', fontWeight: '500' }}>Amount Spent</span>
                <span>${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
        );
    }
    return null;
};

export const TransactionsOverview = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(6); // Default to July like mockup

    const onMouseEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <Card style={{ padding: '1.25rem', background: 'white', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Overview</h2>
            </div>

            <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.9} />
                            </linearGradient>
                            <pattern id="striped-pattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="10" stroke="#3b82f6" strokeWidth="4" opacity="0.2" />
                            </pattern>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'transparent' }}
                            position={{ y: -40 }} // Fixes tooltip above the bars
                        />
                        <Bar
                            dataKey="spent"
                            radius={[4, 4, 0, 0]}
                            barSize={48}
                            onMouseEnter={onMouseEnter}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === activeIndex ? 'url(#barGradient)' : 'url(#striped-pattern)'}
                                    stroke={index === activeIndex ? '#1d4ed8' : 'none'}
                                    strokeWidth={index === activeIndex ? 1 : 0}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
