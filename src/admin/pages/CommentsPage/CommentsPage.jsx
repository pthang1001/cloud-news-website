import { useState } from 'react';
import './CommentsPage.css';

// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const SpamUserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    <line x1="18" y1="2" x2="22" y2="6"/><line x1="22" y1="2" x2="18" y2="6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const LightningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// ── Mock Data ───────────────────────────────────────────────────────────────
const PENDING_COMMENTS = [
  {
    id: 1,
    username: 'Nguyễn Văn An',
    time: '2 phút trước',
    badge: 'pending',
    badgeLabel: 'CẦN DUYỆT',
    body: 'Bài viết rất sâu sắc và phản ánh đúng thực trạng hiện nay. Tôi hy vọng tòa soạn sẽ có thêm nhiều chuyên đề về quy hoạch đô thị bền vững như thế này.',
    isSpam: false,
  },
  {
    id: 2,
    username: 'Lê Thị Mai',
    time: '15 phút trước',
    badge: 'spam',
    badgeLabel: 'CẢNH BÁO SPAM',
    body: '"Bấm vào đây để nhận mã giảm giá 50% cho tất cả các dịch vụ du lịch hè này! Link: bit.ly/spam-example"',
    isSpam: true,
  },
  {
    id: 3,
    username: 'Trần Minh Quân',
    time: '42 phút trước',
    badge: 'pending',
    badgeLabel: 'CẦN DUYỆT',
    body: 'Tôi không đồng tình với quan điểm của tác giả về việc nới lỏng các quy định tài chính. Tuy nhiên, lập luận đưa ra khá logic và có số liệu cụ thể. Đáng để thảo luận thêm.',
    isSpam: false,
  },
];

const RECENTLY_APPROVED = [
  {
    id: 1,
    topic: 'CHỦ ĐỀ: KINH TẾ',
    quote: '"Cảm ơn tòa soạn, phân tích rất sát sao về thị trường vàng…"',
    author: '— Hoàng Nam',
  },
  {
    id: 2,
    topic: 'CHỦ ĐỀ: VĂN HÓA',
    quote: '"Nghệ thuật đương đại Việt Nam đang có những bước tiến…"',
    author: '— Minh Tú',
  },
  {
    id: 3,
    topic: 'CHỦ ĐỀ: CÔNG NGHỆ',
    quote: '"AI sẽ thay đổi cách chúng ta làm báo trong 5 năm tới."',
    author: '— Dr. Thanh',
  },
];

const COMPASS_RULES = [
  'Ưu tiên các bình luận mang tính thảo luận, phản biện văn minh.',
  'Loại bỏ các bình luận công kích cá nhân, xúc phạm vùng miền.',
  'Kiểm duyệt kỹ các đường dẫn (link) đính kèm.',
  'Khuyến khích các bình luận từ tài khoản đã xác thực.',
];

// ── CommentsPage Component ───────────────────────────────────────────────────
const CommentsPage = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [search, setSearch] = useState('');
  const [comments, setComments] = useState(PENDING_COMMENTS);
  const [itemsToShow, setItemsToShow] = useState(2); // Hien thi 2 comments moi lan

  const handleApprove = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleReject = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleBan = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 3); // Thêm 3 comments mỗi lần click
  };

  const filtered = comments.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.body.toLowerCase().includes(search.toLowerCase())
  );

  // Lọc theo tab
  const filteredByTab = filtered.filter((c) => {
    if (activeTab === 'queue') return !c.isSpam; // Hàng chờ: comments bình thường
    if (activeTab === 'archived') return false; // Lưu trữ: trống (không có dữ liệu)
    if (activeTab === 'banned') return c.isSpam; // Người dùng bị cấm: spam
    return true;
  });

  // Chỉ hiển thị số lượng comments được xác định
  const displayedComments = filteredByTab.slice(0, itemsToShow);

  return (
    <div className="comments-page">
      {/* Header */}
      <div className="comments-header">
        <h1>Quản lý Bình luận</h1>
        <p>Quản lý cuộc trò chuyện cộng đồng. Duyệt xét các đóng góp đang chờ và quản lý<br />diễn luận với độ chính xác và tính toàn vẹn biên tập.</p>
      </div>

      {/* Sub-nav + search row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
        <div className="comments-subnav" style={{ marginBottom: 0, flex: 1 }}>
          <button
            className={`subnav-tab ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            Hàng chờ Kiểm duyệt
          </button>
          <button
            className={`subnav-tab ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Lưu trữ
          </button>
          <button
            className={`subnav-tab ${activeTab === 'banned' ? 'active' : ''}`}
            onClick={() => setActiveTab('banned')}
          >
            Người dùng bị cấm
          </button>
        </div>
        <div className="search-box" style={{ maxWidth: '260px', marginBottom: '1.5px' }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Tìm kiếm bình luận..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Divider line (shared with subnav) */}
      <div style={{ borderBottom: '1.5px solid #e5e7eb', marginBottom: '28px' }} />

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">CHỜ DUYỆT</div>
          <div className="stat-value">{filtered.filter(c => !c.isSpam).length}</div>
          <div className="stat-bar" />
        </div>
        <div className="stat-card">
          <div className="stat-label">SPAM BỊ CHẶN</div>
          <div className="stat-value" style={{ fontSize: '32px' }}>{filtered.filter(c => c.isSpam).length}</div>
          <div className="stat-bar orange" />
        </div>
        <div className="stat-card">
          <div className="stat-label">TỔNG BOS DUYỆT</div>
          <div className="stat-value red">{filtered.length}</div>
          <div className="stat-bar red" />
        </div>
        <div className="stat-card">
          <div className="stat-label">HIỂN THỊ</div>
          <div className="stat-value">{displayedComments.length}</div>
          <div className="stat-bar" />
        </div>
      </div>

      {/* Main layout */}
      <div className="comments-layout">
        {/* Left: Pending list */}
        <div className="comments-main">
          <div className="section-header">
            <h2 className="section-title">Chờ Kiểm duyệt</h2>
            {/* <button className="sort-badge">
              MỚI NHẤT TRƯỚC <ChevronDownIcon />
            </button> */}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
              Không có bình luận nào cần duyệt
            </div>
          )}

          {displayedComments.length === 0 && filtered.length > 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af', fontSize: '14px' }}>
              Không tìm thấy bình luận
            </div>
          )}

          {displayedComments.map((comment) => (
            <div className="comment-card" key={comment.id}>
              <div className="comment-card-header">
                <div className="comment-user">
                  <div className={`avatar ${comment.isSpam ? 'spam-avatar' : ''}`}>
                    {comment.isSpam ? <SpamUserIcon /> : <UserIcon />}
                  </div>
                  <div className="comment-user-info">
                    <p className="comment-username">{comment.username}</p>
                    <span className="comment-time">{comment.time}</span>
                  </div>
                </div>
                <span className={`comment-badge ${comment.badge === 'spam' ? 'badge-spam' : 'badge-pending'}`}>
                  {comment.badgeLabel}
                </span>
              </div>

              <p className={`comment-body ${comment.isSpam ? 'spam-body' : ''}`}>
                {comment.body}
              </p>

              <div className="comment-actions">
                {comment.isSpam ? (
                  <>
                    <button className="action-btn btn-approve" onClick={() => handleApprove(comment.id)}>
                      <CheckIcon /> PHÊ DUYỆT
                    </button>
                    <button className="action-btn btn-ban" onClick={() => handleBan(comment.id)}>
                      🚫 XÓA VĨNH VIỄN
                    </button>
                    <button className="action-btn btn-report" onClick={() => handleReject(comment.id)}>
                      🚩 BÁO CÁO VI PHẠM
                    </button>
                  </>
                ) : (
                  <>
                    <button className="action-btn btn-approve" onClick={() => handleApprove(comment.id)}>
                      <CheckIcon /> PHÊ DUYỆT
                    </button>
                    <button className="action-btn btn-reject" onClick={() => handleReject(comment.id)}>
                      ✕ TỪ CHỐI
                    </button>
                    <button className="btn-detail">Chi tiết</button>
                  </>
                )}
              </div>
            </div>
          ))}

          {itemsToShow < filteredByTab.length && (
            <div className="load-more-wrap">
              <button className="load-more-btn" onClick={handleLoadMore}>
                Xem thêm <ChevronDownIcon />
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="comments-sidebar">
          {/* Recently Approved */}
          <div className="sidebar-card">
            <div className="sidebar-card-header">
              <h3 className="sidebar-card-title">Đã duyệt gần đây</h3>
              <div className="approved-check">
                <CheckIcon />
              </div>
            </div>
            <div className="approved-list">
              {RECENTLY_APPROVED.map((item) => (
                <div className="approved-item" key={item.id}>
                  <div className="approved-topic">{item.topic}</div>
                  <div className="approved-quote">{item.quote}</div>
                  <div className="approved-author">{item.author}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Compass */}
          <div className="compass-card">
            <div className="compass-header">
              <h3 className="compass-title">La bàn Biên tập</h3>
              <div className="lightning-icon">
                <LightningIcon />
              </div>
            </div>
            <ul className="compass-list">
              {COMPASS_RULES.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Top Discussion Topic */}
          <div className="topic-card">
            <div className="topic-header">
              <div className="topic-header-label">CHỦ ĐỀ THẢO LUẬN HÀNG ĐẦU</div>
            </div>
            <div className="topic-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80"
                alt="City traffic"
              />
              <div className="topic-image-overlay">
                <span className="topic-category-tag">Tiêu điểm</span>
                <p className="topic-title">Tương lai của giao thông đô thị tại các thành phố lớn</p>
              </div>
            </div>
            <div className="topic-footer">
              <span className="topic-pending-count">48 Bình luận chờ duyệt</span>
              <a className="topic-approve-link">
                Duyệt ngay <ArrowRightIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;