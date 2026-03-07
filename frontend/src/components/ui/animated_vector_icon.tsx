import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface AnimatedVectorIconProps {
    type: 'api' | 'support' | 'whiteLabel' | 'categorization' | 'budget' | 'insights' | 'security' | 'ai' | 'accessible' | 'barChart';
    size?: number;
    className?: string;
    color?: string;
}

const iconVariants: Variants = {
    initial: { opacity: 0, y: 5 },
    animate: {
        opacity: 1,
        y: [0, -4, 0],
        transition: {
            opacity: { duration: 0.5 },
            y: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
            }
        }
    }
};

export const AnimatedVectorIcon: React.FC<AnimatedVectorIconProps> = ({ type, size = 24, className = '', color = 'currentColor' }) => {
    const renderIcon = () => {
        const svgProps = {
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: color,
            strokeWidth: "1.5",
            strokeLinecap: "round" as const,
            strokeLinejoin: "round" as const,
            className: className,
            variants: iconVariants,
            initial: "initial",
            animate: "animate"
        };

        switch (type) {
            case 'api':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </motion.svg>
                );
            case 'support':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" />
                        <path d="M18 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-5Z" />
                        <path d="M21 11V9a9 9 0 0 0-18 0v2" />
                    </motion.svg>
                );
            case 'whiteLabel':
                return (
                    <motion.svg {...svgProps}>
                        <path d="m12 19 7-7 3 3-7 7-3-3Z" />
                        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" />
                        <path d="m2 2 20 20" />
                    </motion.svg>
                );
            case 'categorization':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M3 6h18" />
                        <path d="M7 12h10" />
                        <path d="M10 18h4" />
                    </motion.svg>
                );
            case 'budget':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M20 12V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
                        <path d="M16 12h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2Z" />
                        <circle cx="18" cy="14.5" r=".5" fill={color} />
                    </motion.svg>
                );
            case 'insights':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                    </motion.svg>
                );
            case 'security':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                    </motion.svg>
                );
            case 'ai':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M12 8V4H8" />
                        <rect width="16" height="12" x="4" y="8" rx="2" />
                        <path d="M2 14h2" />
                        <path d="M20 14h2" />
                        <path d="M15 13v2" />
                        <path d="M9 13v2" />
                    </motion.svg>
                );
            case 'accessible':
                return (
                    <motion.svg {...svgProps}>
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                        <path d="M12 18h.01" />
                    </motion.svg>
                );
            case 'barChart':
                return (
                    <motion.svg {...svgProps}>
                        <path d="M3 3v18h18" />
                        <rect x="7" y="10" width="3" height="7" rx="1" />
                        <rect x="12" y="6" width="3" height="11" rx="1" />
                        <rect x="17" y="14" width="3" height="3" rx="1" />
                    </motion.svg>
                );
            default:
                return null;
        }
    };

    return renderIcon();
};
