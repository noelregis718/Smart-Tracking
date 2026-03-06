import { Link } from "react-router-dom"
import '../SiteFooter.css'

interface FooterProps {
    logo: React.ReactNode
    brandName: string
    socialLinks: Array<{
        icon: React.ReactNode
        href: string
        label: string
    }>
    mainLinks: Array<{
        href: string
        label: string
    }>
    legalLinks: Array<{
        href: string
        label: string
    }>
    copyright: {
        text: string
        license?: string
    }
}

export function Footer({
    logo,
    brandName,
    socialLinks,
    mainLinks,
    legalLinks,
    copyright,
}: FooterProps) {
    return (
        <footer className="site-footer-main">
            <div className="site-footer-container">
                {/* Top Row: Logo/Brand and Social Icons - Strictly on one line */}
                <div className="site-footer-top-row">
                    <Link
                        to="/"
                        className="site-footer-brand"
                        aria-label={brandName}
                    >
                        <div className="site-footer-logo-wrapper">
                            {logo}
                        </div>
                        <span className="site-footer-brand-name">{brandName}</span>
                    </Link>

                    <ul className="site-footer-socials">
                        {socialLinks.map((link, i) => (
                            <li key={i}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                    className="site-footer-social-btn"
                                >
                                    {link.icon}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Horizontal Divider */}
                <div className="site-footer-divider"></div>

                {/* Bottom Row: Copyright and Links */}
                <div className="site-footer-bottom-row">
                    {/* Copyright Information */}
                    <div className="site-footer-copyright">
                        <p className="site-footer-copyright-text">
                            {copyright.text}
                        </p>
                        {copyright.license && (
                            <p className="site-footer-license">
                                {copyright.license}
                            </p>
                        )}
                    </div>

                    {/* Links Section */}
                    <div className="site-footer-links-section">
                        <nav>
                            <ul className="site-footer-links-row">
                                {mainLinks.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            to={link.href}
                                            className="site-footer-link"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <nav>
                            <ul className="site-footer-links-row">
                                {legalLinks.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            to={link.href}
                                            className="site-footer-link legal"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}
