import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom"; // Thêm điều hướng bạn nhé

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState({});
  const navigate = useNavigate();

  const inputStyle = (focused, hasError) => ({
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${hasError ? "#ef4444" : focused ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: 10,
    fontSize: 14,
    color: "#1e293b",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: "border-color .18s, box-shadow .18s",
    boxShadow: focused ? (hasError ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 0 0 3px rgba(37,99,235,0.1)") : "none",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { 
      setError("Vui lòng điền đầy đủ thông tin."); 
      return; 
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email không hợp lệ.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      
      // LƯU THÔNG TIN THỰC TẾ: Để Profile và Navbar hiện đúng tên bạn ơi
      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Thông báo thành công và chuyển hướng
      onSuccess?.(data);
      navigate("/");
      window.location.reload(); // Làm mới để Navbar cập nhật tên thật ngay lập tức
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
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
      {/* Email */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
        <input
          type="email" 
          name="email" 
          value={form.email}
          placeholder="example@press.vn"
          onChange={handleChange}
          onFocus={() => setFocused(f => ({ ...f, email: true }))}
          onBlur={() => setFocused(f => ({ ...f, email: false }))}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={inputStyle(focused.email, false)}
        />
      </div>

      {/* Password */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Mật khẩu</label>
          <a href="/forgot-password" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500, transition: "color .2s" }} onMouseEnter={e => e.target.style.color = "#1d4ed8"} onMouseLeave={e => e.target.style.color = "#2563eb"}>Quên mật khẩu?</a>
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          {/* CSS ẩn icon mặc định của trình duyệt để không bị "hai con mắt" bạn nhé */}
          <style>{`
            input::-ms-reveal, input::-ms-clear { display: none; }
          `}</style>
          <input
            type={showPassword ? "text" : "password"}
            name="password" 
            value={form.password}
            placeholder="••••••••"
            onChange={handleChange}
            onFocus={() => setFocused(f => ({ ...f, password: true }))}
            onBlur={() => setFocused(f => ({ ...f, password: false }))}
            onKeyPress={handleKeyPress}
            disabled={loading}
            style={{
              ...inputStyle(focused.password, false),
              paddingRight: "40px",
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            style={{
              position: "absolute",
              right: 12,
              background: "none",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              color: "#94a3b8",
              padding: "4px 8px",
              transition: "color .2s",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.color = "#64748b"; }}
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

      {/* Remember */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
        <input 
          type="checkbox" 
          name="remember" 
          checked={form.remember} 
          onChange={handleChange}
          disabled={loading}
          style={{ width: 15, height: 15, accentColor: "#2563eb", cursor: loading ? "not-allowed" : "pointer" }} 
        />
        Ghi nhớ đăng nhập
      </label>

      {/* Error */}
      {error && (
        <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", 
          padding: "13px",
          background: loading ? "#bfdbfe" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff", 
          border: "none", 
          borderRadius: 10,
          fontSize: 15, 
          fontWeight: 700, 
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          transition: "all .2s",
          boxShadow: loading ? "0 2px 8px rgba(37,99,235,0.2)" : "0 4px 15px rgba(37,99,235,0.35)",
          letterSpacing: "0.2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        onMouseEnter={e => { if (!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(37,99,235,0.4)"; } }}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(37,99,235,0.35)"; }}
      >
        {loading && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin .8s linear infinite" }}>
            <circle cx="12" cy="12" r="10" style={{opacity: 0.3}}/>
            <path d="M12 2a10 10 0 0 1 10 10" style={{opacity: 1}}/>
          </svg>
        )}
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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