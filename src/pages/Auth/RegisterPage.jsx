import { useNavigate } from "react-router-dom";
import OAuthButtons from "../../components/Auth/OAuthButtons";
import RegisterForm from "../../components/Auth/RegisterForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", maxWidth: 520, minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          Tạo tài khoản mới
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Tham gia cộng đồng 500k+ độc giả Diễn Đàn Press
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "32px 36px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid rgba(226,232,240,0.8)",
      }}>
        <OAuthButtons />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1.5, fontWeight: 600 }}>HOẶC ĐĂNG KÝ VỚI EMAIL</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <RegisterForm onSuccess={(data) => {
          console.log("Register success:", data);
          navigate("/login");
        }} />
      </div>

      {/* Footer */}
      <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#64748b" }}>
        Đã có tài khoản?{" "}
        <a href="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
          Đăng nhập
        </a>
      </p>

      {/* Security badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "#f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Bảo mật tuyệt đối</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Dữ liệu của bạn được mã hóa theo tiêu chuẩn ngân hàng.</div>
        </div>
      </div>
    </div>
  );
}