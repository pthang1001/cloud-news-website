import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminHeader from "../AdminHeader/AdminHeader";
import "./AdminLayout.css";

const AdminLayout = ({ children, currentPage = "dashboard", collapsed, onToggle }) => {
  return (
    <div className={`admin-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <AdminSidebar
        currentPage={currentPage}
        collapsed={collapsed}
        onToggle={onToggle}
      />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;