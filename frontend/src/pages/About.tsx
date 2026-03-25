import { Link } from 'react-router-dom';
import { ArrowRight, Workflow, ShieldCheck, ScanEye, Linkedin } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import './About.css';

// Modern X Logo SVG Component
const XIcon = ({ size = 18 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.487h2.039L6.486 3.24H4.298l13.311 17.399z" />
    </svg>
);

const About = () => {
    return (
        <div className="about-page">
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

            <div className="about-hero">
                <header className="about-header">
                    <h1>AI and Intelligence<br />Driving Real Impact</h1>
                    <p className="about-subtitle">
                        Powered by advanced AI and guided by a team of experts, we are redefining possibilities and the future of global finance.
                    </p>
                </header>
            </div>

            {/* AI Features Section - Refined Light Theme */}
            <section className="about-ai-features">
                <div className="ai-feature-grid">
                    <div className="ai-feature-card">
                        <div className="ai-card-icon-wrapper">
                            <Workflow className="ai-card-icon" />
                        </div>
                        <h3>Tailored workflows</h3>
                        <p>Configure workflows around your processes and investment strategies.</p>
                    </div>

                    <div className="ai-feature-card">
                        <div className="ai-card-icon-wrapper">
                            <ShieldCheck className="ai-card-icon" />
                        </div>
                        <h3>Audited & tested</h3>
                        <p>Continuously audited and tested to meet compliance requirements.</p>
                    </div>

                    <div className="ai-feature-card">
                        <div className="ai-card-icon-wrapper">
                            <ScanEye className="ai-card-icon" />
                        </div>
                        <h3>Full data visibility</h3>
                        <p>Gain complete visibility into data usage and activity.</p>
                    </div>
                </div>
            </section>

            {/* Founding Team Section */}
            <section className="about-team">
                <header className="team-header">
                    <h2>Founding Team<br />Behind the Expensify</h2>
                    <p className="team-subtitle">
                        Powered by smart technology and built by a strong founding<br />team, we are shaping the future of global finance together.
                    </p>
                </header>

                <div className="team-founder-grid">
                    <div className="founder-card">
                        <div className="founder-avatar-placeholder">
                            {/* Image placeholder - to be updated by user later */}
                        </div>
                        <h3>Mantosh Kumar Yadav</h3>
                        <p className="founder-role">CEO & Founder</p>
                        <div className="founder-socials">
                            <a href="#" className="social-link"><XIcon size={18} /></a>
                            <a href="https://www.linkedin.com/in/mantosh-kumar-yadav-b819b8291?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="social-link"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    <div className="founder-card">
                        <div className="founder-avatar-placeholder">
                            <img src="/2.jpeg" alt="Noel Regis" className="founder-avatar" />
                        </div>
                        <h3>Noel Regis</h3>
                        <p className="founder-role">CTO & Co-Founder</p>
                        <div className="founder-socials">
                            <a href="https://x.com/NoelRegis8" target="_blank" rel="noopener noreferrer" className="social-link"><XIcon size={18} /></a>
                            <a href="https://www.linkedin.com/in/noel-regis-aa07081b1/" target="_blank" rel="noopener noreferrer" className="social-link"><Linkedin size={18} /></a>
                        </div>
                    </div>

                    <div className="founder-card">
                        <div className="founder-avatar-placeholder">
                            {/* Image placeholder - to be updated by user later */}
                        </div>
                        <h3>Md. Raqib Alam</h3>
                        <p className="founder-role">CTO & Co-Founder</p>
                        <div className="founder-socials">
                            <a href="https://x.com/Raqib_alam01" target="_blank" rel="noopener noreferrer" className="social-link"><XIcon size={18} /></a>
                            <a href="https://www.linkedin.com/in/md-raqib-alam-722311357?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-link"><Linkedin size={18} /></a>
                        </div>
                    </div>
                </div>
            </section>



            <section className="about-cta-section">
                <div className="about-cta-content">
                    <h2>Ready to get started</h2>
                    <p>Experience the future of intelligent expense management with our secure platform.</p>
                    <div className="about-cta-buttons">
                        <Link to="/auth" className="about-btn-black">Try Expensify free</Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default About;
