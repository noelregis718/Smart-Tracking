import { useState } from 'react';
import { 
    Calendar, 
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    style?: React.CSSProperties;
}

export const DatePicker = ({ value, onChange, style = {} }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
    const [viewDate, setViewDate] = useState(new Date(value || new Date()));

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const handleDateSelect = (day: number) => {
        const selected = new Date(currentYear, currentMonth, day);
        const yyyy = selected.getFullYear();
        const mm = String(selected.getMonth() + 1).padStart(2, '0');
        const dd = String(selected.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        setIsOpen(false);
        setViewMode('days');
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const firstDay = firstDayOfMonth(currentYear, currentMonth);
    const totalDays = daysInMonth(currentYear, currentMonth);

    const yearRange = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);

    return (
        <div style={{ position: 'relative', width: '100%', ...style }}>
            <div
                onClick={() => {
                    setIsOpen(!isOpen);
                    setViewMode('days');
                }}
                style={{
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: '#1e293b'
                }}
            >
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {value ? new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'Select date'}
                </span>
                <Calendar size={16} color="#64748b" />
            </div>

            {isOpen && (
                <>
                    <div 
                        onClick={() => setIsOpen(false)}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1999 }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        padding: '1rem',
                        zIndex: 2000,
                        minWidth: '260px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <button onClick={handlePrevMonth} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><ChevronLeft size={18} /></button>
                            <div style={{ display: 'flex', gap: '4px', fontSize: '0.9rem', fontWeight: '700' }}>
                                <span 
                                    onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                                    style={{ cursor: 'pointer', color: viewMode === 'months' ? '#2563eb' : '#1e293b', padding: '2px 4px', borderRadius: '4px', background: viewMode === 'months' ? '#eff6ff' : 'transparent' }}
                                >
                                    {monthNames[currentMonth]}
                                </span>
                                <span 
                                    onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                                    style={{ cursor: 'pointer', color: viewMode === 'years' ? '#2563eb' : '#1e293b', padding: '2px 4px', borderRadius: '4px', background: viewMode === 'years' ? '#eff6ff' : 'transparent' }}
                                >
                                    {currentYear}
                                </span>
                            </div>
                            <button onClick={handleNextMonth} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><ChevronRight size={18} /></button>
                        </div>
                        
                        {viewMode === 'days' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
                                    {dayNames.map(d => (
                                        <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{d}</div>
                                    ))}
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}
                                    {Array.from({ length: totalDays }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isSelected = value === dateStr;
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => handleDateSelect(day)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    background: isSelected ? '#2563eb' : 'transparent',
                                                    color: isSelected ? 'white' : '#1e293b',
                                                    fontWeight: isSelected ? '700' : '500',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = '#f1f5f9')}
                                                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'transparent')}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {viewMode === 'months' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {monthNames.map((name, i) => (
                                    <div
                                        key={name}
                                        onClick={() => {
                                            setViewDate(new Date(currentYear, i, 1));
                                            setViewMode('days');
                                        }}
                                        style={{
                                            padding: '8px',
                                            textAlign: 'center',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            background: currentMonth === i ? '#2563eb' : 'transparent',
                                            color: currentMonth === i ? 'white' : '#1e293b',
                                            fontWeight: currentMonth === i ? '700' : '500'
                                        }}
                                        onMouseEnter={(e) => currentMonth !== i && (e.currentTarget.style.background = '#f1f5f9')}
                                        onMouseLeave={(e) => currentMonth !== i && (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {name.substring(0, 3)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {viewMode === 'years' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                {yearRange.map(year => (
                                    <div
                                        key={year}
                                        onClick={() => {
                                            setViewDate(new Date(year, currentMonth, 1));
                                            setViewMode('months');
                                        }}
                                        style={{
                                            padding: '8px',
                                            textAlign: 'center',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            background: currentYear === year ? '#2563eb' : 'transparent',
                                            color: currentYear === year ? 'white' : '#1e293b',
                                            fontWeight: currentYear === year ? '700' : '500'
                                        }}
                                        onMouseEnter={(e) => currentYear !== year && (e.currentTarget.style.background = '#f1f5f9')}
                                        onMouseLeave={(e) => currentYear !== year && (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
