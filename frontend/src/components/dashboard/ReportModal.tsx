import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Download, ChevronLeft, ChevronRight, ChevronDown, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES = [
    'Bank Fees', 'Entertainment', 'Food And Drink', 'General Merchandise',
    'General Services', 'Income', 'Loan Payments', 'Medical',
    'Rent And Utilities', 'Transfer In', 'Transfer Out', 'Transportation'
];

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    label: string;
    isActive?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, isActive }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
    const [viewDate, setViewDate] = useState(new Date(value || new Date()));

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const handleDateSelect = (day: number) => {
        const selected = new Date(currentYear, currentMonth, day);
        const yyyy = selected.getFullYear();
        const mm = String(selected.getMonth() + 1).padStart(2, '0');
        const dd = String(selected.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        setIsOpen(false);
        setViewMode('days');
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const firstDay = firstDayOfMonth(currentYear, currentMonth);
    const totalDays = daysInMonth(currentYear, currentMonth);
    const yearRange = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);

    return (
        <div style={{ position: 'relative', flex: 1 }}>
            <div
                onClick={() => {
                    setIsOpen(!isOpen);
                    setViewMode('days');
                }}
                style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: `2px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
                    background: 'white',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#1e293b',
                    minHeight: '52px'
                }}
            >
                <div>
                    <span style={{ color: '#94a3b8', fontSize: '1rem', marginRight: '8px' }}>{label}</span>
                    <span style={{ fontWeight: '600' }}>
                        {value ? new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'Select Date'}
                    </span>
                </div>
                <Calendar size={18} color="#94a3b8" />
            </div>

            {isOpen && (
                <>
                    <div 
                        onClick={() => setIsOpen(false)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3001 }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '10px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        padding: '1.25rem',
                        zIndex: 3002,
                        minWidth: '280px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <button onClick={handlePrevMonth} style={{ border: 'none', background: '#f8fafc', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}><ChevronLeft size={18} /></button>
                            <div style={{ display: 'flex', gap: '6px', fontSize: '1rem', fontWeight: '800' }}>
                                <span 
                                    onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                                    style={{ cursor: 'pointer', color: viewMode === 'months' ? '#6366f1' : '#1e293b', padding: '4px 8px', borderRadius: '6px', background: viewMode === 'months' ? '#f5f3ff' : 'transparent' }}
                                >
                                    {monthNames[currentMonth]}
                                </span>
                                <span 
                                    onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                                    style={{ cursor: 'pointer', color: viewMode === 'years' ? '#6366f1' : '#1e293b', padding: '4px 8px', borderRadius: '6px', background: viewMode === 'years' ? '#f5f3ff' : 'transparent' }}
                                >
                                    {currentYear}
                                </span>
                            </div>
                            <button onClick={handleNextMonth} style={{ border: 'none', background: '#f8fafc', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#64748b' }}><ChevronRight size={18} /></button>
                        </div>
                        
                        {viewMode === 'days' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
                                    {dayNames.map(d => (
                                        <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700' }}>{d}</div>
                                    ))}
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}
                                    {Array.from({ length: totalDays }).map((_, i) => {
                                        const day = i + 1;
                                        const d = new Date(currentYear, currentMonth, day);
                                        const dateStr = d.toISOString().split('T')[0];
                                        const isSelected = value === dateStr;
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => handleDateSelect(day)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    borderRadius: '8px',
                                                    background: isSelected ? '#6366f1' : 'transparent',
                                                    color: isSelected ? 'white' : '#1e293b',
                                                    fontWeight: isSelected ? '700' : '500',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = '#f1f5f9')}
                                                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {viewMode === 'months' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {monthNames.map((name, i) => (
                                    <div
                                        key={name}
                                        onClick={() => {
                                            setViewDate(new Date(currentYear, i, 1));
                                            setViewMode('days');
                                        }}
                                        style={{
                                            padding: '12px 8px',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            borderRadius: '8px',
                                            background: currentMonth === i ? '#6366f1' : '#f8fafc',
                                            color: currentMonth === i ? 'white' : '#1e293b',
                                            fontWeight: currentMonth === i ? '700' : '600'
                                        }}
                                    >
                                        {name.substring(0, 3)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {viewMode === 'years' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                {yearRange.map(year => (
                                    <div
                                        key={year}
                                        onClick={() => {
                                            setViewDate(new Date(year, currentMonth, 1));
                                            setViewMode('months');
                                        }}
                                        style={{
                                            padding: '12px 8px',
                                            textAlign: 'center',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            borderRadius: '8px',
                                            background: currentYear === year ? '#6366f1' : '#f8fafc',
                                            color: currentYear === year ? 'white' : '#1e293b',
                                            fontWeight: currentYear === year ? '700' : '600'
                                        }}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
            setStartDate(firstDay);
            setEndDate(lastDay);
            setSelectedCategories(CATEGORIES);
            setIsComplete(false);
            setIsGenerating(false);
            setIsCategoryOpen(false);
            setErrorMessage(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const generatePDF = async () => {
        setErrorMessage(null);
        setIsGenerating(true);
        console.log('Initiating Precise PDF Report Generation...');
        
        try {

            // Detailed Data Aggregation
            const [goalsRes, budgetsRes, accountsRes, investmentsRes, loansRes, recurringRes, tasksRes, expensesRes, incomeRes] = await Promise.all([
                api.get('/goals'),
                api.get('/budgets'),
                api.get('/accounts'),
                api.get('/investments'),
                api.get('/loans'),
                api.get('/recurring'),
                api.get('/tasks'),
                api.get('/expenses'),
                api.get('/income')
            ]);

            const goals = (goalsRes.data || []) as any[];
            const budgets = (budgetsRes.data || []) as any[];
            const accounts = (accountsRes.data || []) as any[];
            const investments = (investmentsRes.data || []) as any[];
            const loans = (loansRes.data || []) as any[];
            const recurring = (recurringRes.data || []) as any[];
            const tasks = (tasksRes.data || []) as any[];
            const expensesRaw = (expensesRes.data || []) as any[];
            const incomeRaw = (incomeRes.data || []) as any[];


            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            // Filtering & Sorting
            const allSortedExpenses = expensesRaw.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const filteredExpenses = allSortedExpenses.filter(e => {
                const d = new Date(e.date);
                return d >= start && d <= end && selectedCategories.includes(e.category);
            });

            const filteredIncome = incomeRaw.filter(inc => {
                const d = new Date(inc.date);
                return d >= start && d <= end;
            });

            // Combine for Highlights
            const allActivity = [
                ...filteredExpenses.map(e => ({ ...e, type: 'Expense' })),
                ...filteredIncome.map(i => ({ ...i, type: 'Income' }))
            ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const recentActivityHighlight = allActivity.slice(0, 5);
            const totalTransactionsAmount = filteredExpenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
            const totalIncomeAmount = filteredIncome.reduce((sum: number, i: any) => sum + Number(i.amount), 0);
            
            const daysInPeriod = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
            const dailyBurnRate = totalTransactionsAmount / daysInPeriod;
            const netCashflow = totalIncomeAmount - totalTransactionsAmount;
            const dailyNetCashflow = netCashflow / daysInPeriod;

            const categorySpending = CATEGORIES.map(cat => {
                const spent = filteredExpenses.filter(e => e.category === cat).reduce((sum: number, e: any) => sum + Number(e.amount), 0);
                const budget = budgets.find(b => b.category === cat)?.limit || 0;
                return { cat, spent, budget };
            }).filter(item => item.spent > 0 || item.budget > 0);

            const doc = new jsPDF();
            const primaryColor = [37, 99, 235] as [number, number, number];

            // PAGE 1: EXECUTIVE SUMMARY
            doc.setFillColor(248, 250, 252);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setFontSize(22);
            doc.setTextColor(30, 41, 59);
            doc.setFont('helvetica', 'bold');
            doc.text('Advanced Financial Audit', 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated for: ${user?.name || 'User'}`, 14, 30);
            doc.text(`Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`, 14, 35);

            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text('Financial Overview', 14, 55);

            const totalBalance = accounts.reduce((sum: number, a: any) => sum + Number(a.balance), 0);
            const totalInvestments = investments.reduce((sum: number, i: any) => sum + Number(i.amount), 0);
            const totalLoans = loans.reduce((sum: number, l: any) => sum + Number(l.total), 0);
            const paidLoans = loans.reduce((sum: number, l: any) => sum + Number(l.amount), 0);

            autoTable(doc, {
                startY: 60,
                head: [['Financial KPI', 'Value (INR)', 'Metric Type']],
                body: [
                    ['Total Period Income', totalIncomeAmount.toLocaleString(), 'Revenue'],
                    ['Total Period Expenses', totalTransactionsAmount.toLocaleString(), 'Expense'],
                    ['Net Period Cashflow', netCashflow.toLocaleString(), netCashflow >= 0 ? 'Surplus' : 'Deficit'],
                    ['Daily Burn Rate (Avg)', dailyBurnRate.toFixed(2), 'Velocity'],
                    ['Net Daily Cashflow', dailyNetCashflow.toFixed(2), 'Velocity'],
                    ['Liquid Net Worth', (totalBalance + totalInvestments - (totalLoans - paidLoans)).toLocaleString(), 'Position']
                ],
                theme: 'striped',
                headStyles: { fillColor: primaryColor }
            });

            // PAGE 1 Highlight: RECENT ACTIVITY
            const recentY = (doc as any).lastAutoTable.finalY + 15;
            doc.setFontSize(14);
            doc.text('Recent Financial Activity (Combined)', 14, recentY);
            autoTable(doc, {
                startY: recentY + 5,
                head: [['Date', 'Title', 'Type', 'Amount (INR)']],
                body: recentActivityHighlight.map((e: any) => [
                    new Date(e.date).toLocaleDateString(),
                    e.title,
                    e.type,
                    `${e.type === 'Income' ? '+' : '-'}${e.amount.toLocaleString()}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [51, 65, 85] as [number, number, number] }
            });

            // Budget Analysis
            const catY = (doc as any).lastAutoTable.finalY + 15;
            if (catY > 230) doc.addPage();
            doc.text('Budget Compliance Status', 14, catY > 230 ? 20 : catY);
            autoTable(doc, {
                startY: catY > 230 ? 25 : catY + 5,
                head: [['Category', 'Spent', 'Planned Limit', 'Variance']],
                body: categorySpending.map(item => [
                    item.cat,
                    item.spent.toLocaleString(),
                    item.budget.toLocaleString(),
                    item.budget > 0 ? `${((item.spent / item.budget) * 100).toFixed(1)}%` : 'N/A'
                ]),
                theme: 'striped',
                headStyles: { fillColor: [71, 85, 105] as [number, number, number] }
            });

            // PAGE 2: ASSET & LIABILITY DETAIL
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Account & Investment Details', 14, 20);
            
            autoTable(doc, {
                startY: 25,
                head: [['Account Name', 'Type', 'Current Balance (INR)']],
                body: accounts.map(a => [a.name, 'Liquid', a.balance.toLocaleString()]),
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129] as [number, number, number] }
            });

            const invY = (doc as any).lastAutoTable.finalY + 12;
            doc.text('Investment Portfolio Asset List', 14, invY);
            autoTable(doc, {
                startY: invY + 5,
                head: [['Asset', 'Asset Change (%)', 'Market Valuation (INR)']],
                body: investments.map(i => [i.title, `${i.change >= 0 ? '+' : ''}${i.change}%`, i.amount.toLocaleString()]),
                theme: 'grid',
                headStyles: { fillColor: [99, 102, 241] as [number, number, number] }
            });

            const loanY = (doc as any).lastAutoTable.finalY + 12;
            doc.text('Loan Breakdown & Exposure', 14, loanY);
            autoTable(doc, {
                startY: loanY + 5,
                head: [['Lender/Loan Name', 'Paid Amount', 'Total Liability', 'Remaining']],
                body: loans.map(l => [
                    l.name, 
                    l.amount.toLocaleString(), 
                    l.total.toLocaleString(), 
                    (l.total - l.amount).toLocaleString()
                ]),
                theme: 'striped',
                headStyles: { fillColor: [239, 68, 68] as [number, number, number] }
            });

            // PAGE 3: COMPLIANCE & GOALS
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Savings Goals & Commitments', 14, 20);

            // Savings Goals Section (Restored)
            autoTable(doc, {
                startY: 25,
                head: [['Financal Goal', 'Target (INR)', 'Current (INR)', 'Progress (%)']],
                body: goals.map(g => [
                    g.title,
                    g.targetAmount.toLocaleString(),
                    g.currentAmount.toLocaleString(),
                    `${((g.currentAmount / g.targetAmount) * 100).toFixed(1)}%`
                ]),
                theme: 'striped',
                headStyles: { fillColor: [6, 182, 212] as [number, number, number] }
            });

            const recY = (doc as any).lastAutoTable.finalY + 12;
            doc.text('Recurring Payment Commitments', 14, recY);
            autoTable(doc, {
                startY: recY + 5,
                head: [['Subscription', 'Cycle Day', 'Status', 'Current Amount (INR)']],
                body: recurring.map(r => [r.name, `Day ${r.billingDay}`, r.status, r.amount.toLocaleString()]),
                theme: 'grid',
                headStyles: { fillColor: [245, 158, 11] as [number, number, number] }
            });

            const taskY = (doc as any).lastAutoTable.finalY + 12;
            doc.text('Related Administrative Tasks', 14, taskY);
            autoTable(doc, {
                startY: taskY + 5,
                head: [['Objective Title', 'Status', 'Logged On']],
                body: tasks.map(t => [t.title, t.completed ? 'COMPLETED' : 'PENDING', new Date(t.createdAt).toLocaleDateString()]),
                theme: 'striped',
                headStyles: { fillColor: [100, 116, 139] as [number, number, number] }
            });

            // PAGE 4: DETAILED AUDIT LOG
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Full Transaction Audit trail', 14, 20);
            
            autoTable(doc, {
                startY: 25,
                head: [['Date', 'Title', 'Category', 'Account', 'Amount']],
                body: filteredExpenses.map(e => [
                    new Date(e.date).toLocaleDateString(),
                    e.title,
                    e.category,
                    e.account?.name || 'General',
                    `INR ${e.amount.toLocaleString()}`
                ]),
                theme: 'grid',
                headStyles: { fillColor: primaryColor },
                styles: { fontSize: 8 }
            });

            doc.save(`Complete_Audit_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
            setIsGenerating(false);
            setIsComplete(true);
            setTimeout(() => onClose(), 1500);
        } catch (error: any) {
            console.error('PDF Generation Error:', error);
            setErrorMessage(error.message || 'Failed to generate report.');
            setIsGenerating(false);
        }
    };

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3000,
                backdropFilter: 'blur(4px)',
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '650px',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                }}>
                    <X size={24} />
                </button>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <div style={{ 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '1.5px solid #1e293b', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <FileText size={24} color="#1e293b" />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
                        Custom Report Builder
                    </h2>
                </div>

                {!isComplete ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Date Range Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Date Range</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <DatePicker 
                                    label="Start" 
                                    value={startDate} 
                                    isActive={true} 
                                    onChange={setStartDate} 
                                />
                                <DatePicker 
                                    label="End" 
                                    value={endDate} 
                                    isActive={false} 
                                    onChange={setEndDate} 
                                />
                            </div>
                        </div>

                        {/* Categories Section - Modern Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Categories</label>
                            <div style={{ position: 'relative' }}>
                                <div 
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    className="modern-select"
                                    style={{ 
                                        padding: '1rem', 
                                        background: 'white', 
                                        border: '2px solid #e2e8f0', 
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        minHeight: '52px'
                                    }}
                                >
                                    <span style={{ color: selectedCategories.length === CATEGORIES.length ? '#1e293b' : '#6366f1', fontWeight: '600', fontSize: '1rem' }}>
                                        {selectedCategories.length === CATEGORIES.length 
                                            ? 'All Categories' 
                                            : `${selectedCategories.length} Categories Selected`}
                                    </span>
                                    <ChevronDown size={20} style={{ color: '#94a3b8', transform: isCategoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                                </div>

                                {isCategoryOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: 0,
                                        right: 0,
                                        marginBottom: '10px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                        zIndex: 3001,
                                        padding: '1.25rem',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '8px',
                                        maxHeight: '300px',
                                        overflowY: 'auto'
                                    }}>
                                        {CATEGORIES.map(cat => {
                                            const isSelected = selectedCategories.includes(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={(e) => { e.stopPropagation(); toggleCategory(cat); }}
                                                    style={{
                                                        padding: '10px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        background: isSelected ? '#f5f3ff' : 'transparent',
                                                        color: isSelected ? '#6366f1' : '#1e293b',
                                                        textAlign: 'left',
                                                        fontSize: '0.9rem',
                                                        fontWeight: isSelected ? '700' : '500',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {isSelected && '✓ '} {cat}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {errorMessage && (
                            <div style={{ 
                                padding: '1rem', 
                                background: '#fef2f2', 
                                border: '1px solid #fecaca', 
                                borderRadius: '8px', 
                                color: '#b91c1c', 
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={18} />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Export Button */}
                        <div style={{ marginTop: '0.5rem' }}>
                            <button
                                onClick={generatePDF}
                                disabled={isGenerating}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    borderRadius: '10px',
                                    background: isGenerating ? '#e2e8f0' : '#a5b4fc', 
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => !isGenerating && (e.currentTarget.style.background = '#818cf8')}
                                onMouseLeave={(e) => !isGenerating && (e.currentTarget.style.background = '#a5b4fc')}
                            >
                                {isGenerating ? (
                                    <div className="spinner-small" />
                                ) : (
                                    <>
                                        <Download size={24} />
                                        <span>Export to PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                        <div style={{ color: '#6366f1', marginBottom: '1.5rem' }}>
                            <Download size={48} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.5rem' }}>Report Exported!</h3>
                        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>Your custom financial PDF is ready.</p>
                    </div>
                )}
            </div>
            
            <style>{`
                .spinner-small {
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
