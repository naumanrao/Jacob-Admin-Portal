import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_CONFIG = {
  LOGIN_URL: 'https://jacobpersonal.onrender.com/admin/api/login',
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  // Load remembered credentials on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
      if (rememberedPassword) setPassword(rememberedPassword);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ message: 'Please fill in all fields', type: 'danger' });
      return;
    }
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    setLoading(true);
    setAlert({ message: '', type: '' });
    try {
      const response = await fetch(API_CONFIG.LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userInfo', JSON.stringify(data.user));
        sessionStorage.setItem('loginTime', new Date().toISOString());
        setAlert({ message: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/'), 1200);
      } else {
        setAlert({ message: 'Invalid credentials', type: 'danger' });
        setPassword('');
      }
    } catch (error) {
      setAlert({ message: 'Login failed. Please try again.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-center-wrapper">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        {/* Alert Messages */}
        {alert.message && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}
        {/* Login Form */}
        <form id="loginForm" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label className="form-label">Username or email <span className="required">*</span></label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button
              type="button"
              className="forgot-password"
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
              onClick={() => alert('Forgot password functionality would be implemented here.')}
            >
              Lost your password?
            </button>
          </div>
          <button type="submit" className="login-button" id="loginBtn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span id="button-text">Log In</span>
                <i className="fas fa-arrow-right" id="button-icon"></i>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 