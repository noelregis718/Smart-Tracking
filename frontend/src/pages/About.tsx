import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-hero">
                <header className="about-header">
                    <p className="about-eyebrow">Our Story</p>
                    <h1>Built for people who care about their money</h1>
                    <p className="about-subtitle">
                        Expensify was founded with one belief: managing your finances shouldn't be complicated. We build tools that are powerful, simple, and human.
                    </p>
                </header>
            </div>

            <section className="about-section">
                <div className="about-grid">
                    <div className="about-card">
                        <div className="about-card-icon">🎯</div>
                        <h3>Our Mission</h3>
                        <p>
                            To give every person the tools they need to understand, control, and grow their personal finances — without needing a finance degree.
                        </p>
                    </div>
                    <div className="about-card">
                        <div className="about-card-icon">💡</div>
                        <h3>Our Vision</h3>
                        <p>
                            A world where financial clarity is the default, not the exception. Where anyone can make smart, informed decisions about their money every single day.
                        </p>
                    </div>
                    <div className="about-card">
                        <div className="about-card-icon">🤝</div>
                        <h3>Our Values</h3>
                        <p>
                            Transparency, simplicity, and trust. We believe your data belongs to you — and we design every feature with your privacy and security at the forefront.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-section about-section-alt">
                <div className="about-story">
                    <div className="about-story-text">
                        <h2>Why we built this</h2>
                        <p>
                            Most finance apps are either too complicated or too simple. They're cluttered with features you'll never use, or they barely scratch the surface of what you actually need.
                        </p>
                        <p>
                            We built Expensify to be different — a focused, beautifully designed platform that gives you a real, live picture of your finances without the noise.
                        </p>
                        <p>
                            From tracking daily expenses to visualising monthly trends, Expensify puts the numbers in context so you can make decisions that actually move the needle.
                        </p>
                    </div>
                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Active Users</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">₹50Cr+</span>
                            <span className="stat-label">Expenses Tracked</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">4.9★</span>
                            <span className="stat-label">User Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-cta-section">
                <div className="about-cta-box">
                    <h2>Ready to take control of your finances?</h2>
                    <p>Join thousands of users who've already made the switch to smarter expense tracking.</p>
                    <div className="about-cta-buttons">
                        <Link to="/auth" className="about-btn-primary">Get started free</Link>
                        <Link to="/contact" className="about-btn-secondary">Talk to us</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
