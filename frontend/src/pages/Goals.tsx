import { useState } from 'react';
import GoalListItem from '../components/goals/GoalListItem';
import GoalSidebar from '../components/goals/GoalSidebar';
import GoalTransferModal from '../components/goals/GoalTransferModal';

const GOALS_DATA = [
    {
        title: 'Retirement',
        status: 'Ahead' as const,
        targetDate: 'Dec 2045',
        currentAmount: 238246,
        targetAmount: 1000000,
        color: '#22c55e'
    },
    {
        title: 'Emergency fund',
        status: 'Ahead' as const,
        statusDetail: '2 months ahead',
        targetDate: 'Jun 2026',
        currentAmount: 5631,
        targetAmount: 10000,
        color: '#22c55e'
    },
    {
        title: 'Down payment',
        status: 'At risk' as const,
        targetDate: 'Dec 2026',
        currentAmount: 80000,
        targetAmount: 100000,
        color: '#eab308'
    },
    {
        title: 'Vacation',
        status: 'Ahead' as const,
        statusDetail: '7 months ahead',
        targetDate: 'Apr 2027',
        currentAmount: 5000,
        targetAmount: 8000,
        color: '#22c55e'
    }
];

const ACCOUNTS_DATA = [
    { name: "Melanie's 401k", balance: 0, color: '#ef4444' },
    { name: "Melanie's Roth IRA", balance: 0, color: '#22c55e' },
    { name: "Jon's IRA", balance: 0, color: '#6366f1' },
    { name: "BofA Checking", balance: 7372.38, color: '#ef4444' },
    { name: "SoFi Checking", balance: 0, color: '#0ea5e9' },
    { name: "Citi Savings", balance: 80670.94, color: '#0047bb', logoColor: '#0047bb' },
    { name: "Joint Savings", balance: 46418.14, color: '#f97316' }
];

export const Goals = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalAvailable = ACCOUNTS_DATA.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <div style={{
            maxWidth: '1600px',
            minHeight: '100vh',
            marginTop: 'calc(-1rem + 2mm)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', textTransform: 'capitalize' }}>Save up</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: 'white',
                    borderRadius: '12px',
                    padding: '0.5rem 1.5rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: 'fit-content'
                }}>
                    {GOALS_DATA.map((goal, idx) => (
                        <GoalListItem 
                            key={idx}
                            {...goal}
                            isLast={idx === GOALS_DATA.length - 1}
                        />
                    ))}
                </div>

                <div>
                    <GoalSidebar 
                        totalAvailable={totalAvailable}
                        accounts={ACCOUNTS_DATA}
                        onCreateTransfer={() => setIsModalOpen(true)}
                    />
                </div>
            </div>

            <GoalTransferModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                accounts={ACCOUNTS_DATA.map(a => a.name)}
                goals={GOALS_DATA.map(g => g.title)}
            />
        </div>
    );
};
