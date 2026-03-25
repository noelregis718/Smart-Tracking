import { useState } from 'react';
import KPISection from '../components/analytics/KPISection';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import HighestTransactions from '../components/analytics/HighestTransactions';
import ConversionTool from '../components/analytics/ConversionTool';
import FinancialCalculators from '../components/analytics/FinancialCalculators';
import StockMarketNews from '../components/analytics/StockMarketNews';
import IncomeSources from '../components/analytics/IncomeSources';


export const Reports = () => {
    const [activeTab, setActiveTab ] = useState<'highest' | 'conversion'>('highest');

    return (
        <div style={{
            maxWidth: '1600px',
            minHeight: '100vh',
            marginTop: '-0.5rem'
        }}>
            <div id="kpi-metrics" style={{ marginTop: '2mm' }}>
                <KPISection />
            </div>

            {/* Top Row: Calculators & Combined Card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <AnalyticsCard title="Financial Planning Tools">
                    <div id="planning-tools">
                        <FinancialCalculators />
                    </div>
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
                        {activeTab === 'highest' ? (
                            <div id="top-transactions">
                                <HighestTransactions />
                            </div>
                        ) : (
                            <div id="forex-tool">
                                <ConversionTool />
                            </div>
                        )}
                    </div>
                </AnalyticsCard>
            </div>

            {/* Bottom Row: Market & AI Assistant */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                <div id="market-news">
                    <StockMarketNews />
                </div>
                <div id="income-tracker">
                    <IncomeSources />
                </div>

            </div>
        </div>
    );
};
