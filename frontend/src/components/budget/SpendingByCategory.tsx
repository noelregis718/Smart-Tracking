import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@clerk/clerk-react';
import { ChevronDown } from 'lucide-react';
import api, { setAuthToken } from '../../lib/api';

interface CategoryData {
    name: string;
    value: number;
    percentage: string;
    color: string;
    budget?: number;
}

interface Budget {
    category: string;
    limit: number;
}

const COLORS = [
    '#0ea5e9', '#22c55e', '#eab308', '#f97316', '#a855f7',
    '#67e8f9', '#db2777', '#4f46e5', '#84cc16', '#0284c7',
    '#52a353', '#facc15'
];

const DEFAULT_CATEGORIES = [
    "Food & Dining", "Shopping", "Transportation", "Utilities", "Entertainment", "Health", "Others"
];

export const SpendingByCategory = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [bulkBudgets, setBulkBudgets] = useState<Record<string, string>>({});

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchData = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const [expRes, budRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/budgets')
            ]);
            setExpenses(expRes.data);
            setBudgets(budRes.data);
        } catch (error) {
            console.error('Failed to fetch spending data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [getToken]);

    const spendingData = useMemo(() => {
        const categoryMap: Record<string, number> = {};
        let total = 0;

        expenses.forEach(exp => {
            const cat = exp.category || 'Others';
            categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
            total += exp.amount;
        });

        // Ensure all categories that have a budget OR are in DEFAULT_CATEGORIES are shown
        const allCategoryNames = Array.from(new Set([
            ...DEFAULT_CATEGORIES,
            ...budgets.map(b => b.category),
            ...Object.keys(categoryMap)
        ])).filter(cat => cat !== 'Income');

        const data: CategoryData[] = allCategoryNames.map((name, index) => {
            const value = categoryMap[name] || 0;
            const budget = budgets.find(b => b.category === name)?.limit;

            return {
                name,
                value,
                percentage: total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%',
                color: COLORS[index % COLORS.length],
                budget
            };
        });

        return data.sort((a, b) => b.value - a.value);
    }, [expenses, budgets]);

    const filteredChartData = useMemo(() => {
        if (!selectedCategory) return spendingData.filter(d => d.value > 0);
        const match = spendingData.find(d => d.name === selectedCategory);
        return match ? [match] : [];
    }, [spendingData, selectedCategory]);

    const { totalSpent, totalBudget } = useMemo(() => {
        const spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const budget = budgets.reduce((acc, curr) => acc + curr.limit, 0);
        return { totalSpent: spent, totalBudget: budget };
    }, [expenses, budgets]);

    const visibleData = showAll ? spendingData : spendingData.slice(0, 12);

    const handleBulkSaveBudgets = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);

            const budgetsToSave = Object.entries(bulkBudgets)
                .filter(([_, limit]) => limit !== '')
                .map(([category, limit]) => ({
                    category,
                    limit: parseFloat(limit)
                }));

            if (budgetsToSave.length === 0) {
                setIsBudgetModalOpen(false);
                return;
            }

            await api.post('/budgets/bulk', { budgets: budgetsToSave });
            await fetchData();
            setIsBudgetModalOpen(false);
        } catch (error) {
            console.error('Failed to save budgets:', error);
        }
    };

    if (loading) return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>Loading spending analytics...</div>
        </div>
    );

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Header / Options */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>Spending by category</h2>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                color: '#64748b',
                                background: selectedCategory ? '#eff6ff' : 'white',
                                borderColor: selectedCategory ? '#3b82f6' : '#e2e8f0'
                            }}
                        >
                            <span style={{ color: selectedCategory ? '#2563eb' : 'inherit', fontWeight: selectedCategory ? '700' : 'normal' }}>
                                {selectedCategory || 'By category'}
                            </span>
                            <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>

                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '4px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                zIndex: 100,
                                minWidth: '180px',
                                padding: '4px'
                            }}>
                                <div
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setIsDropdownOpen(false);
                                    }}
                                    style={{ padding: '8px 12px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', background: !selectedCategory ? '#f1f5f9' : 'transparent', color: !selectedCategory ? '#2563eb' : '#1e293b', fontWeight: !selectedCategory ? '700' : 'normal' }}
                                >
                                    All Categories
                                </div>
                                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    {spendingData.map(d => (
                                        <div
                                            key={d.name}
                                            onClick={() => {
                                                setSelectedCategory(d.name);
                                                setIsDropdownOpen(false);
                                            }}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                background: selectedCategory === d.name ? '#f1f5f9' : 'transparent',
                                                color: selectedCategory === d.name ? '#2563eb' : '#1e293b',
                                                fontWeight: selectedCategory === d.name ? '700' : 'normal',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color }} />
                                            {d.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            const initial: Record<string, string> = {};
                            budgets.forEach(b => initial[b.category] = b.limit.toString());
                            setBulkBudgets(initial);
                            setIsBudgetModalOpen(true);
                        }}
                        className="btn-premium-shine"
                        style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                    >
                        Plan Budget
                    </button>
                </div>
            </div>

            {/* Budget Summary Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2rem',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #f1f5f9'
            }}>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Spent</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>₹{totalSpent.toLocaleString()}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Budget</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>₹{totalBudget.toLocaleString()}</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget Utilization</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) + '%' : '0%'}
                        </div>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: (totalBudget - totalSpent) >= 0 ? '#22c55e' : '#ef4444'
                        }}>
                            (₹{(totalBudget - totalSpent).toLocaleString()} left)
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(250px, 300px) 1fr',
                gap: '2rem',
                alignItems: 'start'
            }}>
                {/* Chart Section */}
                <div style={{ height: '280px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={filteredChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={85}
                                outerRadius={110}
                                paddingAngle={selectedCategory ? 0 : 2}
                                dataKey="value"
                                stroke="none"
                            >
                                {filteredChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: 'white' }}
                                itemStyle={{ color: 'white' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, '']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Spent</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>₹{totalSpent.toLocaleString()}</div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.25rem 2rem',
                    }}>
                        {visibleData.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    background: selectedCategory === item.name ? '#f1f5f9' : 'transparent',
                                    border: selectedCategory === item.name ? '1px solid #e2e8f0' : '1px solid transparent',
                                    opacity: selectedCategory && selectedCategory !== item.name ? 0.5 : 1
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{item.name}</span>
                                </div>
                                <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b' }}>
                                        ₹{item.value.toLocaleString()}
                                    </div>
                                    {item.budget !== undefined && (
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span>of ₹{item.budget.toLocaleString()}</span>
                                            <span style={{
                                                color: item.value > item.budget ? '#ef4444' : '#22c55e',
                                                fontWeight: 'bold'
                                            }}>
                                                ({item.percentage})
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {spendingData.length > 12 && (
                        <div
                            onClick={() => setShowAll(!showAll)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#0ea5e9',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                paddingLeft: '12px'
                            }}
                        >
                            {showAll ? 'Show less' : 'Show all categories'} <ChevronDown size={14} style={{ transform: showAll ? 'rotate(180deg)' : 'none' }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Budget Modal (Keep the existing modal logic) */}
            {isBudgetModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', width: '100%', maxWidth: '500px',
                        borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column', maxHeight: '85vh'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Budget Planning</h3>
                            <button onClick={() => setIsBudgetModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
                        </div>
                        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {DEFAULT_CATEGORIES.map(category => (
                                <div key={category} style={{ display: 'grid', gridTemplateColumns: '1fr 150px', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderBottom: '1px solid #f8fafc' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{category}</span>
                                    <input
                                        type="number" value={bulkBudgets[category] || ''}
                                        onChange={e => setBulkBudgets(prev => ({ ...prev, [category]: e.target.value }))}
                                        placeholder="0.00"
                                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', textAlign: 'right' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setIsBudgetModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: 'white' }}>Cancel</button>
                            <button onClick={handleBulkSaveBudgets} className="btn-premium-shine" style={{ padding: '0.5rem 1.5rem' }}>Save All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
