import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Wallet,
    ArrowLeftRight,
    BarChart3,
    PieChart,
    Repeat,
    Target,
    TrendingUp,
    MessageSquare,
    Search,
    Bell,
    Settings,
    HelpCircle,
    FileText,
    StickyNote
} from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();

    return (
        <div className="layout" style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: 'white' }}>
                        <Wallet size={20} />
                    </div>
                    <span>Expensify</span>
                </div>

                <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', padding: '1rem 0.5rem 0.5rem', textTransform: 'uppercase' }}>Main Menu</p>
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <SidebarLink to="/dashboard/accounts" icon={<Wallet size={18} />} label="Accounts" />
                    <SidebarLink to="/dashboard/transactions" icon={<ArrowLeftRight size={18} />} label="Transactions" />
                    <SidebarLink to="/dashboard/cashflow" icon={<TrendingUp size={18} />} label="Cash Flow" />
                    <SidebarLink to="/dashboard/reports" icon={<BarChart3 size={18} />} label="Reports" />
                    <SidebarLink to="/dashboard/budget" icon={<PieChart size={18} />} label="Budget" />
                    <SidebarLink to="/dashboard/recurring" icon={<Repeat size={18} />} label="Recurring" />
                    <SidebarLink to="/dashboard/goals" icon={<Target size={18} />} label="Goals" />
                    <SidebarLink to="/dashboard/investments" icon={<TrendingUp size={18} />} label="Investments" />
                    <SidebarLink to="/dashboard/advice" icon={<MessageSquare size={18} />} label="Advice" />

                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', padding: '1.5rem 0.5rem 0.5rem', textTransform: 'uppercase' }}>Shared</p>
                    <SidebarLink to="/dashboard/documents" icon={<FileText size={18} />} label="Documents" />
                    <SidebarLink to="/dashboard/notes" icon={<StickyNote size={18} />} label="Notes" />

                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', padding: '1.5rem 0.5rem 0.5rem', textTransform: 'uppercase' }}>Support</p>
                    <SidebarLink to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
                    <SidebarLink to="/dashboard/help" icon={<HelpCircle size={18} />} label="Help" />
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        Upgrade Plan
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <header style={{
                    height: '64px',
                    background: 'var(--surface)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 40px',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                background: 'var(--background)',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Bell size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.fullName}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.publicMetadata?.role as string || 'Member'}</div>
                            </div>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </header>

                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <NavLink
        to={to}
        end={to === '/dashboard'}
        className={({ isActive }) => isActive ? 'sidebar-active' : ''}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '8px',
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: isActive ? '600' : '500',
            fontSize: '0.875rem',
            background: isActive ? '#fff5f0' : 'transparent',
            transition: 'all 0.2s',
            borderRight: isActive ? '3px solid var(--primary)' : 'none'
        })}
    >
        {icon}
        {label}
    </NavLink>
);
