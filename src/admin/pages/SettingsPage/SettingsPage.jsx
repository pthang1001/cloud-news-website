import { useState, useEffect } from "react";

const SettingsPage = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Giao diện</h1>
      <p style={{ color: 'var(--text-sub)', marginBottom: '40px' }}>Tùy chỉnh không gian làm việc của bạn</p>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '20px',
        padding: '30px 50px',
        background: 'var(--sidebar-bg)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)'
      }}>
        <span style={{ fontSize: '18px', fontWeight: '600' }}>{isDark ? "Chế độ Tối" : "Chế độ Sáng"}</span>
        
        {/* Nút Toggle Switch */}
        <div 
          onClick={toggleTheme}
          style={{
            width: '64px', height: '32px',
            background: isDark ? '#3b82f6' : '#cbd5e1',
            borderRadius: '16px', cursor: 'pointer', position: 'relative', transition: '0.3s'
          }}
        >
          <div style={{
            width: '24px', height: '24px', background: '#fff',
            borderRadius: '50%', position: 'absolute', top: '4px',
            left: isDark ? '36px' : '4px', transition: '0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
          }}>
            {isDark ? '🌙' : '☀️'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;