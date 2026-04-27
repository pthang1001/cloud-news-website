import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Be Vietnam Pro', sans-serif", flexDirection: isMobile ? "column" : "row" }}>
      {/* ── CỘT TRÁI ── */}
      <div style={{
        flex: isMobile ? "0 0 auto" : "0 0 50%",
        minHeight: isMobile ? "40vh" : "100vh",
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 48px",
        color: "#1a1a1a",
        borderRight: "1px solid #e2e8f0",
      }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute", bottom: "10%", left: "50%",
          transform: "translateX(-50%)",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }} />

        {/* Logo */}
        <div style={{ position: "absolute", top: 32, left: 48, zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <img src="/Dien_dan_logo.png" alt="Diễn Đàn Press" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </a>
        </div>

        {/* Tagline - Centered */}
        <div style={{ 
          position: "relative", 
          zIndex: 1, 
          textAlign: "center",
          maxWidth: 600,
        }}>
          <div style={{
            fontSize: 13, letterSpacing: 3, textTransform: "uppercase",
            color: "#94a3b8", marginBottom: 28, fontWeight: 600,
          }}>Editorial News</div>
          
          <h1 style={{
            fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, lineHeight: 1.5,
            margin: "0 0 24px", letterSpacing: "-0.8px", color: "#0f172a",
          }}>
            Trí tuệ biên tập,<br />
            <span style={{ color: "#2563eb" }}>Tầm nhìn thời đại.</span>
          </h1>
          
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, margin: "0 0 44px", fontWeight: 500 }}>
            Tham gia cộng đồng Diễn Đàn Press để cập nhật<br />
            những phân tích sâu sắc và thông tin uy tín<br />
            từ các chuyên gia hàng đầu.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            {[
              { val: "500k+", label: "ĐỘC GIẢ TIN DÙNG" },
              { val: "24/7", label: "TIN TỨC ĐA CHIỀU" },
            ].map(({ val, label }) => (
              <div key={label} style={{
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: 16, 
                padding: "24px 32px",
                backdropFilter: "blur(10px)",
                flex: "1",
                minWidth: 140,
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", color: "#0f172a", marginBottom: 8 }}>{val}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CỘT PHẢI ── */}
      <div style={{
        flex: 1,
        minHeight: isMobile ? "60vh" : "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        position: "relative",
      }}>
        {isRegister ? <RegisterPage /> : <LoginPage />}

        <div style={{ position: "absolute", bottom: 20, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          © 2026 Diễn Đàn Press · Editorial Precision System
        </div>
      </div>
    </div>
  );
}