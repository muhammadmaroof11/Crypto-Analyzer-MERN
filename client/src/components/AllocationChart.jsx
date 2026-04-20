import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AllocationChart = ({ portfolio, coins }) => {
    
    const allocationData = portfolio.map(holding => {
        const coin = coins.find(c => c.id === holding.coinId);
        return {
            name: coin?.symbol.toUpperCase() || '???',
            value: (coin?.current_price || 0) * holding.amount
        };
    }).filter(a => a.value > 0);

    const data = {
        labels: allocationData.map(a => a.name),
        datasets: [
            {
                data: allocationData.map(a => a.value),
                backgroundColor: [
                    '#06b6d4',
                    '#10b981',
                    '#3b82f6',
                    '#8b5cf6',
                    '#f43f5e',
                    '#f97316'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }
        ]
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    padding: 20,
                    font: {
                        size: 11,
                        family: 'Outfit'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#94a3b8',
                cornerRadius: 8
            }
        },
        maintainAspectRatio: false,
        cutout: '75%'
    };

    return (
        <div className="glass-panel" style={{ padding: "20px", height: "280px", display: "flex", flexDirection: "column" }}>
            <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", marginBottom: "15px" }}>ASSET ALLOCATION</p>
            <div style={{ flex: 1, position: "relative" }}>
                 {allocationData.length > 0 ? (
                     <Doughnut data={data} options={options} />
                 ) : (
                     <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", fontSize: "13px" }}>
                         Add assets to see breakdown
                     </div>
                 )}
            </div>
        </div>
    );
};

export default AllocationChart;
