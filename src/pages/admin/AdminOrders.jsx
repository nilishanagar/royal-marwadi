import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import AdminSidebar from '../../components/layout/AdminSidebar';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await getAllOrders(params);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-page-header"><h1>Orders</h1></div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-accent' : 'btn-ghost'}`} onClick={() => { setStatusFilter(s); setPage(1); }}>
              {s || 'All'}
            </button>
          ))}
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{order.orderItems.length} items</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(order.totalPrice)}</td>
                  <td><span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span></td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="input"
                      style={{ padding: '6px 8px', fontSize: '13px', width: 'auto' }}
                    >
                      {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
