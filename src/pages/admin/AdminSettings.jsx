import AdminSidebar from '../../components/layout/AdminSidebar';

export default function AdminSettings() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <h1>Settings</h1>
        </div>

        <div className="card" style={{ padding: '32px', maxWidth: '640px' }}>
          <h3 style={{ marginBottom: '24px' }}>Store Settings</h3>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Store Name</label>
            <input className="input" defaultValue="Royal Marwadi" />
          </div>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Contact Email</label>
            <input className="input" defaultValue="hello@royalmarwadi.com" />
          </div>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>Phone</label>
            <input className="input" defaultValue="+91 98765 43210" />
          </div>
          <div className="input-group" style={{ marginBottom: '16px' }}>
            <label>GST Rate (%)</label>
            <input className="input" type="number" defaultValue="18" />
          </div>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label>Free Shipping Above (₹)</label>
            <input className="input" type="number" defaultValue="5000" />
          </div>
          <button className="btn btn-accent">Save Settings</button>
        </div>
      </main>
    </div>
  );
}
