import { SignIn } from '@clerk/clerk-react';
import { Wallet } from 'lucide-react';

export const Auth = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Wallet size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Smart Tracker</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Secure authentication by Clerk</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SignIn routing="hash" forceRedirectUrl="/dashboard" />
                </div>
            </div>
        </div>
    );
};
