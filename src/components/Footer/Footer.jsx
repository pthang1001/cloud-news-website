import "./Footer.css";

const FOOTER_LINKS = [
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Điều khoản", href: "/dieu-khoan" },
  { label: "Bảo mật", href: "/bao-mat" },
  { label: "Liên hệ", href: "/lien-he" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a href="/" className="footer__logo">
            <img src="/Dien_dan_logo.png" alt="Diễn Đàn Press" />
          </a>
          <p className="footer__tagline">
            Cung cấp những góc nhìn sâu sắc và tin tức trung thực nhất cho độc giả Việt.
          </p>
        </div>
        <nav className="footer__links">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="footer__link">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="footer__bottom">
        <span>© 2026 Diễn Đàn Press. Editorial Precision System.</span>
      </div>
    </footer>
  );
}