import { NavLink, useNavigate } from 'react-router-dom';
import { LuLayoutDashboard, LuPackage, LuShoppingCart, LuUsers, LuFolderTree, LuSettings, LuArrowLeft, LuLogOut } from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const navItems = [
  { path: '/admin', icon: LuLayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/products', icon: LuPackage, label: 'Products' },
  { path: '/admin/orders', icon: LuShoppingCart, label: 'Orders' },
  { path: '/admin/users', icon: LuUsers, label: 'Users' },
  { path: '/admin/categories', icon: LuFolderTree, label: 'Categories' },
  { path: '/admin/settings', icon: LuSettings, label: 'Settings' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar" id="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Admin Panel</h3>
        <button className="back-to-store" onClick={() => navigate('/')} title="Back to Store">
          <LuArrowLeft size={16} />
          <span>Store</span>
        </button>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-avatar">{user?.name?.charAt(0) || 'A'}</div>
          <div>
            <p className="admin-user-name">{user?.name}</p>
            <p className="admin-user-role">Administrator</p>
          </div>
        </div>
        <button className="admin-logout" onClick={logout} title="Logout">
          <LuLogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
