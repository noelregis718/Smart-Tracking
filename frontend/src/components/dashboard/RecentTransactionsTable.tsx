import { Card } from '../Card';
import {
    Search,
    ArrowUpDown,
    MoreVertical,
    Columns
} from 'lucide-react';

interface Transaction {
    id: string;
    fromTo: string;
    account: string;
    amount: string;
    status: 'Success' | 'Pending' | 'Failed';
    date: string;
    avatar: string;
    details: string;
}

const transactions: Transaction[] = [
    {
        id: '1',
        fromTo: 'Transfer to Alina',
        details: 'To 5642 ... 0647',
        account: 'Checking',
        amount: '-2,300.00',
        status: 'Success',
        date: 'Feb 03, 2027',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
        id: '2',
        fromTo: 'Received from Ellie',
        details: 'From 2451 ... 6925',
        account: 'Checking',
        amount: '+1,200.00',
        status: 'Success',
        date: 'Feb 01, 2027',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
        id: '3',
        fromTo: 'Received from Alex',
        details: 'From 4628 ... 1128',
        account: 'AP',
        amount: '+8,500.00',
        status: 'Success',
        date: 'Jan 31, 2027',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
        id: '4',
        fromTo: 'Transfer to Jorn',
        details: 'To 3247 ... 4598',
        account: 'Ops Payroll',
        amount: '-1,765.00',
        status: 'Success',
        date: 'Jan 29, 2027',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
];

export const RecentTransactionsTable = () => {
    return (
        <Card style={{ padding: '0', background: 'white', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ArrowUpDown size={18} style={{ color: '#64748b' }} />
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Recent Transactions</h2>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94a3b8'
                        }} />
                        <input
                            type="text"
                            placeholder="Search anything"
                            style={{
                                padding: '8px 40px 8px 40px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                background: '#f8fafc',
                                fontSize: '0.875rem',
                                width: '280px'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            gap: '4px'
                        }}>
                            <kbd style={{
                                padding: '2px 4px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                fontSize: '0.625rem',
                                color: '#64748b',
                                boxShadow: '0 1px 1px rgba(0,0,0,0.05)'
                            }}>⌘</kbd>
                            <kbd style={{
                                padding: '2px 4px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                fontSize: '0.625rem',
                                color: '#64748b',
                                boxShadow: '0 1px 1px rgba(0,0,0,0.05)'
                            }}>S</kbd>
                        </div>
                    </div>

                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        background: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#64748b',
                        cursor: 'pointer'
                    }}>
                        Show Details
                        <Columns size={16} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 24px', textAlign: 'left', width: '48px' }}>
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '4px'
                                }}></div>
                            </th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>From / To</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Account</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#64748b', position: 'relative' }}>
                                Date & Time
                                <MoreVertical size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 24px' }}>
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '4px'
                                    }}></div>
                                </td>
                                <td style={{ padding: '12px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={tx.avatar} alt={tx.fromTo} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{tx.fromTo}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.details}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#475569' }}>
                                    {tx.account}
                                </td>
                                <td style={{ padding: '12px 24px', fontSize: '0.875rem', fontWeight: '600', color: tx.amount.startsWith('+') ? '#10b981' : '#1e293b' }}>
                                    {tx.amount}
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
                                        <div style={{ width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%' }}></div>
                                        {tx.status}
                                    </div>
                                </td>
                                <td style={{ padding: '12px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#475569' }}>{tx.date}</span>
                                        <MoreVertical size={16} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
