import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import api from '../api';
import Loader from '../components/Loader';
import AddAssetModal from '../components/AddAssetModal';
import NewsFeed from '../components/NewsFeed';
import IntelligencePanel from '../components/IntelligencePanel';
import AllocationChart from '../components/AllocationChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [userPortfolio, setUserPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [total24hChange, setTotal24hChange] = useState({ usd: 0, percentage: 0 });
  const [userName, setUserName] = useState("Trader");
  const [activeTab, setActiveTab] = useState('all');
  
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const chartData = {
    labels: historicalData.map(d => {
        const date = new Date(d[0]);
        return date.getHours() + ":00";
    }),
    datasets: [
      {
        label: `${selectedCoin?.name || 'Asset'} Price`,
        data: historicalData.map(d => d[1]),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: { display: false },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(8, 10, 18, 0.95)',
            titleColor: '#94a3b8',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            titleFont: { family: 'Outfit', size: 13 },
            bodyFont: { family: 'Outfit', size: 14 }
        }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#475569', font: { size: 10 } } },
    },
  };

  const fetchHistoricalData = async (coinId) => {
    setIsLoadingChart(true);
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`);
      setHistoricalData(res.data.prices);
    } catch (err) {
      console.error("Chart API Error");
    } finally {
      setIsLoadingChart(false);
    }
  };

  const fetchCoinDetails = async (coinId) => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
      setCoinDetails(res.data);
    } catch (err) {
      console.error("Details API Error");
    }
  };

  const toggleWatchlist = async (coinId) => {
    try {
      const res = await api.put('/watchlist', { coinId });
      setWatchlist(res.data);
    } catch (err) {
      console.error("Watchlist Error");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('user_name');
    
    if (!token) navigate('/login');
    if (storedName) setUserName(storedName);

    const fetchMarketData = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false');
        setCoins(res.data);
        if (!selectedCoin) setSelectedCoin(res.data[0]);
        setIsLoadingMarket(false);
      } catch (err) {
        console.error("Market API Error");
        setIsLoadingMarket(false);
      }
    };

    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/portfolio');
        setUserPortfolio(res.data);
      } catch (err) {
        console.error("Portfolio fetch error");
      } finally {
        setIsLoadingPortfolio(false);
      }
    };

    const fetchWatchlist = async () => {
        try {
            const res = await api.get('/watchlist');
            setWatchlist(res.data);
        } catch (err) {}
    };

    fetchMarketData();
    fetchPortfolio();
    fetchWatchlist();
  }, [navigate]);

  useEffect(() => {
    if (selectedCoin) {
        fetchHistoricalData(selectedCoin.id);
        fetchCoinDetails(selectedCoin.id);
    }
  }, [selectedCoin]);

  useEffect(() => {
    if (coins.length > 0 && userPortfolio.length > 0) {
      let currentVal = 0;
      let val24hAgo = 0;

      userPortfolio.forEach(holding => {
        const coinData = coins.find(c => c.id === holding.coinId);
        if (coinData) {
            const currentPrice = coinData.current_price;
            const priceChangePercent = coinData.price_change_percentage_24h / 100;
            const price24hAgo = currentPrice / (1 + priceChangePercent);
            currentVal += (currentPrice * holding.amount);
            val24hAgo += (price24hAgo * holding.amount);
        }
      });

      setTotalBalance(currentVal);
      const diff = currentVal - val24hAgo;
      const pct = val24hAgo > 0 ? (diff / val24hAgo) * 100 : 0;
      setTotal24hChange({ usd: diff, percentage: pct });
    }
  }, [coins, userPortfolio]);

  const displayedCoins = activeTab === 'all' 
    ? coins 
    : coins.filter(c => watchlist.includes(c.id));

  return (
    <div className="dashboard-container" style={{ paddingBottom: "40px", paddingTop: "20px" }}>
      
      <div className="dashboard-grid">
        
        {/* Column 1: Left (Normalized to Center Height) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div className="glass-panel panel-emerald" style={{ padding: "20px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(13, 17, 28, 0.9))" }}>
                <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px" }}>ESTIMATED VALUE</p>
                <h1 style={{ fontSize: "28px", margin: "0 0 10px 0", fontWeight: "800" }}>
                    {isLoadingPortfolio ? "CALC..." : `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h1>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {!isLoadingPortfolio && (
                        <p style={{ color: total24hChange.usd >= 0 ? "#10b981" : "#f43f5e", fontSize: "12px", fontWeight: "800", margin: 0 }}>
                            {total24hChange.usd >= 0 ? "▲" : "▼"} {total24hChange.percentage.toFixed(2)}%
                        </p>
                    )}
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: "6px 12px", fontSize: "10px" }}>ADD ASSET</button>
                </div>
            </div>

            <AllocationChart portfolio={userPortfolio} coins={coins} />

            <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "340px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h3 style={{ margin: 0, fontSize: "14px" }}>Market Hub</h3>
                    <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "2px" }}>
                        {['all', 'watch'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "4px 8px", fontSize: "9px", border: "none", borderRadius: "6px", cursor: "pointer", background: activeTab === tab ? "var(--accent-blue)" : "transparent", color: activeTab === tab ? "white" : "#64748b", fontWeight: "700" }}>
                                {tab === 'watch' ? 'WATCH' : 'ALL'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="coin-list-vertical scroll-area" style={{ flex: 1, overflowY: "auto" }}>
                    {isLoadingMarket ? <Loader /> : displayedCoins.map(coin => (
                        <div key={coin.id} onClick={() => setSelectedCoin(coin)} className={`coin-row ${selectedCoin?.id === coin.id ? 'active' : ''}`} style={{ padding: "10px", cursor: "pointer", marginBottom: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <img src={coin.image} alt="coin" width="18" />
                                <h4 style={{ margin: 0, fontSize: "11px" }}>{coin.symbol.toUpperCase()}</h4>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ margin: 0, fontWeight: "700", fontSize: "11px" }}>${coin.current_price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Column 2: Center (Master Anchor) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div className="glass-panel panel-cyan" style={{ padding: "30px", height: "auto", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <div>
                        <div className="coin-selector-container">
                            <h3 style={{ margin: 0, fontSize: "18px" }}>{selectedCoin?.name || 'Perspective'}</h3>
                            <span className="chevron-icon">▼</span>
                            <select 
                                className="coin-select-hidden" 
                                value={selectedCoin?.id || ''} 
                                onChange={(e) => {
                                    const coin = coins.find(c => c.id === e.target.value);
                                    if (coin) setSelectedCoin(coin);
                                }}
                            >
                                {coins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#64748b" }}>24H MARKET TRAJECTORY</p>
                    </div>
                    {selectedCoin && (
                        <button 
                            onClick={() => toggleWatchlist(selectedCoin.id)}
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "10px", borderRadius: "12px", cursor: "pointer", fontSize: "18px", color: watchlist.includes(selectedCoin.id) ? "#fbbf24" : "#475569" }}
                        >
                            {watchlist.includes(selectedCoin.id) ? "★" : "☆"}
                        </button>
                    )}
                </div>
                <div className="chart-container">
                    {isLoadingChart && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}><Loader /></div>}
                    {historicalData.length > 0 ? <Line options={chartOptions} data={chartData} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>Select asset to view metrics</div>}
                </div>
            </div>

            {selectedCoin && coinDetails && (
                <div className="glass-panel" style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", height: "210px" }}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", marginBottom: "8px" }}>GLOBAL RANK</p>
                        <h4 style={{ margin: 0, fontSize: "18px" }}>#{coinDetails.market_cap_rank}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", marginBottom: "8px" }}>24H HIGH</p>
                        <h4 style={{ margin: 0, fontSize: "18px" }}>${coinDetails.market_data.high_24h.usd.toLocaleString()}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", marginBottom: "8px" }}>24H LOW</p>
                        <h4 style={{ margin: 0, fontSize: "18px" }}>${coinDetails.market_data.low_24h.usd.toLocaleString()}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <p style={{ color: "#64748b", fontSize: "10px", fontWeight: "700", marginBottom: "8px" }}>ATH</p>
                        <h4 style={{ margin: 0, fontSize: "18px", color: "#06b6d4" }}>${coinDetails.market_data.ath.usd.toLocaleString()}</h4>
                    </div>
                </div>
            )}
        </div>

        {/* Column 3: Right (Normalized to Center Height) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <IntelligencePanel />
            <div className="glass-panel" style={{ padding: "25px", height: "450px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "15px" }}>Market Sentiment</h3>
                    <span style={{ fontSize: "10px", color: "#06b6d4", fontWeight: "800" }}>LIVE FEED</span>
                </div>
                <div className="scroll-area" style={{ flex: 1, overflowY: "auto" }}>
                    <NewsFeed />
                </div>
            </div>
        </div>

      </div>

      {/* Grounding Footer */}
      <div style={{ marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.5 }}>
          <p style={{ fontSize: "11px", letterSpacing: "1px" }}>DEFI ANALYZER TERMINAL v4.0</p>
          <p style={{ fontSize: "11px" }}>POWERED BY COINGECKO API</p>
      </div>

      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} coins={coins} onAssetAdded={() => api.get('/portfolio').then(res => setUserPortfolio(res.data))} />
    </div>
  );
};

export default Dashboard;