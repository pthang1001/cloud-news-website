import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Navbar.css";
import { useSavedArticles } from "../../contexts/SavedArticlesContext";
import { useNotifications } from "../../contexts/NotificationContext";

const NAV_LINKS = [
  { label: "Thời sự", value: "Thời sự" },
  { label: "Thể thao", value: "Thể thao" },
  { label: "Công nghệ", value: "Công nghệ" },
  { label: "Kinh doanh", value: "Kinh doanh" },
  { label: "Giải trí", value: "Giải trí" },
];

export default function Navbar({ onCategoryChange, onSearch, currentCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { clearSavedArticles } = useSavedArticles();
  
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token");

  const formatName = (name) => {
    if (!name) return "";
    return name.toLowerCase().split(" ").filter(w => w !== "").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUserName(formatName(userObj.fullname));
    }
  }, [isLoggedIn]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (location.pathname !== "/") navigate("/");
    if (onSearch) onSearch(searchQuery);
  };

  const handleCategoryClick = (e, categoryValue) => {
    e.preventDefault();
    if (location.pathname !== "/") navigate("/");
    if (onCategoryChange) onCategoryChange(categoryValue);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthClick = async () => {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email })
        });
      } catch (err) { console.error(err); }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (clearSavedArticles) clearSavedArticles();
      navigate("/");
      window.location.reload();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <a href="/" className="navbar__logo" onClick={(e) => handleCategoryClick(e, "Tất cả")}>
          <img src="/Dien_dan_logo.png" alt="Diễn Đàn Press" style={{ flexShrink: 0 }} />
        </a>

        <nav className={`navbar__nav ${menuOpen ? "open" : ""}`} style={{ display: 'flex', alignItems: 'center' }}>
          <a href="/" className={`navbar__link ${currentCategory === "Tất cả" ? "navbar__link--active" : ""}`} onClick={(e) => handleCategoryClick(e, "Tất cả")}>Trang chủ</a>
          {NAV_LINKS.map((link) => (
            <a key={link.value} href={`#${link.value}`} className={`navbar__link ${currentCategory === link.value ? "navbar__link--active" : ""}`} onClick={(e) => handleCategoryClick(e, link.value)}>{link.label}</a>
          ))}
        </nav>

        <div className="navbar__actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
          <form className={`navbar__search ${searchOpen ? "active" : ""}`} onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '350px', display: 'flex' }}>
            <button type="submit" className="navbar__search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
            <input type="text" placeholder="Tìm kiếm tin tức..." value={searchQuery} onChange={handleInputChange} className="navbar__search-input" style={{ width: '100%', padding: '8px 12px 8px 35px' }} />
          </form>

          {isLoggedIn && (
            <>
              {/* CHUÔNG THÔNG BÁO */}
              <div style={{ position: 'relative' }}>
                <button className="navbar__icon-btn" onClick={() => { setShowNotifications(!showNotifications); if(!showNotifications) markAllAsRead(); }} style={{ background: '#f1f5f9', padding: '8px', borderRadius: '50%', border: '1px solid #e2e8f0', cursor: 'pointer', position: 'relative' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', fontSize: '10px', minWidth: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div style={{ position: 'absolute', top: '45px', right: '0', width: '300px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000, border: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '12px', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>Thông báo mới</div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Trống</p> : notifications.map(n => (
                        <div key={n.id} style={{ padding: '10px 15px', borderBottom: '1px solid #f9f9f9', background: n.isRead ? '#fff' : '#f0f7ff', fontSize: '13px' }}>
                          <strong>{n.actor}</strong> {n.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="navbar__icon-btn" onClick={() => navigate("/history")} title="Lịch sử"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
              <button className="navbar__icon-btn navbar__profile-btn" onClick={() => navigate("/profile")} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{userName || "Profile"}</span>
              </button>
            </>
          )}

          <button className="navbar__icon-btn" onClick={handleAuthClick} style={{ padding: '6px 12px', height: '36px', fontSize: '13px', fontWeight: '600', borderRadius: '8px', border: isLoggedIn ? '1px solid #fee2e2' : '1px solid #e2e8f0', background: isLoggedIn ? '#fff1f1' : '#fff', color: isLoggedIn ? '#dc2626' : '#2563eb' }}>{isLoggedIn ? "Thoát" : "Login"}</button>
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
        </div>
      </div>
    </header>
  );
}