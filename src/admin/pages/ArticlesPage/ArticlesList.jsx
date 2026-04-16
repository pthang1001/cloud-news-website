import { useState, useEffect } from "react";
import "./ArticlesList.css";

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Nghệ Thuật Sống",
    category: "Lối Sống",
    author: "Lê Minh Tâm",
    status: "published",
    views: 3241,
    tags: ["SlowLiving", "DigitalMinimalism"],
    publishedAt: "2025-04-14T08:30:00",
    excerpt: "Trong một thế giới vận động không ngừng với tốc độ của ánh sáng...",
  },
  {
    id: 2,
    title: "Trí Tuệ Nhân Tạo và Tương Lai Báo Chí",
    category: "Công Nghệ",
    author: "Báo Chí Admin",
    status: "published",
    views: 5812,
    tags: ["AI", "Journalism"],
    publishedAt: "2025-04-13T14:00:00",
    excerpt: "Liệu AI có thể thay thế nhà báo? Cuộc cách mạng đang diễn ra...",
  },
  {
    id: 3,
    title: "Kinh Tế Xanh: Xu Hướng Toàn Cầu",
    category: "Kinh Tế",
    author: "Nguyễn Văn An",
    status: "draft",
    views: 0,
    tags: ["GreenEconomy", "Sustainability"],
    publishedAt: null,
    excerpt: "Các nền kinh tế đang chuyển mình mạnh mẽ hướng tới mô hình...",
  },
  {
    id: 4,
    title: "Du Lịch Bền Vững: Hành Trình Có Trách Nhiệm",
    category: "Du Lịch",
    author: "Trần Thị Mai",
    status: "published",
    views: 2109,
    tags: ["Travel", "Sustainable"],
    publishedAt: "2025-04-12T09:15:00",
    excerpt: "Cách du lịch có trách nhiệm đang thay đổi ngành công nghiệp không khói...",
  },
  {
    id: 5,
    title: "Sức Khỏe Tâm Thần Thời Đại Số",
    category: "Y Tế",
    author: "Lê Minh Tâm",
    status: "draft",
    views: 0,
    tags: ["MentalHealth", "Digital"],
    publishedAt: null,
    excerpt: "Nghiên cứu mới nhất về tác động của mạng xã hội...",
  },
  {
    id: 6,
    title: "Giáo Dục 4.0: Tương Lai Của Lớp Học",
    category: "Giáo Dục",
    author: "Phạm Quốc Bảo",
    status: "archived",
    views: 1450,
    tags: ["Education", "Technology"],
    publishedAt: "2025-04-10T11:00:00",
    excerpt: "Công nghệ đang định hình lại cách chúng ta dạy và học...",
  },
];

const STATUS_LABELS = {
  published: { label: "Đã đăng", color: "green" },
  draft: { label: "Nháp", color: "orange" },
  archived: { label: "Lưu trữ", color: "gray" },
};

const ArticlesList = ({ onEdit }) => {
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState("publishedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = articles
    .filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.author.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      const matchCat = filterCategory === "all" || a.category === filterCategory;
      return matchSearch && matchStatus && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "views") return sortDir === "desc" ? b.views - a.views : a.views - b.views;
      if (sortBy === "title") return sortDir === "desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      const da = a.publishedAt || "0";
      const db = b.publishedAt || "0";
      return sortDir === "desc" ? db.localeCompare(da) : da.localeCompare(db);
    });

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((a) => a.id));

  const handleDelete = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    setConfirmDelete(null);
  };

  const handleBulkDelete = () => {
    setArticles((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
  };

  const handleStatusChange = (id, newStatus) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(col); setSortDir("desc"); }
  };

  const categories = [...new Set(articles.map((a) => a.category))];

  const fmt = (iso) =>
    iso ? new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

  return (
    <div className="articles-list">
      {/* CONTROLS */}
      <div className="articles-list__controls">
        <div className="articles-list__search">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="search-input"
            placeholder="Tìm kiếm bài viết, tác giả..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="articles-list__filters">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Nháp</option>
            <option value="archived">Lưu trữ</option>
          </select>

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="articles-list__stats">
          <span className="stat-chip stat-chip--total">{articles.length} bài viết</span>
          <span className="stat-chip stat-chip--published">{articles.filter(a => a.status === "published").length} đã đăng</span>
          <span className="stat-chip stat-chip--draft">{articles.filter(a => a.status === "draft").length} nháp</span>
        </div>
      </div>

      {/* BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="articles-bulk-bar">
          <span>{selectedIds.length} bài đã chọn</span>
          <button className="bulk-btn bulk-btn--delete" onClick={handleBulkDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Xóa đã chọn
          </button>
          <button className="bulk-btn" onClick={() => setSelectedIds([])}>Hủy</button>
        </div>
      )}

      {/* TABLE */}
      <div className="articles-table-wrap">
        <table className="articles-table">
          <thead>
            <tr>
              <th className="th-check">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="th-sortable" onClick={() => handleSort("title")}>
                Tiêu đề {sortBy === "title" && (sortDir === "desc" ? "↓" : "↑")}
              </th>
              <th>Danh mục</th>
              <th>Tác giả</th>
              <th>Trạng thái</th>
              <th className="th-sortable" onClick={() => handleSort("views")}>
                Lượt xem {sortBy === "views" && (sortDir === "desc" ? "↓" : "↑")}
              </th>
              <th className="th-sortable" onClick={() => handleSort("publishedAt")}>
                Ngày đăng {sortBy === "publishedAt" && (sortDir === "desc" ? "↓" : "↑")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">
                  <div className="table-empty__inner">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <p>Không có bài viết nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((article) => {
                const status = STATUS_LABELS[article.status];
                return (
                  <tr
                    key={article.id}
                    className={`table-row ${selectedIds.includes(article.id) ? "table-row--selected" : ""}`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(article.id)}
                        onChange={() => toggleSelect(article.id)}
                      />
                    </td>
                    <td className="td-title">
                      <div className="article-title-cell">
                        <span className="article-title-text">{article.title}</span>
                        <span className="article-excerpt">{article.excerpt}</span>
                        <div className="article-tags">
                          {article.tags.map((tag) => (
                            <span key={tag} className="mini-tag">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td><span className="category-badge">{article.category}</span></td>
                    <td className="td-author">{article.author}</td>
                    <td>
                      <select
                        className={`status-select status-select--${article.status}`}
                        value={article.status}
                        onChange={(e) => handleStatusChange(article.id, e.target.value)}
                      >
                        <option value="published">Đã đăng</option>
                        <option value="draft">Nháp</option>
                        <option value="archived">Lưu trữ</option>
                      </select>
                    </td>
                    <td className="td-views">
                      <span className="views-count">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {article.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="td-date">{fmt(article.publishedAt)}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn action-btn--edit"
                          title="Chỉnh sửa"
                          onClick={() => onEdit && onEdit(article)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button
                          className="action-btn action-btn--view"
                          title="Xem trước"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button
                          className="action-btn action-btn--delete"
                          title="Xóa"
                          onClick={() => setConfirmDelete(article.id)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </div>
            <h3 className="modal-title">Xóa bài viết?</h3>
            <p className="modal-desc">Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn.</p>
            <div className="modal-actions">
              <button className="modal-btn modal-btn--cancel" onClick={() => setConfirmDelete(null)}>Hủy</button>
              <button className="modal-btn modal-btn--confirm" onClick={() => handleDelete(confirmDelete)}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesList;