import { useState, useEffect, useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import { ModernSelect } from '../ModernSelect';

interface CategoryData {
    name: string;
    value: number;
    percentage: string;
    totalPercentage: string;
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



export const SpendingByCategory = () => {
    useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [recurring, setRecurring] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [bulkBudgets, setBulkBudgets] = useState<Record<string, string>>({});

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [hoveredData, setHoveredData] = useState<CategoryData | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [timeRange, setTimeRange] = useState<'this_month' | 'all_time'>('all_time');

    const [loans, setLoans] = useState<any[]>([]);
    const [investments, setInvestments] = useState<any[]>([]);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close the category dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const fetchData = async () => {
        try {
            const response = await api.get('/dashboard/summary');
            const data = response.data;
            
            setExpenses(data.expenses || []);
            setBudgets(data.budgets || []);
            setRecurring(data.recurring || []);
            setLoans(data.loans || []);
            setInvestments(data.investments || []);
        } catch (error) {
            console.error('Failed to fetch spending summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        fetchData();
        const timer = setTimeout(() => setIsReady(true), 150);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredExpenses = useMemo(() => {
        if (timeRange === 'all_time') return expenses;
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
        });
    }, [expenses, timeRange]);

    const normalizeCategory = (cat: string) => {
        const c = cat.trim();
        if (c === 'Bills' || c === 'Utilities' || c === 'Bills & Utilities') return 'Bills & Utilities';
        if (c === 'Other' || c === 'Others') return 'Others';
        if (c === 'Health & Fitness' || c === 'Health') return 'Health & Fitness';
        return c;
    };

    const spendingData = useMemo(() => {
        const categoryMap: Record<string, number> = {};

        // 1. Process Expenses (Exclude Income and Investments)
        filteredExpenses.forEach(exp => {
            if (exp.category === 'Income' || exp.category === 'Investments') return;
            const cat = normalizeCategory(exp.category || 'Others');
            categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
        });

        // 2. Add active recurring payments (monthly)
        recurring.filter(r => r.status === 'Active').forEach(rec => {
            if (rec.category === 'Income' || rec.category === 'Investments') return;
            const cat = normalizeCategory(rec.category || 'Others');
            categoryMap[cat] = (categoryMap[cat] || 0) + rec.amount;
        });

        // 3. Add Loans (All Time)
        if (timeRange === 'all_time') {
            const totalLoans = loans.reduce((acc, curr) => acc + curr.amount, 0);
            if (totalLoans > 0) {
                categoryMap['Debt Repayment'] = (categoryMap['Debt Repayment'] || 0) + totalLoans;
            }
        }

        // Ensure all categories that have a budget OR are in categories found are shown
        const budgetedCategories = budgets.map(b => normalizeCategory(b.category));
        
        const allCategoryNames = Array.from(new Set([
            ...budgetedCategories,
            ...Object.keys(categoryMap)
        ])).filter(cat => cat !== 'Income' && cat !== 'Investments');

        const data: CategoryData[] = allCategoryNames.map((name, index) => {
            const value = categoryMap[name] || 0;
            const budgetItem = budgets.find(b => normalizeCategory(b.category) === name);
            const budget = budgetItem?.limit;
            const totalSpent = Object.values(categoryMap).reduce((a, b) => a + b, 0);
            const totalPercentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) + '%' : '0%';

            return {
                name,
                value,
                percentage: (budget && budget > 0) ? ((value / budget) * 100).toFixed(1) + '%' : '0%',
                totalPercentage,
                color: COLORS[index % COLORS.length],
                budget
            };
        });

        return data.sort((a, b) => b.value - a.value);
    }, [filteredExpenses, budgets, recurring, loans, investments, timeRange]);

    const filteredChartData = useMemo(() => {
        if (!selectedCategory) return spendingData.filter(d => d.value > 0);
        const match = spendingData.find(d => d.name === selectedCategory);
        return match ? [match] : [];
    }, [spendingData, selectedCategory]);

    const { totalSpent, totalBudget } = useMemo(() => {
        const spent = spendingData.reduce((acc, curr) => acc + curr.value, 0);
        const budget = budgets.reduce((acc, curr) => acc + curr.limit, 0);
        return { totalSpent: spent, totalBudget: budget };
    }, [spendingData, budgets]);

    const visibleData = showAll ? spendingData : spendingData.slice(0, 12);

    const handleBulkSaveBudgets = async () => {
        try {

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
        <div style={{ background: 'white', borderRadius: '4px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>Loading spending analytics...</div>
        </div>
    );

    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '100%'
        }}>
            {/* Header / Options */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '1rem',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>Spending by category</h2>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <ModernSelect
                        value={timeRange}
                        options={[
                            { id: 'this_month', label: 'This Month' },
                            { id: 'all_time', label: 'All Time' }
                        ]}
                        onChange={(val) => setTimeRange(val as any)}
                        style={{ width: '135px' }}
                    />

                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                color: '#64748b',
                                background: selectedCategory ? '#eff6ff' : 'white',
                                borderColor: selectedCategory ? '#3b82f6' : '#e2e8f0',
                                height: '44px',
                                boxSizing: 'border-box'
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
                                borderRadius: '4px',
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
                borderRadius: '4px',
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
                <div style={{ height: '280px', minHeight: '280px', position: 'relative' }}>
                    {isReady && (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                        <PieChart>
                                <Pie
                                    data={filteredChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={85}
                                    outerRadius={110}
                                    paddingAngle={selectedCategory ? 0 : 2}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="none"
                                    onMouseEnter={(_, index) => setHoveredData(filteredChartData[index])}
                                    onMouseLeave={() => setHoveredData(null)}
                                >
                                    {filteredChartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color} 
                                            style={{ 
                                                filter: (hoveredData && hoveredData.name === entry.name) ? 'brightness(1.1)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={() => null} />
                        </PieChart>
                    </ResponsiveContainer>
                    )}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.8rem', color: hoveredData ? hoveredData.color : '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.2s' }}>
                            {hoveredData ? hoveredData.name : 'Total Spent'}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', transition: 'all 0.2s' }}>
                            ₹{(hoveredData ? hoveredData.value : totalSpent).toLocaleString()}
                        </div>
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
                                    borderRadius: '4px',
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
                                        {item.budget ? (
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                                of ₹{item.budget.toLocaleString()} <span style={{ 
                                                    color: parseFloat(item.percentage) > 100 ? '#ef4444' : '#16a34a',
                                                    fontWeight: '700'
                                                }}>({item.percentage})</span>
                                            </div>
                                        ) : (
                                            (item.name === 'Memberships' || item.name === 'Debt Repayment') && item.value > 0 && (
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                                                     <span style={{ 
                                                        color: '#16a34a',
                                                        fontWeight: '700'
                                                    }}>({item.totalPercentage} of total)</span>
                                                </div>
                                            )
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
                <div 
                    onClick={() => setIsBudgetModalOpen(false)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                        background: 'white', width: '100%', maxWidth: '500px',
                        borderRadius: '4px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column', maxHeight: '85vh'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Budget Planning</h3>
                            <button onClick={() => setIsBudgetModalOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
                        </div>
                        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(() => {
                                const MASTER_CATEGORIES = [
                                    'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
                                    'Bills & Utilities', 'Health & Fitness', 'Travel', 'Education',
                                    'Personal Care', 'General Services', 'General Merchandise',
                                    'Debt Repayment', 'Others'
                                ];
                                const allBudgetable = Array.from(new Set([
                                    ...MASTER_CATEGORIES,
                                    ...spendingData.map(d => d.name),
                                    ...Object.keys(bulkBudgets)
                                ])).filter(cat => cat !== 'Income' && cat !== 'Investments');

                                return (
                                    <>
                                        {allBudgetable.sort().map(catName => (
                                            <div key={catName} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 40px', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderBottom: '1px solid #f8fafc' }}>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{catName}</span>
                                                <input
                                                    type="number" 
                                                    value={bulkBudgets[catName] || ''}
                                                    onChange={e => setBulkBudgets(prev => ({ ...prev, [catName]: e.target.value }))}
                                                    placeholder="0.00"
                                                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', textAlign: 'right', fontSize: '0.875rem' }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const next = { ...bulkBudgets };
                                                        delete next[catName];
                                                        setBulkBudgets(next);
                                                        const existing = budgets.find(b => normalizeCategory(b.category) === catName);
                                                        if (existing) {
                                                            api.delete('/budgets', { data: { category: catName } }).catch(console.error);
                                                        }
                                                    }}
                                                    style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Create New Category */}
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Create Custom Category</div>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <input 
                                                    id="new-category-name"
                                                    placeholder="Category name..."
                                                    style={{ flex: 1, padding: '0.625rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            const val = (e.currentTarget as HTMLInputElement).value.trim();
                                                            if (val) {
                                                                setBulkBudgets(prev => ({ ...prev, [val]: '' }));
                                                                (e.currentTarget as HTMLInputElement).value = '';
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const input = document.getElementById('new-category-name') as HTMLInputElement;
                                                        const val = input.value.trim();
                                                        if (val) {
                                                            setBulkBudgets(prev => ({ ...prev, [val]: '' }));
                                                            input.value = '';
                                                        }
                                                    }}
                                                    style={{ padding: '0.625rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '600', color: '#0ea5e9', cursor: 'pointer' }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setIsBudgetModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white' }}>Cancel</button>
                            <button onClick={handleBulkSaveBudgets} className="btn-premium-shine" style={{ padding: '0.5rem 1.5rem' }}>Save All</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
