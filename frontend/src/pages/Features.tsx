import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import './Features.css';

const Features = () => {
    return (
        <div className="features-page">
            <div className="features-hero">
                <header className="features-header">
                    <p className="features-eyebrow">Features</p>
                    <h1>Everything you need to manage your money</h1>
                    <p className="features-subtitle">
                        Powerful tools designed to give you clarity and control over your finances, without the complexity.
                    </p>
                </header>
            </div>

            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-card-icon">📊</div>
                        <h3>Smart Categorization</h3>
                        <p>Automatically categorize your expenses with AI. Say goodbye to manual entry and hello to effortless tracking.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-card-icon">💰</div>
                        <h3>Budgeting Made Simple</h3>
                        <p>Set budget limits for different categories and get notified when you're close to exceeding them.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-card-icon">📈</div>
                        <h3>Visual Insights</h3>
                        <p>Understand your spending habits with clean, interactive charts and comprehensive monthly reports.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-card-icon">🔒</div>
                        <h3>Bank-Level Security</h3>
                        <p>Your data is protected with industry-standard encryption. We never sell your personal information.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-card-icon">🤖</div>
                        <h3>AI Financial Assistant</h3>
                        <p>Get personalized tips and actionable insights on how to save more and optimize your spending.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-card-icon">📱</div>
                        <h3>Accessible Anywhere</h3>
                        <p>Track your finances on the go with our fully responsive platform, available on any device.</p>
                    </div>
                </div>
            </section>

            <section className="features-cta-section">
                <div className="features-cta-box">
                    <h2>Ready to experience these features?</h2>
                    <p>Join Expensify today and take the first step towards financial freedom.</p>
                    <div className="features-cta-buttons">
                        <Link to="/auth" className="features-btn-primary">Get started free</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;
