import React, { useState, useEffect, useMemo } from 'react';
import { useExpenses } from '../../context/ExpensesContext';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

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
    const { user } = useAuth();
    const { expenses, loading: expensesLoading } = useExpenses();
    const [income, setIncome] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [investments, setInvestments] = useState<any[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currency = '₹';

    const fetchData = async () => {
        try {
            setLoading(true);
            const [incRes, budRes, accRes, loanRes, invRes, goalRes] = await Promise.all([
                api.get('/income'),
                api.get('/budgets'),
                api.get('/accounts'),
                api.get('/loans'),
                api.get('/investments'),
                api.get('/goals')
            ]);
            setIncome(incRes.data);
            setBudgets(budRes.data);
            setAccounts(accRes.data);
            setLoans(loanRes.data);
            setInvestments(invRes.data);
            setGoals(goalRes.data);
        } catch (error) {
            console.error('Failed to fetch data for health score:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const avgSpent = expenses.length > 0 ? totalSpent / expenses.length : 0;
    
    // Robust Financial Health Calculation Logic
    const healthScore = useMemo(() => {
        if (loading || expensesLoading) return 0;

        // 1. Savings Rate (30%)
        let savingsScore = 0;
        if (totalIncome > 0) {
            const savingsRate = (totalIncome - totalSpent) / totalIncome;
            if (savingsRate >= 0.20) savingsScore = 100;
            else if (savingsRate >= 0.10) savingsScore = 80;
            else if (savingsRate > 0) savingsScore = 50;
            else savingsScore = 0;
        }

        // 2. Budget Adherence (20%)
        let budgetScore = 100;
        if (budgets.length > 0) {
            const categoriesSpent: Record<string, number> = {};
            expenses.forEach(e => {
                categoriesSpent[e.category] = (categoriesSpent[e.category] || 0) + e.amount;
            });

            const overBudgetCount = budgets.filter(b => (categoriesSpent[b.category] || 0) > b.limit).length;
            budgetScore = Math.max(0, 100 - (overBudgetCount / budgets.length) * 100);
        }

        // 3. Debt Progress (15%)
        let debtScore = 100;
        if (loans.length > 0) {
            const totalLoanAmount = loans.reduce((sum, l) => sum + l.total, 0);
            const totalPaid = loans.reduce((sum, l) => sum + l.amount, 0);
            debtScore = totalLoanAmount > 0 ? (totalPaid / totalLoanAmount) * 100 : 100;
        }

        // 4. Goal Progress (15%)
        let goalScore = 0;
        if (goals.length > 0) {
            const totalProgress = goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0);
            goalScore = (totalProgress / goals.length) * 100;
        } else {
            goalScore = 100; // No goals is fine
        }

        // 5. Investment Performance (10%)
        let investmentScore = 50; // Neutral baseline
        if (investments.length > 0) {
            const avgChange = investments.reduce((sum, i) => sum + i.change, 0) / investments.length;
            investmentScore = Math.min(100, Math.max(0, 50 + avgChange * 10));
        }

        // 6. Liquidity / Emergency Fund (10%)
        let liquidityScore = 0;
        const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
        const monthlyBurn = totalSpent || 1000; // Avoid division by zero
        const monthsOfRunway = totalBalance / monthlyBurn;
        liquidityScore = Math.min(100, (monthsOfRunway / 3) * 100); // 3 months = 100%

        // Weighted Calculation
        const finalScore = (
            (savingsScore * 0.30) +
            (budgetScore * 0.20) +
            (debtScore * 0.15) +
            (goalScore * 0.15) +
            (investmentScore * 0.10) +
            (liquidityScore * 0.10)
        );

        return Math.round(finalScore);
    }, [loading, expensesLoading, totalSpent, totalIncome, budgets, expenses, loans, goals, investments, accounts]);

    const today = new Date();
    const dayOfMonth = today.getDate();
    const dailyBurn = totalSpent / dayOfMonth;

    if (loading || expensesLoading) return (
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ flex: 1, height: '100px', background: '#f8fafc', borderRadius: '4px' }} />
            ))}
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '1.5rem', width: '100%', marginBottom: '2rem' }}>
            <KPICard 
                title="Total Spent" 
                value={`${currency}${totalSpent.toLocaleString()}`} 
                description="Total expenses tracked"
            />
            <KPICard 
                title="Avg Transaction" 
                value={`${currency}${avgSpent.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                description="Average cost per expense"
            />
            <KPICard 
                title="Daily Burn Rate" 
                value={`${currency}${dailyBurn.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                description="Avg spending per day"
            />
            <KPICard 
                title="Financial Health" 
                value={`${healthScore}/100`} 
                description="Robust multi-factor score"
            />
        </div>
    );
};

export default KPISection;
