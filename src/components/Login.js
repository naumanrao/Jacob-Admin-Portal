import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_CONFIG = {
  LOGIN_URL: 'https://jacobpersonal.onrender.com/admin/api/login',
};

function Login({ darkMode = false, setDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [lang, setLang] = useState('en');
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

  React.useEffect(() => {
    localStorage.setItem('loginDarkMode', darkMode);
  }, [darkMode]);

  const translations = {
    en: {
      login: 'Login',
      username: 'Username or email',
      password: 'Password',
      rememberMe: 'Remember me',
      logIn: 'Log In',
      required: '*',
      fillAllFields: 'Please fill in all fields',
      loginSuccess: 'Login successful! Redirecting...',
      invalidCreds: 'Invalid credentials',
      loginFailed: 'Login failed. Please try again.',
    },
    'zh-CN': {
      login: '登录',
      username: '用户名或邮箱',
      password: '密码',
      rememberMe: '记住我',
      logIn: '登录',
      required: '*',
      fillAllFields: '请填写所有字段',
      loginSuccess: '登录成功！正在跳转...',
      invalidCreds: '无效的凭据',
      loginFailed: '登录失败，请重试。',
    },
    'zh-TW': {
      login: '登入',
      username: '用戶名或郵箱',
      password: '密碼',
      rememberMe: '記住我',
      logIn: '登入',
      required: '*',
      fillAllFields: '請填寫所有欄位',
      loginSuccess: '登入成功！正在跳轉...',
      invalidCreds: '無效的憑證',
      loginFailed: '登入失敗，請重試。',
    },
  };
  const t = translations[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ message: t.fillAllFields, type: 'danger' });
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
        setAlert({ message: t.loginSuccess, type: 'success' });
        setTimeout(() => navigate('/'), 1200);
      } else {
        setAlert({ message: t.invalidCreds, type: 'danger' });
        setPassword('');
      }
    } catch (error) {
      setAlert({ message: t.loginFailed, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"login-center-wrapper" + (darkMode ? " dark" : "") } style={{ minHeight: '100vh', background: darkMode ? '#181824' : undefined }}>
      <div className={"login-container" + (darkMode ? " dark" : "")} style={darkMode ? { background: '#232336', color: '#a259ff', boxShadow: '0 2px 16px rgba(0,0,0,0.7)', position: 'relative' } : { position: 'relative' }}>
        {/* Dark mode toggle - top right */}
        <button
          onClick={() => setDarkMode && setDarkMode(dm => !dm)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            position: 'absolute',
            top: 18,
            right: 24,
            background: darkMode ? '#232336' : '#f1f3f4',
            border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
            borderRadius: 20,
            padding: '8px 16px',
            color: darkMode ? '#a259ff' : '#333',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.12)' : '0 1px 4px rgba(60,60,60,0.04)',
            transition: 'background 0.2s',
            zIndex: 10,
          }}
        >
          {darkMode ? <span role="img" aria-label="Light">🌞</span> : <span role="img" aria-label="Dark">🌙</span>}
          {darkMode ? 'Light' : 'Dark'}
        </button>
        {/* Language Switcher - segmented control */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 24, marginTop: 40, gap: 16 }}>
          <div className="segmented-control" style={{
            display: 'inline-flex',
            background: darkMode ? '#232336' : '#f1f3f4',
            borderRadius: 24,
            boxShadow: darkMode ? '0 1px 4px rgba(0,0,0,0.12)' : '0 1px 4px rgba(60,60,60,0.04)',
            overflow: 'hidden',
            border: darkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}>
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
              style={{
                padding: '8px 20px',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span role="img" aria-label="English">🇺🇸</span> EN
            </button>
            <button
              className={lang === 'zh-CN' ? 'active' : ''}
              onClick={() => setLang('zh-CN')}
              style={{
                padding: '8px 20px',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span role="img" aria-label="简体">🇨🇳</span> 简体
            </button>
            <button
              className={lang === 'zh-TW' ? 'active' : ''}
              onClick={() => setLang('zh-TW')}
              style={{
                padding: '8px 20px',
                border: 'none',
                outline: 'none',
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span role="img" aria-label="繁體">🇹🇼</span> 繁體
            </button>
          </div>
        </div>
        <h1 className="login-title">{t.login}</h1>
        {/* Alert Messages */}
        {alert.message && (
          <div className={`alert alert-${alert.type}`}>{alert.message}</div>
        )}
        {/* Login Form */}
        <form id="loginForm" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label className="form-label">{t.username} <span className="required">{t.required}</span></label>
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
            <label className="form-label">{t.password} <span className="required">{t.required}</span></label>
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
              <label htmlFor="rememberMe">{t.rememberMe}</label>
            </div>
            {/* Removed Lost your password button */}
          </div>
          <button type="submit" className="login-button" id="loginBtn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span id="button-text">{t.logIn}</span>
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