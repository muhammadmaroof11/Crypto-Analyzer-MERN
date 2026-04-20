import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('user_name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel" style={{ borderRadius: "0 0 20px 20px", borderTop: "none", display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr", alignItems: "center", padding: "15px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <h2 style={{ margin: 0, fontWeight: 800, letterSpacing: "1px", fontSize: "16px", borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: "25px" }}>
            CRYPTO<span style={{ color: "var(--accent-blue)" }}>ANALYZER</span>
        </h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "var(--accent-cyan)", fontWeight: "800", fontSize: "14px", letterSpacing: "1px" }}>DASHBOARD</span>
            <span style={{ color: "var(--text-secondary)", fontSize: "9px", letterSpacing: "2px", fontWeight: "700" }}>v4.0 TERMINAL</span>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        {token && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "700", marginBottom: "2px" }}>OPERATOR</span>
                <span style={{ color: "var(--accent-cyan)", fontWeight: "800", fontSize: "15px", textShadow: "0 0 15px rgba(6, 182, 212, 0.3)" }}>{userName || "TRADER"}</span>
            </div>
        )}
      </div>

      <div className="nav-links" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
        {token && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(16, 185, 129, 0.05)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.1)", marginRight: "10px" }}>
                <div className="live-indicator" style={{ width: "8px", height: "8px" }}></div>
                <span style={{ color: "#10b981", fontSize: "10px", fontWeight: "800" }}>ONLINE</span>
            </div>
        )}
        {!token ? (
          <>
            <NavLink to="/login" style={{ marginLeft: "0" }}>Login</NavLink>
            <Link to="/register"><button className="btn-primary" style={{ padding: "8px 20px" }}>Get Started</button></Link>
          </>
        ) : (
          <>
            <NavLink to="/dashboard" style={{ fontSize: "12px" }}>Market</NavLink>
            <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;