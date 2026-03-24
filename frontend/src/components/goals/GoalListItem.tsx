import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface GoalListItemProps {
    id: string;
    title: string;
    status: 'Ahead' | 'On track' | 'At risk' | 'Behind';
    statusDetail?: string;
    targetDate: string;
    currentAmount: number;
    targetAmount: number;
    currency?: string;
    color?: string;
    isLast?: boolean;
    onEdit: (goal: any) => void;
    onDelete: (id: string) => void;
}

const GoalListItem: React.FC<GoalListItemProps> = ({
    id,
    title,
    status,
    statusDetail,
    targetDate,
    currentAmount,
    targetAmount,
    currency = '₹',
    color = '#22c55e',
    isLast = false,
    onEdit,
    onDelete
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
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

    // Handle click away
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen) {
                // If clicked outside the icon and menu triggers
                const target = event.target as HTMLElement;
                if (!target.closest('.fixed-dropdown-menu') && !target.closest('.menu-trigger')) {
                    setIsMenuOpen(false);
                }
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleEdit = () => {
        setIsMenuOpen(false);
        onEdit({ id, title, targetAmount, currentAmount, targetDate, color });
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        onDelete(id);
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
                    <div style={{ position: 'relative' }}>
                        <button 
                            className="menu-trigger"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMenuPosition({ 
                                    top: rect.bottom + window.scrollY, 
                                    left: rect.left + window.scrollX - 110 
                                });
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', borderRadius: '4px', transition: 'background 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                            <MoreVertical size={20} />
                        </button>
                        
                        {isMenuOpen && (
                            <div 
                                className="fixed-dropdown-menu"
                                style={{
                                position: 'fixed',
                                top: menuPosition.top + 4,
                                left: menuPosition.left,
                                background: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                zIndex: 9999,
                                minWidth: '140px',
                                border: '1px solid #f1f5f9',
                                overflow: 'hidden'
                            }}>
                                <button 
                                    onClick={handleEdit}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 12px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: '#1e293b',
                                        textAlign: 'left',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                >
                                    <Edit2 size={14} />
                                    Edit Goal
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 12px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: '#ef4444',
                                        textAlign: 'left',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                >
                                    <Trash2 size={14} />
                                    Delete Goal
                                </button>
                            </div>
                        )}
                    </div>
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
