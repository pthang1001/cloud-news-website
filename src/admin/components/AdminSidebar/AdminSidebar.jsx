import { Link } from "react-router-dom";
import "./AdminSidebar.css";

const navItems = [
  {
    id: "users",
    label: "Người dùng",
    path: "/admin/users",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: "content",
    label: "Quản lý nội dung",
    path: "/admin/content",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  // ✅ Đã xóa mục Cài đặt Duy nhé
];

const AdminSidebar = ({ currentPage, collapsed, onToggle }) => {
  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <img src="/Dien_dan_logo.png" alt="Diễn Đàn Press" className="logo-image" />
        </div>
        {!collapsed && (
          <div className="logo-text">
            <span className="logo-title">Diễn Đàn Press</span>
            <span className="logo-sub">Quản trị viên</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`sidebar-nav-item ${currentPage === item.id ? "active" : ""}`}
            title={collapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {currentPage === item.id && !collapsed && <span className="nav-indicator" />}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">Đào Văn Duy</span>
              <span className="user-role">Quản trị hệ thống</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button className="sidebar-toggle" onClick={onToggle} title="Thu gọn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>
    </aside>
  );
};

export default AdminSidebar;