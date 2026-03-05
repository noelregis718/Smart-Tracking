import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
    RefreshCcw,
    Plus,
    TrendingUp,
    ChevronRight,
    Building2,
    CreditCard,
    DollarSign,
    Info
} from 'lucide-react';
import { AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
    { date: 'Nov 11', value: 663000 },
    { date: 'Nov 13', value: 669000 },
    { date: 'Nov 15', value: 667000 },
    { date: 'Nov 17', value: 673000 },
    { date: 'Nov 19', value: 672000 },
    { date: 'Nov 21', value: 678000 },
    { date: 'Nov 23', value: 681000 },
    { date: 'Nov 25', value: 683000 },
    { date: 'Nov 27', value: 686000 },
    { date: 'Nov 29', value: 688000 },
    { date: 'Dec 1', value: 692000 },
    { date: 'Dec 3', value: 695000 },
    { date: 'Dec 5', value: 698000 },
    { date: 'Dec 7', value: 702000 },
    { date: 'Dec 9', value: 705000 },
    { date: 'Dec 11', value: 706547.97 },
];

const CategoryRow = ({ icon, name, delta, balance, details }: any) => (
    <div className="card" style={{ padding: '0', marginBottom: '1rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ChevronRight size={16} color="var(--text-muted)" />
                <div style={{ padding: '8px', background: 'var(--background)', borderRadius: '8px' }}>{icon}</div>
                <span style={{ fontWeight: '700', fontSize: '1rem' }}>{name}</span>
                <span style={{ fontSize: '0.875rem', color: delta.startsWith('+') ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>{delta} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>1 month change</span></span>
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.125rem' }}>{balance}</span>
        </div>
        {details && details.map((item: any, i: number) => (
            <div key={i} style={{ padding: '1rem 1.5rem 1.25rem 4.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#003399', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.625rem' }}>AMEX</div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9375rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.type}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700' }}>{item.balance}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</div>
                </div>
            </div>
        ))}
    </div>
);

const SummaryItem = ({ color, label, value }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <span style={{ fontWeight: '600' }}>{value}</span>
    </div>
);

export const Accounts = () => {
    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Accounts</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button variant="secondary" style={{ gap: '0.5rem', fontSize: '0.875rem' }}>
                        <RefreshCcw size={16} /> Refresh all
                    </Button>
                    <Button style={{ background: '#ff5f1f', color: 'white', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <Plus size={16} /> Add account
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Card style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                    Net Worth <Info size={14} />
                                </div>
                                <div style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '0.25rem' }}>
                                    $686,547.97 <span style={{ fontSize: '1rem', color: 'var(--success)', fontWeight: '600' }}><TrendingUp size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> $23,292.75 (3.5%)</span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>1 month change</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select className="input" style={{ width: 'auto', fontSize: '0.875rem' }}>
                                    <option>Net worth performance</option>
                                </select>
                                <select className="input" style={{ width: 'auto', fontSize: '0.875rem' }}>
                                    <option>1 month</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <CategoryRow icon={<TrendingUp size={20} color="#22c55e" />} name="Investments" delta="+ $10,635.13 (2%)" balance="$541,793.51" />
                    <CategoryRow icon={<DollarSign size={20} color="#3b82f6" />} name="Cash" delta="+ $1,573.70 (2.5%)" balance="$65,755.47" />
                    <CategoryRow
                        icon={<CreditCard size={20} color="#ef4444" />}
                        name="Credit Cards"
                        delta="-$101.24 (4.2%)"
                        balance="$2,511.55"
                        details={[{ name: 'Joint Credit Card', type: 'Credit Card', balance: '$2,511.55', time: '19 hours ago' }]}
                    />
                    <CategoryRow icon={<Building2 size={20} color="#8b5cf6" />} name="Real Estate" delta="+ $6,173.44 (2.1%)" balance="$300,816.71" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: '700' }}>Summary</h3>
                            <div style={{ display: 'flex', background: 'var(--background)', borderRadius: '8px', padding: '2px' }}>
                                <button className="btn" style={{ fontSize: '0.75rem', padding: '4px 12px', background: 'white', boxShadow: 'var(--shadow-sm)' }}>Totals</button>
                                <button className="btn" style={{ fontSize: '0.75rem', padding: '4px 12px', color: 'var(--text-muted)' }}>Percent</button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>Assets</span>
                                <span style={{ fontWeight: '700' }}>$928,436.75</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f1f1', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: '58%', background: '#06b6d4' }}></div>
                                <div style={{ width: '30%', background: '#8b5cf6' }}></div>
                                <div style={{ width: '8%', background: '#3b82f6' }}></div>
                                <div style={{ width: '4%', background: '#ff5f1f' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <SummaryItem color="#06b6d4" label="Investments" value="$541,793.51" />
                            <SummaryItem color="#8b5cf6" label="Real Estate" value="$300,816.71" />
                            <SummaryItem color="#3b82f6" label="Cash" value="$65,755.47" />
                            <SummaryItem color="#ff5f1f" label="Vehicles" value="$20,071.06" />
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600' }}>Liabilities</span>
                                <span style={{ fontWeight: '700' }}>$241,888.78</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
