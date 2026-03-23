import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';
import { Card } from '../Card';
import {
    MoreVertical,
    Calendar,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const DatePicker = ({ value, onChange }: { value: string, onChange: (date: string) => void }) => {
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
        <div style={{ position: 'relative' }}>
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
                    {new Date(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
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

interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
}

interface Account {
    id: string;
    name: string;
    balance: number;
}

export const RecentTransactionsTable = () => {
    const { getToken } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIdOpen, setIsIdOpen] = useState(false);
    const [isAccOpen, setIsAccOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: new Date().toISOString().split('T')[0],
        accountId: ''
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        title: '',
        amount: '',
        category: 'Food & Dining',
        date: '',
        accountId: ''
    });

    const [accFormData, setAccFormData] = useState({
        name: '',
        balance: ''
    });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const [expRes, accRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/accounts')
            ]);
            setTransactions(expRes.data);
            setAccounts(accRes.data);
            // Pre-select first account if available
            if (accRes.data.length > 0 && !formData.accountId) {
                setFormData(prev => ({ ...prev, accountId: accRes.data[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        if (!formData.title || !formData.amount) return;
        setIsSaving(true);
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.post('/expenses', formData);
            await fetchData();
            setIsIdOpen(false);
            setFormData({
                title: '',
                amount: '',
                category: 'Food & Dining',
                date: new Date().toISOString().split('T')[0],
                accountId: accounts[0]?.id || ''
            });
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save transaction');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAccSave = async () => {
        if (!accFormData.name) return;
        setIsSaving(true);
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.post('/accounts', accFormData);
            await fetchData();
            setIsAccOpen(false);
            setAccFormData({ name: '', balance: '' });
        } catch (error) {
            console.error('Account save failed:', error);
            alert('Failed to save account');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.delete(`/expenses/${id}`);
            await fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete transaction');
        }
    };

    const handleEditSave = async () => {
        if (!editFormData.title || !editFormData.amount) return;
        setIsSaving(true);
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.patch(`/expenses/${editFormData.id}`, editFormData);
            await fetchData();
            setIsEditOpen(false);
            setEditFormData({ id: '', title: '', amount: '', category: 'Food & Dining', date: '', accountId: '' });
        } catch (error) {
            console.error('Edit failed:', error);
            alert('Failed to update transaction');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <Card style={{ padding: '2rem', textAlign: 'center' }}>Loading transactions...</Card>;
    }
    return (
        <Card style={{ padding: '0', background: 'white', overflow: 'visible' }}>
            {/* Modal Overlay: Edit Transaction */}
            {isEditOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '4px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                        position: 'relative'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Edit Expense</h3>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Title</label>
                                <input 
                                    value={editFormData.title}
                                    onChange={e => setEditFormData({...editFormData, title: e.target.value})}
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={editFormData.amount}
                                        onChange={e => setEditFormData({...editFormData, amount: e.target.value})}
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                    <DatePicker 
                                        value={editFormData.date.split('T')[0]}
                                        onChange={newDate => setEditFormData({...editFormData, date: newDate})}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                                    <select 
                                        value={editFormData.category}
                                        onChange={e => setEditFormData({...editFormData, category: e.target.value})}
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', fontSize: '0.875rem' }}
                                    >
                                        <option>Food & Dining</option>
                                        <option>Shopping</option>
                                        <option>Transportation</option>
                                        <option>Utilities</option>
                                        <option>Entertainment</option>
                                        <option>Health</option>
                                        <option>Income</option>                                        
                                        <option>Others</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsEditOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                             <button 
                                 onClick={handleEditSave}
                                 disabled={isSaving}
                                 className="btn-premium-shine"
                                 style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem', borderRadius: '4px' }}
                             >
                                 {isSaving ? 'Saving...' : 'Update Expense'}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay: Add Transaction */}
            {isIdOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '4px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                        position: 'relative'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Add Manual Expense</h3>
                        </div>
                        
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Title</label>
                                <input 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Starbucks Coffee"
                                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        placeholder="0.00"
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Date</label>
                                    <DatePicker 
                                        value={formData.date}
                                        onChange={newDate => setFormData({...formData, date: newDate})}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="modern-select"
                                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem', background: 'white' }}
                                    >
                                        <option>Food & Dining</option>
                                        <option>Shopping</option>
                                        <option>Transportation</option>
                                        <option>Utilities</option>
                                        <option>Entertainment</option>
                                        <option>Health</option>
                                        <option>Income</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Account</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <select 
                                            value={formData.accountId}
                                            onChange={e => setFormData({...formData, accountId: e.target.value})}
                                            className="modern-select"
                                            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem', background: 'white' }}
                                        >
                                            <option value="">No Account</option>
                                            {accounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => setIsAccOpen(true)}
                                            style={{ padding: '0 12px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontWeight: '700' }}
                                            title="Quick Add Account"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => setIsIdOpen(false)}
                                style={{ padding: '0.625rem 1.25rem', borderRadius: '4px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                             <button 
                                 onClick={handleSave}
                                 disabled={isSaving}
                                 className="btn-premium-shine"
                                 style={{ 
                                     padding: '0.625rem 1.25rem', 
                                     fontSize: '0.875rem',
                                     borderRadius: '4px'
                                 }}
                             >
                                 {isSaving ? 'Saving...' : 'Add Expense'}
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay: Manage Accounts */}
            {isAccOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1100, // Higher than transaction modal
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '450px',
                        borderRadius: '4px',
                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>Manage Accounts</h3>
                            <button onClick={() => setIsAccOpen(false)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                            {/* Create New Account form nested or as section */}
                            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.8125rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Create New</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input 
                                        value={accFormData.name}
                                        onChange={e => setAccFormData({...accFormData, name: e.target.value})}
                                        placeholder="Account Name (e.g. HDFC Bank)"
                                        style={{ padding: '0.65rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="number"
                                            value={accFormData.balance}
                                            onChange={e => setAccFormData({...accFormData, balance: e.target.value})}
                                            placeholder="Initial Balance"
                                            style={{ flex: 1, padding: '0.65rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.875rem' }}
                                        />
                                         <button 
                                             onClick={handleAccSave}
                                             disabled={isSaving}
                                             className="btn-premium-shine"
                                             style={{ padding: '0.65rem 1.25rem', fontSize: '0.8125rem', borderRadius: '4px' }}
                                         >
                                             {isSaving ? '...' : 'Add'}
                                         </button>
                                    </div>
                                </div>
                            </div>

                            {/* List of accounts */}
                            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.8125rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Your Accounts</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {accounts.length === 0 ? (
                                    <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>No accounts yet</div>
                                ) : (
                                    accounts.map(acc => (
                                        <div key={acc.id} style={{ padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#1e293b' }}>{acc.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>₹{acc.balance.toLocaleString()}</div>
                                            </div>
                                            <button 
                                                onClick={async () => {
                                                    if(confirm(`Delete account "${acc.name}"?`)) {
                                                        const token = await getToken();
                                                        setAuthToken(token);
                                                        await api.delete(`/accounts/${acc.id}`);
                                                        await fetchData();
                                                    }
                                                }}
                                                style={{ padding: '6px', border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Recent Expenses</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search anything"
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                background: '#f8fafc',
                                fontSize: '0.875rem',
                                width: '280px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button 
                        onClick={() => setIsIdOpen(true)}
                        className="btn-premium-shine"
                        style={{
                            padding: '8px 16px',
                            fontSize: '0.875rem'
                        }}
                    >
                        Add Expense
                    </button>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>From / To</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Account</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>
                                Date & Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                    No transactions found. Start adding your expenses!
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{tx.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#475569' }}>
                                        {(tx as any).account?.name || 'Default Account'}
                                    </td>
                                    <td style={{ padding: '12px 24px', fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                                        ₹{tx.amount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '12px 24px' }}>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '4px 10px',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '4px',
                                            fontSize: '0.8125rem',
                                            fontWeight: '500',
                                            color: '#1e293b'
                                        }}>
                                            <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                                            Success
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', position: 'relative' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#475569' }}>
                                                {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <MoreVertical 
                                                size={16} 
                                                style={{ color: '#94a3b8', cursor: 'pointer' }} 
                                                onClick={() => setActiveMenu(activeMenu === tx.id ? null : tx.id)}
                                            />

                                            {activeMenu === tx.id && (
                                                <>
                                                    <div 
                                                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
                                                        onClick={() => setActiveMenu(null)}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        right: 0,
                                                        marginTop: '8px',
                                                        background: 'white',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                        padding: '4px',
                                                        zIndex: 100,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        minWidth: '120px'
                                                    }}>
                                                        <button
                                                            onClick={() => {
                                                                setEditFormData({
                                                                    id: tx.id,
                                                                    title: tx.title,
                                                                    amount: tx.amount.toString() as any,
                                                                    category: tx.category,
                                                                    date: tx.date,
                                                                    accountId: (tx as any).accountId || ''
                                                                });
                                                                setIsEditOpen(true);
                                                                setActiveMenu(null);
                                                            }}
                                                            style={{
                                                                padding: '8px 12px',
                                                                textAlign: 'left',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: '600',
                                                                color: '#475569',
                                                                background: 'none',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleDelete(tx.id);
                                                                setActiveMenu(null);
                                                            }}
                                                            style={{
                                                                padding: '8px 12px',
                                                                textAlign: 'left',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: '600',
                                                                color: '#ef4444',
                                                                background: 'none',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
