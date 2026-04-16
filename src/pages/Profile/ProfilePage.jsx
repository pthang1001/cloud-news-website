import { useState } from "react";
import "./ProfilePage.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useChangePassword } from "../../contexts/ChangePasswordContext";

// --- Mock Data ---
const savedArticles = [
  {
    id: 1,
    category: "KINH DOANH",
    title: "Thị trường ngân hàng Việt Nam 2024: Bước ngoặt kỹ thuật số",
    excerpt:
      "Các tổ chức tín dụng đang đẩy nhanh lộ trình chuyển đổi số nhằm thích ứng với yêu cầu mới của thị trường...",
    date: "15 tháng 5, 2024",
    image: "https://picsum.photos/seed/bank/600/400",
    large: true,
  },
  {
    id: 2,
    category: "CÔNG NGHỆ",
    title: "AI đang thay đổi cách thức tác nghiệp báo chí hiện đại",
    excerpt: "",
    date: "12 tháng 5, 2024",
    image: "https://picsum.photos/seed/ai/600/400",
    large: false,
  },
  {
    id: 3,
    category: "THẾ GIỚI",
    title: "Chính sách khí hậu mới tại Liên minh Châu Âu",
    excerpt: "",
    date: "10 tháng 5, 2024",
    image: "https://picsum.photos/seed/earth/600/400",
    large: false,
  },
];

const notificationSettings = [
  {
    id: "email",
    label: "Thông báo qua Email",
    description: "Nhận bản tin tổng hợp hàng ngày vào mỗi buổi sáng.",
    enabled: true,
  },
  {
    id: "push",
    label: "Thông báo đẩy (Push Notifications)",
    description: "Nhận thông báo tức thì khi có tin tức nóng hổi.",
    enabled: false,
  },
  {
    id: "reporter",
    label: "Cập nhật từ phóng viên đã theo dõi",
    description:
      "Thông báo khi các tác giả yêu thích của bạn xuất bản bài viết mới.",
    enabled: true,
  },
];

// --- Sub-components ---

function Toggle({ enabled, onChange }) {
  return (
    <button
      className={`profile-toggle ${enabled ? "profile-toggle--on" : ""}`}
      onClick={onChange}
      aria-pressed={enabled}
    >
      <span className="profile-toggle__thumb" />
    </button>
  );
}

function AccountInfoPanel({ isEditMode }) {
  const { openChangePassword } = useChangePassword();
  const [form, setForm] = useState({
    name: "Nguyễn Minh Tuấn",
    email: "tuan.nguyen@example.com",
    bio: "Đam mê công nghệ và kinh tế số. Theo dõi sát sao các biến động thị trường tại Việt Nam và Đông Nam Á.",
  });

  return (
    <div className="profile-left-panel">
      <section className="profile-account-details">
        <h3 className="profile-section-title">Chi tiết tài khoản</h3>
        <div className="profile-field">
          <label className="profile-field__label">HỌ VÀ TÊN</label>
          <input
            className="profile-field__input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={!isEditMode}
          />
        </div>
        <div className="profile-field">
          <label className="profile-field__label">ĐỊA CHỈ EMAIL</label>
          <input
            className="profile-field__input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={!isEditMode}
          />
        </div>
        <div className="profile-field">
          <label className="profile-field__label">TIỂU SỬ</label>
          <textarea
            className="profile-field__input profile-field__textarea"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            disabled={!isEditMode}
            rows={4}
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
        <div className="profile-security-item">
          <span className="profile-security-item__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </span>
          <span className="profile-security-item__label">Xác thực 2 yếu tố</span>
          <svg className="profile-security-item__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </section>
    </div>
  );
}

function SavedArticlesPanel() {
  const [articles, setArticles] = useState(savedArticles);

  const removeBookmark = (id) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  const [large, ...small] = articles;

  return (
    <div className="profile-saved-articles">
      <div className="profile-saved-articles__header">
        <h2 className="profile-saved-articles__title">Bài viết đã lưu</h2>
        <a href="#" className="profile-saved-articles__view-all">
          Xem tất cả
        </a>
      </div>

      <div className="profile-articles-grid">
        {large && (
          <div className="profile-article-card profile-article-card--large">
            <div className="profile-article-card__image-wrap">
              <img src={large.image} alt={large.title} className="profile-article-card__image" />
            </div>
            <div className="profile-article-card__body">
              <span className="profile-article-card__category">{large.category}</span>
              <h3 className="profile-article-card__title">{large.title}</h3>
              {large.excerpt && (
                <p className="profile-article-card__excerpt">{large.excerpt}</p>
              )}
              <div className="profile-article-card__footer">
                <span className="profile-article-card__date">{large.date}</span>
                <button
                  className="profile-article-card__bookmark profile-article-card__bookmark--active"
                  onClick={() => removeBookmark(large.id)}
                  title="Bỏ lưu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="profile-articles-small-grid">
          {small.map((article) => (
            <div key={article.id} className="profile-article-card profile-article-card--small">
              <div className="profile-article-card__image-wrap">
                <img src={article.image} alt={article.title} className="profile-article-card__image" />
              </div>
              <div className="profile-article-card__body">
                <span className="profile-article-card__category">{article.category}</span>
                <h3 className="profile-article-card__title">{article.title}</h3>
                <div className="profile-article-card__footer">
                  <span className="profile-article-card__date">{article.date}</span>
                  <button
                    className="profile-article-card__bookmark profile-article-card__bookmark--active"
                    onClick={() => removeBookmark(article.id)}
                    title="Bỏ lưu"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const [settings, setSettings] = useState(notificationSettings);

  const toggle = (id) => {
    setSettings(settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  return (
    <div className="profile-notifications">
      <h2 className="profile-notifications__title">Cài đặt thông báo</h2>
      <div className="profile-notifications__list">
        {settings.map((item) => (
          <div key={item.id} className="profile-notification-item">
            <div className="profile-notification-item__info">
              <span className="profile-notification-item__label">{item.label}</span>
              <span className="profile-notification-item__desc">{item.description}</span>
            </div>
            <Toggle enabled={item.enabled} onChange={() => toggle(item.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---

const TABS = [
  { id: "info", label: "Thông tin cá nhân" },
  { id: "saved", label: "Bài viết đã lưu" },
  { id: "notifications", label: "Cài đặt thông báo" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatar, setAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=MinhTuan");

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header__inner">
          <div className="profile-header__identity">
            <div className={`profile-header__avatar-wrap ${isEditMode ? "profile-header__avatar-wrap--editable" : ""}`}>
              <img
                src={avatar}
                alt="Avatar"
                className="profile-header__avatar"
              />
              <div className="profile-header__avatar-overlay">
                <input
                  type="file"
                  id="avatar-input"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="avatar-input" className="profile-header__avatar-edit-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </label>
              </div>
            </div>
            <div className="profile-header__meta">
              <h1 className="profile-header__name">Nguyễn Minh Tuấn</h1>
              <p className="profile-header__role">
                Độc giả cao cấp &bull; Gia nhập từ 2022
              </p>
            </div>
          </div>
          <button className="profile-header__edit-btn" onClick={handleEditToggle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {isEditMode ? "Lưu chỉnh sửa" : "Chỉnh sửa hồ sơ"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-bar">
        <div className="profile-tabs-bar__inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`profile-tab ${activeTab === tab.id ? "profile-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="profile-content">
        {activeTab === "info" && (
          <div className="profile-layout">
            <AccountInfoPanel isEditMode={isEditMode} />
            <div className="profile-right-panel">
              <SavedArticlesPanel />
              <NotificationsPanel />
            </div>
          </div>
        )}
        {activeTab === "saved" && (
          <div className="profile-layout profile-layout--full">
            <SavedArticlesPanel />
          </div>
        )}
        {activeTab === "notifications" && (
          <div className="profile-layout profile-layout--full">
            <NotificationsPanel />
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}