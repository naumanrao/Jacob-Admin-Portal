import React from 'react';
import { useNavigate } from 'react-router-dom';

function TopNavbar({ breadcrumbText, onSaveDraft, onPublish, onSidebarToggle, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const userInfo = React.useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('userInfo'));
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('loginTime');
    navigate('/login');
  };

  return (
    <nav className="top-navbar">
      <div className="d-flex align-items-center">
        <button className="btn btn-link d-md-none me-3" onClick={onSidebarToggle}>
          <i className="fas fa-bars"></i>
        </button>
        <div className="breadcrumb-nav">
          <a href="/">Home</a>
          <i className="fas fa-chevron-right"></i>
          <span id="breadcrumb-text">{breadcrumbText}</span>
        </div>
      </div>
      <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Remove Language Selector */}
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(dm => !dm)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            background: darkMode ? '#232336' : '#f1f3f4',
            border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
            borderRadius: 20,
            padding: '6px 14px',
            color: darkMode ? '#a259ff' : '#333',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.12)' : '0 1px 4px rgba(60,60,60,0.04)',
            transition: 'background 0.2s',
          }}
        >
          {darkMode ? <span role="img" aria-label="Light">🌞</span> : <span role="img" aria-label="Dark">🌙</span>}
          {darkMode ? 'Light' : 'Dark'}
        </button>
        {userInfo && (
          <span style={{ fontSize: '0.95rem', color: '#555' }}>
            <i className="fas fa-user-circle me-1"></i>
            {userInfo.name || userInfo.email || userInfo.username || 'User'}
          </span>
        )}
        <button className="btn btn-outline-primary" onClick={handleLogout} style={{ marginLeft: 8 }}>
          <i className="fas fa-sign-out-alt me-1"></i>Logout
        </button>
      </div>
    </nav>
  );
}

export default TopNavbar; 