import { useState, useEffect } from 'react';
import { LuPlus, LuTrash2, LuPencil } from 'react-icons/lu';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';
import AdminSidebar from '../../components/layout/AdminSidebar';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      await createCategory(formData);
      setName('');
      setDescription('');
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Create failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <h1>Categories</h1>
          <button className="btn btn-accent btn-sm" onClick={() => setShowForm(!showForm)}>
            <LuPlus size={16} /> Add Category
          </button>
        </div>

        {showForm && (
          <form className="card" style={{ padding: '24px', marginBottom: '24px', maxWidth: '480px' }} onSubmit={handleCreate}>
            <div className="input-group" style={{ marginBottom: '12px' }}>
              <label>Category Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Description</label>
              <textarea className="input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-accent btn-sm">Create</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={{ fontWeight: 500 }}>{cat.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{cat.slug}</td>
                  <td>{cat.description || '—'}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(cat._id)} style={{ color: 'var(--error)' }}>
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
