import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuCheck, LuArrowRight } from 'react-icons/lu';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { formatPrice } from '../../utils/helpers';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id, name: item.name, price: item.price, quantity: item.quantity, image: item.images?.[0] || '',
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };
      await createOrder(orderData);
      clearCart();
      setStep(4);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Success step
  if (step === 4) {
    return (
      <div className="page container checkout-success">
        <div className="success-icon"><LuCheck size={48} /></div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with Royal Marwadi. Your order is being processed.</p>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-accent" onClick={() => navigate('/my-orders')}>View Orders</button>
          <button className="btn btn-outline" onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        {/* Steps */}
        <div className="checkout-steps">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <div key={i} className={`checkout-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-number">{step > i + 1 ? <LuCheck size={16} /> : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 1 && (
              <div className="checkout-section card animate-fadeIn">
                <h3>Shipping Address</h3>
                <div className="checkout-form-grid">
                  <div className="input-group"><label>Full Name</label><input className="input" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required /></div>
                  <div className="input-group"><label>Phone</label><input className="input" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required /></div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Address Line 1</label><input className="input" value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })} required /></div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}><label>Address Line 2</label><input className="input" value={address.addressLine2} onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })} /></div>
                  <div className="input-group"><label>City</label><input className="input" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required /></div>
                  <div className="input-group"><label>State</label><input className="input" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required /></div>
                  <div className="input-group"><label>Pincode</label><input className="input" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} required /></div>
                </div>
                <button className="btn btn-accent" onClick={() => setStep(2)} style={{ marginTop: '20px' }}>Continue to Payment <LuArrowRight size={16} /></button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section card animate-fadeIn">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  {['COD', 'Online'].map((method) => (
                    <label key={method} className={`payment-option ${paymentMethod === method ? 'active' : ''}`}>
                      <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                      <div>
                        <strong>{method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</strong>
                        <p>{method === 'COD' ? 'Pay when your order arrives' : 'Pay now via UPI, Cards, or Net Banking'}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-accent" onClick={() => setStep(3)}>Review Order <LuArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-section card animate-fadeIn">
                <h3>Review Your Order</h3>
                <div className="review-block">
                  <h4>Shipping to:</h4>
                  <p>{address.fullName}, {address.phone}</p>
                  <p>{address.addressLine1}, {address.addressLine2}</p>
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                </div>
                <div className="review-block">
                  <h4>Payment:</h4>
                  <p>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                </div>
                <div className="review-block">
                  <h4>Items ({cartItems.length}):</h4>
                  {cartItems.map((item) => (
                    <div key={item._id} className="review-item">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-accent btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="checkout-summary card">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
