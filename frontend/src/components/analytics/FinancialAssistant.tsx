import React, { useState, useRef, useEffect } from 'react';
import AnalyticsCard from './AnalyticsCard';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

const FinancialAssistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm your AI Financial Assistant. How can I help you today?", sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now() + 1,
                text: getMockResponse(input),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 800);
    };

    const getMockResponse = (text: string) => {
        const query = text.toLowerCase();
        if (query.includes('market')) return "The markets are showing some volatility today, especially in the tech sector.";
        if (query.includes('spend') || query.includes('budget')) return "Your spending is 5% lower this week. Great job!";
        if (query.includes('goal')) return "You're 65% of the way to your 'New MacBook' goal.";
        return "I'm analyzing your data. Ask me anything about your spending or the market.";
    };

    return (
        <AnalyticsCard style={{ height: '440px', padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', background: '#fff' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>AI Financial Assistant</h3>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff' }} ref={scrollRef}>
                {messages.map(m => (
                    <div key={m.id} style={{
                        alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: m.sender === 'user' ? '#1e293b' : '#f8fafc',
                        color: m.sender === 'user' ? '#fff' : '#1e293b',
                        fontSize: '13px',
                        fontWeight: '700',
                        lineHeight: '1.4',
                        border: m.sender === 'ai' ? '1px solid #f1f5f9' : 'none',
                        boxShadow: m.sender === 'ai' ? '0 1px 2px rgba(0,0,0,0.02)' : 'none'
                    }}>
                        {m.text}
                        <div style={{ fontSize: '8px', opacity: 0.5, marginTop: '4px', textAlign: 'right', fontWeight: '900' }}>{m.time}</div>
                    </div>
                ))}
            </div>
            
            <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem', background: '#fff' }}>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Analyze my finances..."
                    style={{
                        flex: 1,
                        padding: '0.65rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        fontWeight: '700',
                        outline: 'none',
                        color: '#1e293b'
                    }}
                />
                <button 
                    onClick={handleSend}
                    style={{
                        padding: '0.65rem 1.25rem',
                        background: '#1e293b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                    }}
                >
                    Send
                </button>
            </div>
        </AnalyticsCard>
    );
};

export default FinancialAssistant;
