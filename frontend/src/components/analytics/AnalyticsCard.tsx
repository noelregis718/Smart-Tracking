import React from 'react';

interface AnalyticsCardProps {
    title?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    headerAction?: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, children, style, headerAction }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '4px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            ...style
        }}>
            {(title || headerAction) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    {title && <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{title}</h3>}
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    );
};

export default AnalyticsCard;
