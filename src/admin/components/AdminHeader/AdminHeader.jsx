import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader = ({ title = "Diễn Đàn Press" }) => {
  const navigate = useNavigate();

  const handleSwitchToUser = () => {
    navigate("/");
  };

  const handleLogout = () => {
    // 1. Xóa thông tin Admin Duy nhé
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    // 2. Chuyển về trang Login
    navigate("/auth/login");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <img src="/Dien_dan_logo.png" alt="Diễn Đàn Press" className="header-logo" />
      </div>

      <div className="header-right">
        {/* ✅ ĐÃ XÓA CHUÔNG THÔNG BÁO THEO YÊU CẦU DUY NHÉ */}
        
        <button 
          className="header-action-btn" 
          title="Chuyển sang giao diện người dùng" 
          onClick={handleSwitchToUser}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Giao diện Người dùng</span>
        </button>

        <button 
          className="header-logout-btn" 
          title="Đăng xuất" 
          onClick={handleLogout}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;