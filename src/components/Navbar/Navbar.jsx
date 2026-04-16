import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Thời sự", href: "/thoi-su", active: true },
  { label: "Thể thao", href: "/the-thao" },
  { label: "Công nghệ", href: "/cong-nghe" },
  { label: "Kinh doanh", href: "/kinh-doanh" },
  { label: "Giải trí", href: "/giai-tri" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAuthClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // User is logged in - logout
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    } else {
      // User is not logged in - go to auth
      navigate("/auth");
    }
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="/" className="navbar__logo">
          <img src="/Dien_dan_logo.png" alt="Diễn Đàn Press" />
        </a>

        <nav className={`navbar__nav ${menuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`navbar__link ${link.active ? "navbar__link--active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <form className={`navbar__search ${searchOpen ? "active" : ""}`} onSubmit={handleSearch}>
            <button type="button" className="navbar__search-icon" onClick={() => setSearchOpen(!searchOpen)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
          </form>

          <button
            className="navbar__icon-btn navbar__profile-btn"
            onClick={handleProfileClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>

          <button
            className="navbar__icon-btn navbar__auth-btn"
            onClick={handleAuthClick}
          >
            {isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
          </button>

          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}