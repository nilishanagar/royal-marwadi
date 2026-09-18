import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import ShopPage from './pages/public/ShopPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CartPage from './pages/public/CartPage';
import CheckoutPage from './pages/public/CheckoutPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User Pages
import ProfilePage from './pages/user/ProfilePage';
import OrdersPage from './pages/user/OrdersPage';
import WishlistPage from './pages/user/WishlistPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';

// Route guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page flex-center" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  return !user ? children : <Navigate to="/" replace />;
}

// Layout wrapper for pages with Navbar + Footer
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/shop" element={<PublicLayout><ShopPage /></PublicLayout>} />
              <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
              <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
              <Route path="/wishlist" element={<PublicLayout><WishlistPage /></PublicLayout>} />

              {/* Auth Routes */}
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

              {/* Protected User Routes */}
              <Route path="/profile" element={<PublicLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></PublicLayout>} />
              <Route path="/my-orders" element={<PublicLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></PublicLayout>} />
              <Route path="/checkout" element={<PublicLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></PublicLayout>} />

              {/* Admin Routes (no Navbar/Footer — uses sidebar) */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<PublicLayout><div className="page container" style={{ textAlign: 'center', padding: '120px 0' }}>
                <h1 style={{ fontSize: '72px', color: 'var(--accent)' }}>404</h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Page not found</p>
                <a href="/" className="btn btn-accent">Go Home</a>
              </div></PublicLayout>} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
