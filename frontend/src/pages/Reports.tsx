import { useState } from 'react';
import KPISection from '../components/analytics/KPISection';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import HighestTransactions from '../components/analytics/HighestTransactions';
import ConversionTool from '../components/analytics/ConversionTool';
import FinancialCalculators from '../components/analytics/FinancialCalculators';
import StockMarketNews from '../components/analytics/StockMarketNews';
import FinancialAssistant from '../components/analytics/FinancialAssistant';

export const Reports = () => {
    const [activeTab, setActiveTab ] = useState<'highest' | 'conversion'>('highest');

    return (
        <div style={{
            maxWidth: '1600px',
            minHeight: '100vh',
            marginTop: '-0.5rem'
        }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Financial Analytics</h1>
            </div>

            {/* KPI Cards */}
            <KPISection />

            {/* Top Row: Calculators & Combined Card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <AnalyticsCard title="Financial Planning Tools">
                    <FinancialCalculators />
                </AnalyticsCard>

                <AnalyticsCard style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
                        <button 
                            onClick={() => setActiveTab('highest')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === 'highest' ? '2px solid #1e293b' : 'none',
                                fontSize: '0.85rem',
                                fontWeight: activeTab === 'highest' ? '800' : '600',
                                color: activeTab === 'highest' ? '#1e293b' : '#94a3b8',
                                cursor: 'pointer'
                            }}
                        >
                            Highest
                        </button>
                        <button 
                            onClick={() => setActiveTab('conversion')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === 'conversion' ? '2px solid #1e293b' : 'none',
                                fontSize: '0.85rem',
                                fontWeight: activeTab === 'conversion' ? '800' : '600',
                                color: activeTab === 'conversion' ? '#1e293b' : '#94a3b8',
                                cursor: 'pointer'
                            }}
                        >
                            Conversion
                        </button>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                        {activeTab === 'highest' ? <HighestTransactions /> : <ConversionTool />}
                    </div>
                </AnalyticsCard>
            </div>

            {/* Bottom Row: Market & AI Assistant */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                <StockMarketNews />
                <FinancialAssistant />
            </div>
        </div>
    );
};


