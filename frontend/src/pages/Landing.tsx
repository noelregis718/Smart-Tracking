
import { Link } from 'react-router-dom';
import { ShieldCheck, PieChart, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';

export const Landing = () => {
    return (
        <div className="landing">
            {/* Hero Section */}
            <header style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white', padding: '100px 0', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                        Master Your Finances <br /> with Smart Insights.
                    </h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Track expenses, set budgets, and achieve your financial goals with our intuitive and powerful expense tracker.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/auth">
                            <Button style={{ fontSize: '1.1rem', padding: '12px 24px', background: 'white', color: '#4f46e5' }}>
                                Get Started Free <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ padding: '80px 0', background: 'var(--background)' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', fontWeight: '700' }}>Why Choose Expensify?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center', borderRadius: '1rem', padding: '2.5rem' }}>
                            <div style={{ background: '#e0e7ff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#4f46e5' }}>
                                <PieChart size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Visual Analytics</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Visualize your spending habits with interactive charts and graphs to understand where your money goes.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', borderRadius: '1rem', padding: '2.5rem' }}>
                            <div style={{ background: '#dcfce7', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#22c55e' }}>
                                <TrendingUp size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Smart Tracking</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Categorize transactions automatically and identify trends to optimize your budget.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center', borderRadius: '1rem', padding: '2.5rem' }}>
                            <div style={{ background: '#fee2e2', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444' }}>
                                <ShieldCheck size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Secure & Private</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Your financial data is encrypted and secure. We prioritize your privacy above all else.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#1e293b', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <p>&copy; 2024 Expensify. College Project.</p>
                </div>
            </footer>
        </div>
    );
};
