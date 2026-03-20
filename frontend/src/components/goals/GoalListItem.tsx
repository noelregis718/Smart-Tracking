import React from 'react';
import { MoreVertical } from 'lucide-react';

interface GoalListItemProps {
    title: string;
    status: 'Ahead' | 'On track' | 'At risk' | 'Behind';
    statusDetail?: string;
    targetDate: string;
    currentAmount: number;
    targetAmount: number;
    currency?: string;
    color?: string;
    isLast?: boolean;
}

const GoalListItem: React.FC<GoalListItemProps> = ({
    title,
    status,
    statusDetail,
    targetDate,
    currentAmount,
    targetAmount,
    currency = '₹',
    color = '#22c55e',
    isLast = false
}) => {
    const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
    
    const statusColors = {
        'Ahead': '#166534',
        'On track': '#3b82f6',
        'At risk': '#92400e',
        'Behind': '#991b1b'
    };

    const statusBgColors = {
        'Ahead': '#dcfce7',
        'On track': '#dbeafe',
        'At risk': '#fef3c7',
        'Behind': '#fee2e2'
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1.25rem 0',
            background: 'transparent',
            borderRadius: '0',
            boxShadow: 'none',
            borderBottom: isLast ? 'none' : '1px solid #e2e8f0',
            marginBottom: '0',
            gap: '1.25rem'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span style={{ 
                                fontSize: '0.65rem', 
                                fontWeight: '700', 
                                color: statusColors[status],
                                background: statusBgColors[status],
                                padding: '1px 6px',
                                borderRadius: '4px',
                                textTransform: 'uppercase'
                            }}>{status}</span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>{targetDate} {statusDetail && `(${statusDetail})`}</span>
                        </div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                        <MoreVertical size={20} />
                    </button>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>
                        {currency}{currentAmount.toLocaleString()} <span style={{ color: '#64748b', fontWeight: '400' }}>Saved so far</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: statusColors[status] }}>
                        {percentage}%
                    </div>
                </div>

                <div style={{ marginTop: '6px' }}>
                    <div style={{ 
                        height: '6px', 
                        background: '#f1f5f9', 
                        borderRadius: '3px', 
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{ 
                            width: `${percentage}%`, 
                            height: '100%', 
                            background: color,
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        Target: <span style={{ color: '#1e293b', fontWeight: '600' }}>{currency}{targetAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: '600' }}>
                        Remaining: {currency}{(targetAmount - currentAmount).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalListItem;
