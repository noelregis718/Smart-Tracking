import { Info } from 'lucide-react';

export const LeftToBudget = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateX(-4mm)'
        }}>
            {/* Header Banner */}
            <div style={{
                background: '#f0fdf4',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                borderBottom: '1px solid #dcfce7'
            }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#166534', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                    ₹3,210
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#15803d', fontSize: '0.9rem', fontWeight: '600' }}>
                    Left to budget <Info size={16} />
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '1rem 0.5rem 0',
                gap: '1rem'
            }}>
                <Tab label="Summary" />
                <Tab label="Income" />
                <Tab label="Expenses" active />
            </div>

            {/* Category Breakdown */}
            <div style={{ padding: '1rem', flex: 1 }}>
                <BudgetCategoryRow
                    label="Fixed"
                    budget={3390}
                    spent={2810}
                    remaining={580}
                    color="#22c55e"
                />
                <BudgetCategoryRow
                    label="Flexible"
                    budget={1420}
                    spent={581}
                    remaining={839}
                    color="#22c55e"
                    overlayColor="#eab308"
                    overlayWidth="40px"
                />
                <BudgetCategoryRow
                    label="Non-Monthly"
                    budget={390}
                    spent={308}
                    remaining={82}
                    color="#22c55e"
                    last
                />
            </div>
        </div>
    );
};

export const RecurringPayments = () => {
    return (
        <div style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            transform: 'translateX(-2mm)'
        }}>
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Recurring Payments</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>14</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Active subscriptions</div>
                </div>
                <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', lineHeight: '1' }}>₹1,240</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Monthly total</div>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                    <span>Subscription Budget Utilization</span>
                    <span style={{ fontWeight: '700', color: '#1e293b' }}>68%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '68%', height: '100%', background: '#8b5cf6', borderRadius: '3px' }} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <RecurringRow label="SaaS Tools" count={6} amount={840} />
                <RecurringRow label="Cloud Services" count={3} amount={320} />
                <RecurringRow label="Memberships" count={5} amount={80} last />
            </div>
        </div>
    );
};

// Keep backward-compat export
export const BudgetSummary = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <LeftToBudget />
        <RecurringPayments />
    </div>
);

const Tab = ({ label, active }: { label: string, active?: boolean }) => (
    <div style={{
        fontSize: '0.8rem',
        fontWeight: '600',
        color: active ? '#1e293b' : '#64748b',
        padding: '6px 14px',
        borderRadius: '100px',
        background: active ? '#f1f5f9' : 'transparent',
        cursor: 'pointer'
    }}>
        {label}
    </div>
);

const BudgetCategoryRow = ({ label, budget, spent, remaining, color, overlayColor, overlayWidth, last }: {
    label: string,
    budget: number,
    spent: number,
    remaining: number,
    color: string,
    overlayColor?: string,
    overlayWidth?: string,
    last?: boolean
}) => {
    const percentage = (spent / budget) * 100;

    return (
        <div style={{
            marginBottom: last ? 0 : '1rem',
            paddingBottom: last ? 0 : '1rem',
            borderBottom: last ? 'none' : '1px solid #f1f5f9'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>{label}</span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>₹{budget.toLocaleString()} budget</span>
            </div>

            <div style={{
                height: '6px',
                background: '#f1f5f9',
                borderRadius: '3px',
                position: 'relative',
                marginBottom: '6px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: color,
                    borderRadius: '3px'
                }} />
                {overlayColor && (
                    <div style={{
                        position: 'absolute',
                        left: `${percentage}%`,
                        top: 0,
                        width: overlayWidth || '6px',
                        height: '100%',
                        background: overlayColor,
                    }} />
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>₹{spent.toLocaleString()} spent</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: overlayColor || '#15803d' }}>₹{remaining.toLocaleString()}</span> remaining
                </span>
            </div>
        </div>
    );
};

const RecurringRow = ({ label, count, amount, last }: { label: string, count: number, amount: number, last?: boolean }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: last ? 'none' : '1px solid #f1f5f9'
    }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{label} ({count})</span>
        <span style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: '700' }}>₹{amount}/mo</span>
    </div>
);
