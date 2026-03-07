import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    Home,
    ArrowLeftRight,
    Target,
    Search,
    Settings,
    HelpCircle,
    PanelLeft,
    PanelRight,
    Wallet,
    BarChart3,
    Plus
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Button } from './Button';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const sidebarWidth = isCollapsed ? '80px' : '240px';

    return (
        <div className="layout" style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div style={{
                    padding: isCollapsed ? '1rem 0' : '0.75rem 0.5rem',
                    display: 'flex',
                    flexDirection: isCollapsed ? 'column' : 'row',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    gap: isCollapsed ? '1rem' : '0.5rem'
                }}>
                    <Link to="/dashboard" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        overflow: 'hidden'
                    }}>
                        <img src="/2-removebg-preview.png" alt="Expensify Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain', marginLeft: isCollapsed ? '0' : '-4px' }} />
                        {!isCollapsed && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', transform: 'translateY(3px)' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1.1', transform: 'translateX(-2px)' }}>Expensify</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', transform: 'translateX(-2px)' }}>Track Smart</span>
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                            marginRight: isCollapsed ? '0' : '0.5rem'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--background)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        {isCollapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
                    </button>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {!isCollapsed && (
                        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', padding: '1rem 0.5rem 0.5rem', textTransform: 'uppercase' }}>Menu</p>
                    )}
                    <SidebarLink to="/dashboard" icon={<Home size={18} />} label="Dashboard" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/transactions" icon={<ArrowLeftRight size={18} />} label="Transactions" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/budget" icon={<Wallet size={18} />} label="Budget" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/goals" icon={<Target size={18} />} label="Goals" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/analytics" icon={<BarChart3 size={18} />} label="Analytics" collapsed={isCollapsed} />
                </nav>

                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <SidebarLink to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/help" icon={<HelpCircle size={18} />} label="Help" collapsed={isCollapsed} />

                    <div style={{
                        marginTop: '1.5rem',
                        padding: isCollapsed ? '0' : '0 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem'
                    }}>
                        <img
                            src={user?.imageUrl}
                            alt="Profile"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                objectFit: 'cover'
                            }}
                        />
                        {!isCollapsed && (
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user?.fullName}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user?.primaryEmailAddress?.emailAddress}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div style={{
                flex: 1,
                marginLeft: sidebarWidth,
                display: 'flex',
                flexDirection: 'column',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
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
                        <Button
                            variant="secondary"
                            onClick={() => { }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 1rem',
                                fontSize: '0.875rem',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'white'
                            }}
                        >
                            <Plus size={16} />
                            <span>Create invoice</span>
                        </Button>
                    </div>
                </header>

                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

const SidebarLink = ({ to, icon, label, collapsed }: { to: string, icon: React.ReactNode, label: string, collapsed?: boolean }) => (
    <NavLink
        to={to}
        end={to === '/dashboard'}
        className={({ isActive }) => isActive ? 'sidebar-active' : ''}
        title={collapsed ? label : ''}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '8px',
            color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
            fontWeight: isActive ? '600' : '500',
            background: isActive ? '#f9fafb' : 'transparent',
            border: isActive ? '1px solid #e5e7eb' : '1px solid transparent',
            boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            margin: '0 4px'
        })}
    >
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '18px'
        }}>
            {icon}
        </div>
        {!collapsed && <span>{label}</span>}
    </NavLink>
);
