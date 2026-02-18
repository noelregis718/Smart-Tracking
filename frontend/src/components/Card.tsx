import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {children}
        </div>
    );
};
