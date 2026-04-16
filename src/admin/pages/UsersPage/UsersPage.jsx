import { useState } from 'react';
import './UsersPage.css';

// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = {
  UserPlus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
  Ban: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
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
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ── Static mock data ────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, name: 'Nguyễn Văn An',  email: 'an.nguyen@press.vn',  role: 'Admin',      status: 'active',  joinDate: '12/05/2023', initials: 'NA' },
  { id: 2, name: 'Lê Thị Mai',     email: 'mai.le@press.vn',     role: 'Editor',     status: 'active',  joinDate: '24/08/2023', initials: 'LM' },
  { id: 3, name: 'Trần Hoàng Nam', email: 'nam.tran@gmail.com',  role: 'Subscriber', status: 'blocked', joinDate: '02/11/2023', initials: 'TN' },
  { id: 4, name: 'Phạm Minh Tâm',  email: 'tam.pham@press.vn',   role: 'Editor',     status: 'active',  joinDate: '15/01/2024', initials: 'PT' },
  { id: 5, name: 'Hoàng Thu Hà',   email: 'ha.hoang@press.vn',   role: 'Editor',     status: 'active',  joinDate: '03/03/2024', initials: 'HH' },
  { id: 6, name: 'Vũ Đình Khoa',   email: 'khoa.vu@gmail.com',   role: 'Subscriber', status: 'active',  joinDate: '18/04/2024', initials: 'VK' },
];

const getStatConfig = () => [
  { label: 'TỔNG NGƯỜI DÙNG', iconColor: 'blue',   Icon: Icon.Users },
  { label: 'MỚI HÔM NAY',     iconColor: 'green',  Icon: Icon.UserPlus },
  { label: 'ĐANG HOẠT ĐỘNG',  iconColor: 'orange', Icon: Icon.UserCheck },
  { label: 'BỊ CHẶN',         iconColor: 'red',   Icon: Icon.Ban },
];

const ROLE_CLASS = { Admin: 'admin', Editor: 'editor', Subscriber: 'subscriber' };
const TABS = ['Tất cả', 'Admin', 'Biên tập viên'];

// ── AddUserModal ─────────────────────────────────────────────────────────────
function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '', role: 'Editor', status: 'active' });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.fullName || !form.email) return;
    const initials = form.fullName.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
    onAdd({ 
      id: Date.now(), 
      name: form.fullName,
      email: form.email,
      username: form.username,
      password: form.password,
      role: form.role,
      status: form.status,
      joinDate: new Date().toLocaleDateString('vi-VN'), 
      initials 
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Thêm người dùng mới</h3>
          <button className="modal__close" onClick={onClose}><Icon.X /></button>
        </div>

        <div className="modal__body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input className="form-input" name="fullName" placeholder="Nguyễn Văn A" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" name="email" type="email" placeholder="example@press.vn" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input className="form-input" name="username" placeholder="username" value={form.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vai trò</label>
              <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                <option value="Admin">Admin</option>
                <option value="Editor">Biên tập viên</option>
                <option value="Subscriber">Người đọc</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option value="active">Hoạt động</option>
                <option value="blocked">Bị chặn</option>
              </select>
            </div>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-submit" onClick={handleSubmit}>Thêm người dùng</button>
        </div>
      </div>
    </div>
  );
}

// ── EditRoleModal ────────────────────────────────────────────────────────────
function EditRoleModal({ user, onClose, onSave }) {
  const [newRole, setNewRole] = useState(user.role);

  const handleSave = () => {
    onSave(user.id, newRole);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">Chỉnh sửa vai trò</h3>
          <button className="modal__close" onClick={onClose}><Icon.X /></button>
        </div>

        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Người dùng: {user.name}</label>
            <p className="form-hint" style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{user.email}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Vai trò mới</label>
            <select className="form-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="Admin">Admin</option>
              <option value="Editor">Biên tập viên</option>
              <option value="Subscriber">Người đọc</option>
            </select>
          </div>
        </div>

        <div className="modal__footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-submit" onClick={handleSave}>Cập nhật</button>
        </div>
      </div>
    </div>
  );
}

// ── UsersPage ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers]         = useState(MOCK_USERS);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  // Calculate stats dynamically
  const statConfig = getStatConfig();
  const today = new Date().toLocaleDateString('vi-VN');
  const newTodayCount = users.filter(u => u.joinDate === today).length;
  const activeCount = users.filter(u => u.status === 'active').length;
  const blockedCount = users.filter(u => u.status === 'blocked').length;
  
  const stats = [
    { ...statConfig[0], value: users.length.toString() },
    { ...statConfig[1], value: newTodayCount.toString() },
    { ...statConfig[2], value: activeCount.toString() },
    { ...statConfig[3], value: blockedCount.toString() },
  ];

  // Filter by tab
  const filtered = users.filter(u => {
    if (activeTab === 'Admin')         return u.role === 'Admin';
    if (activeTab === 'Biên tập viên') return u.role === 'Editor';
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAddUser = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const handleEditUser = (id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleToggleBlock = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u
    ));
  };

  return (
    <div className="users-page">
      {/* ── Header ── */}
      <div className="users-page__header">
        <div>
          <h1 className="users-page__title">Quản lý người dùng</h1>
          <p className="users-page__subtitle">Quản lý tài khoản, phân quyền và trạng thái truy cập hệ thống.</p>
        </div>
        <button className="btn-add-user" onClick={() => setShowModal(true)}>
          <Icon.UserPlus />
          Thêm người dùng
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="users-stats">
        {stats.map(({ label, value, iconColor, Icon: IconComp }) => (
          <div className="stat-card" key={label}>
            <div className="stat-card__top">
              <div className={`stat-card__icon stat-card__icon--${iconColor}`}>
                <IconComp />
              </div>
            </div>
            <div className="stat-card__label">{label}</div>
            <div className="stat-card__value">{value}</div>
          </div>
        ))}
      </div>

      {/* ── Table Section ── */}
      <div className="users-table-section">
        {/* Toolbar */}
        <div className="users-toolbar">
          <div className="users-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`users-tab ${activeTab === tab ? 'users-tab--active' : ''}`}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="users-sort">
            Sắp xếp: Mới nhất
            <Icon.ChevronDown />
          </div>
        </div>

        {/* Table */}
        <table className="users-table">
          <thead>
            <tr>
              <th>NGƯỜI DÙNG</th>
              <th>VAI TRÒ</th>
              <th>TRẠNG THÁI</th>
              <th>NGÀY THAM GIA</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(user => (
              <tr key={user.id}>
                {/* User */}
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-placeholder">{user.initials}</div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td>
                  <span className={`role-badge role-badge--${ROLE_CLASS[user.role] || 'editor'}`}>
                    {user.role}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span className={`status-dot status-dot--${user.status}`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Bị chặn'}
                  </span>
                </td>

                {/* Date */}
                <td>{user.joinDate}</td>

                {/* Actions */}
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="Chỉnh sửa" onClick={() => setEditingUser(user)}>
                      <Icon.Edit />
                    </button>
                    <button
                      className="action-btn action-btn--block"
                      title={user.status === 'blocked' ? 'Bỏ chặn' : 'Chặn'}
                      onClick={() => handleToggleBlock(user.id)}
                    >
                      {user.status === 'blocked' ? <Icon.Lock /> : <Icon.Ban />}
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      title="Xóa"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination
        <div className="users-pagination">
          <span className="pagination-info">
            Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} – {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} trong số {filtered.length} người dùng
          </span>
          <div className="pagination-controls">
            <button className="page-btn page-btn--nav" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <Icon.ChevronLeft />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`page-btn ${currentPage === p ? 'page-btn--active' : ''}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="page-btn page-btn--nav" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <Icon.ChevronRight />
            </button>
          </div>
        </div> */}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AddUserModal onClose={() => setShowModal(false)} onAdd={handleAddUser} />
      )}
      {editingUser && (
        <EditRoleModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleEditUser} />
      )}
    </div>
  );
}