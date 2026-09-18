import { Link } from 'react-router-dom';
import { LuMinus, LuPlus, LuTrash2, LuArrowRight, LuShoppingBag } from 'react-icons/lu';
import { useCart } from '../../context/CartContext';
import { formatPrice, PLACEHOLDER_IMAGE } from '../../utils/helpers';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, shipping, tax, total } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page container empty-cart">
        <LuShoppingBag size={64} color="var(--text-muted)" />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-accent btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <h1 style={{ marginBottom: '32px' }}>Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item card">
                <img src={item.images?.[0] || PLACEHOLDER_IMAGE} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}><LuMinus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}><LuPlus size={14} /></button>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeFromCart(item._id)} style={{ color: 'var(--error)' }}>
                      <LuTrash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
                <p className="cart-item-total">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            <button className="btn btn-ghost" onClick={clearCart} style={{ color: 'var(--error)' }}>Clear Cart</button>
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="summary-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>
            {shipping === 0 && <p className="free-shipping-msg">🎉 You qualify for free shipping!</p>}
            <Link to="/checkout" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: '16px' }}>
              Proceed to Checkout <LuArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn btn-ghost" style={{ width: '100%' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
