import { useState } from "react";
import { register } from "../../services/authService";

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ fullname: "", email: "", password: "", confirmPassword: "", agree: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});

  const inputStyle = (name) => ({
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${focused[name] ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: 10,
    fontSize: 14,
    color: "#1e293b",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: "border-color .18s",
    boxShadow: focused[name] ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
  });

  const Field = ({ name, label, type = "text", placeholder }) => (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input
        type={type} name={name} value={form[name]} placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        onFocus={() => setFocused(f => ({ ...f, [name]: true }))}
        onBlur={() => setFocused(f => ({ ...f, [name]: false }))}
        style={inputStyle(name)}
      />
    </div>
  );

  const handleSubmit = async () => {
    setError("");
    if (!form.fullname || !form.email || !form.password || !form.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp."); return;
    }
    if (!form.agree) {
      setError("Vui lòng đồng ý với điều khoản sử dụng."); return;
    }
    setLoading(true);
    try {
      const data = await register(form.fullname, form.email, form.password);
      onSuccess?.(data);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Field name="fullname" label="Họ và tên" placeholder="Nguyễn Văn A" />
      <Field name="email" label="Email" type="email" placeholder="example@press.vn" />
      <Field name="password" label="Mật khẩu" type="password" placeholder="••••••••" />
      <Field name="confirmPassword" label="Xác nhận mật khẩu" type="password" placeholder="••••••••" />

      <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#64748b", cursor: "pointer" }}>
        <input type="checkbox" checked={form.agree}
          onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))}
          style={{ width: 15, height: 15, accentColor: "#2563eb", marginTop: 1, flexShrink: 0 }} />
        <span>
          Tôi đồng ý với{" "}
          <a href="/terms" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>Điều khoản sử dụng</a>{" "}
          và{" "}
          <a href="/privacy" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>Chính sách bảo mật</a>
        </span>
      </label>

      {error && (
        <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px" }}>
          {error}
        </div>
      )}

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
        }}
        onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
      >
        {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
      </button>
    </div>
  );
}