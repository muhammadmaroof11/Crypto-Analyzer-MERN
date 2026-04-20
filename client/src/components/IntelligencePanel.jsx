import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader';

const IntelligencePanel = () => {
    const [fng, setFng] = useState(null);
    const [global, setGlobal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fngRes, globalRes] = await Promise.all([
                    axios.get('https://api.alternative.me/fng/?limit=1'),
                    axios.get('https://api.coingecko.com/api/v3/global')
                ]);
                setFng(fngRes.data.data[0]);
                setGlobal(globalRes.data.data);
            } catch (err) {
                console.error("Intelligence API Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader inline />;

    const getSentimentColor = (val) => {
        if (val > 75) return "#10b981"; // Extreme Greed
        if (val > 50) return "#06b6d4"; // Greed
        if (val > 25) return "#fbbf24"; // Fear
        return "#f43f5e"; // Extreme Fear
    };

    const getVerdict = (val) => {
        if (val > 75) return "Euphoria. Potential for correction.";
        if (val > 55) return "Bullish sentiment. Trend continues.";
        if (val > 45) return "Neutral. Market is undecided.";
        if (val > 25) return "Fearful. Opportunity emerging.";
        return "Extreme Fear. Historic buying zone.";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Fear & Greed Dial */}
            <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "15px" }}>MARKET SENTIMENT</p>
                <div style={{ position: "relative", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="120" height="120" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke={getSentimentColor(fng?.value || 50)} 
                            strokeWidth="8" 
                            strokeDasharray={`${(fng?.value / 100) * 283} 283`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            style={{ transition: "stroke-dasharray 1.5s ease" }}
                        />
                    </svg>
                    <div style={{ position: "absolute", textAlign: "center" }}>
                        <h2 style={{ margin: 0, fontSize: "28px" }}>{fng?.value}</h2>
                        <p style={{ margin: 0, fontSize: "10px", color: "#94a3b8" }}>F&G INDEX</p>
                    </div>
                </div>
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: getSentimentColor(fng?.value), fontWeight: "700" }}>
                        {fng?.value_classification.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* AI Verdict */}
            <div className="glass-panel" style={{ padding: "15px", borderLeft: `4px solid ${getSentimentColor(fng?.value)}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>AI ANALYST</span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.5", color: "#e2e8f0" }}>
                    <strong>Verdict:</strong> {getVerdict(fng?.value)}
                </p>
            </div>

            {/* Global Health */}
            <div className="glass-panel" style={{ padding: "15px" }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "600", marginBottom: "15px" }}>GLOBAL HEALTH</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "5px" }}>
                            <span>BTC DOMINANCE</span>
                            <span style={{ color: "#06b6d4" }}>{global?.market_cap_percentage?.btc.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                            <div style={{ height: "100%", width: `${global?.market_cap_percentage?.btc}%`, background: "#06b6d4", borderRadius: "2px" }}></div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "5px" }}>
                            <span>ETH DOMINANCE</span>
                            <span style={{ color: "#3b82f6" }}>{global?.market_cap_percentage?.eth.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                            <div style={{ height: "100%", width: `${global?.market_cap_percentage?.eth}%`, background: "#3b82f6", borderRadius: "2px" }}></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default IntelligencePanel;
