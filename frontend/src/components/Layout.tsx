import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ background: 'var(--surface)', padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleSidebar} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wallet style={{ color: 'var(--primary)' }} />
                        Expensify
                    </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Welcome, {user?.name}</span>
                    <div className="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {user?.name.charAt(0)}
                    </div>
                </div>
            </nav>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <aside style={{
                    width: '250px',
                    background: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    padding: '1rem',
                    display: isSidebarOpen ? 'block' : 'none',
                    position: 'sticky',
                    top: 0,
                    height: 'calc(100vh - 65px)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <NavLink to="/dashboard" className={({ isActive }) => `btn btn-secondary ${isActive ? 'active' : ''}`} style={{ justifyContent: 'flex-start', border: 'none' }}>
                            <LayoutDashboard size={18} style={{ marginRight: '0.5rem' }} /> Dashboard
                        </NavLink>
                        <Button variant="secondary" onClick={handleLogout} style={{ justifyContent: 'flex-start', marginTop: 'auto', border: 'none', color: 'var(--danger)' }}>
                            <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '2rem' }}>
                    <div className="container">
                        {children}
                    </div>
                </main>
            </div >
        </div >
    );
};
