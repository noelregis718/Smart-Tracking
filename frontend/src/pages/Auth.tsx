import { SignIn } from '@clerk/clerk-react';

export const Auth = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #dbeafe 0%, #f3f4f6 40%)', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SignIn routing="hash" forceRedirectUrl="/dashboard" />
                </div>
            </div>
        </div>
    );
};
