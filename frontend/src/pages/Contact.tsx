import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import { Footer } from '../components/Footer';
import './Contact.css';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

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
        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formRef.current,
                EMAILJS_PUBLIC_KEY
            );
            setStatus('success');
            formRef.current.reset();
            setExistingCustomer('');
        } catch (err) {
            console.error('EmailJS error:', err);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
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
                                        name="from_name"
                                        placeholder="Eg. Jane Smith"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="from_email"
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
            <Footer />
        </div>
    );
};

export default Contact;
