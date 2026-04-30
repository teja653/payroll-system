// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate in React Router v6
import styles from '../../styles/Admin/LoginPage.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Replacing useHistory with useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      }, { withCredentials: true });

      console.log(response.data); // Debug the response

      // Redirect to the dashboard based on role
      if (response.data.dashboard_url) {
        navigate(response.data.dashboard_url);
      } else {
        setError('No dashboard URL provided for this role.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <>
    <div className={styles.container}>
    <div className={styles.loginBox}>
      <div className={styles.loginHeader}>
        <header>Login</header>
      </div>
      <form onSubmit={handleLogin} className={styles.form}>
      <div className={styles.inputBox}>
        <input
            type="text"
            className={styles.inputField}
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
      </div>
      <div className={styles.inputBox}>
        <input
            type="password"
            className={styles.inputField}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.inputSubmit}>
        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
      </div>
      </form>
    </div>
    </div>
    </>
  );
};

export default LoginPage;
