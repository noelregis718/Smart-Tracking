import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
    return (
        <button
            className={`btn btn-${variant} ${className}`}
            {...props}
        >
            {props.children}
        </button>
    );
};
