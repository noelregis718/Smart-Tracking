import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronDown, Share2, Clock, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const spendingData = [
    { name: 'Mortgage', value: 1385.00, percentage: '37.2%', color: '#0ea5e9' },
    { name: 'Loan Repayment', value: 500.23, percentage: '13.4%', color: '#22c55e' },
    { name: 'Garbage', value: 320.47, percentage: '8.6%', color: '#eab308' },
    { name: 'Home Improvement', value: 208.00, percentage: '5.6%', color: '#f97316' },
    { name: 'Insurance', value: 201.45, percentage: '5.4%', color: '#a855f7' },
    { name: 'Pets', value: 150.00, percentage: '4%', color: '#67e8f9' },
    { name: 'Phone', value: 140.00, percentage: '3.8%', color: '#db2777' },
    { name: 'Internet & Cable', value: 115.00, percentage: '3.1%', color: '#4f46e5' },
    { name: 'Groceries', value: 110.00, percentage: '3%', color: '#84cc16' },
    { name: 'Gas & Electric', value: 108.00, percentage: '2.9%', color: '#0284c7' },
    { name: 'Restaurants & Bars', value: 107.35, percentage: '2.9%', color: '#52a353' },
    { name: 'Everything else', value: 373.96, percentage: '10.1%', color: '#facc15' },
];

export const SpendingByCategory = () => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
            }}>
                <div>
                    <div style={{
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '2px'
                    }}>
                        Spending by Category
                    </div>
                    <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        color: '#1e293b'
                    }}>
                        Dec 1, 2024 - Dec 31, 2024
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        cursor: 'pointer'
                    }}>
                        By category <ChevronDown size={13} />
                    </div>

                    <div style={{ height: '18px', width: '1px', background: '#e2e8f0', margin: '0 4px' }} />

                    <div style={{
                        display: 'flex',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        padding: '2px'
                    }}>
                        <div style={{ padding: '3px 8px', background: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Total amounts</div>
                        <div style={{ padding: '3px 8px', fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Change over time</div>
                    </div>

                    <div style={{ height: '18px', width: '1px', background: '#e2e8f0', margin: '0 4px' }} />

                    <div style={{ display: 'flex', gap: '2px' }}>
                        <IconButton><Clock size={14} /></IconButton>
                        <IconButton><BarChart3 size={14} /></IconButton>
                        <IconButton><PieChartIcon size={14} /></IconButton>
                    </div>

                    <div style={{ height: '18px', width: '1px', background: '#e2e8f0', margin: '0 4px' }} />

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        cursor: 'pointer'
                    }}>
                        <Share2 size={13} /> Share
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: '0.5rem',
                alignItems: 'center'
            }}>
                {/* Chart Section */}
                <div style={{ height: '285px', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={spendingData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {spendingData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                formatter={(value: number | undefined) => value !== undefined ? [`$${value.toLocaleString()}`, 'Amount'] : ['', 'Amount']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Inner Label for Hover */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        background: '#1e293b',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        pointerEvents: 'none',
                        display: 'none' // We'll rely on recharts tooltip for now, but this resembles the image's centered tooltip
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9' }} />
                            Mortgage
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: '700' }}>$1,385.00 (37.2%)</div>
                    </div>
                </div>

                {/* Legend/Grid Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.4rem 0.75rem',
                    padding: '0.25rem'
                }}>
                    {spendingData.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1px',
                            padding: '5px 6px',
                            borderRadius: '6px',
                            transition: 'background 0.2s',
                            cursor: 'pointer',
                            background: item.name === 'Mortgage' ? '#f1f5f9' : 'transparent'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: item.color }} />
                                {item.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b', marginLeft: '13px' }}>
                                ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span style={{ color: '#64748b', fontWeight: '500', fontSize: '0.7rem' }}>({item.percentage})</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '1.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#0ea5e9',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                    Show all categories <ChevronDown size={13} />
                </div>
            </div>
        </div>
    );
};

const IconButton = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background 0.2s'
    }}>
        {children}
    </div>
);
