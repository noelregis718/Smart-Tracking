import { Card } from '../Card';
import { CreditCard } from 'lucide-react';

interface StatCardProps {
    title: string;
    balance: string;
    number: string;
    color: string;
}

export const StatCard = ({ title, balance, number, color }: StatCardProps) => (
    <Card style={{
        background: color,
        color: 'white',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '180px',
        border: 'none',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
        }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{balance}</div>
            </div>
            <CreditCard size={24} opacity={0.5} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.875rem', letterSpacing: '2px' }}>{number}</div>
            <div style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 8px',
                borderRadius: '4px'
            }}>VISA</div>
        </div>
    </Card>
);
