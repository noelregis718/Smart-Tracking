import { useState, useEffect } from 'react';
import GoalListItem from '../components/goals/GoalListItem';
import GoalSidebar from '../components/goals/GoalSidebar';
import GoalTransferModal from '../components/goals/GoalTransferModal';
import GoalModal from '../components/goals/GoalModal';
import { GoalTasks } from '../components/goals/GoalTasks';
import api from '../lib/api';
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

// Interface for Account from backend
interface Account {
    id: string;
    name: string;
    balance: number;
}

export const Goals = () => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any>(null);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            const res = await api.get('/goals');
            setGoals(res.data);
            
            // Also fetch accounts here to keep data in sync
            const accRes = await api.get('/accounts');
            setAccounts(accRes.data);
        } catch (error: any) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/goals/${id}`);
            fetchGoals();
        } catch (error: any) {
            console.error('Failed to delete goal:', error);
            alert('Failed to delete goal. Please try again.');
        }
    };

    const handleEditGoal = (goal: any) => {
        setEditingGoal(goal);
        setIsGoalModalOpen(true);
    };

    const handleCloseGoalModal = () => {
        setIsGoalModalOpen(false);
        setEditingGoal(null);
    };

    useEffect(() => {
        fetchGoals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalAvailable = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <div style={{
            maxWidth: '1600px',
            minHeight: '100vh',
            marginTop: 'calc(-1rem + 2mm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem'
        }}>
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                    {/* Left Column */}
                    <div id="all-savings-goals" style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        background: 'white',
                        borderRadius: '4px',
                        padding: '1.5rem',
                        marginTop: '3mm',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        height: '100%'
                    }}>
                        <h1 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', textTransform: 'capitalize' }}>Save up</h1>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading goals...</div>
                        ) : (
                            <>
                                {goals.length > 0 ? (
                                    goals.map((goal, idx) => (
                                        <GoalListItem 
                                            key={goal.id || idx}
                                            {...goal}
                                            isLast={idx === goals.length - 1}
                                            onEdit={handleEditGoal}
                                            onDelete={handleDeleteGoal}
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
                                        borderRadius: '0 0 4px 4px'
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

                    {/* Right Column */}
                    <div id="savings-transfer" style={{ position: 'sticky', top: '2rem', marginTop: '3mm', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <GoalSidebar 
                            totalAvailable={totalAvailable}
                            accounts={accounts.map(a => ({ name: a.name, balance: a.balance, color: '#2563eb' }))}
                            onCreateTransfer={() => setIsTransferModalOpen(true)}
                        />
                    </div>
                </div>

                {/* Integrated Tasks Section - Full Width at Bottom */}
                <div id="my-tasks" style={{ marginTop: '3rem' }}>
                    <GoalTasks title="My Tasks" />
                </div>
            </div>

            <GoalTransferModal 
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                accounts={accounts}
                goals={goals}
                onSuccess={fetchGoals}
            />

            <GoalModal 
                isOpen={isGoalModalOpen}
                onClose={handleCloseGoalModal}
                onSave={fetchGoals}
                goal={editingGoal}
            />
        </div>
    );
};
