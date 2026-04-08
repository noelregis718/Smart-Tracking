import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
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
                <Link to="/" className="nav-logo">
                    <img src="/2-removebg-preview.png" alt="Expensify Logo" className="logo-image" />
                    <span>Expensify</span>
                </Link>
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
                    <div className="preview-container" style={{ border: 'none', background: '#fff' }}>
                        <img src="/7.png" alt="Expensify Dashboard Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                </div>
                <div className="dashboard-divider"></div>
            </main>


            {/* New Feature Bento Grid Section */}
            <section className="feature-grid-section">
                <div className="feature-grid-header">
                    <h2 className="feature-grid-title">Financial intelligence, visualized.</h2>
                    <p className="feature-grid-subtitle">
                        Every transaction, budget shift, and savings milestone — captured with rich context from your real expense traffic.
                    </p>
                </div>

                <div className="bento-grid">
                    {/* Card 1: Schematic Window */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bento-card"
                    >
                        <div className="visual-container">
                            <div className="schematic-window">
                                <div className="schematic-dot" style={{ top: '8px', left: '8px' }} />
                                <div className="schematic-dot" style={{ top: '8px', right: '8px' }} />
                                <div className="schematic-dot" style={{ bottom: '8px', left: '8px' }} />
                                <div className="schematic-dot" style={{ bottom: '8px', right: '8px' }} />
                                
                                <div className="schematic-top-bars">
                                    <div className="schematic-bar-full" />
                                    <div className="schematic-bars-flex">
                                        <div className="schematic-bar-small" />
                                        <div className="schematic-bar-small" />
                                        <div className="schematic-bar-small" />
                                        <div className="schematic-bar-small" />
                                    </div>
                                </div>

                                <motion.div 
                                    className="schematic-grid"
                                    initial="initial"
                                    animate="animate"
                                >
                                    {[...Array(15)].map((_, i) => (
                                        <motion.div 
                                            key={i} 
                                            className="schematic-tile"
                                            variants={{
                                                initial: { backgroundColor: '#f1f1f1', scale: 1 },
                                                animate: { 
                                                    backgroundColor: ['#f1f1f1', '#1d4ed8', '#1d4ed8', '#f1f1f1'],
                                                    scale: [1, 1.05, 1.05, 1]
                                                }
                                            }}
                                            transition={{ 
                                                duration: 4, 
                                                repeat: Infinity, 
                                                delay: i * 0.15,
                                                times: [0, 0.2, 0.8, 1]
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">Intelligent Workflow</h3>
                            <p className="card-description">
                                Streamline every financial movement with a centralized, AI-driven process.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 2: Isometric Block */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bento-card"
                    >
                        <div className="visual-container">
                            <motion.div 
                                className="isometric-block"
                                whileHover={{ 
                                    rotateX: 30, 
                                    rotateZ: 45,
                                    scale: 1.05,
                                    boxShadow: '1px 1px 0 #ccc, 2px 2px 0 #ccc, 3px 3px 0 #ccc, 4px 4px 0 #ccc, 20px 20px 50px rgba(0,0,0,0.15)'
                                }}
                            >
                                <motion.div 
                                    className="iso-sidebar" 
                                    animate={{ opacity: [0, 1, 1, 0], x: [-10, 0, 0, -10] }}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}
                                />
                                <motion.div 
                                    className="iso-top-bar" 
                                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.15, 0.25, 0.9, 1] }}
                                />
                                <motion.div 
                                    className="iso-content-header" 
                                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.2, 0.3, 0.9, 1] }}
                                />
                                <div className="iso-lines">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div 
                                            key={i} 
                                            className="iso-line" 
                                            style={{ width: `${100 - (i * 5)}%` }}
                                            animate={{ opacity: [0, 0, 1, 1, 0], x: [10, 10, 0, 0, 10] }}
                                            transition={{ 
                                                duration: 6, 
                                                repeat: Infinity, 
                                                times: [0, 0.3 + (i * 0.05), 0.45 + (i * 0.05), 0.9, 1],
                                                ease: "easeOut"
                                            }}
                                        />
                                    ))}
                                </div>
                                <motion.div 
                                    className="iso-dot" 
                                    animate={{ opacity: [0, 0, 1, 1, 0], scale: [0, 0, 1.2, 1, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.6, 0.9, 1] }}
                                />
                            </motion.div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">Unified Platform</h3>
                            <p className="card-description">
                                Centralized data and signals without stitching together multiple tools.
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 3: Orange Usage Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bento-card"
                    >
                        <div className="visual-container">
                            <motion.div 
                                className="usage-bar-card"
                                animate={{ 
                                    opacity: [0, 0, 1, 1, 0],
                                    scale: [0.9, 0.9, 1, 1, 0.9],
                                    y: [20, 20, 0, 0, 20]
                                }}
                                transition={{ 
                                    duration: 6, 
                                    repeat: Infinity, 
                                    times: [0, 0.1, 0.2, 0.9, 1],
                                    ease: "easeInOut"
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '700' }}>
                                        Usage
                                    </div>
                                    <div className="hobby-badge">Saver</div>
                                </div>
                                <div className="usage-progress" style={{ marginBottom: '8px' }}>
                                    <motion.div 
                                        className="usage-fill"
                                        initial={{ width: '0%', backgroundColor: '#1d4ed8' }}
                                        animate={{ 
                                            width: ['0%', '0%', '0%', '75%', '75%', '0%'],
                                            backgroundColor: ['#1d4ed8', '#1d4ed8', '#1d4ed8', '#1132cb', '#1132cb', '#1d4ed8']
                                        }}
                                        transition={{ 
                                            duration: 6, 
                                            repeat: Infinity, 
                                            times: [0, 0.2, 0.3, 0.5, 0.9, 1],
                                            ease: 'easeInOut'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.7rem', fontWeight: '700', color: '#666' }}>
                                    750 / 1000 INR
                                </div>
                            </motion.div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-title">Predictable Budgeting</h3>
                            <p className="card-description">
                                Transparent consumption tracking with no hidden costs or surprises.
                            </p>
                        </div>
                    </motion.div>
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
