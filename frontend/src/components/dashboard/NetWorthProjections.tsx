/**
 * NetWorthProjections Component
 * 
 * This component visualizes historical total expenses alongside future projections.
 * It allows users to toggle between different timeframes (7, 15, 30, 90, 180 days)
 * to see how their spending behavior impacts their long-term financial health.
 */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../../lib/api';
import type { ProjectionPoint } from '../../lib/projections';
import { calculateProjections } from '../../lib/projections';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    ResponsiveContainer
} from 'recharts';
import { Info, ChevronDown } from 'lucide-react';

export const NetWorthProjections = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [recurring, setRecurring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [projectionDays, setProjectionDays] = useState(30);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showProjections] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken();
                setAuthToken(token);
                const [expRes, incRes, recRes] = await Promise.all([
                    api.get('/expenses'),
                    api.get('/income'),
                    api.get('/recurring')
                ]);
                setExpenses(expRes.data);
                setIncome(incRes.data);
                setRecurring(recRes.data);
            } catch (error) {
                console.error('Failed to fetch data for projections:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const data: ProjectionPoint[] = useMemo(() => {
        return calculateProjections(expenses, income, recurring, showProjections ? projectionDays : 0);
    }, [expenses, income, recurring, projectionDays, showProjections]);

    // Check if user has enough data for an accurate model
    const isNewUser = expenses.length === 0;

    const lastPoint = data[data.length - 1];
    const isOverallProfitable = lastPoint ? lastPoint.value >= 0 : true;

    if (loading) return <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Calculating projections...</div>;

    return (
        <div style={{ padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '100px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#1e293b',
                            cursor: 'pointer',
                            background: 'white',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <span>{projectionDays} Days Forecast</span>
                        <ChevronDown size={14} style={{ 
                            color: '#64748b',
                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.2s'
                        }} />
                    </div>

                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            zIndex: 100,
                            minWidth: '160px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                            padding: '4px',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            {[7, 15, 30, 90, 180].map(days => (
                                <div
                                    key={days}
                                    onClick={() => {
                                        setProjectionDays(days);
                                        setIsDropdownOpen(false);
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        color: projectionDays === days ? '#2563eb' : '#475569',
                                        background: projectionDays === days ? '#f0f9ff' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.1s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span>{days} Days</span>
                                    {projectionDays === days && (
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#2563eb' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!isNewUser && (
                        <div style={{
                            padding: '4px 12px',
                            borderRadius: '100px',
                            background: isOverallProfitable ? '#ecfdf5' : '#fef2f2',
                            color: isOverallProfitable ? '#10b981' : '#ef4444',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            border: `1px solid ${isOverallProfitable ? '#10b981' : '#ef4444'}`
                        }}>
                            HABIT: {isOverallProfitable ? 'PROFITABLE' : 'AT LOSS'}
                        </div>
                    )}
                </div>
            </div>

            {isNewUser ? (
                <div style={{ 
                    height: '280px', 
                    background: '#f8fafc', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '12px',
                    color: '#64748b',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '2px dashed #e2e8f0'
                }}>
                    <Info size={32} color="#94a3b8" />
                    <p style={{ margin: 0, fontWeight: '500' }}>Insight: Create your first transaction to unlock projections.</p>
                </div>
            ) : (
                <div style={{ height: '280px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                            />
                            <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: number | undefined, _name: any, props: any) => [
                                    `₹${value?.toLocaleString() || '0'}`, 
                                    props.payload.isProjected ? 'Projected Net' : 'Actual Net'
                                ]}
                            />
                            <Bar 
                                dataKey="value" // Using cumulative value for rise/fall pattern
                                radius={[4, 4, 4, 4]}
                                barSize={data.length > 50 ? 8 : data.length > 20 ? 16 : 32}
                            >
                                {data.map((entry, index) => {
                                    const isProfitable = entry.value >= 0;
                                    return (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={isProfitable ? '#10b981' : '#ef4444'} 
                                            fillOpacity={entry.isProjected ? 0.3 : 1}
                                            stroke={isProfitable ? '#10b981' : '#ef4444'}
                                            strokeDasharray={entry.isProjected ? "4 4" : "0"}
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};
