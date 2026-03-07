import { Card } from '../Card';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const mockChartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 700 },
];

export const InvestmentTrend = () => (
    <Card style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '700' }}>Investment Trend</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: '600' }}>
                <TrendingUp size={16} style={{ display: 'inline', marginRight: '4px' }} /> +4.5%
            </div>
        </div>
        <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.1} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </Card>
);
