import React from 'react';

interface CardProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

export const Card = ({ children, style, className }: CardProps) => {
    return (
        <div 
            className={`card ${className || ''}`} 
            style={{ 
                background: 'white', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                ...style 
            }}
        >
            {children}
        </div>
    );
};
