import React, { useState, useEffect } from 'react';

type CalcType = 'loan' | 'fd' | 'rd' | 'compound';

const FinancialCalculators: React.FC = () => {
    const [activeCalc, setActiveCalc] = useState<CalcType>('loan');
    
    // Form States
    const [amount, setAmount] = useState<number>(100000);
    const [rate, setRate] = useState<number>(8.5);
    const [tenure, setTenure] = useState<number>(5);
    const [monthly, setMonthly] = useState<number>(5000);
    
    // Result States
    const [result, setResult] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);

    const currency = '₹';

    useEffect(() => {
        calculate();
    }, [activeCalc, amount, rate, tenure, monthly]);

    const calculate = () => {
        if (activeCalc === 'loan') {
            const p = amount;
            const r = rate / 12 / 100;
            const n = tenure * 12;
            const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            setResult(emi);
            setTotalInterest((emi * n) - p);
        } else if (activeCalc === 'fd') {
            const p = amount;
            const r = rate / 100;
            const t = tenure;
            const m = p * Math.pow(1 + r, t);
            setResult(m);
            setTotalInterest(m - p);
        } else if (activeCalc === 'rd') {
            const p = monthly;
            const r = rate / 100;
            const n = tenure * 12;
            const i = r / 4;
            // Simplified RD Maturity formula
            const m = p * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1/3)));
            setResult(m);
            setTotalInterest(m - (p * n));
        } else if (activeCalc === 'compound') {
            const p = amount;
            const r = rate / 100;
            const t = tenure;
            const m = p * Math.pow(1 + r, t);
            setResult(m);
            setTotalInterest(m - p);
        }
    };

    const InputField = ({ label, value, onChange, unit }: any) => (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input 
                    type="number" 
                    value={value} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        paddingRight: '40px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        outline: 'none'
                    }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>
                    {unit}
                </span>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', gap: '1.5rem' }}>
                {(['loan', 'fd', 'rd', 'compound'] as CalcType[]).map((type) => (
                    <button 
                        key={type}
                        onClick={() => setActiveCalc(type)}
                        style={{
                            padding: '4px 0',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.75rem',
                            fontWeight: activeCalc === type ? '800' : '600',
                            color: activeCalc === type ? '#1e293b' : '#94a3b8',
                            borderBottom: activeCalc === type ? '2px solid #1e293b' : 'none',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                <div>
                    {activeCalc === 'loan' && (
                        <>
                            <InputField label="Principal Amount" value={amount} onChange={setAmount} unit={currency} />
                            <InputField label="Interest Rate" value={rate} onChange={setRate} unit="%" />
                            <InputField label="Tenure" value={tenure} onChange={setTenure} unit="Yrs" />
                        </>
                    )}
                    {activeCalc === 'fd' && (
                        <>
                            <InputField label="Deposit Amount" value={amount} onChange={setAmount} unit={currency} />
                            <InputField label="Interest Rate" value={rate} onChange={setRate} unit="%" />
                            <InputField label="Duration" value={tenure} onChange={setTenure} unit="Yrs" />
                        </>
                    )}
                    {activeCalc === 'rd' && (
                        <>
                            <InputField label="Monthly Deposit" value={monthly} onChange={setMonthly} unit={currency} />
                            <InputField label="Interest Rate" value={rate} onChange={setRate} unit="%" />
                            <InputField label="Duration" value={tenure} onChange={setTenure} unit="Yrs" />
                        </>
                    )}
                    {activeCalc === 'compound' && (
                        <>
                            <InputField label="Initial Investment" value={amount} onChange={setAmount} unit={currency} />
                            <InputField label="Interest Rate" value={rate} onChange={setRate} unit="%" />
                            <InputField label="Duration" value={tenure} onChange={setTenure} unit="Yrs" />
                        </>
                    )}
                </div>

                <div style={{ 
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {activeCalc === 'loan' ? 'Monthly EMI' : 'Estimated Return'}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#166534' }}>
                        {currency}{result.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    
                    <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '1rem 0' }} />
                    
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Total Interest
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>
                        {currency}{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>

                    <div style={{ marginTop: '1rem', fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center' }}>
                        Standard calculations apply.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialCalculators;
