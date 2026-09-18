import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LuMinus, LuPlus, LuShoppingCart, LuHeart, LuStar, LuChevronRight, LuTruck, LuShieldCheck, LuRefreshCw } from 'react-icons/lu';
import { getProduct } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, PLACEHOLDER_IMAGE } from '../../utils/helpers';
import ProductCard from '../../components/ui/ProductCard';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getProduct(id);
        setProduct(data.product);
        setSelectedImage(0);
        setQuantity(1);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-accent" style={{ marginTop: '20px' }}>Back to Shop</Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [PLACEHOLDER_IMAGE];
  const wishlisted = isInWishlist(product._id);

  return (
    <div className="page product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb container">
        <Link to="/">Home</Link>
        <LuChevronRight size={14} />
        <Link to="/shop">Shop</Link>
        <LuChevronRight size={14} />
        <span>{product.name}</span>
      </div>

      <div className="container product-detail-layout">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={images[selectedImage]} alt={product.name} />
            {product.compareAtPrice > product.price && (
              <span className="badge badge-accent product-badge">
                -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`thumbnail ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <p className="product-category-label">{product.category?.name}</p>
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <LuStar key={s} size={18} className={s <= Math.round(product.rating) ? 'star-filled' : ''} fill={s <= Math.round(product.rating) ? '#F59E0B' : 'none'} />
              ))}
            </div>
            <span>{product.rating?.toFixed(1)}</span>
            <span className="text-muted">({product.numReviews} reviews)</span>
          </div>

          <div className="product-price-block">
            <span className="product-main-price">{formatPrice(product.price)}</span>
            {product.compareAtPrice > product.price && (
              <span className="product-compare-price">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {/* Specs */}
          <div className="product-specs">
            {product.material && <div className="spec"><span>Material</span><span>{product.material}</span></div>}
            {product.color && <div className="spec"><span>Color</span><span>{product.color}</span></div>}
            {product.dimensions?.length > 0 && (
              <div className="spec">
                <span>Dimensions</span>
                <span>{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}</span>
              </div>
            )}
            {product.weight > 0 && <div className="spec"><span>Weight</span><span>{product.weight} kg</span></div>}
          </div>

          {/* Add to Cart */}
          <div className="product-actions-row">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><LuMinus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}><LuPlus size={16} /></button>
            </div>

            <button
              className="btn btn-accent btn-lg"
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              style={{ flex: 1 }}
            >
              <LuShoppingCart size={20} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              className={`btn btn-icon ${wishlisted ? 'wishlisted-btn' : 'btn-outline'}`}
              onClick={() => toggleWishlist(product)}
            >
              <LuHeart size={20} />
            </button>
          </div>

          <p className="stock-info" style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock'}
          </p>

          {/* Guarantees */}
          <div className="product-guarantees">
            <div><LuTruck size={18} /> <span>Free delivery on orders above ₹5,000</span></div>
            <div><LuShieldCheck size={18} /> <span>5-year warranty included</span></div>
            <div><LuRefreshCw size={18} /> <span>Easy 7-day return policy</span></div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <section className="section container">
          <h2 className="section-title" style={{ textAlign: 'left', fontSize: '24px' }}>Customer Reviews</h2>
          <div className="reviews-list">
            {product.reviews.map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{review.name?.charAt(0)}</div>
                  <div>
                    <p className="review-name">{review.name}</p>
                    <div className="stars" style={{ gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <LuStar key={s} size={14} className={s <= review.rating ? 'star-filled' : ''} fill={s <= review.rating ? '#F59E0B' : 'none'} />
                      ))}
                    </div>
                  </div>
                </div>
                {review.title && <p className="review-title">{review.title}</p>}
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
