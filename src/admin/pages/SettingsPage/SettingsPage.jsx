import { useState } from "react";
import "./SettingsPage.css";

const SettingsPage = () => {
  // ── State cho Form ──
  const [siteName, setSiteName] = useState("Diễn Đàn Press");
  const [slogan, setSlogan] = useState("Tiếng nói của Sự thật & Công lý");
  const [email, setEmail] = useState("contact@diendanpress.vn");
  const [footer, setFooter] = useState(
    "Cung cấp tin tức đa chiều, chính xác và nhanh chóng nhất về các vấn đề thời sự, kinh tế và văn hóa tại Việt Nam."
  );
  const [keywords, setKeywords] = useState(["tin tức", "thời sự", "việt nam"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [robotsTxt, setRobotsTxt] = useState(
    "User-agent: *\nDisallow: /admin/"
  );
  const [twoFA, setTwoFA] = useState(true);
  const [loginLimit, setLoginLimit] = useState({ attempts: 5, minutes: 30 });
  const [ogImage, setOgImage] = useState(null);
  
  // ── State cho UI ──
  const [saveMessage, setSaveMessage] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);
  const [showLoginLimitModal, setShowLoginLimitModal] = useState(false);
  const [editLoginLimit, setEditLoginLimit] = useState({ attempts: 5, minutes: 30 });
  const [hasChanges, setHasChanges] = useState(false);

  // ── Access Log Mock Data ──
  const [accessLogs] = useState([
    { time: "14:32 - 24/03/2024", user: "Admin User", action: "Thay đổi cấu hình SEO", ipAddress: "192.168.1.100" },
    { time: "13:15 - 24/03/2024", user: "Editor User", action: "Cập nhật footer", ipAddress: "192.168.1.101" },
    { time: "11:45 - 23/03/2024", user: "Admin User", action: "Bật 2FA", ipAddress: "192.168.1.100" },
    { time: "10:20 - 23/03/2024", user: "Admin User", action: "Thay đổi email liên hệ", ipAddress: "192.168.1.100" },
  ]);

  // ── Handlers ──
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
      setHasChanges(true);
    }
  };

  const handleRemoveKeyword = (kw) => {
    setKeywords(keywords.filter((k) => k !== kw));
    setHasChanges(true);
  };

  const handleChangeOGImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOgImage(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLoginLimit = () => {
    setLoginLimit(editLoginLimit);
    setShowLoginLimitModal(false);
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    setSaveMessage("");
    // Simulate API call
    setTimeout(() => {
      setSaveMessage("✓ Cấu hình đã được lưu thành công!");
      setHasChanges(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }, 500);
  };

  const handleCancelChanges = () => {
    setSiteName("Diễn Đàn Press");
    setSlogan("Tiếng nói của Sự thật & Công lý");
    setEmail("contact@diendanpress.vn");
    setFooter("Cung cấp tin tức đa chiều, chính xác và nhanh chóng nhất về các vấn đề thời sự, kinh tế và văn hóa tại Việt Nam.");
    setKeywords(["tin tức", "thời sự", "việt nam"]);
    setTwoFA(true);
    setLoginLimit({ attempts: 5, minutes: 30 });
    setOgImage(null);
    setHasChanges(false);
    setSaveMessage("");
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="settings-header">
        <h1 className="settings-title">Cấu hình Hệ thống</h1>
        <p className="settings-subtitle">
          Quản lý định danh thương hiệu, tối ưu hóa công cụ tìm kiếm và thiết
          lập bảo mật đa lớp cho tòa soạn Diễn Đàn Press.
        </p>
      </div>

      {/* ===================== SECTION 1: Thông tin Website ===================== */}
      <section className="settings-section">
        <div className="section-intro">
          <h2 className="section-title">Thông tin Website</h2>
          <p className="section-desc">
            Bản sắc của một tờ báo. Thông tin này sẽ xuất hiện trên
            thanh tiêu đề trình duyệt và các phần giới thiệu công khai.
          </p>
        </div>

        <div className="section-card">
          <div className="form-group">
            <label className="form-label">TÊN TÒA SOẠN</label>
            <input
              type="text"
              className="form-input"
              value={siteName}
              onChange={(e) => {
                setSiteName(e.target.value);
                setHasChanges(true);
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">SLOGAN</label>
              <input
                type="text"
                className="form-input"
                value={slogan}
                onChange={(e) => {
                  setSlogan(e.target.value);
                  setHasChanges(true);
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">EMAIL LIÊN HỆ</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasChanges(true);
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">LỜI GIỚI THIỆU CHÂN TRANG (FOOTER)</label>
            <textarea
              className="form-textarea"
              value={footer}
              onChange={(e) => {
                setFooter(e.target.value);
                setHasChanges(true);
              }}
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* ===================== SECTION 2: SEO ===================== */}
      <section className="settings-section seo-section">
        <h2 className="section-title-center">
          Tối ưu hóa Tìm kiếm (SEO)
          <span className="title-underline" />
        </h2>

        <div className="seo-grid">
          {/* SEO Score Card */}
          <div className="seo-score-card">
            <p className="seo-score-label">CHỈ SỐ SEO HIỆN TẠI</p>
            <div className="seo-score-value">
              <span className="score-number">94</span>
              <span className="score-denom">/100</span>
            </div>
            <div className="seo-badges">
              <span className="seo-badge active">Sitemap Active</span>
              <span className="seo-badge active">Meta OK</span>
            </div>
            <div className="seo-score-decoration">
              <svg viewBox="0 0 120 120" className="score-svg">
                <circle cx="60" cy="60" r="54" strokeWidth="8" className="score-bg" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth="8"
                  className="score-fill"
                  strokeDasharray={`${(94 / 100) * 339.3} 339.3`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
            </div>
          </div>

          {/* Meta Data Card */}
          <div className="seo-meta-card">
            <div className="meta-card-header">
              <h3 className="meta-card-title">Cấu hình Meta Data</h3>
              <button className="meta-update-btn" onClick={handleSaveSettings}>CẬP NHẬT →</button>
            </div>

            <div className="meta-row">
              <span className="meta-field-label">TỪ KHÓA MẶC ĐỊNH</span>
              <div className="keywords-container">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="keyword-tag"
                    onClick={() => handleRemoveKeyword(kw)}
                    title="Nhấn để xoá"
                  >
                    {kw}
                  </span>
                ))}
                <button
                  className="keyword-add-btn"
                  onClick={() => {
                    const val = prompt("Nhập từ khóa mới:");
                    if (val) {
                      setNewKeyword(val);
                      handleAddKeyword();
                    }
                  }}
                >
                  + Thêm
                </button>
              </div>
            </div>

            <div className="meta-row">
              <span className="meta-field-label">ROBOTS.TXT</span>
              <textarea
                className="robots-textarea"
                value={robotsTxt}
                onChange={(e) => {
                  setRobotsTxt(e.target.value);
                  setHasChanges(true);
                }}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Social OG Image */}
        <div className="og-card">
          <div className="og-image-preview">
            <div className="og-avatar-placeholder">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#1e2d4a" />
                <circle cx="100" cy="75" r="38" fill="#3d5a80" />
                <ellipse cx="100" cy="155" rx="60" ry="35" fill="#3d5a80" />
                <circle cx="100" cy="70" r="28" fill="#e8c49a" />
                <path d="M78 65 Q100 50 122 65 Q115 85 100 90 Q85 85 78 65Z" fill="#c49a6c" />
                <path d="M72 72 Q78 58 100 55 Q122 58 128 72 Q122 60 100 58 Q78 60 72 72Z" fill="#5c3d2e" />
              </svg>
            </div>
          </div>
          <div className="og-info">
            <p className="og-label">MẶC ĐỊNH MẠNG XÃ HỘI</p>
            <p className="og-description">
              Xem trước hình ảnh khi chia sẻ liên kết trên Facebook/Zalo/X.
            </p>
          <div className="og-actions">
              <input
                type="file"
                id="og-image-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleChangeOGImage}
              />
              <button className="btn-primary" onClick={() => document.getElementById("og-image-input").click()}>
                THAY ĐỔI ẢNH
              </button>
              <button className="btn-secondary" onClick={() => alert("Xem trước: " + (ogImage ? "Ảnh đã được chọn" : "Chưa có ảnh nào"))}>
                XEM TRƯỚC
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION 3: An ninh & Bảo mật ===================== */}
      <section className="settings-section security-section">
        <div className="security-header">
          <div className="security-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
                fill="#1a3a6b"
                stroke="#1a3a6b"
                strokeWidth="1"
              />
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="security-title">An ninh &amp; Bảo mật</h2>
            <p className="security-subtitle">Thiết lập các lớp phòng thủ cho dữ liệu tòa soạn.</p>
          </div>
        </div>

        {/* 2FA Row */}
        <div className="security-item twofa-item">
          <div className="twofa-logo">
            <span className="twofa-text">AUTH</span>
            <span className="twofa-icon-dot">⬤</span>
            <span className="twofa-text">ICATOR</span>
          </div>
          <div className="security-item-info">
            <h4 className="security-item-title">Xác thực hai yếu tố (2FA)</h4>
            <p className="security-item-desc">
              Yêu cầu dùng ứng dụng xác thực khi đăng nhập vào quản trị.
            </p>
          </div>
          <div className="toggle-container">
            {/* <span className="toggle-label">ĐANG BẬT</span> */}
            <button
              className={`toggle-switch ${twoFA ? "on" : "off"}`}
              onClick={() => setTwoFA(!twoFA)}
              aria-label="Toggle 2FA"
            >
              <span className="toggle-knob" />
            </button>
          </div>
        </div>

        {/* Login Limit Row */}
        <div className="security-item">
          <div className="security-item-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1a3a6b" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="security-item-info">
            <h4 className="security-item-title">Giới hạn Đăng nhập Sai</h4>
            <p className="security-item-desc">
              Khóa IP tạm thời sau 5 lần nhập sai mật khẩu liên tiếp.
            </p>
          </div>
          <div className="security-item-action">
            <span className="security-item-value">
              {loginLimit.attempts} Lần / {loginLimit.minutes} Phút
            </span>
            <button className="icon-edit-btn" title="Chỉnh sửa" onClick={() => {
              setEditLoginLimit(loginLimit);
              setShowLoginLimitModal(true);
            }}>
              <svg viewBox="0 0 20 20" fill="none">
                <path
                  d="M14.69 2.21a1.5 1.5 0 012.1 2.1l-9.5 9.5-2.8.7.7-2.8 9.5-9.5z"
                  stroke="#555"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Access Log Row */}
        <div className="security-item">
          <div className="security-item-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#1a3a6b" strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke="#1a3a6b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="security-item-info">
            <h4 className="security-item-title">Nhật ký Truy cập Hệ thống</h4>
            <p className="security-item-desc">
              Lưu vết tất cả các thao tác thay đổi cấu hình từ quản trị viên.
            </p>
          </div>
          <div className="security-item-action">
            <button className="btn-outline-sm" onClick={() => setShowLogModal(true)}>XEM NHẬT KÝ</button>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ACTIONS ===================== */}
      <div className="settings-footer">
        {saveMessage && <p className="save-message">{saveMessage}</p>}
        <p className="last-updated">
          🕐 CẬP NHẬT LẦN CUỐI: 14:32 - 24/03/2024
        </p>
        <div className="footer-actions">
          <button className="btn-cancel" onClick={handleCancelChanges}>HỦY THAY ĐỔI</button>
          <button className="btn-save" onClick={handleSaveSettings} disabled={!hasChanges}>LƯU TẤT CẢ CẤU HÌNH</button>
        </div>
      </div>

      {/* ===================== MODAL: Access Logs ===================== */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Nhật ký Truy cập Hệ thống</h3>
              <button className="modal-close" onClick={() => setShowLogModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <table className="log-table">
                <thead>
                  <tr>
                    <th>THỜI GIAN</th>
                    <th>NGƯỜI DÙNG</th>
                    <th>THAO TÁC</th>
                    <th>ĐỊA CHỈ IP</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.time}</td>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                      <td className="ip-cell">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setShowLogModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: Edit Login Limit ===================== */}
      {showLoginLimitModal && (
        <div className="modal-overlay" onClick={() => setShowLoginLimitModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Chỉnh sửa Giới hạn Đăng nhập Sai</h3>
              <button className="modal-close" onClick={() => setShowLoginLimitModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Số lần thử tối đa</label>
                <input
                  type="number"
                  className="form-input"
                  value={editLoginLimit.attempts}
                  onChange={(e) => setEditLoginLimit({ ...editLoginLimit, attempts: parseInt(e.target.value) })}
                  min="1"
                  max="20"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thời gian khóa (phút)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editLoginLimit.minutes}
                  onChange={(e) => setEditLoginLimit({ ...editLoginLimit, minutes: parseInt(e.target.value) })}
                  min="5"
                  max="120"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowLoginLimitModal(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSaveLoginLimit}>Cập nhật</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;