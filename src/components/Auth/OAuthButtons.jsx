export default function OAuthButtons() {
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
  };

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
      <button
        style={btnStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
        onClick={() => console.log("Google login")}
      >
        {/* Google icon */}
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2 14-5.3l-6.5-5.5C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.5 5.5C41.9 36.1 44 30.4 44 24c0-1.3-.1-2.6-.4-3.9z"/>
        </svg>
        Google
      </button>

      <button
        style={btnStyle}
        onMouseEnter={e => handleHover(e, true)}
        onMouseLeave={e => handleHover(e, false)}
        onClick={() => console.log("Facebook login")}
      >
        {/* Facebook icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
        </svg>
        Facebook
      </button>
    </div>
  );
}