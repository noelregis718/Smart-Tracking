import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page">
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

            <header className="privacy-header">
                <h1>Privacy policy</h1>
                <p className="last-updated">Last updated: March 2026</p>
            </header>

            <main className="privacy-content">
                <p>
                    Expensify ("we," "our," or "us") respects your privacy and is committed to
                    protecting your personal information. This Privacy Policy explains how we
                    collect, use, and safeguard your data when you interact with our website
                    and services. We take the responsibility of handling your financial details
                    seriously and ensure that every measure is taken to maintain the highest
                    standards of data integrity and transparency throughout your journey with us.
                </p>

                <p>
                    When you use our website or contact us, we may collect personal
                    information such as your name, email address, and any specific details you
                    willingly provide regarding your expenses and financial tracking preferences.
                    This information is collected solely for the purpose of enhancing your experience
                    and ensuring that our automated insights are as accurate and personalized as
                    possible to help you manage your assets effectively.
                </p>

                <p>
                    We use the information we collect to provide and improve our services,
                    process your transactions, and communicate with you about your account.
                    Your data helps us personalize your experience and provide smart insights
                    that allow you to save better and track smarter. We do not sell your data
                    to third parties, and all information is used within the strict boundaries
                    of providing you with the best financial tracking utility available.
                </p>

                <p>
                    Data security is at the core of our operations. We implement industry-standard
                    security measures to protect your data, including advanced encryption for
                    data at rest and in transit. This ensures that your sensitive financial
                    information remains private and secure from any unauthorized access,
                    maintaining the institutional-grade security that our users expect and deserve.
                </p>

                <p>
                    You have the right to access, update, or delete your personal
                    information at any time. If you wish to exercise these rights or have any
                    concerns about how your data is being handled, please contact our support
                    team. We are committed to responding to all inquiries promptly and
                    ensuring that you maintain total control over your digital financial profile.
                </p>

                <p className="contact-info">
                    For any questions regarding this policy, please contact us at
                    noel.regis04@gmail.com
                </p>
            </main>
            <SiteFooter />
        </div>
    );
};

export default PrivacyPolicy;
