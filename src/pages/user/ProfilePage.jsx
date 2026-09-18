import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuUser, LuMail, LuPhone, LuLock, LuSave } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePassword } from '../../services/authService';
import './UserPages.css';

export default function ProfilePage() {
  const { user, dispatch } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateProfile(form);
      dispatch({ type: 'UPDATE_USER', payload: data.user });
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password updated!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="page container user-page">
      <h1>My Profile</h1>
      <div className="user-tabs">
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => { setTab('profile'); setMessage(''); setError(''); }}>Profile</button>
        <button className={tab === 'password' ? 'active' : ''} onClick={() => { setTab('password'); setMessage(''); setError(''); }}>Password</button>
      </div>

      {message && <div className="user-message success">{message}</div>}
      {error && <div className="user-message error">{error}</div>}

      {tab === 'profile' && (
        <form className="user-form card" onSubmit={handleProfileUpdate}>
          <div className="input-group">
            <label>Full Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-accent"><LuSave size={16} /> Save Changes</button>
        </form>
      )}

      {tab === 'password' && (
        <form className="user-form card" onSubmit={handlePasswordUpdate}>
          <div className="input-group">
            <label>Current Password</label>
            <input type="password" className="input" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input type="password" className="input" minLength={6} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
          </div>
          <div className="input-group">
            <label>Confirm New Password</label>
            <input type="password" className="input" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-accent"><LuLock size={16} /> Update Password</button>
        </form>
      )}
    </div>
  );
}
