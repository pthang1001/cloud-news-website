import { useState, useEffect } from "react";
import "./ChangePasswordModal.css";

const getStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "", color: "" },
    { label: "Yếu", color: "#ef4444" },
    { label: "Trung bình", color: "#1d4ed8" },
    { label: "Mạnh", color: "#16a34a" },
    { label: "Rất mạnh", color: "#15803d" },
  ];
  return { score, ...levels[score] };
};

const EyeIcon = ({ off }) => off ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Lưu email người dùng Duy nhé

  useEffect(() => {
    // Lấy email người dùng từ localStorage khi mở Modal
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserEmail(JSON.parse(savedUser).email);
    }
  }, [isOpen]);

  const strength = getStrength(newPw);

  const validate = () => {
    const errs = {};
    if (!currentPw) errs.currentPw = "Vui lòng nhập mật khẩu hiện tại";
    if (!newPw) errs.newPw = "Vui lòng nhập mật khẩu mới";
    else if (newPw.length < 8) errs.newPw = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!confirmPw) errs.confirmPw = "Vui lòng xác nhận mật khẩu mới";
    else if (confirmPw !== newPw) errs.confirmPw = "Mật khẩu xác nhận không khớp";
    return errs;
  };

  // FIX: HÀM CẬP NHẬT MẬT KHẨU THỰC TẾ GỬI LÊN BACKEND Duy nhé
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setErrors({});
    setLoading(true);

    try {
      // Gửi yêu cầu đổi mật khẩu lên cổng 5000 Duy nhé
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          oldPassword: currentPw,
          newPassword: newPw
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          handleClose();
        }, 1800);
      } else {
        // Nếu mật khẩu cũ sai, Backend sẽ báo và hiện lỗi ở đây Duy nhé
        setErrors({ currentPw: data.message || "Đã có lỗi xảy ra." });
      }
    } catch (err) {
      setErrors({ currentPw: "Không thể kết nối máy chủ. Hãy chạy server.js Duy nhé!" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setErrors({}); setSuccess(false); setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cpw-overlay" onClick={handleClose}>
      <div className="cpw-modal" onClick={(e) => e.stopPropagation()}>
        {/* FIX: CSS ẨN CON MẮT DƯ THỪA TRÊN TRÌNH DUYỆT Duy nhé */}
        <style>{`
          input::-ms-reveal, input::-ms-clear { display: none; }
        `}</style>

        {/* HEADER */}
        <div className="cpw-header">
          <div>
            <h2 className="cpw-title">Đổi mật khẩu</h2>
            <p className="cpw-subtitle">
              Để bảo mật tài khoản, vui lòng sử dụng mật khẩu mạnh bao gồm chữ cái, chữ số và ký
              tự đặc biệt. Hệ thống khuyến nghị cập nhật mật khẩu 3 tháng một lần.
            </p>
          </div>
          <button className="cpw-close-btn" onClick={handleClose} aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* SUCCESS STATE */}
        {success ? (
          <div className="cpw-success">
            <div className="cpw-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <p className="cpw-success-text">Mật khẩu đã được cập nhật thành công!</p>
          </div>
        ) : (
          <>
            {/* FORM CARD */}
            <div className="cpw-card">
              {/* Current Password */}
              <div className="cpw-field">
                <label className="cpw-label">MẬT KHẨU HIỆN TẠI</label>
                <div className={`cpw-input-wrap ${errors.currentPw ? "cpw-input-wrap--error" : ""}`}>
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="cpw-input"
                    placeholder="••••••••"
                    value={currentPw}
                    onChange={(e) => { setCurrentPw(e.target.value); setErrors((p) => ({ ...p, currentPw: "" })); }}
                  />
                  <button type="button" className="cpw-eye-btn" onClick={() => setShowCurrent((v) => !v)}>
                    <EyeIcon off={!showCurrent} />
                  </button>
                </div>
                {errors.currentPw && <span className="cpw-error">{errors.currentPw}</span>}
              </div>

              {/* New Password */}
              <div className="cpw-field">
                <label className="cpw-label">MẬT KHẨU MỚI</label>
                <div className={`cpw-input-wrap ${errors.newPw ? "cpw-input-wrap--error" : ""}`}>
                  <input
                    type={showNew ? "text" : "password"}
                    className="cpw-input"
                    placeholder="Tối thiểu 8 ký tự"
                    value={newPw}
                    onChange={(e) => { setNewPw(e.target.value); setErrors((p) => ({ ...p, newPw: "" })); }}
                  />
                  <button type="button" className="cpw-eye-btn" onClick={() => setShowNew((v) => !v)}>
                    <EyeIcon off={!showNew} />
                  </button>
                </div>

                {/* Strength Bar */}
                {newPw && (
                  <div className="cpw-strength">
                    <div className="cpw-strength-header">
                      <span className="cpw-strength-label">Độ mạnh mật khẩu</span>
                      <span className="cpw-strength-value" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="cpw-strength-bar">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="cpw-strength-segment"
                          style={{
                            background: i <= strength.score ? strength.color : "#e2e8f0",
                          }}
                        />
                      ))}
                    </div>
                    <p className="cpw-strength-tip">
                      <em>Mẹo: Sử dụng cụm từ dễ nhớ kết hợp với số để tăng tính bảo mật.</em>
                    </p>
                  </div>
                )}
                {errors.newPw && <span className="cpw-error">{errors.newPw}</span>}
              </div>

              {/* Confirm Password */}
              <div className="cpw-field">
                <label className="cpw-label">XÁC NHẬN MẬT KHẨU MỚI</label>
                <div className={`cpw-input-wrap ${errors.confirmPw ? "cpw-input-wrap--error" : ""}`}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="cpw-input"
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPw}
                    onChange={(e) => { setConfirmPw(e.target.value); setErrors((p) => ({ ...p, confirmPw: "" })); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                  <button type="button" className="cpw-eye-btn" onClick={() => setShowConfirm((v) => !v)}>
                    <EyeIcon off={!showConfirm} />
                  </button>
                </div>
                {errors.confirmPw && <span className="cpw-error">{errors.confirmPw}</span>}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="cpw-actions">
              <button className="cpw-btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <span className="cpw-spinner" />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                )}
                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
              <button className="cpw-btn-cancel" onClick={handleClose} disabled={loading}>
                Hủy bỏ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;