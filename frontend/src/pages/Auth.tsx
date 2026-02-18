import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Wallet } from 'lucide-react';

export const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate auth
        login(email);
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Wallet size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? 'Enter your details to access your account' : 'Sign up to start tracking your expenses'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" style={{ marginTop: '1rem' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
};
