import React from 'react';
import { useExpenses } from '../../context/ExpensesContext';

interface KPICardProps {
    title: string;
    value: string;
    description: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, description }) => (
    <div style={{
        background: 'white',
        borderRadius: '4px',
        padding: '1.25rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    }}>
        <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{title}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginTop: '2px' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>{description}</div>
        </div>
    </div>
);

const KPISection: React.FC = () => {
    const { expenses, loading } = useExpenses();
    const currency = '₹';

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading analytics...</div>;

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgSpent = expenses.length > 0 ? totalSpent / expenses.length : 0;
    
    // Simplified Financial Health Score logic
    // Higher score if average transaction is lower and total spent is reasonable (mocked thresholds)
    const healthScore = Math.max(0, Math.min(100, 100 - (totalSpent / 5000) - (avgSpent / 200)));

    const today = new Date();
    const dayOfMonth = today.getDate();
    const dailyBurn = totalSpent / dayOfMonth;

    return (
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
            <KPICard 
                title="Total Spent" 
                value={`${currency}${totalSpent.toLocaleString()}`} 
                description="Total expenses tracked"
            />
            <KPICard 
                title="Avg Transaction Size" 
                value={`${currency}${avgSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                description="Average cost per expense"
            />
            <KPICard 
                title="Daily Burn Rate" 
                value={`${currency}${dailyBurn.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                description="Average spending per day"
            />
            <KPICard 
                title="Financial Health" 
                value={`${Math.round(healthScore)}/100`} 
                description="Based on spending patterns"
            />
        </div>
    );
};

export default KPISection;
