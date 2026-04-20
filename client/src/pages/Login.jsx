import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_name', res.data.name);
      
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data || "Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container glass-panel panel-cyan" style={{ borderBottomWidth: "4px" }}>
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <p style={{ color: "var(--accent-cyan)", fontSize: "11px", fontWeight: "800", letterSpacing: "3px", marginBottom: "8px", textTransform: "uppercase" }}>
          SECURE ACCESS
        </p>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" }}>Welcome Back</h2>
      </div>
      
      {error && <div style={{ color: "#f43f5e", textAlign: "center", marginBottom: "20px", fontSize: "13px", background: "rgba(244, 63, 94, 0.1)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(244, 63, 94, 0.1)" }}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
            <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", marginLeft: "5px", marginBottom: "5px", display: "block" }}>EMAIL ADDRESS</label>
            <input className="form-input" type="email" placeholder="name@company.com" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
            <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", marginLeft: "5px", marginBottom: "5px", display: "block" }}>PASSWORD</label>
            <input className="form-input" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "15px", height: "50px" }} disabled={isLoading}>
          {isLoading ? <Loader inline /> : "AUTHORIZE ACCESS"}
        </button>
      </form>
      
      <p style={{ textAlign: "center", marginTop: "25px", fontSize: "13px", color: "var(--text-secondary)" }}>
        Don't have an account? <Link to="/register" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: "700" }}>Register Hub</Link>
      </p>
    </div>
  );
};

export default Login;