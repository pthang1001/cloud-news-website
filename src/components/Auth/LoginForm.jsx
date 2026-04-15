import { useState } from "react";
import { login } from "../../services/authService";

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = (focused) => ({
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${focused ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: 10,
    fontSize: 14,
    color: "#1e293b",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: "border-color .18s",
    boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
  });

  const [focused, setFocused] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Vui lòng điền đầy đủ thông tin."); return; }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      onSuccess?.(data);
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Email */}
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
        <input
          type="email" name="email" value={form.email}
          placeholder="example@press.vn"
          onChange={handleChange}
          onFocus={() => setFocused(f => ({ ...f, email: true }))}
          onBlur={() => setFocused(f => ({ ...f, email: false }))}
          style={inputStyle(focused.email)}
        />
      </div>

      {/* Password */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Mật khẩu</label>
          <a href="/forgot-password" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Quên mật khẩu?</a>
        </div>
        <input
          type="password" name="password" value={form.password}
          placeholder="••••••••"
          onChange={handleChange}
          onFocus={() => setFocused(f => ({ ...f, password: true }))}
          onBlur={() => setFocused(f => ({ ...f, password: false }))}
          style={inputStyle(focused.password)}
        />
      </div>

      {/* Remember */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", cursor: "pointer" }}>
        <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange}
          style={{ width: 15, height: 15, accentColor: "#2563eb" }} />
        Ghi nhớ đăng nhập
      </label>

      {/* Error */}
      {error && (
        <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%", padding: "13px",
          background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "#fff", border: "none", borderRadius: 10,
          fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          transition: "all .2s",
          boxShadow: "0 4px 15px rgba(37,99,235,0.35)",
          letterSpacing: "0.2px",
        }}
        onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </div>
  );
}