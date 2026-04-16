import { useState } from "react";
import "./ArticlesHistory.css";

const MOCK_HISTORY = [
  {
    id: 1,
    action: "published",
    title: "Nghệ Thuật Sống",
    author: "Lê Minh Tâm",
    category: "Lối Sống",
    timestamp: "2025-04-14T08:30:00",
    status: "published",
    views: 3241,
    revisions: 12,
  },
  {
    id: 2,
    action: "edited",
    title: "Nghệ Thuật Sống",
    author: "Báo Chí Admin",
    category: "Lối Sống",
    timestamp: "2025-04-14T10:15:00",
    status: "published",
    views: 3241,
    revisions: 13,
  },
  {
    id: 3,
    action: "published",
    title: "Trí Tuệ Nhân Tạo và Tương Lai Báo Chí",
    author: "Báo Chí Admin",
    category: "Công Nghệ",
    timestamp: "2025-04-13T14:00:00",
    status: "published",
    views: 5812,
    revisions: 7,
  },
  {
    id: 4,
    action: "drafted",
    title: "Kinh Tế Xanh: Xu Hướng Toàn Cầu",
    author: "Nguyễn Văn An",
    category: "Kinh Tế",
    timestamp: "2025-04-13T09:00:00",
    status: "draft",
    views: 0,
    revisions: 3,
  },
  {
    id: 5,
    action: "published",
    title: "Du Lịch Bền Vững: Hành Trình Có Trách Nhiệm",
    author: "Trần Thị Mai",
    category: "Du Lịch",
    timestamp: "2025-04-12T09:15:00",
    status: "published",
    views: 2109,
    revisions: 5,
  },
  {
    id: 6,
    action: "archived",
    title: "Giáo Dục 4.0: Tương Lai Của Lớp Học",
    author: "Phạm Quốc Bảo",
    category: "Giáo Dục",
    timestamp: "2025-04-10T11:00:00",
    status: "archived",
    views: 1450,
    revisions: 9,
  },
  {
    id: 7,
    action: "deleted",
    title: "Bài Viết Thử Nghiệm #03",
    author: "Báo Chí Admin",
    category: "Công Nghệ",
    timestamp: "2025-04-09T16:45:00",
    status: "deleted",
    views: 0,
    revisions: 1,
  },
  {
    id: 8,
    action: "published",
    title: "Thế Giới Sau Đại Dịch",
    author: "Lê Minh Tâm",
    category: "Thế Giới",
    timestamp: "2025-04-08T07:00:00",
    status: "published",
    views: 8921,
    revisions: 18,
  },
];

const ACTION_CONFIG = {
  published: { label: "Đã đăng", color: "#22c55e", icon: "📢" },
  edited: { label: "Đã sửa", color: "#3b82f6", icon: "✏️" },
  drafted: { label: "Lưu nháp", color: "#f59e0b", icon: "📝" },
  archived: { label: "Lưu trữ", color: "#94a3b8", icon: "📦" },
  deleted: { label: "Đã xóa", color: "#ef4444", icon: "🗑️" },
};

const groupByDate = (items) => {
  const groups = {};
  items.forEach((item) => {
    const date = new Date(item.timestamp).toLocaleDateString("vi-VN", {
      weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
};

const ArticlesHistory = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const filtered = MOCK_HISTORY.filter((h) => {
    const matchFilter = filter === "all" || h.action === filter;
    const matchSearch =
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.author.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const groups = groupByDate(filtered);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const fmtTime = (iso) =>
    new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  const totalPublished = MOCK_HISTORY.filter((h) => h.action === "published").length;
  const totalEdited = MOCK_HISTORY.filter((h) => h.action === "edited").length;
  const totalViews = MOCK_HISTORY.reduce((acc, h) => acc + h.views, 0);

  return (
    <div className="articles-history">
      {/* STATS CARDS */}
      <div className="history-stats">
        <div className="history-stat-card">
          <div className="history-stat-icon history-stat-icon--green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
          </div>
          <div>
            <div className="history-stat-value">{totalPublished}</div>
            <div className="history-stat-label">Bài đã đăng</div>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon history-stat-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <div className="history-stat-value">{totalEdited}</div>
            <div className="history-stat-label">Lần chỉnh sửa</div>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon history-stat-icon--purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
            <div className="history-stat-value">{totalViews.toLocaleString()}</div>
            <div className="history-stat-label">Tổng lượt xem</div>
          </div>
        </div>
        <div className="history-stat-card">
          <div className="history-stat-icon history-stat-icon--orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <div className="history-stat-value">{MOCK_HISTORY.length}</div>
            <div className="history-stat-label">Hoạt động</div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="history-controls">
        <div className="history-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            placeholder="Tìm bài viết, tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="history-filters">
          {["all", "published", "edited", "drafted", "archived", "deleted"].map((f) => (
            <button
              key={f}
              className={`history-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Tất cả" : ACTION_CONFIG[f]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <div className="history-timeline">
        {Object.keys(groups).length === 0 ? (
          <div className="history-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
            <p>Không tìm thấy lịch sử phù hợp</p>
          </div>
        ) : (
          Object.entries(groups).map(([date, items]) => (
            <div key={date} className="history-group">
              <div className="history-group__date">
                <span className="history-date-badge">{date}</span>
              </div>
              <div className="history-group__items">
                {items.map((item) => {
                  const cfg = ACTION_CONFIG[item.action];
                  const isOpen = expanded[item.id];
                  return (
                    <div
                      key={item.id}
                      className={`history-item history-item--${item.action}`}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="history-item__timeline">
                        <div className="history-item__dot" style={{ borderColor: cfg.color, background: cfg.color + "22" }}>
                          <span>{cfg.icon}</span>
                        </div>
                        <div className="history-item__line" />
                      </div>
                      <div className="history-item__card">
                        <div className="history-item__main">
                          <div className="history-item__left">
                            <span
                              className="history-action-badge"
                              style={{ background: cfg.color + "18", color: cfg.color, border: `1px solid ${cfg.color}33` }}
                            >
                              {cfg.label}
                            </span>
                            <span className="history-item__title">{item.title}</span>
                            <span className="history-item__category">{item.category}</span>
                          </div>
                          <div className="history-item__right">
                            <span className="history-item__author">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                              {item.author}
                            </span>
                            <span className="history-item__time">{fmtTime(item.timestamp)}</span>
                            <svg
                              className={`history-item__chevron ${isOpen ? "open" : ""}`}
                              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </div>
                        </div>
                        {isOpen && (
                          <div className="history-item__detail">
                            <div className="detail-row">
                              <span className="detail-label">Lượt xem</span>
                              <span className="detail-val">{item.views.toLocaleString()}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Phiên bản</span>
                              <span className="detail-val">Rev. #{item.revisions}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Thời gian chính xác</span>
                              <span className="detail-val">
                                {new Date(item.timestamp).toLocaleString("vi-VN")}
                              </span>
                            </div>
                            <div className="detail-actions">
                              <button className="detail-btn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                Xem bài
                              </button>
                              <button className="detail-btn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                Chỉnh sửa
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArticlesHistory;