import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuPackage, LuEye } from 'react-icons/lu';
import { getMyOrders } from '../../services/orderService';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';
import './UserPages.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="page container flex-center" style={{ minHeight: '40vh' }}><div className="spinner" /></div>;
  }

  return (
    <div className="page container user-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <LuPackage size={56} color="var(--text-muted)" />
          <h3>No orders yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Start shopping to see your orders here.</p>
          <Link to="/shop" className="btn btn-accent" style={{ marginTop: '16px' }}>Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card card">
              <div className="order-card-header">
                <div>
                  <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`badge ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
              </div>
              <div className="order-card-items">
                {order.orderItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="order-item-mini">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <p className="text-muted" style={{ fontSize: '13px' }}>+{order.orderItems.length - 3} more items</p>
                )}
              </div>
              <div className="order-card-footer">
                <span className="order-total">Total: <strong>{formatPrice(order.totalPrice)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
