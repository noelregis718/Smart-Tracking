import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
    return (
        <footer className="footer-minimal">
            <div className="footer-line"></div>
            <div className="footer-container">
                <div className="footer-left">
                    <span>© 2026 Expensify. All rights reserved.</span>
                </div>
                <div className="footer-center">
                    <Link to="/features">Features</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/about">About</Link>
                    <Link to="/privacy">Privacy policy</Link>
                    <Link to="/terms">Terms of use</Link>
                </div>
                <div className="footer-right">
                    <a href="https://github.com/noelregis718" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
};
