import React, { useState, useEffect } from 'react';
import AnalyticsCard from './AnalyticsCard';

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

interface NewsItem {
    id: number;
    headline: string;
    summary: string;
    url: string;
    source: string;
    datetime: number;
}

const StockMarketNews: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!FINNHUB_KEY) {
                setError('API Key missing');
                setIsLoading(false);
                return;
            }
            
            try {
                const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`);
                if (!newsRes.ok) {
                    throw new Error(`HTTP error! status: ${newsRes.status}`);
                }
                const newsData = await newsRes.json();
                
                if (Array.isArray(newsData)) {
                    setNews(newsData.slice(0, 6));
                    setError(null);
                } else {
                    console.error('Unexpected news data format:', newsData);
                    setError('Unable to parse intelligence feed');
                }
            } catch (error) {
                console.error('Market news fetch error:', error);
                setError('Market data stream offline');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        const tid = setInterval(fetchData, 300000);
        return () => clearInterval(tid);
    }, []);

    if (isLoading && news.length === 0) {
        return (
            <AnalyticsCard title="Market Intelligence">
                <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '800' }}>
                    Initializing intelligence feed...
                </div>
            </AnalyticsCard>
        );
    }

    if (error || news.length === 0) {
        return (
            <AnalyticsCard title="Market Intelligence">
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '800', textAlign: 'center' }}>
                    {error || 'No market news available at this time.'}
                </div>
            </AnalyticsCard>
        );
    }

    return (
        <AnalyticsCard title="Market Intelligence" style={{ minHeight: '440px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {news.slice(0, 3).map((item: NewsItem) => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '10px', borderBottom: '1px solid #f8fafc' }}>
                            <a href={item.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', lineHeight: '1.4' }}>{item.headline}</div>
                            </a>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '9px', fontWeight: '800', color: '#cbd5e1' }}>
                                <span style={{ textTransform: 'uppercase' }}>{item.source}</span>
                                <span>•</span>
                                <span>{new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {news.slice(3, 6).map((item: NewsItem) => (
                        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '10px', borderBottom: '1px solid #f8fafc' }}>
                            <a href={item.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', lineHeight: '1.4' }}>{item.headline}</div>
                            </a>
                            <div style={{ display: 'flex', gap: '8px', fontSize: '9px', fontWeight: '800', color: '#cbd5e1' }}>
                                <span style={{ textTransform: 'uppercase' }}>{item.source}</span>
                                <span>•</span>
                                <span>{new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnalyticsCard>
    );
};

export default StockMarketNews;
