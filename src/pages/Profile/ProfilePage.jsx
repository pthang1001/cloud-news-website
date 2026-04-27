import { useState, useEffect } from "react";
import "./ProfilePage.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useChangePassword } from "../../contexts/ChangePasswordContext";
// Import hàm updateAvatar để gửi ảnh lên server
import { updateAvatar } from "../../services/authService";

// --- Sub-components ---

function AccountInfoPanel({ user }) {
  const { openChangePassword } = useChangePassword();

  const formatName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .filter((word) => word !== "")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="profile-left-panel">
      <section className="profile-account-details">
        <h3 className="profile-section-title">Chi tiết tài khoản</h3>
        <div className="profile-field">
          <label className="profile-field__label">HỌ VÀ TÊN</label>
          <input
            className="profile-field__input"
            value={formatName(user.fullname)}
            disabled={true} 
          />
        </div>
        <div className="profile-field">
          <label className="profile-field__label">ĐỊA CHỈ EMAIL</label>
          <input
            className="profile-field__input"
            value={user.email || ""}
            disabled={true}
          />
        </div>
      </section>

      <section className="profile-security">
        <h3 className="profile-section-title">Bảo mật</h3>
        <button 
          className="profile-security-item"
          onClick={openChangePassword}
          style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: "11px 0" }}
        >
          <span className="profile-security-item__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <span className="profile-security-item__label">Thay đổi mật khẩu</span>
          <svg className="profile-security-item__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </section>
    </div>
  );
}

// --- Main Page ---

export default function ProfilePage() {
  const [user, setUser] = useState({ fullname: "", email: "", joinDate: "" });
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?u=user");

  const formatName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(" ")
      .filter((word) => word !== "")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
      if (userObj.avatar) {
        setAvatar(userObj.avatar);
      }
    }
  }, []);

  // ✅ FIX TRIỆT ĐỂ: Cập nhật hàm thay đổi ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const newAvatarData = event.target?.result;
        
        // 1. Hiển thị tạm lên giao diện để Duy thấy thay đổi ngay
        const oldAvatar = avatar;
        setAvatar(newAvatarData);

        try {
          // 2. GỬI LÊN SERVER (MONGODB)
          const response = await updateAvatar(user.email, newAvatarData);
          
          if (response) {
            // 3. CHỈ KHI SERVER LƯU XONG: Mới cập nhật localStorage Duy nhé
            const updatedUser = { ...user, avatar: newAvatarData };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            console.log("✅ Đã lưu avatar vĩnh viễn vào MongoDB!");
          }
        } catch (err) {
          console.error("❌ Lỗi khi lưu ảnh lên server:", err);
          // Nếu lỗi thì trả lại ảnh cũ cho Duy đỡ nhầm
          setAvatar(oldAvatar);
          alert("Lỗi server! Duy kiểm tra xem đã chạy Backend chưa nhé.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <style>{`
        input::-ms-reveal, input::-ms-clear { display: none; }
      `}</style>
      
      <Navbar />
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-header__inner">
            <div className="profile-header__identity">
              <div className="profile-header__avatar-wrap profile-header__avatar-wrap--editable">
                <img src={avatar} alt="Avatar" className="profile-header__avatar" />
                <div className="profile-header__avatar-overlay">
                  <input type="file" id="avatar-input" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
                  <label htmlFor="avatar-input" className="profile-header__avatar-edit-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </label>
                </div>
              </div>
              <div className="profile-header__meta">
                <h1 className="profile-header__name">{formatName(user.fullname) || "Người dùng"}</h1>
                <p className="profile-header__role">
                  Gia nhập ngày: {user.joinDate || "25/4/2026"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-layout">
            <AccountInfoPanel user={user} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}