import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../lib/api';

interface GoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    goal?: any; // Optional goal for editing
}

const COLORS = [
    '#22c55e', '#ef4444', '#eab308', '#6366f1', '#f97316', '#0ea5e9'
];

const GoalModal: React.FC<GoalModalProps> = ({
    isOpen,
    onClose,
    onSave,
    goal
}) => {
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('0');
    const [targetDate, setTargetDate] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (goal && isOpen) {
            setTitle(goal.title || '');
            setTargetAmount(goal.targetAmount?.toString() || '');
            setCurrentAmount(goal.currentAmount?.toString() || '0');
            setTargetDate(goal.targetDate || '');
            setSelectedColor(goal.color || COLORS[0]);
        } else if (isOpen) {
            setTitle('');
            setTargetAmount('');
            setCurrentAmount('0');
            setTargetDate('');
            setSelectedColor(COLORS[0]);
        }
    }, [goal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedTarget = parseFloat(targetAmount);
        if (isNaN(parsedTarget) || parsedTarget <= 0) {
            alert('Please enter a valid target amount greater than 0.');
            return;
        }

        setLoading(true);
        try {
            
            const payload = {
                title,
                targetAmount: parsedTarget,
                currentAmount: parseFloat(currentAmount) || 0,
                targetDate,
                color: selectedColor
            };

            if (goal?.id) {
                await api.put(`/goals/${goal.id}`, payload);
            } else {
                await api.post('/goals', payload);
            }
            
            onSave();
            onClose();
        } catch (error: any) {
            console.error('Failed to save goal:', error);
            alert(`Failed to ${goal ? 'update' : 'create'} goal. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                backdropFilter: 'blur(4px)'
            }}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                background: 'white',
                borderRadius: '4px',
                width: '100%',
                maxWidth: '450px',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                            {goal ? 'Edit goal' : 'Add new goal'}
                        </h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Goal Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. New Car, Emergency Fund"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Target Amount</label>
                            <input
                                type="number"
                                required
                                placeholder="₹ 0.00"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Initial Savings</label>
                            <input
                                type="number"
                                placeholder="₹ 0.00"
                                value={currentAmount}
                                onChange={(e) => setCurrentAmount(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#444', marginBottom: '6px' }}>Target Date</label>
                        <input
                            type="text"
                            placeholder="e.g. Dec 2026"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Theme Color</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {COLORS.map(color => (
                                <div
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        background: color,
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        border: selectedColor === color ? '2px solid #1e293b' : '2px solid transparent',
                                        transition: 'transform 0.2s'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-premium-shine"
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                fontSize: '1rem'
                            }}
                        >
                            {loading ? (goal ? 'Saving...' : 'Creating...') : (goal ? 'Save Changes' : 'Create Goal')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoalModal;
