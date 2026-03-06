import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ChevronDown
} from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import './Landing.css';

export const Landing = () => {
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does Expensify automatically track my spending?",
            answer: "Expensify uses advanced AI to scan your receipts and categorize every transaction in real-time. Simply snap a photo or upload a digital receipt, and our system handles the rest, identifying merchants, dates, and amounts with precision."
        },
        {
            question: "Is my personal financial data secure?",
            answer: "Yes, security is our top priority. We use industry-standard bank-level encryption (AES-256) to protect your data. Your sensitive information is never shared with third parties, and we ensure full compliance with privacy regulations."
        },
        {
            question: "Can I set custom budget goals for different categories?",
            answer: "Absolutely. Expensify allows you to create flexible budgets for specific categories like dining, travel, or entertainment. You'll receive smart notifications when you're approaching your limits to help you stay on track."
        },
        {
            question: "How does the platform help me grow my savings?",
            answer: "Beyond tracking, Expensify analyzes your spending patterns to identify 'leaks' and suggests actionable ways to save. Our smart tips help you optimize your subscriptions and discover savings opportunities you might have missed."
        }
    ];

    return (
        <div className="landing-container">
            {/* Pattern Overlay */}
            <div className="pattern-overlay"></div>

            {/* Bg Gradient */}
            <div className="framer-13n7swf" data-framer-name="Bg Gradient"></div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-logo">
                    <img src="/2-removebg-preview.png" alt="Expensify Logo" className="logo-image" />
                    <span>Expensify</span>
                </div>
                <div className="nav-links">
                    <Link to="/features">Features</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/about">About</Link>
                </div>
                <div className="nav-cta">
                    <a
                        href="https://cal.com/noel-regis/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-demo-link"
                    >
                        Get a Demo
                    </a>
                    <Link to="/auth" className="nav-download-link">
                        Start now <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            {/* Hero Grid Lines & Divider (Right Side) */}
            <div className="hero-divider"></div>
            <div className="hero-vertical-divider-right"></div>
            <div className="hero-vertical-divider-left"></div>
            <div className="hero-lines-pattern"></div>

            {/* Hero Grid Lines & Divider (Left Side - Symmetrical) */}
            <div className="hero-vertical-divider-left-outer"></div>
            <div className="hero-vertical-divider-left-inner"></div>
            <div className="hero-lines-pattern-left"></div>

            {/* Navbar Glow Beam */}
            <div className="nav-glow-container">
                <div className="nav-glow-beam"></div>
            </div>

            {/* Hero Section */}
            <main className="hero">
                <div className="spotlight"></div>
                <h1 className="hero-title">
                    The New Standard<br /><span className="hero-light">For Global Finance</span>
                </h1>
                <p className="hero-subtitle">
                    Manage, scale, and secure your assets on an intuitive financial<br />infrastructure built for speed, reliability, and long-term trust.
                </p>

                <div className="hero-cta">
                    <div className="btn-rays-container">
                        <div className="btn-ray"></div>
                        <div className="btn-ray"></div>
                        <div className="btn-ray"></div>
                        <div className="btn-ray"></div>
                    </div>
                    <Link to="/auth" className="btn-framer">
                        <span>Start tracking</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>

                {/* Dashboard Preview Mockup Wrapper */}
                <div className="preview-wrapper">
                    <div className="preview-line-extension"></div>
                    <div className="preview-line-extension-left"></div>
                    <div className="preview-container">
                        <div className="mockup-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Expensify</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '80px', height: '24px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                                <div style={{ width: '24px', height: '24px', background: '#f3f4f6', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div className="mockup-main">
                            <div className="mockup-sidebar">
                                <div className="skeleton-text" style={{ width: '80%' }}></div>
                                <div className="skeleton-text" style={{ width: '90%' }}></div>
                                <div className="skeleton-text" style={{ width: '70%' }}></div>
                                <div style={{ marginTop: '2rem' }}>
                                    <div className="skeleton-text" style={{ width: '85%' }}></div>
                                    <div className="skeleton-text" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                            <div className="mockup-content">
                                <div className="skeleton-title"></div>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ flex: 1, height: '80px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}></div>
                                    <div style={{ flex: 1, height: '80px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}></div>
                                </div>
                                <div className="skeleton-chart"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-divider"></div>
            </main>


            {/* Feature Description Section */}
            <section className="feature-description-section">
                <div className="feature-description-container">
                    <p className="feature-description-text">
                        Expensify helps you make sense of your money. It uses AI to categorize your receipts and tracks your spending automatically.
                    </p>
                    <p className="feature-description-text">
                        It gives you smart, simple, and actionable tips to budget better and grow your savings without the stress.
                    </p>
                </div>
                <div className="feature-image-container">
                    <img src="/1-removebg-preview.png" alt="Expensify App Mockup" className="feature-main-image" />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="faq-header">
                    <h2 className="faq-title">Answers to the Most<br />Common Questions</h2>
                    <p className="faq-subtitle">
                        Everything you need to know about managing your assets, protecting<br />
                        your wealth, and building a secure and successful financial future.
                    </p>
                </div>

                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <ChevronDown className="faq-icon" size={20} />
                            </div>
                            <div className="faq-answer">
                                <div className="answer-content">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="final-cta-minimal">
                <div className="final-cta-container">
                    <h2 className="final-cta-title">
                        Use Expensify to track smarter,<br />
                        save better, and make every<br />
                        rupee work for you.
                    </h2>
                    <div className="final-cta-button-wrapper">
                        <Link to="/auth" className="btn-framer-blue">
                            <span>Start tracking</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};
