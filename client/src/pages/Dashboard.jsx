import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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
  const [totalBalance, setTotalBalance] = useState(0);
  const [userName, setUserName] = useState("Trader");
  const navigate = useNavigate();

  const portfolioHoldings = [
    { id: 'bitcoin', amount: 0.5 },
    { id: 'ethereum', amount: 5.2 },
    { id: 'solana', amount: 120 }
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Portfolio Value',
        data: [42000, 43500, 42800, 45200, 46800, 47500, totalBalance > 0 ? totalBalance : 48000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('user_name');
    
    if (!token) navigate('/login');
    if (storedName) setUserName(storedName);

    const fetchData = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        setCoins(res.data);

        let currentVal = 0;
        portfolioHoldings.forEach(holding => {
          const coinData = res.data.find(c => c.id === holding.id);
          if (coinData) currentVal += (coinData.current_price * holding.amount);
        });
        setTotalBalance(currentVal > 0 ? currentVal : 48500); 

      } catch (err) {
        console.error("API Error");
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-container" style={{ paddingBottom: "50px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "35px" }}>
        
        <div>
          <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600", letterSpacing: "1px", marginBottom: "5px", textTransform: "uppercase" }}>
            Welcome back
          </p>
          <h1 style={{ 
            fontSize: "3rem",
            fontWeight: "800", 
            margin: 0, 
            background: "linear-gradient(to right, #fff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {userName}
          </h1>
        </div>

        <div style={{ textAlign: "right", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.1)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <span style={{ height: "8px", width: "8px", backgroundColor: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px #10b981" }}></span>
              <span style={{ color: "#10b981", fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>LIVE MARKET</span>
            </div>
        </div>

      </div>

      <div className="dashboard-grid">
        
        <div className="glass-panel" style={{ padding: "25px", height: "550px", display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>Portfolio Performance</h3>
          <div className="chart-container" style={{ flex: 1, height: "100%" }}>
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            <div className="glass-panel" style={{ padding: "25px", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(30, 41, 59, 0.7))" }}>
                <p style={{ color: "#94a3b8", fontSize: "13px", letterSpacing: "1px", marginBottom: "8px" }}>TOTAL ESTIMATED VALUE</p>
                <h1 style={{ fontSize: "36px", margin: "0 0 10px 0" }}>
                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
                <p style={{ color: "#10b981", fontSize: "14px", fontWeight: "600" }}>▲ +2.4% <span style={{ color: "#94a3b8", fontWeight: "400" }}>vs last week</span></p>
                
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                    <button className="btn-primary" style={{ flex: 1, padding: "10px" }}>Deposit</button>
                    <button style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: "8px", cursor: "pointer" }}>Withdraw</button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: "20px", flex: 1 }}>
                <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>Top Movers</h3>
                <div className="coin-list-vertical" style={{ maxHeight: "250px" }}>
                    {coins.slice(0, 5).map(coin => (
                    <div key={coin.id} className="coin-row" style={{ padding: "10px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img src={coin.image} alt={coin.name} width="30" style={{ borderRadius: "50%" }} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: "13px" }}>{coin.symbol.toUpperCase()}</h4>
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "13px" }}>${coin.current_price.toLocaleString()}</p>
                            <p className={coin.price_change_percentage_24h > 0 ? "text-green" : "text-red"} style={{ margin: 0, fontSize: "11px" }}>
                                {coin.price_change_percentage_24h.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;