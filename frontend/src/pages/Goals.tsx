import { useState, useEffect } from 'react';
import GoalListItem from '../components/goals/GoalListItem';
import GoalSidebar from '../components/goals/GoalSidebar';
import GoalTransferModal from '../components/goals/GoalTransferModal';
import GoalModal from '../components/goals/GoalModal';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../lib/api';
import { Plus } from 'lucide-react';

interface Goal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    color: string;
    status: 'Ahead' | 'At risk' | 'Behind';
}

// Initial data removed to use backend data

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
    const { getToken } = useAuth();
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);
            const res = await api.get('/goals');
            setGoals(res.data);
        } catch (error: any) {
            console.error('Failed to fetch goals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, [getToken]);

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
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading goals...</div>
                    ) : (
                        <>
                            {goals.length > 0 ? (
                                goals.map((goal, idx) => (
                                    <GoalListItem 
                                        key={idx}
                                        {...goal}
                                        isLast={idx === goals.length - 1}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No goals found. Create one to get started!</div>
                            )}
                            
                            <button 
                                onClick={() => setIsGoalModalOpen(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '1rem',
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    borderTop: '1px solid #f1f5f9',
                                    color: '#2563eb',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    borderRadius: '0 0 12px 12px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <Plus size={18} />
                                Add Goal
                            </button>
                        </>
                    )}
                </div>

                <div>
                    <GoalSidebar 
                        totalAvailable={totalAvailable}
                        accounts={ACCOUNTS_DATA}
                        onCreateTransfer={() => setIsTransferModalOpen(true)}
                    />
                </div>
            </div>

            <GoalTransferModal 
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                accounts={ACCOUNTS_DATA.map(a => a.name)}
                goals={goals.map(g => g.title)}
            />

            <GoalModal 
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                onSave={fetchGoals}
            />
        </div>
    );
};
