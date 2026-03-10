import { useState } from 'react';
import { Card } from '../Card';
import { Plus, X, ChevronDown, Check, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const initialTasks = [
    {
        id: '1',
        title: 'Team Budget Report',
        assignees: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
        ],
        dueDate: 'Jan 10, 2025',
        priority: 'Urgent',
        volume: '$12.283,00'
    },
    {
        id: '2',
        title: 'Travel Expenses: Sarah',
        assignees: [
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
        ],
        dueDate: 'Jan 10, 2025',
        priority: 'Urgent',
        volume: '$1.920,23'
    }
];

export const TasksTable = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [newTask, setNewTask] = useState({
        title: '',
        dueDate: '',
        priority: 'Normal',
        volume: ''
    });

    const handleAddTask = () => {
        let formattedDate = newTask.dueDate;
        if (newTask.dueDate) {
            const date = new Date(newTask.dueDate);
            formattedDate = date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }

        const taskObj = {
            id: Date.now().toString(),
            title: newTask.title || 'New Task',
            assignees: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'],
            dueDate: formattedDate || '15 Jan 2025',
            priority: newTask.priority,
            volume: newTask.volume ? `$${newTask.volume}` : '$0.00'
        };
        setTasks([...tasks, taskObj]);
        setIsModalOpen(false);
        setNewTask({ title: '', dueDate: '', priority: 'Normal', volume: '' });
        setIsPriorityOpen(false);
        setIsCalendarOpen(false);
    };

    const priorities = ['Normal', 'Urgent', 'Low', 'High'];

    // Calendar logic
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const days = [];
        const numDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= numDays; i++) {
            days.push(i);
        }

        return days;
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const isSelected = (day: number) => {
        if (!newTask.dueDate) return false;
        const sel = new Date(newTask.dueDate);
        return sel.getDate() === day && sel.getMonth() === viewDate.getMonth() && sel.getFullYear() === viewDate.getFullYear();
    };

    return (
        <Card style={{ padding: '0', background: 'white', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Tasks</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '6px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Plus size={16} /> Add Task
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'white', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Task</th>
                            <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Assignees</th>
                            <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Due date</th>
                            <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Priority</th>
                            <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#64748b' }}>Volume (USD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ background: 'white' }}>
                            <td colSpan={5} style={{ padding: '12px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>Pending Approvals</span>
                                    <div style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', color: '#64748b' }}>3</div>
                                </div>
                            </td>
                        </tr>

                        {tasks.map((task) => (
                            <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '24px' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e293b' }}>{task.title}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '12px 24px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {task.assignees.map((avatar, i) => (
                                            <img key={i} src={avatar} alt="Assignee" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0' }} />
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '12px 24px', fontSize: '0.875rem', color: '#475569' }}>{task.dueDate}</td>
                                <td style={{ padding: '12px 24px', textAlign: 'center' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '4px 12px',
                                        background: 'white',
                                        border: `1px solid ${task.priority === 'Urgent' ? '#fee2e2' : '#e2e8f0'}`,
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: task.priority === 'Urgent' ? '#ef4444' : '#64748b'
                                    }}>
                                        {task.priority}
                                    </div>
                                </td>
                                <td style={{ padding: '12px 24px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{task.volume}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Popup */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Create New Task</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>TASK TITLE</label>
                                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Monthly Report" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>DUE DATE</label>
                                <div
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px 10px 40px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.875rem',
                                        color: newTask.dueDate ? '#1e293b' : '#64748b',
                                        position: 'relative'
                                    }}
                                >
                                    <Calendar size={18} style={{ position: 'absolute', left: '12px', color: '#64748b' }} />
                                    <span>{newTask.dueDate ? new Date(newTask.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select date'}</span>
                                </div>

                                {isCalendarOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '4px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 100,
                                        padding: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <button onClick={(e) => { e.stopPropagation(); changeMonth(-1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><ChevronLeft size={18} /></button>
                                            <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>
                                                {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </span>
                                            <button onClick={(e) => { e.stopPropagation(); changeMonth(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><ChevronRight size={18} /></button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <span key={d} style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af', paddingBottom: '4px' }}>{d}</span>
                                            ))}
                                            {generateCalendar().map((day, i) => (
                                                <div
                                                    key={i}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (day) {
                                                            const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                                                            setNewTask({ ...newTask, dueDate: d.toISOString() });
                                                            setIsCalendarOpen(false);
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '8px 0',
                                                        fontSize: '0.8125rem',
                                                        borderRadius: '6px',
                                                        cursor: day ? 'pointer' : 'default',
                                                        background: day && isSelected(day) ? '#3b82f6' : 'transparent',
                                                        color: day && isSelected(day) ? 'white' : (day ? '#1e293b' : 'transparent'),
                                                        fontWeight: day && isSelected(day) ? '700' : '400'
                                                    }}
                                                    onMouseEnter={(e) => { if (day && !isSelected(day)) e.currentTarget.style.background = '#f1f5f9' }}
                                                    onMouseLeave={(e) => { if (day && !isSelected(day)) e.currentTarget.style.background = 'transparent' }}
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>PRIORITY</label>
                                <div
                                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{newTask.priority}</span>
                                    <ChevronDown size={18} style={{ color: '#64748b', transform: isPriorityOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                                </div>

                                {isPriorityOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '4px',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        zIndex: 10,
                                        overflow: 'hidden'
                                    }}>
                                        {priorities.map((p) => (
                                            <div
                                                key={p}
                                                onClick={() => {
                                                    setNewTask({ ...newTask, priority: p });
                                                    setIsPriorityOpen(false);
                                                }}
                                                style={{
                                                    padding: '10px 12px',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    background: newTask.priority === p ? '#f8fafc' : 'transparent',
                                                    color: newTask.priority === p ? '#3b82f6' : '#1e293b',
                                                    fontWeight: newTask.priority === p ? '600' : '400'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = newTask.priority === p ? '#f8fafc' : 'transparent'}
                                            >
                                                {p}
                                                {newTask.priority === p && <Check size={16} />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>VOLUME (USD)</label>
                                <input type="text" value={newTask.volume} onChange={(e) => setNewTask({ ...newTask, volume: e.target.value })} placeholder="e.g. 5,000.00" style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <button
                                onClick={handleAddTask}
                                style={{
                                    marginTop: '1.5rem',
                                    padding: '12px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
