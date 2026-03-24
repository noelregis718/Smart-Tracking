import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    ArrowLeftRight,
    Target,
    Search,
    PanelLeft,
    PanelRight,
    Wallet,
    BarChart3,
    FileText,
    LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';
import { ReportModal } from './dashboard/ReportModal';

const SEARCH_ITEMS = [
    // Dashboard Spot Index
    { label: 'Dashboard', path: '/dashboard', keywords: ['home', 'overview', 'main', 'welcome', 'summary'] },
    { label: 'Generate Report', path: '/dashboard', keywords: ['download', 'financial', 'statement', 'csv', 'generate', 'report'] },
    { label: 'Net Worth Tracker', path: '/dashboard#net-worth-tracker', keywords: ['wealth', 'equity', 'total', 'networth', 'growth', 'chart'] },
    { label: 'Recent Expenses', path: '/dashboard#recent-expenses', keywords: ['history', 'spending', 'transactions', 'recent', 'activity'] },
    { label: 'Savings Goals Preview', path: '/dashboard#savings-goals-preview', keywords: ['save', 'target', 'progress', 'goals', 'savings'] },

    // Transactions Spot Index
    { label: 'Transactions', path: '/dashboard/transactions', keywords: ['history', 'recent', 'expenses', 'income', 'all transactions'] },
    { label: 'Transaction Statistics', path: '/dashboard/transactions#transaction-stats', keywords: ['key stats', 'summary', 'metrics', 'numbers', 'total'] },
    { label: 'Activity Chart', path: '/dashboard/transactions#activity-chart', keywords: ['graph', 'trends', 'timeline', 'spending over time'] },
    { label: 'Account Overview', path: '/dashboard/transactions#account-overview-sidebar', keywords: ['accounts list', 'balances', 'wallets', 'banks'] },
    { label: 'Transaction History', path: '/dashboard/transactions#full-history', keywords: ['detailed list', 'table', 'raw data', 'edit delete'] },

    // Budget Spot Index
    { label: 'Budget', path: '/dashboard/budget', keywords: ['spending', 'limit', 'plan', 'budgeting', 'finance'] },
    { label: 'Spending Analysis', path: '/dashboard/budget#spending-analysis', keywords: ['categories', 'pie', 'charts', 'where is my money', 'breakdown'] },
    { label: 'Loan Details', path: '/dashboard/budget#loan-details', keywords: ['debt', 'mortgage', 'liabilities', 'how much i owe', 'loans'] },
    { label: 'Investment Portfolio', path: '/dashboard/budget#investment-portfolio', keywords: ['stocks', 'assets', 'market', 'portfolio', 'investments'] },
    { label: 'Budget Summary', path: '/dashboard/budget#budget-summary', keywords: ['left to spend', 'remaining', 'allowance', 'limit'] },
    { label: 'Monthly Subscriptions', path: '/dashboard/budget#monthly-subscriptions', keywords: ['recurring bills', 'subscriptions', 'monthly', 'payments', 'netflix'] },

    // Goals Spot Index
    { label: 'Goals', path: '/dashboard/goals', keywords: ['savings', 'target', 'save', 'my goals'] },
    { label: 'All Savings Goals', path: '/dashboard/goals#all-savings-goals', keywords: ['list of goals', 'targets', 'progress', 'setups'] },
    { label: 'Savings Transfer', path: '/dashboard/goals#savings-transfer', keywords: ['move money', 'transfer', 'allocate', 'deposit'] },
    { label: 'My Tasks', path: '/dashboard/goals#my-tasks', keywords: ['checklist', 'to-do', 'todos', 'manage', 'tasks', 'my tasks'] },

    // Analytics (Reports) Spot Index
    { label: 'Analytics', path: '/dashboard/analytics', keywords: ['charts', 'reports', 'stats', 'financial analytics'] },
    { label: 'KPI Analytics', path: '/dashboard/analytics#kpi-metrics', keywords: ['key', 'performance', 'summary', 'important stats'] },
    { label: 'Planning Tools', path: '/dashboard/analytics#planning-tools', keywords: ['calculators', 'finance', 'math', 'tools'] },
    { label: 'Currency Conversion', path: '/dashboard/analytics#forex-tool', keywords: ['forex', 'calculator', 'rates', 'change', 'exchange'] },
    { label: 'Highest Transactions', path: '/dashboard/analytics#top-transactions', keywords: ['highest', 'biggest', 'large', 'extremes', 'top expenses'] },
    { label: 'Market Sentiment', path: '/dashboard/analytics#market-news', keywords: ['stocks', 'news', 'trends', 'updates', 'stock market'] },
    { label: 'AI Assistant', path: '/dashboard/analytics#ai-assistant', keywords: ['bot', 'help', 'ask', 'assistant', 'financial advisor'] },

    // Settings & Help
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const sidebarWidth = isCollapsed ? '80px' : '240px';

    // Handle scroll to hash specifically
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.replace('#', '');
            const scroll = () => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };
            
            // Try immediately AND after a short delay for dynamic content
            scroll();
            const timer = setTimeout(scroll, 200);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, location.hash]); // Listen to both path and hash changes

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return;

            const match = SEARCH_ITEMS.find(item => 
                item.label.toLowerCase().includes(query) || 
                item.keywords.some(k => k.toLowerCase().includes(query))
            );

            if (match) {
                // If we're already on that path but with a different hash, or even the same path, 
                // we should force navigate or manually trigger the scroll.
                if (window.location.pathname + window.location.hash === match.path) {
                    // Force re-scroll if already there
                    const id = match.path.split('#')[1];
                    if (id) {
                        const element = document.getElementById(id);
                        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    navigate(match.path);
                }
                setSearchQuery('');
            }
        }
    };

    return (
        <div className="layout" style={{ minHeight: '100vh', display: 'flex', background: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarWidth,
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                borderRight: '1px solid var(--border)',
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
                            borderRadius: '4px',
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

                <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '2rem' }}>
                    <SidebarLink to="/dashboard" icon={<Home size={18} />} label="Dashboard" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/transactions" icon={<ArrowLeftRight size={18} />} label="Transactions" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/budget" icon={<Wallet size={18} />} label="Budget" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/goals" icon={<Target size={18} />} label="Goals" collapsed={isCollapsed} />
                    <SidebarLink to="/dashboard/analytics" icon={<BarChart3 size={18} />} label="Analytics" collapsed={isCollapsed} />
                </nav>

                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button 
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            gap: '0.75rem',
                            padding: '0.625rem 0.75rem',
                            borderRadius: '4px',
                            color: 'var(--text-muted)',
                            fontWeight: '500',
                            background: 'transparent',
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            margin: '0 4px',
                            width: 'calc(100% - 8px)',
                            textAlign: 'left'
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px' }}>
                            <LogOut size={18} />
                        </div>
                        {!isCollapsed && <span>Log out</span>}
                    </button>

                    <div style={{
                        marginTop: '1.5rem',
                        padding: isCollapsed ? '0' : '0 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: '0.75rem'
                    }}>
                        <img
                            src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                            alt="Profile"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                objectFit: 'cover'
                            }}
                        />
                        {!isCollapsed && (
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user?.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {user?.email}
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
                background: 'var(--background)',
                transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '100vh'
            }}>
                {/* Header */}
                <header style={{
                    height: '64px',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90,
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 40px',
                                border: '1px solid var(--border)',
                                borderRadius: '4px',
                                background: 'var(--surface)',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Button
                            variant="secondary"
                            onClick={() => setIsReportModalOpen(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 1rem',
                                fontSize: '0.875rem',
                                height: '36px',
                                borderRadius: '4px',
                                background: 'white'
                            }}
                        >
                            <FileText size={16} />
                            <span>Generate report</span>
                        </Button>
                    </div>
                </header>

                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>

            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
    );
};

const SidebarLink = ({ to, icon, label, collapsed, badge }: { to: string, icon: React.ReactNode, label: string, collapsed?: boolean, badge?: string }) => (
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
            borderRadius: '4px',
            color: isActive ? '#0f172a' : 'var(--text-muted)',
            fontWeight: '500',
            background: isActive ? '#f8fafc' : 'transparent',
            border: isActive ? '1px solid #e2e8f0' : '1px solid transparent',
            boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            margin: '0 8px'
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
        {!collapsed && badge && (
            <span style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#f1f5f9',
                color: '#64748b',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: '1px solid #e2e8f0'
            }}>{badge}</span>
        )}
    </NavLink>
);
