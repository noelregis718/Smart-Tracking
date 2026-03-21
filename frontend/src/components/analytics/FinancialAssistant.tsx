import React, { useState, useRef, useEffect } from 'react';
import AnalyticsCard from './AnalyticsCard';
// Version: 1.0.1 (Forcing HMR reload)

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
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const callOpenRouterAPI = async (userText: string) => {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!apiKey) {
            return "API Key is missing. Please check your .env file.";
        }

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "Smart Expense Tracker",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "google/gemma-2-9b-it:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a helpful, expert-level financial assistant within a 'Smart Expense Tracker' application. Provide concise, accurate financial advice, budgeting tips, and market analysis. Be professional and encouraging."
                        },
                        {
                            "role": "user",
                            "content": userText
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                return "I'm having trouble thinking right now. Please try again later.";
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "I'm not sure how to respond to that.";
        } catch (error) {
            console.error('Network Error:', error);
            return "Connection error. Please check your internet.";
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        const aiResponseText = await callOpenRouterAPI(currentInput);

        const aiMsg: Message = {
            id: Date.now() + 1,
            text: aiResponseText,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    return (
        <AnalyticsCard style={{ height: '440px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', background: '#fff', flexShrink: 0 }}>
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
                {isTyping && (
                    <div style={{
                        alignSelf: 'flex-start',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: '#f8fafc',
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontStyle: 'italic',
                        border: '1px solid #f1f5f9'
                    }}>
                        Assistant is thinking...
                    </div>
                )}
            </div>
            
            <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem', background: '#fff', flexShrink: 0 }}>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Analyze my finances..."
                    disabled={isTyping}
                    style={{
                        flex: 1,
                        padding: '0.65rem 1rem',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        fontWeight: '700',
                        outline: 'none',
                        color: '#1e293b',
                        background: isTyping ? '#f8fafc' : '#fff'
                    }}
                />
                <button 
                    onClick={handleSend}
                    disabled={isTyping}
                    style={{
                        padding: '0.65rem 1.25rem',
                        background: isTyping ? '#94a3b8' : '#1e293b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        cursor: isTyping ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isTyping ? '...' : 'Send'}
                </button>
            </div>
        </AnalyticsCard>
    );
};

export default FinancialAssistant;
