import React from 'react';
import { useNavigate } from 'react-router-dom';

function TopNavbar({ breadcrumbText, onSaveDraft, onPublish, onSidebarToggle }) {
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
        {userInfo && (
          <span style={{ fontSize: '0.95rem', color: '#555' }}>
            <i className="fas fa-user-circle me-1"></i>
            {userInfo.name || userInfo.email || userInfo.username || 'User'}
          </span>
        )}
        <button className="btn btn-save-draft" onClick={onSaveDraft}>Save As Draft</button>
        <button className="btn btn-publish" onClick={onPublish}>Publish Course</button>
        <button className="btn btn-outline-primary" onClick={handleLogout} style={{ marginLeft: 8 }}>
          <i className="fas fa-sign-out-alt me-1"></i>Logout
        </button>
      </div>
    </nav>
  );
}

export default TopNavbar; 