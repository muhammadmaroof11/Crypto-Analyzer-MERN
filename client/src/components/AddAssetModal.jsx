import React, { useState } from 'react';
import './Modal.css';
import Loader from './Loader';
import api from '../api';

const AddAssetModal = ({ isOpen, onClose, coins, onAssetAdded }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [amount, setAmount] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const filteredCoins = coins.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async () => {
        if (!selectedCoin || !amount) return;
        setIsSaving(true);
        try {
            // Get current portfolio
            const res = await api.get('/portfolio');
            let portfolio = res.data;
            
            // Add or update
            const existingIndex = portfolio.findIndex(p => p.coinId === selectedCoin.id);
            if (existingIndex > -1) {
                portfolio[existingIndex].amount = parseFloat(amount);
            } else {
                portfolio.push({ coinId: selectedCoin.id, amount: parseFloat(amount) });
            }

            await api.post('/portfolio', { portfolio });
            onAssetAdded();
            onClose();
        } catch (err) {
            console.error("Save error", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add Asset</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="asset-search">
                    <input 
                        className="form-input" 
                        placeholder="Search coin (e.g. BTC)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="asset-results">
                    {filteredCoins.slice(0, 5).map(coin => (
                        <div 
                            key={coin.id} 
                            className={`asset-item ${selectedCoin?.id === coin.id ? 'selected' : ''}`}
                            onClick={() => setSelectedCoin(coin)}
                        >
                            <img src={coin.image} alt={coin.name} width="24" />
                            <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                        </div>
                    ))}
                </div>

                {selectedCoin && (
                    <div style={{ animation: "fadeIn 0.3s" }}>
                        <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "10px" }}>
                            How much <strong>{selectedCoin.name}</strong> do you hold?
                        </p>
                        <input 
                            className="form-input" 
                            type="number" 
                            placeholder="Amount (e.g. 0.5)" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button 
                            className="btn-primary" 
                            style={{ width: "100%", marginTop: "20px" }}
                            onClick={handleSave}
                            disabled={isSaving || !amount}
                        >
                            {isSaving ? <Loader inline /> : "Save Asset"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddAssetModal;
