import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
}

export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
    const baseStyles = {
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
    };

    const variants = {
        primary: { background: '#3b82f6', color: 'white' },
        secondary: { background: '#f3f4f6', color: '#1f2937' },
        outline: { background: 'transparent', border: '1px solid #d1d5db', color: '#374151' },
    };

    return (
        <button 
            style={{ ...baseStyles, ...variants[variant], ...props.style }} 
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};
