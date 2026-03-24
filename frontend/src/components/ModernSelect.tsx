import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    id: string;
    label: string;
}

interface ModernSelectProps {
    value: string;
    options: Option[];
    onChange: (val: string) => void;
    placeholder?: string;
    style?: React.CSSProperties;
}

export const ModernSelect = ({ 
    value, 
    options, 
    onChange, 
    placeholder = "Select option",
    style = {}
}: ModernSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.modern-select-container')) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="modern-select-container" style={{ position: 'relative', width: '100%', ...style }}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '12px 16px',
                    background: 'white',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: selectedOption ? '#1e293b' : '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    borderColor: isOpen ? '#2563eb' : '#e2e8f0',
                    boxShadow: isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none'
                }}
            >
                <span style={{ fontWeight: selectedOption ? '600' : '400' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={18} style={{ 
                    color: '#94a3b8', 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }} />
            </div>

            {isOpen && (
                <>
                    <div 
                        onClick={() => setIsOpen(false)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1999 }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        zIndex: 2000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        padding: '4px'
                    }}>
                        {options.map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => {
                                    onChange(opt.id);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    color: value === opt.id ? '#2563eb' : '#475569',
                                    background: value === opt.id ? '#eff6ff' : 'transparent',
                                    cursor: 'pointer',
                                    fontWeight: value === opt.id ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (value !== opt.id) e.currentTarget.style.background = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                    if (value !== opt.id) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
