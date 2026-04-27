import { useState, useEffect } from 'react';
import './UsersPage.css';

// ── Icons (Giữ nguyên bộ SVG xịn của Duy) ──────────────────────────────────────────────
const Icon = {
  UserPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
  Ban: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// ── Modal Thêm Người Dùng (Giữ nguyên logic Duy đã viết) ───────────────────────────────────
function AddUserModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Subscriber', status: 'Ngoại tuyến' });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return alert("Duy ơi, nhập đủ tên, email và pass nhé!");
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname: form.name, email: form.email, password: form.password })
      });
      if (response.ok) {
        alert("Thêm thành công! Giờ user này login được rồi đó Duy nhé.");
        onRefresh();
        onClose();
      } else {
        alert("Lỗi rồi bạn ơi!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Tạo tài khoản mới</h3>
          <button className="modal__close" onClick={onClose}><Icon.X /></button>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Tên hiển thị *</label>
            <input className="form-input" placeholder="Nguyễn Văn A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email đăng nhập *</label>
            <input className="form-input" placeholder="email@gmail.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-submit" onClick={handleSubmit}>Lưu thông tin</button>
        </div>
      </div>
    </div>
  );
}

// ── UsersPage Chính (Đã thêm tính năng Real-time Polling Duy nhé) ───────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      
      const mapped = data.map(u => ({
        ...u,
        // Tạo initials từ fullname an toàn Duy nhé
        initials: u.fullname ? u.fullname.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase() : "??",
        // Chuyển đổi status string từ Backend sang class CSS Duy nhé
        displayStatus: u.status === 'Đang hoạt động' ? 'active' : 'offline'
      }));
      setUsers(mapped);
    } catch (error) {
      console.error("Lỗi lấy danh sách Admin:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Tự động cập nhật mỗi 10 giây để Duy thấy ai vừa online/offline
  useEffect(() => { 
    fetchUsers(); 
    const timer = setInterval(fetchUsers, 10000); 
    return () => clearInterval(timer);
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const paginated = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    if (window.confirm("Xóa tài khoản này nhé Duy?")) {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <div className="users-page">
      <div className="users-page__header">
        <div>
          <h1 className="users-page__title">Quản lý người dùng</h1>
          <p className="users-page__subtitle">Trạng thái hoạt động của thành viên trong hệ thống.</p>
        </div>
        <button className="btn-add-user" onClick={() => setShowModal(true)}>
          <Icon.UserPlus /> Thêm thành viên
        </button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><Icon.Users /></div>
          <div className="stat-card__label">TỔNG NGƯỜI DÙNG</div>
          <div className="stat-card__value">{users.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--orange"><Icon.UserCheck /></div>
          <div className="stat-card__label">ĐANG HOẠT ĐỘNG</div>
          <div className="stat-card__value">{users.filter(u => u.status === 'Đang hoạt động').length}</div>
        </div>
      </div>

      <div className="users-table-section">
        <table className="users-table">
          <thead>
            <tr>
              <th>NGƯỜI DÙNG</th>
              <th>VAI TRÒ</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Đang kết nối Database...</td></tr>
            ) : (
              paginated.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      {/* Ưu tiên hiện ảnh đại diện Duy đã upload nhé */}
                      {user.avatar ? (
                        <img src={user.avatar} className="user-avatar-img" alt="AVT" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div className="user-avatar-placeholder">{user.initials}</div>
                      )}
                      <div>
                        <div className="user-name">{user.fullname}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="role-badge">{user.role || "Subscriber"}</span></td>
                  <td>
                    {/* Chấm xanh cho Online, Chấm xám cho Offline Duy nhé */}
                    <span className={`status-dot status-dot--${user.displayStatus}`}>
                      {user.status || 'Ngoại tuyến'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn action-btn--delete" title="Xóa" onClick={() => handleDelete(user._id)}>
                        <Icon.Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="users-pagination">
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <Icon.ChevronLeft />
          </button>
          <span className="page-info">Trang {currentPage} / {totalPages}</span>
          <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            <Icon.ChevronRight />
          </button>
        </div>
      </div>

      {showModal && <AddUserModal onClose={() => setShowModal(false)} onRefresh={fetchUsers} />}
    </div>
  );
}