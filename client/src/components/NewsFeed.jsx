import React from 'react';
import './NewsFeed.css';

const NewsFeed = () => {
    // Curated mock news representing real market sentiment
    const news = [
        {
            id: 1,
            title: "Bitcoin Institutional Adoption Grows as Major Banks Open ETF Access",
            source: "CoinDesk",
            time: "2h ago",
            badge: "ETFs",
            image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=200&h=200&fit=crop"
        },
        {
            id: 2,
            title: "Ethereum Ecosystem Thrives with New Layer-2 Scalability Breakthroughs",
            source: "Decrypt",
            time: "5h ago",
            badge: "SCALING",
            image: "https://images.unsplash.com/photo-1622790694515-974f144ce8bc?w=200&h=200&fit=crop"
        },
        {
            id: 3,
            title: "Regulators Propose Clearer Standards for Global Stablecoin Operations",
            source: "The Block",
            time: "8h ago",
            badge: "POLICY",
            image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=200&h=200&fit=crop"
        },
        {
            id: 4,
            title: "DeFi Yield Protocols Experience Surge in TVL Amidst Market Stability",
            source: "Bloomberg",
            time: "12h ago",
            badge: "DEFI",
            image: "https://images.unsplash.com/photo-1644333649534-f36894676660?w=200&h=200&fit=crop"
        }
    ];

    return (
        <div className="news-container">
            {news.map(item => (
                <a key={item.id} href="#" className="news-card">
                    <img src={item.image} alt="news" className="news-image" />
                    <div className="news-content">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="news-badge">{item.badge}</span>
                            <span className="news-time">{item.time}</span>
                        </div>
                        <h4 className="news-title">{item.title}</h4>
                        <div className="news-meta">
                            <span className="news-source">{item.source}</span>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default NewsFeed;
