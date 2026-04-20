import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await api.post('/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
          navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Error registering user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container glass-panel panel-cyan" style={{ borderBottomWidth: "4px" }}>
      <div style={{ textAlign: "center", marginBottom: "35px" }}>
        <p style={{ color: "var(--accent-cyan)", fontSize: "11px", fontWeight: "800", letterSpacing: "3px", marginBottom: "8px", textTransform: "uppercase" }}>
          PROTOCOL INITIALIZATION
        </p>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "800", margin: 0, letterSpacing: "-1px" }}>Create Identity</h2>
      </div>
      
      {success && <div style={{ color: "var(--accent-emerald)", textAlign: "center", marginBottom: "20px", fontSize: "13px", background: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>Success! Redirecting to Auth Gateway...</div>}
      {error && <div style={{ color: "#f43f5e", textAlign: "center", marginBottom: "20px", fontSize: "13px", background: "rgba(244, 63, 94, 0.1)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(244, 63, 94, 0.1)" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
            <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", marginLeft: "5px", marginBottom: "5px", display: "block" }}>FULL NAME</label>
            <input className="form-input" type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
        </div>
        <div>
            <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", marginLeft: "5px", marginBottom: "5px", display: "block" }}>EMAIL ADDRESS</label>
            <input className="form-input" type="email" name="email" placeholder="name@company.com" onChange={handleChange} required />
        </div>
        <div>
            <label style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: "700", marginLeft: "5px", marginBottom: "5px", display: "block" }}>SECURE PASSWORD</label>
            <input className="form-input" type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "15px", height: "50px" }} disabled={isLoading}>
          {isLoading ? <Loader inline /> : "INITIALIZE ACCOUNT"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "25px", fontSize: "13px", color: "var(--text-secondary)" }}>
        Already indexed? <Link to="/login" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: "700" }}>Login Gateway</Link>
      </p>
    </div>
  );
};

export default Register;