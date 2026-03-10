import { Card } from '../Card';
import { Info, ChevronDown } from 'lucide-react';
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from 'recharts';

const data = [
    { date: 'Nov 11', value: 663000 },
    { date: 'Nov 12', value: 665000 },
    { date: 'Nov 13', value: 668000 },
    { date: 'Nov 14', value: 673000 },
    { date: 'Nov 15', value: 670000 },
    { date: 'Nov 16', value: 672000 },
    { date: 'Nov 17', value: 674000 },
    { date: 'Nov 18', value: 675000 },
    { date: 'Nov 19', value: 672000 },
    { date: 'Nov 20', value: 679000 },
    { date: 'Nov 21', value: 679500 },
    { date: 'Nov 22', value: 680000 },
    { date: 'Nov 23', value: 683000 },
    { date: 'Nov 24', value: 684000 },
    { date: 'Nov 25', value: 682000 },
    { date: 'Nov 26', value: 685000 },
    { date: 'Nov 27', value: 686500 },
    { date: 'Nov 28', value: 687500 },
    { date: 'Nov 29', value: 688500 },
    { date: 'Nov 30', value: 688500 },
    { date: 'Dec 1', value: 690000 },
    { date: 'Dec 2', value: 692000 },
    { date: 'Dec 3', value: 695000 },
    { date: 'Dec 4', value: 698000 },
    { date: 'Dec 5', value: 698500 },
    { date: 'Dec 6', value: 698500 },
    { date: 'Dec 7', value: 700000 },
    { date: 'Dec 8', value: 702000 },
    { date: 'Dec 9', value: 705000 },
    { date: 'Dec 10', value: 705500 },
    { date: 'Dec 11', value: 706500 },
];

export const NetWorthCard = () => {
    return (
        <Card style={{ padding: '1.5rem', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>NET WORTH</span>
                        <Info size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>$686,547.97</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9375rem', color: '#10b981', fontWeight: '600' }}>
                            <span>↑ $23,292.75 (3.5%)</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '500', marginLeft: '4px' }}>1 month change</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Dropdown label="Net worth performance" />
                    <Dropdown label="1 month" />
                </div>
            </div>

            <div style={{ height: '280px', width: '100%', marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dy={10}
                            interval={2}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                            domain={['dataMin - 5000', 'dataMax + 5000']}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const Dropdown = ({ label }: { label: string }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#1e293b',
        cursor: 'pointer',
        background: 'white'
    }}>
        {label}
        <ChevronDown size={16} style={{ color: '#64748b' }} />
    </div>
);
