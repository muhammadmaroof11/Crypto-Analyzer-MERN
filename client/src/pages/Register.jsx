import React, { useState } from 'react';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Success! Please Login.");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
    <div className="auth-container glass-panel">
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-input" type="text" name="name" placeholder="Full Name" onChange={handleChange} />
        <input className="form-input" type="email" name="email" placeholder="Email Address" onChange={handleChange} />
        <input className="form-input" type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>Register Now</button>
      </form>
    </div>
  );
};

export default Register;