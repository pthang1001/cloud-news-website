import CategoryColumn from "./CategoryColumn";
import "./CategorySection.css";

// Icons as SVG strings
const ICON_SPORTS = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M4.93 4.93 19.07 19.07M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ICON_TECH = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
  </svg>
);
const ICON_ENTERTAINMENT = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 11 19-9-9 19-2-8-8-2z"/>
  </svg>
);

const CATEGORIES = [
  {
    id: "the-thao",
    label: "Thể thao",
    href: "/the-thao",
    icon: ICON_SPORTS,
    mainArticle: {
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80",
      title: "Đội tuyển quốc gia chuẩn bị cho vòng loại châu lục với tâm thế tự tin",
    },
    subArticles: [
      "Cú hích lớn từ các giải đấu phong trào địa phương",
      "Xu hướng đầu tư vào thể thao điện tử tại Việt Nam",
    ],
  },
  {
    id: "cong-nghe",
    label: "Công nghệ",
    href: "/cong-nghe",
    icon: ICON_TECH,
    mainArticle: {
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      title: "Chuỗi cung ứng bán dẫn đang dịch chuyển mạnh mẽ sang khu vực Đông Nam Á",
    },
    subArticles: [
      "Top 5 ứng dụng AI hỗ trợ làm việc hiệu quả nhất",
      "Xe điện thông minh: Tương lai gần của giao thông đô thị",
    ],
  },
  {
    id: "giai-tri",
    label: "Giải trí",
    href: "/giai-tri",
    icon: ICON_ENTERTAINMENT,
    mainArticle: {
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
      title: "Liên hoan phim quốc tế hứa hẹn mang đến nhiều tác phẩm đột phá",
    },
    subArticles: [
      "Nhạc Việt vươn tầm thế giới qua các nền tảng trực tuyến",
      "Khám phá văn hóa ẩm thực đặc trưng của miền Trung",
    ],
  },
];

export default function CategorySection() {
  return (
    <section className="category-section">
      <div className="category-section__inner">
        <div className="category-section__header">
          <div>
            <h2 className="category-section__heading">Danh mục mới nhất</h2>
            <p className="category-section__sub">Cập nhật tin tức đa chiều trên mọi lĩnh vực</p>
          </div>
          <a href="/tat-ca" className="category-section__see-all">
            Xem tất cả
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        <div className="category-section__grid">
          {CATEGORIES.map((cat) => (
            <CategoryColumn key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}