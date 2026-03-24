import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    goalId?: string;
}

interface GoalTasksProps {
    goalId?: string;
    title?: string;
}

export const GoalTasks: React.FC<GoalTasksProps> = ({ goalId, title = "Goal Tasks" }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks', {
                params: { goalId }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user, goalId]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setIsAdding(true);
        try {
            const response = await api.post('/tasks', {
                title: newTaskTitle,
                goalId
            });
            setTasks([response.data, ...tasks]);
            setNewTaskTitle('');
        } catch (error) {
            console.error('Failed to add task:', error);
        } finally {
            setIsAdding(false);
        }
    };

    const toggleTaskStatus = async (task: Task) => {
        try {
            const updatedTask = await api.put(`/tasks/${task.id}`, {
                completed: !task.completed
            });
            setTasks(tasks.map(t => t.id === task.id ? updatedTask.data : t));
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    return (
        <div style={{ background: 'white', borderRadius: '4px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '800', color: '#1e293b' }}>{title}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Individual items to track your progress</p>
                </div>
            </div>

            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                <input 
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.875rem',
                        outline: 'none',
                    }}
                />
                <button 
                    type="submit"
                    disabled={isAdding || !newTaskTitle.trim()}
                    className="btn-premium-shine"
                    style={{
                        padding: '0 1.25rem',
                        borderRadius: '4px',
                        border: 'none',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        cursor: isAdding ? 'not-allowed' : 'pointer',
                        opacity: isAdding || !newTaskTitle.trim() ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    Add
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {loading ? (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', fontStyle: 'italic' }}>
                        No tasks yet. Create one above!
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div 
                            key={task.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                background: '#f8fafc',
                                borderRadius: '4px',
                                border: '1px solid #f1f5f9',
                                transition: 'all 0.2s'
                            }}
                        >
                            <button 
                                onClick={() => toggleTaskStatus(task)}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: task.completed ? '#22c55e' : '#cbd5e1' }}
                            >
                                {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </button>
                            <span style={{ 
                                flex: 1, 
                                fontSize: '0.875rem', 
                                color: task.completed ? '#94a3b8' : '#1e293b',
                                fontWeight: '500',
                                textDecoration: task.completed ? 'line-through' : 'none'
                            }}>
                                {task.title}
                            </span>
                            <button 
                                onClick={() => handleDeleteTask(task.id)}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#ef4444', opacity: 0.6 }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
