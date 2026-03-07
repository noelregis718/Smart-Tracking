import React from 'react';

interface TransactionItemProps {
    title: string;
    subtitle: string;
    amount: string;
    date: string;
    icon: React.ReactNode;
    color: string;
}

export const TransactionItem = ({ title, subtitle, amount, date, icon, color }: TransactionItemProps) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                width: '40px',
                height: '40px',
                background: '#f8fafc',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle} • {date}</div>
            </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{
                fontWeight: '700',
                color: amount.startsWith('+') ? 'var(--success)' : 'var(--text-main)'
            }}>{amount}</div>
        </div>
    </div>
);
