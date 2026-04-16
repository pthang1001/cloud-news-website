import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

/* ─── Mock data ─── */
const topArticles = [
  { id: 1, title: "Tương lai của kiến trúc bền vững tại Việt Nam", category: "Thiết kế Thương mại", views: "2.4k" },
  { id: 2, title: "Kinh tế số: Thách thức và Cơ hội năm 2024", category: "Kinh tế", views: "1.8k" },
  { id: 3, title: "Báo chí trong kỷ nguyên Trí tuệ Nhân tạo", category: "Phương tiện", views: "942" },
];

const reviewQueue = [
  {
    id: 1, status: "ĐANG XEM XÉT", statusClass: "status-review",
    category: "Văn hóa & Nghệ thuật",
    title: "Sức sống mãnh liệt của nghệ thuật hát Xẩm giữa...",
    author: "Lan Anh", time: "2 giờ trước",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
  },
  {
    id: 2, status: "NHÁP", statusClass: "status-draft",
    category: "Công nghệ",
    title: "Phân tích tác động của chip bán dẫn tới kinh tế vùng",
    author: "Minh Quân", time: "Hôm qua",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: 3, status: "ĐẶT LỊCH", statusClass: "status-scheduled",
    category: "Du lịch & Sinh sống",
    title: "Khám phá những cung đường mây tại Tây Bắc và...",
    author: "Thu Trang", time: "Đặt lịch: 06:00",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
];

/* ─── Bar chart data (24h traffic) ─── */
const chartData = [
  { time: "00:00", val: 28 }, { time: "02:00", val: 18 }, { time: "04:00", val: 15 },
  { time: "06:00", val: 35 }, { time: "08:00", val: 58 }, { time: "10:00", val: 72 },
  { time: "12:00", val: 65 }, { time: "14:00", val: 80 }, { time: "16:00", val: 95 },
  { time: "18:00", val: 88 }, { time: "20:00", val: 70 }, { time: "22:00", val: 52 },
  { time: "23:59", val: 38 },
];
const maxVal = Math.max(...chartData.map((d) => d.val));

const Dashboard = () => {
  const navigate = useNavigate();
  const [chartView, setChartView] = useState("DAY");
  
  const handleCreateArticle = () => {
    navigate("/admin/articles");
  };

  return (
    <div className="dashboard">
        {/* Greeting */}
        <div className="dash-greeting">
          <h1>Hello, Biên tập viên.</h1>
          <p>Đây là những gì đang diễn ra với <em>Diễn Đàn Press</em> hôm nay.</p>
        </div>
 
        {/* ── Top stats row ── */}
        <div className="stats-grid">
          {/* Published articles */}
          <div className="stat-card stat-secondary">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <p className="stat-label">Xuất bản hôm nay</p>
            <h3 className="stat-value">24 Bài viết</h3>
          </div>

          {/* Active discussions */}
          <div className="stat-card stat-secondary">
            <div className="stat-icon stat-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="stat-label">Bình luận Tích cực</p>
            <h3 className="stat-value">1,102</h3>
          </div>

          {/* Reader conversion */}
          <div className="stat-card stat-secondary">
            <div className="stat-icon stat-icon-gold">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <p className="stat-label">Chuyển đổi Độc giả</p>
            <h3 className="stat-value">4.2%</h3>
          </div>

          {/* Warned comments */}
          <div className="stat-card stat-secondary">
            <div className="stat-icon stat-icon-red">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className="stat-label">Bình luận Bị cảnh báo</p>
            <h3 className="stat-value">18 Bình luận</h3>
          </div>
        </div>

        {/* ── Main content row ── */}
        <div className="dash-main-row">
          {/* Audience Engagement Chart */}
          <div className="dash-chart-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Tương tác Độc giả</h2>
                <p className="section-sub">Phân bố lưu lượng trong 24 giờ qua.</p>
              </div>
              <div className="chart-toggle">
                {["TUẦN", "NGÀY"].map((v) => (
                  <button
                    key={v}
                    className={`toggle-btn ${chartView === v ? "active" : ""}`}
                    onClick={() => setChartView(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="bar-chart">
              <div className="bars-wrapper">
                {chartData.map((d, i) => {
                  const pct = (d.val / maxVal) * 100;
                  const isActive = d.val === maxVal;
                  return (
                    <div key={i} className="bar-col">
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${isActive ? "bar-fill-active" : ""}`}
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bar-labels">
                {["00:00", "06:00", "12:00", "18:00", "23:59"].map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-dot dot-direct" />Lưu lượng Trực tiếp 42%</span>
              <span className="legend-item"><span className="legend-dot dot-seo" />Tìm kiếm (SEO) 31%</span>
              <span className="legend-item"><span className="legend-dot dot-social" />Liên kết Xã hội 27%</span>
            </div>
          </div>

          {/* Top Articles */}
          <div className="dash-top-articles">
            <div className="section-header">
              <h2 className="section-title">Bài viết Hàng đầu</h2>
            </div>
            <div className="top-articles-list">
              {topArticles.map((a) => (
                <div key={a.id} className="top-article-item">
                  <div className="article-thumb">
                    <div className="article-thumb-placeholder" />
                  </div>
                  <div className="article-info">
                    <p className="article-title">{a.title}</p>
                    <div className="article-meta">
                      <span className="article-cat">{a.category.toUpperCase()}</span>
                      <span className="article-views">{a.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-view-all">XEM TẤT CẢ HIỆU SUẤT BIÊN TẬP</button>
          </div>
        </div>

        {/* ── Review Queue ── */}
        <div className="dash-review-section">
          <div className="section-header">
            <h2 className="section-title">Hàng đợi Tái xem xét</h2>
            <button className="btn-draft" onClick={handleCreateArticle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              TẠO BÀI VIẾT MỚI
            </button>
          </div>

          <div className="review-queue-grid">
            {reviewQueue.map((item) => (
              <div key={item.id} className="review-card">
                <div className="review-card-img" style={{ backgroundImage: `url(${item.img})` }}>
                  <span className={`review-status ${item.statusClass}`}>{item.status}</span>
                </div>
                <div className="review-card-body">
                  <span className="review-category">{item.category}</span>
                  <h3 className="review-title">{item.title}</h3>
                  <div className="review-footer">
                    <span className="review-author">Tác giả: {item.author}</span>
                    <span className="review-time">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;