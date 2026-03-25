import React, { useState, useEffect, useRef } from 'react';

const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToINR: 1 },
    { code: 'USD', symbol: '$', name: 'US Dollar', rateToINR: 83.25 },
    { code: 'EUR', symbol: '€', name: 'Euro', rateToINR: 90.15 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rateToINR: 105.40 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToINR: 0.55 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToINR: 54.20 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToINR: 61.40 },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', rateToINR: 94.80 },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rateToINR: 11.55 },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToINR: 62.10 },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateToINR: 22.65 },
];

const Dropdown = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selected = currencies.find(c => c.code === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', flex: 1 }}>
            <label style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>{label}</label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px 12px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.2s'
                }}
            >
                <span>{selected?.code} - {selected?.name}</span>
                <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    marginTop: '4px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    maxHeight: '250px',
                    overflowY: 'auto'
                }}>
                    {currencies.map(c => (
                        <div 
                            key={c.code}
                            onClick={() => {
                                onChange(c.code);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '10px 12px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: value === c.code ? '#1e293b' : '#475569',
                                background: value === c.code ? '#f1f5f9' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.1s'
                            }}
                        >
                            {c.code} - {c.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const ConversionTool: React.FC = () => {
    const [amount, setAmount] = useState<number>(1000);
    const [fromCurr, setFromCurr] = useState('INR');
    const [toCurr, setToCurr] = useState('USD');
    const [result, setResult] = useState<number>(0);
    const [rates, setRates] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Call our internal proxy to avoid 429s and keep API key secure
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/external/exchange-rates`);
                const data = await response.json();
                
                if (data && typeof data === 'object') {
                    setRates(data);
                }
            } catch (error) {
                console.error('Failed to fetch rates from internal proxy:', error);
            }
        };

        fetchRates();
    }, []);

    useEffect(() => {
        // Use live rates if available, otherwise fall back to hardcoded defaults
        
        // Note: ExchangeRatesAPI free plan is base EUR.
        // If fromCurr = INR, toCurr = USD:
        // amount_in_EUR = amount / rate_EUR_to_INR
        // result = amount_in_EUR * rate_EUR_to_USD
        
        let final: number;
        if (rates[fromCurr] && rates[toCurr]) {
            // Live rates calculation (Base EUR)
            const amountInEUR = amount / rates[fromCurr];
            final = amountInEUR * rates[toCurr];
        } else {
            // Fallback (Base INR)
            const fromHardcoded = currencies.find(c => c.code === fromCurr)?.rateToINR || 1;
            const toHardcoded = currencies.find(c => c.code === toCurr)?.rateToINR || 1;
            const inINR = amount * fromHardcoded;
            final = inINR / toHardcoded;
        }
        
        setResult(final);
    }, [amount, fromCurr, toCurr, rates]);

    const handleSwap = () => {
        const temp = fromCurr;
        setFromCurr(toCurr);
        setToCurr(temp);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ 
                padding: '1rem 0',
            }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                    <Dropdown label="From" value={fromCurr} onChange={setFromCurr} />

                    <button 
                        onClick={handleSwap}
                        style={{
                            height: '40px',
                            minWidth: '40px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '800',
                            color: '#1e293b',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0'
                        }}
                    >
                        ⇌
                    </button>

                    <Dropdown label="To" value={toCurr} onChange={setToCurr} />
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Amount</label>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                fontSize: '1.25rem',
                                fontWeight: '800',
                                color: '#1e293b',
                                outline: 'none'
                            }}
                        />
                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#64748b' }}>
                            {currencies.find(c => c.code === fromCurr)?.symbol}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>
                        {amount} {fromCurr} =
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-0.025em' }}>
                        {currencies.find(c => c.code === toCurr)?.symbol}{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                        <span>{toCurr}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ConversionTool;
