import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { AnimatedVectorIcon } from '../components/ui/animated_vector_icon';
import './Features.css';

const Features = () => {
    return (
        <div className="features-page landing-container">
            {/* Pattern Overlay */}
            <div className="pattern-overlay"></div>

            {/* Bg Gradient */}
            <div className="framer-13n7swf" data-framer-name="Bg Gradient"></div>

            {/* Navbar (Shared Layout) */}
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

            <div className="features-hero-three hero">
                <div className="features-hero-content-centered">
                    <h1 className="hero-title">
                        Powering Confident<br /><span className="hero-light">Financial Growth</span>
                    </h1>
                    <p className="hero-subtitle">
                        Created to support secure, scalable, and efficient financial<br />
                        operations across global enterprise ecosystems.
                    </p>

                    <div className="hero-cta">
                        <div className="btn-rays-container">
                            <div className="btn-ray"></div>
                            <div className="btn-ray"></div>
                            <div className="btn-ray"></div>
                            <div className="btn-ray"></div>
                        </div>
                        <Link to="/auth" className="btn-framer">
                            <span>Get started free</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
                <div className="benefit-cards-overlap">
                    <div className="benefit-card-premium">
                        <div className="benefit-card-header">
                            <div className="benefit-icon-ring">
                                <AnimatedVectorIcon type="api" size={24} color="#333" />
                            </div>
                            <h3>Custom API</h3>
                        </div>
                        <p>Receive a dedicated solutions architect to help integrate our platform into your existing legacy systems.</p>
                    </div>
                    <div className="benefit-card-premium">
                        <div className="benefit-card-header">
                            <div className="benefit-icon-ring">
                                <AnimatedVectorIcon type="support" size={24} color="#333" />
                            </div>
                            <h3>Dedicated Support</h3>
                        </div>
                        <p>Benefit from guaranteed 99.9% uptime and a 24/7 dedicated support line for immediate assistance.</p>
                    </div>
                    <div className="benefit-card-premium">
                        <div className="benefit-card-header">
                            <div className="benefit-icon-ring">
                                <AnimatedVectorIcon type="whiteLabel" size={24} color="#333" />
                            </div>
                            <h3>White-Labeling</h3>
                        </div>
                        <p>Customize the entire platform interface to match your corporate branding for a seamless client experience.</p>
                    </div>
                </div>
            </div>

            <div className="features-slogan-section">
                <h2 className="slogan-text">
                    Track with Confidence.<br />
                    <span>Backed by Intelligence.</span>
                </h2>
            </div>

            <section className="features-custom-budgets">
                <div className="budget-content">
                    <h2 className="budget-title">Custom Budgets</h2>
                    <p className="budget-description">
                        Create personalized budgets for specific categories like groceries,
                        entertainment, and transportation, and monitor your spending against these limits.
                    </p>
                </div>
                <div className="budget-image-container">
                    <img src="/5.jpeg" alt="Custom Budgets Dashboard" className="budget-image" />
                </div>
            </section>

            <section className="features-accurate-research">
                <div className="research-image-container" style={{ transform: 'translateX(-50px)' }}>
                    <img src="/6.png" alt="Accurate Research Dashboard" className="research-image" />
                </div>
                <div className="research-content">
                    <h2 className="research-title">Accurate Research</h2>
                    <p className="research-description">
                        Run research across all internal and external data
                        sources in a single workflow. Get comprehensive insights to make smarter financial decisions, faster.
                    </p>
                </div>
            </section>

            <section className="features-balance-monitor">
                <div className="balance-content">
                    <h2 className="balance-title">Balance Control</h2>
                    <p className="balance-description">
                        Stay updated with real-time balance tracking. Know exactly where you stand financially, anytime, anywhere.
                    </p>
                </div>
                <div className="balance-image-container">
                    <img src="/7.jpeg" alt="Balance Monitor Dashboard" className="balance-image" />
                </div>
            </section>

            <section className="features-process-section">
                <h2 className="process-heading">
                    How our process ensures a<br />seamless banking experience
                </h2>
                <div className="process-steps-full">
                    <div className="process-step-box">
                        <div className="step-number">01</div>
                        <div className="step-details">
                            <h3 className="step-title">Set up your account</h3>
                            <p className="step-description">Create an account quickly and securely to get started. Simply enter your details and link your bank.</p>
                        </div>
                    </div>
                    <div className="process-step-arrow">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="process-step-box">
                        <div className="step-number">02</div>
                        <div className="step-details">
                            <h3 className="step-title">Track and manage transactions</h3>
                            <p className="step-description">Monitor your transactions in real-time, categorize expenses, and view detailed spending insights.</p>
                        </div>
                    </div>
                    <div className="process-step-arrow">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="process-step-box">
                        <div className="step-number">03</div>
                        <div className="step-details">
                            <h3 className="step-title">Stay informed and take action</h3>
                            <p className="step-description">Receive personalized alerts, set financial goals, and take action with smart tools.</p>
                        </div>
                    </div>
                </div>
            </section>



            <section className="features-cta-section">
                <div className="features-cta-box">
                    <h2>Ready to Elevate Your<br />Financial Infrastructure?</h2>
                    <p>Join over 50,000 businesses worldwide using our intelligent platform<br />to automate workflows, secure assets, and accelerate global growth.</p>
                    <div className="features-cta-buttons">
                        <Link to="/auth" className="features-btn-premium-cta">
                            <span>Get started for free</span>
                            <div className="btn-icon-circle">
                                <ArrowRight size={18} color="white" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Features;
