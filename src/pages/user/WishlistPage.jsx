import { Link } from 'react-router-dom';
import { LuHeart, LuShoppingCart } from 'react-icons/lu';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ui/ProductCard';
import './UserPages.css';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="page container user-page">
        <h1>My Wishlist</h1>
        <div className="empty-state" style={{ padding: '80px 0' }}>
          <LuHeart size={56} color="var(--text-muted)" />
          <h3>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Save items you love to find them later.</p>
          <Link to="/shop" className="btn btn-accent" style={{ marginTop: '16px' }}>Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container user-page">
      <h1>My Wishlist ({wishlist.length} items)</h1>
      <div className="grid-products">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
