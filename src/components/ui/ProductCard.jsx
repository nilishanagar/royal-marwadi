import { Link } from 'react-router-dom';
import { LuHeart, LuShoppingCart, LuStar } from 'react-icons/lu';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, PLACEHOLDER_IMAGE } from '../../utils/helpers';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  const image = product.images?.[0] || PLACEHOLDER_IMAGE;
  const discountPercent = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="product-card card" id={`product-card-${product._id}`}>
      <div className="product-card-image">
        <Link to={`/product/${product._id}`}>
          <img src={image} alt={product.name} loading="lazy" />
        </Link>

        {/* Badges */}
        <div className="product-card-badges">
          {discountPercent > 0 && <span className="badge badge-accent">-{discountPercent}%</span>}
          {product.stock === 0 && <span className="badge badge-error">Sold Out</span>}
          {product.featured && <span className="badge badge-accent">Featured</span>}
        </div>

        {/* Quick Actions */}
        <div className="product-card-actions">
          <button
            className={`product-action-btn ${wishlisted ? 'wishlisted' : ''}`}
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
          >
            <LuHeart size={18} />
          </button>
          {product.stock > 0 && (
            <button
              className="product-action-btn cart-action"
              onClick={() => addToCart(product)}
              aria-label="Add to cart"
            >
              <LuShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{product.category?.name || 'Uncategorized'}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>

        <div className="product-card-rating">
          <LuStar size={14} className={product.rating >= 1 ? 'star-filled' : ''} />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="review-count">({product.numReviews || 0})</span>
        </div>

        <div className="product-card-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="compare-price">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
