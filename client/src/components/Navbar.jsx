import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel" style={{ borderRadius: "0 0 20px 20px", borderTop: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: "1px" }}>CRYPTO<span style={{ color: "#3b82f6" }}>ANALYZER</span></h2>
      </div>

      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register"><button className="btn-primary" style={{ padding: "8px 20px", marginLeft: "20px" }}>Get Started</button></Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Market</Link>
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "8px 20px", borderRadius: "8px", marginLeft: "30px", cursor: "pointer" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;