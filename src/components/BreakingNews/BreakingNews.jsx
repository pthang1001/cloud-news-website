import "./BreakingNews.css";

const BREAKING_ITEMS = [
  {
    id: 1,
    category: "CHÍNH TRỊ",
    categoryColor: "#8B4513",
    title: "Hội nghị cấp cao bàn về hợp tác thương mại khu vực diễn ra tại Hà Nội",
    author: "Phạm Thảo",
    timeAgo: "2 giờ trước",
  },
  {
    id: 2,
    category: "CÔNG NGHỆ",
    categoryColor: "#1a5a9e",
    title: "Công nghệ AI thế hệ mới đang thay đổi cách thức vận hành của các doanh nghiệp nội địa",
    author: "Nguyễn Duy",
    timeAgo: "4 giờ trước",
  },
  {
    id: 3,
    category: "GIẢI TRÍ",
    categoryColor: "#6b21a8",
    title: "Những chuyển biến tích cực trong thị trường điện ảnh Việt những tháng đầu năm",
    author: "Trần Minh",
    timeAgo: "5 giờ trước",
  },
];

export default function BreakingNews() {
  return (
    <aside className="breaking-news">
      <div className="breaking-news__header">
        <span className="breaking-news__bar" />
        <h2 className="breaking-news__title">Tin nổi bật</h2>
      </div>
      <ul className="breaking-news__list">
        {BREAKING_ITEMS.map((item) => (
          <li key={item.id} className="breaking-news__item">
            <span
              className="breaking-news__category"
              style={{ color: item.categoryColor }}
            >
              {item.category}
            </span>
            <a href="#" className="breaking-news__item-title">{item.title}</a>
            <div className="breaking-news__item-meta">
              <span>{item.author}</span>
              <span className="breaking-news__dot">•</span>
              <span>{item.timeAgo}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}