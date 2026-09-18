import { useState, useEffect } from 'react';
import { LuSearch, LuTrash2 } from 'react-icons/lu';
import { getUsers, deleteUser, updateUser } from '../../services/userService';
import { formatDate } from '../../utils/helpers';
import AdminSidebar from '../../components/layout/AdminSidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const { data } = await getUsers(params);
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header"><h1>Users</h1></div>

        <div style={{ marginBottom: '24px', maxWidth: '400px', position: 'relative' }}>
          <input className="input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', paddingLeft: '40px' }} />
          <LuSearch size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="input" style={{ padding: '6px 8px', fontSize: '13px', width: 'auto' }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(u._id)} style={{ color: 'var(--error)' }}>
                      <LuTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
