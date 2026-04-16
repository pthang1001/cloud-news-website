import { useState } from "react";
import { register } from "../../services/authService";

function Field({ name, label, type = "text", placeholder, value, onChange, onFocus, onBlur, disabled, style }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input
        type={type} 
        name={name} 
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        style={style}
      />
    </div>
  );
}

function PasswordField({ name, label, placeholder, value, onChange, onFocus, onBlur, disabled, style, showPassword, onToggle }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          style={{...style, paddingRight: "40px"}}
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          style={{
            position: "absolute",
            right: 12,
            background: "none",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            color: "#94a3b8",
            padding: "4px 8px",
            transition: "color .2s",
          }}
          onMouseEnter={e => { if (!disabled) e.target.style.color = "#64748b"; }}
          onMouseLeave={e => { e.target.style.color = "#94a3b8"; }}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
              <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ fullname: "", email: "", password: "", confirmPassword: "", agree: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputStyle = (name, hasError) => ({
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${hasError ? "#ef4444" : focused[name] ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: 10,
    fontSize: 14,
    color: "#1e293b",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: "border-color .18s, box-shadow .18s",
    boxShadow: focused[name] ? (hasError ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 0 0 3px rgba(37,99,235,0.1)") : "none",
  });

  const handleFieldChange = (name) => (e) => {
    setForm(f => ({ ...f, [name]: e.target.value }));
    if (error) setError("");
  };

  const handleFieldFocus = (name) => () => {
    setFocused(f => ({ ...f, [name]: true }));
  };

  const handleFieldBlur = (name) => () => {
    setFocused(f => ({ ...f, [name]: false }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.fullname || !form.email || !form.password || !form.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email không hợp lệ.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!form.agree) {
      setError("Vui lòng đồng ý với điều khoản sử dụng.");
      return;
    }
    setLoading(true);
    try {
      const data = await register(form.fullname, form.email, form.password);
      localStorage.setItem("token", data.token);
      onSuccess?.(data);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Register Header Info */}
      <div style={{ 
        background: "#f0f9ff", 
        border: "1px solid #bfdbfe",
        borderRadius: 10,
        padding: "12px 14px",
        fontSize: 13,
        color: "#1e40af",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span style={{ fontWeight: 500, lineHeight: 1.4 }}>Mật khẩu phải có ít nhất 6 ký tự với chữ, số và ký tự đặc biệt</span>
      </div>

      <Field 
        name="fullname" 
        label="Họ và tên" 
        placeholder="Nguyễn Văn A"
        value={form.fullname}
        onChange={handleFieldChange("fullname")}
        onFocus={handleFieldFocus("fullname")}
        onBlur={handleFieldBlur("fullname")}
        disabled={loading}
        style={inputStyle("fullname", false)}
      />
      <Field 
        name="email" 
        label="Email" 
        type="email" 
        placeholder="example@press.vn"
        value={form.email}
        onChange={handleFieldChange("email")}
        onFocus={handleFieldFocus("email")}
        onBlur={handleFieldBlur("email")}
        disabled={loading}
        style={inputStyle("email", false)}
      />
      <PasswordField 
        name="password" 
        label="Mật khẩu" 
        placeholder="••••••••"
        value={form.password}
        onChange={handleFieldChange("password")}
        onFocus={handleFieldFocus("password")}
        onBlur={handleFieldBlur("password")}
        disabled={loading}
        style={inputStyle("password", false)}
        showPassword={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
      />
      <PasswordField 
        name="confirmPassword" 
        label="Xác nhận mật khẩu" 
        placeholder="••••••••"
        value={form.confirmPassword}
        onChange={handleFieldChange("confirmPassword")}
        onFocus={handleFieldFocus("confirmPassword")}
        onBlur={handleFieldBlur("confirmPassword")}
        disabled={loading}
        style={inputStyle("confirmPassword", false)}
        showPassword={showConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <label style={{ 
        display: "flex", 
        alignItems: "flex-start", 
        gap: 10, 
        fontSize: 14, 
        color: "#374151", 
        cursor: loading ? "not-allowed" : "pointer", 
        opacity: loading ? 0.6 : 1,
        padding: "4px 0",
      }}>
        <input 
          type="checkbox" 
          checked={form.agree}
          onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}
          disabled={loading}
          style={{ width: 16, height: 16, accentColor: "#2563eb", marginTop: 2, flexShrink: 0, cursor: loading ? "not-allowed" : "pointer" }} 
        />
        <span style={{ fontWeight: 500, lineHeight: 1.5 }}>
          Tôi đồng ý với{" "}
          <a href="/terms" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700, transition: "color .2s" }} onMouseEnter={e => e.target.style.color = "#1d4ed8"} onMouseLeave={e => e.target.style.color = "#2563eb"}>Điều khoản sử dụng</a>{" "}
          và{" "}
          <a href="/privacy" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 700, transition: "color .2s" }} onMouseEnter={e => e.target.style.color = "#1d4ed8"} onMouseLeave={e => e.target.style.color = "#2563eb"}>Chính sách bảo mật</a>
        </span>
      </label>

      {error && (
        <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontWeight: 500, lineHeight: 1.4 }}>{error}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{
          width: "100%", 
          padding: "14px 16px",
          background: loading ? "#bfdbfe" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff", 
          border: "none", 
          borderRadius: 10,
          fontSize: 15, 
          fontWeight: 700, 
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          transition: "all .2s ease",
          boxShadow: loading ? "0 2px 8px rgba(37,99,235,0.2)" : "0 4px 15px rgba(37,99,235,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 4,
          letterSpacing: "0.3px",
        }}
        onMouseEnter={e => { if (!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)"; } }}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(37,99,235,0.35)"; }}
      >
        {loading && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin .8s linear infinite" }}>
            <circle cx="12" cy="12" r="10" style={{opacity: 0.3}}/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        )}
        {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}