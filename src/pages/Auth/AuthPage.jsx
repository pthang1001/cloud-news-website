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
        background: "linear-gradient(160deg, #0a1628 0%, #0d2657 60%, #1a3a7a 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "32px 48px",
        color: "#fff",
      }}>
        {/* Grid pattern overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute", bottom: "10%", left: "5%",
          width: 350, height: 350,
          background: "radial-gradient(circle, rgba(30,100,255,0.25) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff",
          }}>D</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>Diễn Đàn Press</span>
        </div>

        {/* Nav */}
        <nav style={{ position: "relative", zIndex: 1, display: "flex", gap: 28, marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
          {["Thời sự", "Thể thao", "Công nghệ", "Kinh doanh", "Giải trí"].map(item => (
            <a key={item} href="#" style={{ color: "inherit", textDecoration: "none" }}>{item}</a>
          ))}
        </nav>

        {/* Tagline */}
        <div style={{ position: "relative", zIndex: 1, marginTop: "auto", paddingBottom: 40 }}>
          <div style={{
            fontSize: 13, letterSpacing: 3, textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)", marginBottom: 20, fontWeight: 500,
          }}>Editorial News</div>
          <h1 style={{
            fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, lineHeight: 1.2,
            margin: "0 0 20px", letterSpacing: "-0.5px",
          }}>
            Trí tuệ biên tập,<br />
            <span style={{ color: "#60a5fa" }}>Tầm nhìn thời đại.</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 380, margin: "0 0 36px" }}>
            Tham gia cộng đồng Diễn Đàn Press để cập nhật những phân tích sâu sắc và thông tin uy tín từ các chuyên gia hàng đầu.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { val: "500k+", label: "ĐỘC GIẢ TIN DÙNG" },
              { val: "24/7", label: "TIN TỨC ĐA CHIỀU" },
            ].map(({ val, label }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14, padding: "16px 24px", backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CỘT PHẢI ── */}
      <div style={{
        flex: 1,
        minHeight: isMobile ? "60vh" : "100vh",
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        position: "relative",
      }}>
        {isRegister ? <RegisterPage /> : <LoginPage />}

        <div style={{ position: "absolute", bottom: 20, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          © 2024 Diễn Đàn Press · Editorial Precision System
        </div>
      </div>
    </div>
  );
}