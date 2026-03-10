import { Card } from '../Card';

export const AccountOverview = () => {
    return (
        <Card style={{ padding: '1.25rem', background: 'white', borderRadius: '6px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>Accounts</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* White Card (previously Green) */}
                <div style={{
                    background: 'white',
                    padding: '1.25rem',
                    borderRadius: '6px',
                    border: '1px solid #f1f5f9',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>12,890.00</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>USD</div>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>**** 9928</span>
                        </div>
                    </div>
                </div>

                {/* White Card */}
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #f1f5f9',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>12,890.00</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>USD</div>
                    </div>
                    <div style={{
                        background: '#f8fafc',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>**** 1100</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
