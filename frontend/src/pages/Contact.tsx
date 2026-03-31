import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Check, Loader2, ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import './Contact.css';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const Contact = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [existingCustomer, setExistingCustomer] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const options = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
    ];

    const handleSelect = (value: string) => {
        setExistingCustomer(value);
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setStatus('sending');

        const formData = new FormData(formRef.current);
        // Ensure hidden field is manually updated if not already captured
        formData.set('existing_customer', existingCustomer || 'not specified');

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus('success');
                formRef.current.reset();
                setExistingCustomer('');
            } else {
                const errorData = await response.json();
                console.error('Formspree error:', errorData);
                setStatus('error');
            }
        } catch (err) {
            console.error('Network error:', err);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
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

            <div className="contact-hero">
                <header className="contact-header">
                    <h1>Let's connect</h1>
                    <p className="contact-subtitle">
                        Have questions about Expensify? Contact us and we'll be happy to help.
                    </p>
                </header>

                <main className="contact-container">
                    {status === 'success' ? (
                        <div className="contact-success">
                            <div className="success-icon">✓</div>
                            <h2>Message sent!</h2>
                            <p>Thanks for reaching out. We'll get back to you soon.</p>
                            <button className="contact-submit-btn" onClick={() => setStatus('idle')}>
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Eg. Jane Smith"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="jane@framer.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Enter your message..."
                                    rows={5}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Are you an existing customer?</label>
                                {/* Hidden input to pass dropdown value to EmailJS */}
                                <input type="hidden" name="existing_customer" value={existingCustomer} />
                                <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`}>
                                    <div
                                        className="dropdown-trigger"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>{existingCustomer ? options.find(opt => opt.value === existingCustomer)?.label : 'Select...'}</span>
                                        <ChevronDown className={`select-icon ${isDropdownOpen ? 'rotate' : ''}`} size={18} />
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="dropdown-options">
                                            {options.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className={`dropdown-option ${existingCustomer === option.value ? 'selected' : ''}`}
                                                    onClick={() => handleSelect(option.value)}
                                                >
                                                    <span>{option.label}</span>
                                                    {existingCustomer === option.value && <Check size={16} />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {status === 'error' && (
                                <p className="contact-error">Something went wrong. Please try again.</p>
                            )}

                            <button
                                type="submit"
                                className="contact-submit-btn"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? (
                                    <><Loader2 size={18} className="spin" /> Sending...</>
                                ) : (
                                    'Send a message'
                                )}
                            </button>
                        </form>
                    )}
                </main>
            </div>
            <SiteFooter />
        </div>
    );
};

export default Contact;
