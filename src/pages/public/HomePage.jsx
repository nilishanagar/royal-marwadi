import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LuArrowRight, 
  LuTruck, 
  LuShieldCheck, 
  LuStar, 
  LuWrench, 
  LuSparkles, 
  LuCircleCheck,
  LuLayers
} from 'react-icons/lu';
import ProductCard from '../../components/ui/ProductCard';
import { getFeaturedProducts } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { CATEGORY_IMAGES } from '../../utils/helpers';
import './HomePage.css';

const DEFAULT_CATEGORIES = [
  { name: 'Living Room', slug: 'living-room', image: CATEGORY_IMAGES['Living Room'] },
  { name: 'Bedroom', slug: 'bedroom', image: CATEGORY_IMAGES['Bedroom'] },
  { name: 'Dining', slug: 'dining', image: CATEGORY_IMAGES['Dining'] },
  { name: 'Office', slug: 'office', image: CATEGORY_IMAGES['Office'] },
  { name: 'Outdoor', slug: 'outdoor', image: CATEGORY_IMAGES['Outdoor'] },
  { name: 'Decor', slug: 'decor', image: CATEGORY_IMAGES['Decor'] },
];

const LOOKBOOK_ITEMS = [
  {
    title: 'The Maharaja Living Room',
    subtitle: 'Pure Italian Leather & Carved Teak',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    category: 'Living Room',
    tag: 'Living Suite',
  },
  {
    title: 'Imperial Sanctuary Bedroom',
    subtitle: 'Solid Rosewood Four-Poster Suite',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80',
    category: 'Bedroom',
    tag: 'Bedroom Suite',
  },
  {
    title: 'The Darbar Dining Hall',
    subtitle: 'Carrara Marble & Hand-turned Brass',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    category: 'Dining',
    tag: 'Dining Suite',
  },
  {
    title: 'Royal Study & Library',
    subtitle: 'Hand-rubbed Sheesham & Tufted Chairs',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    category: 'Office',
    tag: 'Executive Suite',
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getFeaturedProducts(12),
          getCategories(),
        ]);
        setFeatured(prodRes.data.products);
        if (catRes.data.categories?.length > 0) {
          setCategories(catRes.data.categories);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  // Filter featured products based on activeCategoryTab
  const filteredProducts = activeCategoryTab === 'all'
    ? featured
    : featured.filter((prod) => {
        const catId = typeof prod.category === 'object' ? prod.category?._id : prod.category;
        const catName = typeof prod.category === 'object' ? prod.category?.name : '';
        return catId === activeCategoryTab || catName.toLowerCase() === activeCategoryTab.toLowerCase();
      });

  const features = [
    { icon: LuWrench, title: 'Heritage Craftsmanship', desc: 'Every piece is hand-carved in Jodhpur by master artisans with generational skills.' },
    { icon: LuTruck, title: 'White-Glove Delivery', desc: 'Complimentary Pan-India shipping and full on-site installation.' },
    { icon: LuShieldCheck, title: '10-Year Guarantee', desc: 'Crafted from seasoned solid timber with lifetime termite resistance.' },
    { icon: LuStar, title: 'Bespoke Finishes', desc: 'Customizable premium upholstery, Italian marble, and brass inlays.' },
  ];

  const testimonials = [
    { name: 'Priya Mehta', location: 'Mumbai', text: 'The Royal Chesterfield sofa is a grand showstopper in our penthouse. The leather is butter-soft and the deep button tufting is immaculate. Worth every single rupee!', rating: 5 },
    { name: 'Vikramaditya Rathore', location: 'Jaipur', text: 'Being from Rajasthan, authentic royal woodwork is close to my heart. Royal Marwadi captures the true essence of royal Jodhpur furniture with flawless modern finishing.', rating: 5 },
    { name: 'Dr. Anita Joshi', location: 'Bengaluru', text: 'The Imperial four-poster bed transformed our master bedroom into a palace suite. The assembly team was courteous and swift. Truly a 7-star experience.', rating: 5 },
  ];

  return (
    <div className="home-page">
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="hero" id="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-grid">
            {/* Left Hero Text */}
            <div className="hero-text animate-fadeIn">
              <span className="hero-label">
                <LuSparkles size={14} /> Rajasthani Heritage & Luxury Living
              </span>
              <h1 className="hero-title">
                Heirloom Furniture for the <span className="text-gold">Modern Palace</span>
              </h1>
              <p className="hero-desc">
                Discover masterfully handcrafted furniture that fuses centuries-old Marwadi carving traditions 
                with contemporary royal grandeur. Hand-hewn from solid Sheesham, Rosewood, and Italian leather.
              </p>
              
              <div className="hero-actions">
                <Link to="/shop" className="btn btn-accent btn-lg">
                  Explore Collections <LuArrowRight size={18} />
                </Link>
                <Link to="/about" className="btn btn-outline btn-lg hero-story-btn">
                  Our Artisanal Legacy
                </Link>
              </div>

              {/* Quick Hero Badges */}
              <div className="hero-highlights">
                <div className="hero-highlight-item">
                  <LuCircleCheck size={16} className="text-gold" />
                  <span>100% Solid Teak & Sheesham</span>
                </div>
                <div className="hero-highlight-item">
                  <LuCircleCheck size={16} className="text-gold" />
                  <span>Pan-India Free Shipping</span>
                </div>
                <div className="hero-highlight-item">
                  <LuCircleCheck size={16} className="text-gold" />
                  <span>4.9★ Rated by 5,000+ Patrons</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Showcase */}
            <div className="hero-showcase">
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80" 
                  alt="Royal Marwadi Living Room Suite" 
                  className="hero-main-img"
                  loading="eager"
                />
                
                {/* Floating Glassmorphism Badge 1: Product Preview */}
                <div className="hero-floating-card top-right glass">
                  <img 
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80" 
                    alt="Chesterfield Preview" 
                    className="floating-thumb"
                  />
                  <div>
                    <span className="floating-badge-title">Royal Chesterfield</span>
                    <div className="floating-badge-stars">
                      {[...Array(5)].map((_, i) => (
                        <LuStar key={i} size={12} fill="#C9A96E" color="#C9A96E" />
                      ))}
                      <span>(4.9)</span>
                    </div>
                    <span className="floating-badge-price">₹1,85,000</span>
                  </div>
                </div>

                {/* Floating Glassmorphism Badge 2: Craftsmanship Tag */}
                <div className="hero-floating-card bottom-left glass">
                  <div className="floating-icon-box">
                    <LuSparkles size={20} color="#C9A96E" />
                  </div>
                  <div>
                    <h4 className="floating-badge-title">Handcrafted in Jodhpur</h4>
                    <p className="floating-badge-subtitle">Master Karigars with Generational Heritage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Grid Section ───────────────────────── */}
      <section className="section" id="categories-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">Curated Ensembles</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our handcrafted collections designed for every distinguished space</p>
          </div>

          <div className="categories-grid">
            {displayCategories.slice(0, 6).map((cat, i) => {
              const catImg = cat.image || CATEGORY_IMAGES[cat.name] || CATEGORY_IMAGES['Living Room'];
              return (
                <Link
                  to={`/shop?category=${cat._id || cat.slug}`}
                  key={cat._id || i}
                  className="category-card"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img 
                    src={catImg} 
                    alt={cat.name} 
                    className="category-card-img" 
                    loading="lazy"
                  />
                  <div className="category-card-overlay" />
                  <div className="category-card-content">
                    <span className="category-card-tag">Collection</span>
                    <h3>{cat.name}</h3>
                    <p className="category-card-desc">{cat.description || 'Handcrafted luxury pieces'}</p>
                    <span className="category-card-link">
                      Explore Collection <LuArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Collection with Category Tabs ────────── */}
      <section className="section featured-section" id="featured-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">Masterpiece Collection</span>
            <h2 className="section-title">Featured Highlights</h2>
            <p className="section-subtitle">Select a category tab to browse our most coveted handcrafted creations</p>
          </div>

          {/* Interactive Category Filter Tabs with Thumbnail Images */}
          <div className="category-tabs-container">
            <div className="category-tabs-scroll">
              <button
                className={`category-tab-btn ${activeCategoryTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategoryTab('all')}
              >
                <div className="tab-thumb-icon">
                  <LuLayers size={18} />
                </div>
                <span>All Collections</span>
              </button>

              {displayCategories.map((cat) => {
                const thumbImg = cat.image || CATEGORY_IMAGES[cat.name] || CATEGORY_IMAGES['Living Room'];
                const isActive = activeCategoryTab === cat._id || activeCategoryTab === cat.name;
                return (
                  <button
                    key={cat._id || cat.name}
                    className={`category-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveCategoryTab(cat._id || cat.name)}
                  >
                    <img 
                      src={thumbImg} 
                      alt={cat.name} 
                      className="tab-thumb-img" 
                      loading="lazy"
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid-products">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card" style={{ height: '400px' }}>
                  <div className="skeleton" style={{ height: '250px' }} />
                  <div style={{ padding: '16px' }}>
                    <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '18px', marginBottom: '8px' }} />
                    <div className="skeleton" style={{ height: '20px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid-products animate-fadeIn">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-category-notice">
              <p>No featured products in this category yet.</p>
              <Link to="/shop" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                Browse Full Catalog
              </Link>
            </div>
          )}

          <div className="text-center" style={{ marginTop: '48px' }}>
            <Link to="/shop" className="btn btn-primary btn-lg">
              View All 100+ Masterpieces <LuArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Royal Spaces Lookbook / Inspiration Gallery ───── */}
      <section className="section lookbook-section" id="lookbook-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">Inspiration & Living</span>
            <h2 className="section-title">The Royal Lookbook</h2>
            <p className="section-subtitle">Glimpses of royal spaces styled with our signature bespoke furniture</p>
          </div>

          <div className="lookbook-grid">
            {LOOKBOOK_ITEMS.map((item, i) => (
              <div key={i} className="lookbook-card">
                <img src={item.image} alt={item.title} className="lookbook-img" loading="lazy" />
                <div className="lookbook-overlay">
                  <span className="lookbook-tag">{item.tag}</span>
                  <h3 className="lookbook-title">{item.title}</h3>
                  <p className="lookbook-subtitle">{item.subtitle}</p>
                  <Link to="/shop" className="lookbook-btn">
                    Shop The Look <LuArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artisanal Legacy Banner with Visual ───────────── */}
      <section className="artisan-banner-section">
        <div className="container">
          <div className="artisan-banner">
            <div className="artisan-banner-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1200&q=80" 
                alt="Woodcraft Master Karigar at Work" 
                className="artisan-banner-img"
                loading="lazy"
              />
            </div>
            <div className="artisan-banner-content">
              <span className="section-label">Generations of Mastery</span>
              <h2>Hand-hewn by Traditional Jodhpur Woodworkers</h2>
              <p>
                Every dining table, four-poster bed, and console is sculpted by generational wood-turners. 
                Using naturally seasoned Sheesham and aged Teak with traditional joinery, our pieces contain 
                no quick shortcuts — built to be passed on for generations.
              </p>
              <div className="artisan-stats">
                <div>
                  <span className="stat-num">40+</span>
                  <span className="stat-lbl">Master Artisans</span>
                </div>
                <div>
                  <span className="stat-num">100%</span>
                  <span className="stat-lbl">Solid Seasoned Wood</span>
                </div>
                <div>
                  <span className="stat-num">5,000+</span>
                  <span className="stat-lbl">Homes Styled</span>
                </div>
              </div>
              <Link to="/about" className="btn btn-accent" style={{ marginTop: '20px' }}>
                Discover Our Craft <LuArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────── */}
      <section className="section" id="features-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">Why Royal Marwadi</span>
            <h2 className="section-title">Crafted with Purpose</h2>
            <p className="section-subtitle">What sets our royal handcrafted heritage apart from mass manufacturing</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">
                  <f.icon size={28} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="section testimonials-section" id="testimonials-section">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">Loved By Patrons</span>
            <h2 className="section-title" style={{ color: 'white' }}>Words from Royal Marwadi Patrons</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Join thousands of discerning connoisseurs who cherish our handcrafted furniture
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card glass">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => (
                    <LuStar key={j} size={16} fill="#C9A96E" color="#C9A96E" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-location">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────── */}
      <section className="section newsletter-section" id="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="newsletter-content">
              <span className="newsletter-badge">Private Connoisseur Circle</span>
              <h2>Join the Royal Marwadi Circle</h2>
              <p>Receive exclusive private catalogs, preview upcoming limited editions, and bespoke design guides.</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address" className="input" />
                <button type="submit" className="btn btn-accent">Request Invitation</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
