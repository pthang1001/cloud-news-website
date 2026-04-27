import { useState, useRef } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Field({ name, label, type = "text", placeholder, inputRef, value, onChange, onFocus, onBlur, style }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <input
        type={type} 
        name={name} 
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        spellCheck="false"
        autoComplete="off"
        style={{ ...style, textTransform: "none" }}
      />
    </div>
  );
}

function PasswordField({ name, label, placeholder, value, onChange, onFocus, onBlur, disabled, style, showPassword, onToggle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <style>{`input::-ms-reveal, input::-ms-clear { display: none; }`}</style>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          style={{...style, paddingRight: "40px", textTransform: "none"}}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{ position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
        >
          {showPassword ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const fullnameRef = useRef(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const normalizeName = (name) => {
    if (!name) return "";
    return name.trim().toLowerCase().split(' ').filter(w => w !== "").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

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

  const handleSubmit = async () => {
    // FIX: Loại bỏ khoảng trắng ở 2 đầu để không bị lỗi Regex Duy nhé
    const rawFullname = fullnameRef.current.value.trim();
    const rawEmail = form.email.trim();
    const rawPassword = form.password.trim();
    const rawConfirm = form.confirmPassword.trim();

    setError("");
    const errors = {};
    
    // Regex email linh hoạt hơn cho Duy nhé
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    // Mật khẩu: Ít nhất 6 ký tự, có 1 chữ HOA và 1 ký tự đặc biệt
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;

    if (!rawFullname) errors.fullname = true;
    if (!emailRegex.test(rawEmail)) errors.email = true;
    if (!passRegex.test(rawPassword)) errors.password = true;
    if (rawPassword !== rawConfirm) errors.confirmPassword = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Thông tin nhập chưa đúng (Email cần đúng định dạng, Mật khẩu cần chữ HOA và ký tự đặc biệt) Duy nhé!");
      return;
    }

    setLoading(true);
    try {
      const finalName = normalizeName(rawFullname);
      const data = await register(finalName, rawEmail, rawPassword);
      
      const now = new Date();
      const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        fullname: finalName,
        email: rawEmail,
        joinDate: formattedDate 
      }));

      if (onSuccess) onSuccess(data);
      navigate("/");
      window.location.reload(); 
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", margin: "10px 0" }}>Tham gia cộng đồng độc giả Diễn Đàn Press</h2>
      
      <Field 
        name="fullname" 
        label="Họ và tên" 
        placeholder="Nguyễn Văn A" 
        inputRef={fullnameRef} 
        onFocus={() => setFocused(f => ({ ...f, fullname: true }))} 
        onBlur={() => setFocused(f => ({ ...f, fullname: false }))} 
        style={inputStyle("fullname", fieldErrors.fullname)} 
      />

      <Field 
        name="email" 
        label="Email" 
        type="email" 
        placeholder="example@press.vn" 
        value={form.email} 
        onChange={(e) => setForm({...form, email: e.target.value})} 
        onFocus={() => setFocused(f => ({ ...f, email: true }))} 
        onBlur={() => setFocused(f => ({ ...f, email: false }))} 
        style={inputStyle("email", fieldErrors.email)} 
      />

      <PasswordField name="password" label="Mật khẩu" placeholder="••••••••" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} onFocus={() => setFocused(f => ({ ...f, password: true }))} onBlur={() => setFocused(f => ({ ...f, password: false }))} style={inputStyle("password", fieldErrors.password)} showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
      <PasswordField name="confirmPassword" label="Xác nhận mật khẩu" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} onFocus={() => setFocused(f => ({ ...f, confirmPassword: true }))} onBlur={() => setFocused(f => ({ ...f, confirmPassword: false }))} style={inputStyle("confirmPassword", fieldErrors.confirmPassword)} showPassword={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />

      {error && <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px", textAlign: "center" }}>{error}</div>}

      <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#bfdbfe" : "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}>
        {loading ? "Đang xử lý..." : "Tạo tài khoản"}
      </button>
    </div>
  );
}