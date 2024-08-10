import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();

  const { name, email, phone, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('https://helpify-backend-7a73.onrender.com/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(res.data);
      if (res.data.success) {
        navigate('/');
      }
    } catch (err) {
      if (err.response) {
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        console.error('Error request:', err.request);
      } else {
        console.error('Error message:', err.message);
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', width: '300px' }}
      >
        <h2 style={{ marginBottom: '20px' }}>Sign Up</h2>
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Name"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Email"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="phone"
              value={phone}
              onChange={onChange}
              required
              placeholder="Phone"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Password"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Sign Up
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
