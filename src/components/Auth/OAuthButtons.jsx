import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ Đã gỡ facebookProvider để không bị lỗi import Duy nhé
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";

export default function OAuthButtons() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const btnStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "11px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    color: "#1e293b",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    transition: "all .18s ease",
  };

  const handleHover = (e, enter) => {
    e.currentTarget.style.borderColor = enter ? "#94a3b8" : "#e2e8f0";
    e.currentTarget.style.boxShadow = enter ? "0 2px 8px rgba(0,0,0,0.08)" : "none";
    e.currentTarget.style.transform = enter ? "translateY(-1px)" : "translateY(0)";
  };

  // ✅ Logic đã rút gọn chỉ còn cho Google Duy nhé
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // 1. Mở Popup xác thực Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Gửi thông tin về Backend
      const res = await fetch("http://localhost:5000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          provider: "google",
          socialId: user.uid
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        // 3. Lưu token và chuyển hướng
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
        window.location.reload();
      } else {
        alert(data.message || "Lỗi đăng nhập Google Duy ơi!");
      }

    } catch (err) {
      console.error("Lỗi OAuth:", err);
      if (err.code !== "auth/cancelled-popup-request") {
        alert("Xác thực Google thất bại hoặc bạn đã hủy!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
      {/* Chỉ giữ lại nút Google và căn giữa nó Duy nhé */}
      <button
        style={btnStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
        onClick={handleGoogleLogin}
        disabled={loading}
        title="Đăng nhập với Google"
      >
        {loading ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin .8s linear infinite" }}>
            <circle cx="12" cy="12" r="10" style={{opacity: 0.3}}/>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.5 5.5C41.9 36.1 44 30.4 44 24c0-1.3-.1-2.6-.4-3.9z"/>
          </svg>
        )}
        {loading ? "Đang xác minh..." : "Đăng nhập với Google"}
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