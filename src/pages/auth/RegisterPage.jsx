import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuUser, LuMail, LuLock, LuEye, LuEyeOff, LuPhone } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/');
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
        <h2>Join the Family</h2>
        <p>Create an account to unlock exclusive offers, save your favourite pieces, and enjoy a seamless shopping experience.</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Fill in your details to get started</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-icon-wrapper">
                <LuUser size={18} />
                <input id="reg-name" className="input" placeholder="Your full name" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <div className="input-icon-wrapper">
                <LuMail size={18} />
                <input id="reg-email" type="email" className="input" placeholder="your@email.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-phone">Phone (Optional)</label>
              <div className="input-icon-wrapper">
                <LuPhone size={18} />
                <input id="reg-phone" className="input" placeholder="+91 9876543210" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-icon-wrapper">
                <LuLock size={18} />
                <input id="reg-password" type={showPassword ? 'text' : 'password'} className="input" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => updateField('password', e.target.value)} required minLength={6} />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
