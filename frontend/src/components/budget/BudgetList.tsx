import {
    ChevronDown,
    Banknote,
    TrendingUp,
    Car,
    Home,
    Trash2,
    Zap,
    Globe,
    Phone,
    Activity,
    PiggyBank,
    Eye
} from 'lucide-react';

interface BudgetItemProps {
    icon: React.ReactNode;
    label: string;
    budget: number;
    actual: number;
    remaining: number;
    isOver?: boolean;
}

const BudgetItem = ({ icon, label, budget, actual, remaining, isOver }: BudgetItemProps) => {
    const progress = Math.min((actual / budget) * 100, 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ color: '#64748b' }}>{icon}</div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>{label}</span>
                </div>

                <div style={{ width: '120px', textAlign: 'right', paddingRight: '1rem' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        fontWeight: '600'
                    }}>
                        ₹{budget.toLocaleString()}
                    </div>
                </div>

                <div style={{ width: '120px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                    ₹{actual.toLocaleString()}
                </div>

                <div style={{ width: '120px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: isOver ? '#ef4444' : '#22c55e' }}>
                    {remaining < 0 ? `-₹${Math.abs(remaining).toLocaleString()}` : `₹${remaining.toLocaleString()}`}
                </div>
            </div>

            {/* Progress Bar Line */}
            <div style={{ height: '3px', background: '#f1f5f9', position: 'relative', width: '310px', marginLeft: 'auto', marginRight: '0' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${progress}%`,
                    background: isOver ? '#ef4444' : '#22c55e'
                }} />
            </div>
        </div>
    );
};

const SectionHeader = ({ label, budget, actual, remaining, type = 'default' }: { label: string, budget: number, actual: number, remaining: number, type?: 'default' | 'sub' }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 1rem',
        background: type === 'default' ? '#f1f1f1' : 'white',
        borderBottom: '1px solid #f1f5f9'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <ChevronDown size={18} style={{ color: '#64748b' }} />
            <span style={{ fontSize: type === 'default' ? '0.9rem' : '1rem', fontWeight: type === 'default' ? '600' : '700', color: '#1e293b' }}>{label}</span>
        </div>
        <div style={{ width: '120px', textAlign: 'right', fontSize: '1rem', fontWeight: '800', color: '#1e293b', paddingRight: '1rem' }}>
            ₹{budget.toLocaleString()}
        </div>
        <div style={{ width: '120px', textAlign: 'center', fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>
            ₹{actual.toLocaleString()}
        </div>
        <div style={{ width: '120px', textAlign: 'right', fontSize: '1rem', fontWeight: '800', color: '#22c55e' }}>
            ₹{remaining.toLocaleString()}
        </div>
    </div>
);

export const BudgetList = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            marginTop: '1.5rem'
        }}>
            <div style={{ paddingTop: '1.5rem' }}>
                {/* Summary Headers - Pushed down more */}
                <div style={{
                    display: 'flex',
                    padding: '24px 1rem 12px',
                    borderBottom: '1px solid #f1f5f9',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    letterSpacing: '0.1em'
                }}>
                    <div style={{ flex: 1 }}>NAME</div>
                    <div style={{ width: '120px', textAlign: 'center' }}>BUDGET</div>
                    <div style={{ width: '120px', textAlign: 'center' }}>ACTUAL</div>
                    <div style={{ width: '120px', textAlign: 'center' }}>REMAINING</div>
                </div>

                {/* Income Section */}
                <SectionHeader label="Income" budget={8410} actual={4200} remaining={4210} />
                <div style={{ paddingLeft: '1rem' }}>
                    <SectionHeader type="sub" label="Income" budget={8410} actual={4200} remaining={4210} />
                    <BudgetItem icon={<Banknote size={16} />} label="Paychecks" budget={8400} actual={4200} remaining={4200} />
                    <BudgetItem icon={<TrendingUp size={16} />} label="Interest" budget={10} actual={0} remaining={10} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 1rem', color: '#64748b', fontSize: '0.875rem', cursor: 'pointer' }}>
                        <Eye size={16} /> Show 2 unbudgeted
                    </div>
                </div>


                {/* Expenses Section Header with extra large gap */}
                <div style={{ marginTop: '2rem' }}>
                    <SectionHeader label="Expenses" budget={3390} actual={2810} remaining={580} />
                </div>
                <div style={{ paddingLeft: '1rem' }}>
                    <SectionHeader type="sub" label="Fixed" budget={3390} actual={2810} remaining={580} />
                    <BudgetItem icon={<Car size={16} />} label="Auto Payment" budget={580} actual={0} remaining={580} />
                    <BudgetItem icon={<Home size={16} />} label="Mortgage" budget={1380} actual={1385} remaining={-5} isOver={true} />
                    <BudgetItem icon={<Trash2 size={16} />} label="Garbage" budget={320} actual={320} remaining={0} />
                    <BudgetItem icon={<Zap size={16} />} label="Gas & Electric" budget={110} actual={108} remaining={2} />
                    <BudgetItem icon={<Globe size={16} />} label="Internet & Cable" budget={120} actual={115} remaining={5} />
                    <BudgetItem icon={<Phone size={16} />} label="Phone" budget={140} actual={140} remaining={0} />
                    <BudgetItem icon={<Activity size={16} />} label="Fitness" budget={40} actual={40} remaining={0} />
                    <BudgetItem icon={<PiggyBank size={16} />} label="Loan Repayment" budget={500} actual={500} remaining={0} />
                </div>
            </div>
        </div>
    );
};
