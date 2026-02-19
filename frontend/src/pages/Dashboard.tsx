import { Card } from '../components/Card';
import {
    TrendingUp,
    DollarSign,
    CreditCard,
    Search
} from 'lucide-react';
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

export const Dashboard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Overview</h1>
            </div>

            {/* Quick Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <GradientCard
                    title="Main Debit"
                    balance="$12,450.00"
                    number="**** 4823"
                    color="linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
                />
                <GradientCard
                    title="Savings Account"
                    balance="$45,200.32"
                    number="**** 9901"
                    color="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
                />
                <GradientCard
                    title="Total Debt"
                    balance="$2,511.55"
                    number="Credit Cards"
                    color="linear-gradient(135deg, #ff5f1f 0%, #ef4444 100%)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Income/Expense Summary */}
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

                {/* Recent Transactions List */}
                <Card style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Recent Transactions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <TransactionItem title="Apple Store" subtitle="Product Purchase" amount="- $135.00" date="05.01.2024" icon={<Search size={16} />} color="#000" />
                        <TransactionItem title="Starbucks" subtitle="Coffee & Drinks" amount="- $16.50" date="04.01.2024" icon={<DollarSign size={16} />} color="#00704a" />
                        <TransactionItem title="Pharmacy" subtitle="Health Care" amount="- $58.00" date="04.01.2024" icon={<CreditCard size={16} />} color="#ef4444" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

const GradientCard = ({ title, balance, number, color }: any) => (
    <Card style={{
        background: color,
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '180px',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{balance}</div>
            </div>
            <CreditCard size={24} opacity={0.5} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.875rem', letterSpacing: '2px' }}>{number}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>VISA</div>
        </div>
    </Card>
);

const TransactionItem = ({ title, subtitle, amount, date, icon, color }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#f8fafc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                {icon}
            </div>
            <div>
                <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle} • {date}</div>
            </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '700', color: amount.startsWith('+') ? 'var(--success)' : 'var(--text-main)' }}>{amount}</div>
        </div>
    </div>
);
