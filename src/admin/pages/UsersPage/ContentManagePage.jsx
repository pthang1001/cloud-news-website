import { useState, useEffect } from 'react';
import './ContentManagePage.css';

// Thêm bộ Icon để giống trang Users Duy nhé
const Icon = {
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
};

export default function ContentManagePage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/reported-comments');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Lỗi lấy tố cáo Duy ơi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Xóa bình luận vi phạm này nhé?")) {
      await fetch(`http://localhost:5000/api/articles/comments/${id}`, { method: 'DELETE' });
      fetchReports();
    }
  };

  return (
    <div className="users-page"> {/* Dùng chung class với UsersPage để ăn theo CSS tổng */}
      <div className="users-page__header">
        <div>
          <h1 className="users-page__title">Quản lý nội dung & Tố cáo</h1>
          <p className="users-page__subtitle">Xử lý các báo cáo vi phạm nội dung từ cộng đồng Press.</p>
        </div>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--orange"><Icon.Alert /></div>
          <div className="stat-card__label">BÌNH LUẬN ĐỢI XỬ LÝ</div>
          <div className="stat-card__value">{reports.length}</div>
        </div>
      </div>

      <div className="users-table-section">
        <table className="users-table">
          <thead>
            <tr>
              <th>NGƯỜI GỬI</th>
              <th>NỘI DUNG VI PHẠM</th>
              <th>THỜI GIAN</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px' }}>Đang tải dữ liệu...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Hiện tại không có tố cáo nào nhé! </td></tr>
            ) : (
              reports.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-placeholder" style={{background: '#cbd5e1', color: '#475569'}}>
                        {r.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{r.user_name}</div>
                        <div className="user-email">{r.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="violation-text">"{r.content}"</p>
                  </td>
                  <td>
                    <span className="report-time">{new Date(r.created_at).toLocaleString('vi-VN')}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn action-btn--delete" title="Xóa vi phạm" onClick={() => handleDelete(r.id)}>
                        <Icon.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}