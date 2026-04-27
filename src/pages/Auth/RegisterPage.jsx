import { useNavigate } from "react-router-dom";
import OAuthButtons from "../../components/Auth/OAuthButtons";
import RegisterForm from "../../components/Auth/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", maxWidth: 520, minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
          Tạo tài khoản mới
        </h2>
        <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
          Tham gia cộng đồng độc giả Diễn Đàn Press
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "36px 40px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.03)",
        border: "1px solid #f0f4f8",
      }}>
        <OAuthButtons />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, marginTop: 28 }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase", whiteSpace: "nowrap" }}>Hoặc tiếp tục với Email</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <RegisterForm onSuccess={(data) => {
          console.log("Register success:", data);
          navigate("/");
        }} />
      </div>

      {/* Footer */}
      <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: "#64748b" }}>
        Đã có tài khoản?{" "}
        <a href="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = "#1d4ed8"} onMouseLeave={e => e.target.style.color = "#2563eb"}>
          Đăng nhập
        </a>
      </p>

      {/* Security badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 24 }}>
        <div style={{
          width: 34, 
          height: 34, 
          borderRadius: 10,
          background: "linear-gradient(135deg, #f0f4f8, #e8ecf1)",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", lineHeight: 1.4 }}>Bảo mật tuyệt đối</div>
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>Dữ liệu được mã hóa theo tiêu chuẩn ngân hàng</div>
        </div>
      </div>
    </div>
  );
}