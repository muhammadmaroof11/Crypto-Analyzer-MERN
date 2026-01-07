import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_name', res.data.name);
      
      navigate('/dashboard');
      
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="auth-container glass-panel">
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <input className="form-input" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="form-input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>Login</button>
      </form>
    </div>
  );
};

export default Login;