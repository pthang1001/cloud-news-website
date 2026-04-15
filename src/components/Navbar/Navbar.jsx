import { useState } from "react";
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

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="/" className="navbar__logo">
          Diễn Đàn<span>Press</span>
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
          <div className="navbar__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <button className="navbar__icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <button className="navbar__icon-btn" aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}