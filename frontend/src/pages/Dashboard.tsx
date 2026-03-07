import { Card } from '../components/Card';
import {
    DollarSign,
    CreditCard,
    Search
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { TransactionItem } from '../components/dashboard/TransactionItem';
import { InvestmentTrend } from '../components/dashboard/InvestmentTrend';

export const Dashboard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Overview</h1>
            </div>

            {/* Quick Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Main Debit"
                    balance="$12,450.00"
                    number="**** 4823"
                    color="linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"
                />
                <StatCard
                    title="Savings Account"
                    balance="$45,200.32"
                    number="**** 9901"
                    color="linear-gradient(135deg, #22c55e 0%, #10b981 100%)"
                />
                <StatCard
                    title="Total Debt"
                    balance="$2,511.55"
                    number="Credit Cards"
                    color="linear-gradient(135deg, #ff5f1f 0%, #ef4444 100%)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Investment Trend Chart */}
                <InvestmentTrend />

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
