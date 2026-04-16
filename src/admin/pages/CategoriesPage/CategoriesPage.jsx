import { useState } from 'react';
import './CategoriesPage.css';

const initialCategories = [
  { id: 1, name: 'Thời sự', slug: '/thoi-su', articles: 1248, status: 'active', color: '#1a1a2e' },
  { id: 2, name: 'Kinh tế & Thị trường', slug: '/kinh-te', articles: 856, status: 'active', color: '#e63946' },
  { id: 3, name: 'Công nghệ 360', slug: '/cong-nghe', articles: 412, status: 'draft', color: '#6b7280' },
  { id: 4, name: 'Văn hóa & Đời sống', slug: '/van-hoa', articles: 2094, status: 'active', color: '#dc2626' },
  { id: 5, name: 'Thể thao', slug: '/the-thao', articles: 734, status: 'active', color: '#1a1a2e' },
  { id: 6, name: 'Giáo dục', slug: '/giao-duc', articles: 321, status: 'active', color: '#e63946' },
  { id: 7, name: 'Sức khỏe', slug: '/suc-khoe', articles: 589, status: 'draft', color: '#6b7280' },
];

const STATUS_LABEL = { active: 'HOẠT ĐỘNG', draft: 'BẢN NHÁP' };

function CategoryDot({ color }) {
  return <span className="cat-dot" style={{ background: color }} />;
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function ArticleCount({ count }) {
  return <span className="article-count">{count.toLocaleString('vi-VN')}</span>;
}

function ActionMenu({ onEdit, onDelete, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="action-menu">
      <button className="action-trigger" onClick={() => setOpen(o => !o)}>
        <span />
        <span />
        <span />
      </button>
      {open && (
        <div className="action-dropdown" onMouseLeave={() => setOpen(false)}>
          <button onClick={() => { onEdit(); setOpen(false); }}>✏️ Chỉnh sửa</button>
          <button onClick={() => { onToggle(); setOpen(false); }}>🔄 Đổi trạng thái</button>
          <button className="danger" onClick={() => { onDelete(); setOpen(false); }}>🗑️ Xóa</button>
        </div>
      )}
    </div>
  );
}

function Modal({ onClose, onSave, editData }) {
  const [name, setName] = useState(editData?.name || '');
  const [slug, setSlug] = useState(editData?.slug || '');
  const [status, setStatus] = useState(editData?.status || 'active');

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (!editData) {
      const s = '/' + e.target.value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-');
      setSlug(s);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editData ? 'Chỉnh sửa chuyên mục' : 'Thêm chuyên mục mới'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Tên chuyên mục</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="VD: Công nghệ 360"
            />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <div className="slug-input-wrap">
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="/ten-chuyen-muc"
              />
            </div>
            <p className="form-hint">URL: diendanpress.com{slug}</p>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              <option value="active">Hoạt động</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-save" onClick={() => onSave({ name, slug, status })}>
            {editData ? 'Lưu thay đổi' : 'Tạo chuyên mục'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-box--sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Xác nhận xóa</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Hủy</button>
          <button className="btn-danger" onClick={onConfirm}>Xóa chuyên mục</button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [perfTab, setPerfTab] = useState('30');

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalArticles = categories.reduce((s, c) => s + c.articles, 0);
  const avgViews = 45200;
  const newThisMonth = 3;

  const handleSave = (data) => {
    if (editTarget) {
      setCategories(cs => cs.map(c => c.id === editTarget.id ? { ...c, ...data } : c));
    } else {
      setCategories(cs => [...cs, {
        id: Date.now(),
        ...data,
        articles: 0,
        color: '#1a1a2e',
      }]);
    }
    setShowModal(false);
    setEditTarget(null);
  };

  const handleDelete = (id) => {
    setCategories(cs => cs.filter(c => c.id !== id));
    setDeleteTarget(null);
  };

  const handleToggle = (id) => {
    setCategories(cs => cs.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'draft' : 'active' } : c
    ));
  };

  const fastestGrowing = [...categories].sort((a, b) => b.articles - a.articles)[0];
  const needsOptimize = categories.find(c => c.name === 'Giáo dục') || categories[2];

  return (
    <div className="categories-page">
      {/* Top bar */}
      <div className="categories-topbar">
        <div className="search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm chuyên mục..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" title="Thông báo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button className="icon-btn" title="Trợ giúp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
          <button className="btn-primary" onClick={() => { setEditTarget(null); setShowModal(true); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Thêm chuyên mục
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="categories-content">
        <div className="categories-main">
          {/* Header */}
          <div className="page-header">
            <h1>Quản lý chuyên mục</h1>
            <p>Điều hướng cấu trúc nội dung của Diễn Đàn Press. Tối ưu hóa phân loại để tăng khả năng tiếp cận người đọc và tinh chỉnh chính xác của dữ liệu biên tập.</p>
          </div>

          {/* Table */}
          <div className="cat-table-wrap">
            <table className="cat-table">
              <thead>
                <tr>
                  <th>TÊN CHUYÊN MỤC</th>
                  <th>SLUG</th>
                  <th>BÀI VIẾT</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-row">Không tìm thấy chuyên mục nào.</td>
                  </tr>
                )}
                {filtered.map(cat => (
                  <tr key={cat.id}>
                    <td>
                      <div className="cat-name-cell">
                        <CategoryDot color={cat.color} />
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td><span className="slug-text">{cat.slug}</span></td>
                    <td><ArticleCount count={cat.articles} /></td>
                    <td><StatusBadge status={cat.status} /></td>
                    <td>
                      <ActionMenu
                        onEdit={() => { setEditTarget(cat); setShowModal(true); }}
                        onDelete={() => setDeleteTarget(cat)}
                        onToggle={() => handleToggle(cat.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Section */}
          <div className="perf-section">
            <div className="perf-header">
              <h2>Phân tích hiệu suất chuyên mục</h2>
              <div className="perf-tabs">
                <button className={perfTab === '7' ? 'active' : ''} onClick={() => setPerfTab('7')}>7 ngày qua</button>
                <button className={perfTab === '30' ? 'active' : ''} onClick={() => setPerfTab('30')}>30 ngày qua</button>
              </div>
            </div>
            <div className="perf-card">
              <div className="perf-card-label">TĂNG TRƯỞNG NHANH NHẤT</div>
              <div className="perf-card-name">{fastestGrowing?.name}</div>
              <div className="perf-card-stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
                +18.4% lượt xem trong tuần này
              </div>
              <div className="perf-bars">
                {[40, 55, 48, 62, 58, 75, 82].map((h, i) => (
                  <div key={i} className="perf-bar" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="categories-sidebar">
          {/* Stats */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">Thống kê nhanh</div>
            <div className="sidebar-card-subtitle">TỔNG QUAN CHUYÊN MỤC</div>
            <div className="stat-row">
              <span>Tổng số chuyên mục</span>
              <span className="stat-value stat-value--large">{categories.length}</span>
            </div>
            <div className="stat-row">
              <span>Lượt xem trung bình</span>
              <span className="stat-value stat-value--large">45.2k</span>
            </div>
            <div className="stat-row">
              <span>Chuyên mục mới (tháng)</span>
              <span className="stat-value stat-value--large">{newThisMonth.toString().padStart(2, '0')}</span>
            </div>
            <button className="btn-outline-full">XUẤT BÁO CÁO CHI TIẾT</button>
          </div>

          {/* Tip card */}
          <div className="sidebar-card sidebar-card--dark">
            <div className="tip-label">MẸO BIÊN TẬP</div>
            <h3 className="tip-title">Cấu trúc chuyên mục ảnh hưởng 40% đến SEO của bạn.</h3>
            <p className="tip-body">Hãy đảm bảo các thẻ 'Slug' luôn ngắn gọn, chứa từ khóa chính và không sử dụng ký tự đặc biệt.</p>
            <a href="#" className="tip-link">
              Đọc thêm hướng dẫn
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Needs optimization */}
          <div className="sidebar-card sidebar-card--warn">
            <div className="warn-label">CẦN TỐI ƯU</div>
            <h3 className="warn-title">{needsOptimize?.name}</h3>
            <p className="warn-body">Tỷ lệ thoát trang đạt 72%. Cần nhắc tái cấu trúc nội dung hoặc thay đổi hướng tiếp cận chuyên mục.</p>
            <a href="#" className="warn-link">
              XEM CHI TIẾT
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </aside>
      </div>

      {/* Modals */}
      {showModal && (
        <Modal
          editData={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          message={`Bạn có chắc chắn muốn xóa chuyên mục "${deleteTarget.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}