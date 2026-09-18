import { useState, useEffect } from 'react';
import { LuDollarSign, LuShoppingCart, LuUsers, LuPackage, LuTrendingUp } from 'react-icons/lu';
import { getOrderStats } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import AdminSidebar from '../../components/layout/AdminSidebar';
import '../../components/layout/AdminSidebar.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getOrderStats();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header">
          <h1>Dashboard</h1>
          <p className="text-muted">Welcome back! Here's what's happening.</p>
        </div>

        <div className="kpi-grid">
          {[
            { label: 'Total Revenue', value: stats ? formatPrice(stats.totalRevenue) : '—', icon: LuDollarSign, color: '#059669', bg: '#D1FAE5' },
            { label: 'Total Orders', value: stats?.totalOrders || 0, icon: LuShoppingCart, color: '#2563EB', bg: '#DBEAFE' },
            { label: 'Processing', value: stats?.processingOrders || 0, icon: LuPackage, color: '#D97706', bg: '#FEF3C7' },
            { label: 'Delivered', value: stats?.deliveredOrders || 0, icon: LuTrendingUp, color: '#7C3AED', bg: '#EDE9FE' },
          ].map((kpi, i) => (
            <div key={i} className="kpi-card">
              <div className="kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                <kpi.icon size={24} />
              </div>
              <div>
                <p className="kpi-label">{kpi.label}</p>
                <p className="kpi-value">{loading ? '...' : kpi.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Revenue */}
        {stats?.monthlyRevenue?.length > 0 && (
          <div className="data-table-wrapper" style={{ marginTop: '24px' }}>
            <div style={{ padding: '20px 20px 12px' }}>
              <h3 style={{ fontSize: '18px' }}>Monthly Revenue</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyRevenue.map((m) => (
                  <tr key={m._id}>
                    <td>{m._id}</td>
                    <td>{m.count}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(m.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
