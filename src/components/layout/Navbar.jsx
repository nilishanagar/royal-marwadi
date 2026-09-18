import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LuShoppingCart, LuHeart, LuUser, LuSearch, LuMenu, LuX, LuLogOut, LuLayoutDashboard, LuPackage, LuChevronDown } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${isTransparent ? 'navbar-transparent' : ''}`} id="main-navbar">
        <div className="navbar-inner container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" id="navbar-logo">
            <span className="logo-text">Royal</span>
            <span className="logo-accent">Marwadi</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="navbar-links" id="navbar-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="nav-action-btn" onClick={() => setSearchOpen(!searchOpen)} id="search-toggle" aria-label="Search">
              <LuSearch size={20} />
            </button>

            <Link to="/wishlist" className="nav-action-btn" id="wishlist-btn" aria-label="Wishlist">
              <LuHeart size={20} />
              {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
            </Link>

            <Link to="/cart" className="nav-action-btn" id="cart-btn" aria-label="Cart">
              <LuShoppingCart size={20} />
              {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
            </Link>

            {user ? (
              <div className="user-menu-wrapper">
                <button className="nav-action-btn user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} id="user-menu-toggle">
                  <LuUser size={20} />
                  <LuChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="user-menu-overlay" onClick={() => setUserMenuOpen(false)} />
                    <div className="user-dropdown" id="user-dropdown">
                      <div className="user-dropdown-header">
                        <p className="user-dropdown-name">{user.name}</p>
                        <p className="user-dropdown-email">{user.email}</p>
                      </div>
                      <div className="user-dropdown-divider" />
                      <Link to="/profile" className="user-dropdown-item"><LuUser size={16} /> My Profile</Link>
                      <Link to="/my-orders" className="user-dropdown-item"><LuPackage size={16} /> My Orders</Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="user-dropdown-item"><LuLayoutDashboard size={16} /> Admin Panel</Link>
                      )}
                      <div className="user-dropdown-divider" />
                      <button className="user-dropdown-item logout-btn" onClick={logout}><LuLogOut size={16} /> Logout</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-accent btn-sm" id="login-btn">Login</Link>
            )}

            {/* Mobile Toggle */}
            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} id="mobile-menu-toggle" aria-label="Menu">
              {mobileOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="search-bar animate-slideUp">
            <div className="container">
              <form onSubmit={handleSearch} className="search-form">
                <LuSearch size={20} />
                <input
                  type="text"
                  placeholder="Search for furniture, decor, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  id="search-input"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close"><LuX size={18} /></button>
              </form>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu" id="mobile-menu">
            <div className="mobile-menu-header">
              <span className="logo-text">Royal</span>
              <span className="logo-accent">Marwadi</span>
              <button onClick={() => setMobileOpen(false)}><LuX size={24} /></button>
            </div>
            <ul className="mobile-nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              {user && <li><Link to="/profile">My Profile</Link></li>}
              {user && <li><Link to="/my-orders">My Orders</Link></li>}
              {user?.role === 'admin' && <li><Link to="/admin">Admin Panel</Link></li>}
            </ul>
            <div className="mobile-menu-footer">
              {user ? (
                <button className="btn btn-outline" style={{ width: '100%' }} onClick={logout}>Logout</button>
              ) : (
                <Link to="/login" className="btn btn-accent" style={{ width: '100%' }}>Login / Register</Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
