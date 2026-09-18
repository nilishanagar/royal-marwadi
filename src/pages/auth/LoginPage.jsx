import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuMail, LuLock, LuEye, LuEyeOff } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch {
      // error is set via context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="logo-text" style={{ color: 'white', fontSize: '32px' }}>Royal</span>
          <span className="logo-accent" style={{ fontSize: '30px' }}>Marwadi</span>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to access your account, track orders, and explore exclusive collections.</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h1>Sign In</h1>
          <p className="auth-subtitle">Enter your credentials to continue</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <div className="input-icon-wrapper">
                <LuMail size={18} />
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-icon-wrapper">
                <LuLock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

          <div className="demo-credentials">
            <p><strong>Demo Admin:</strong> admin@royalmarwadi.com / Admin@123</p>
            <p><strong>Demo Customer:</strong> arjun@example.com / Customer@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
