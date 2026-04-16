import { useState, useEffect } from "react";
import ArticleCard from "../ArticleCard/ArticleCard";
import "./CategorySection.css";
import api from "../../services/api";

// Mock articles data
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Đội tuyển quốc gia chuẩn bị cho vòng loại châu lục với tâm thế tự tin",
    excerpt: "Cú hích lớn từ các giải đấu phong trào địa phương giúp nâng cao kỹ năng và chiến thuật của các cầu thủ.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80",
    category: "Thể thao",
    author: "Trần Hùng",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    title: "Chuỗi cung ứng bán dẫn đang dịch chuyển mạnh mẽ sang khu vực Đông Nam Á",
    excerpt: "Các công ty chip hàng đầu thế giới đang xem xét việc xây dựng nhà máy tại khu vực Đông Nam Á.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    category: "Công nghệ",
    author: "Nguyễn Minh",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    title: "Liên hoan phim quốc tế hứa hẹn mang đến nhiều tác phẩm đột phá",
    excerpt: "Năm nay sẽ có hơn 200 bộ phim từ các quốc gia trên thế giới tham dự liên hoan.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    category: "Giải trí",
    author: "Lý Thanh",
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 4,
    title: "Tương lai của hạ tầng đô thị thông minh tại Việt Nam",
    excerpt: "Các đô thị lớn đang chuyển mình để thích ứng với cuộc cách mạng công nghệ 4.0.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80",
    category: "Thời sự",
    author: "Nguyễn Minh Quân",
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 5,
    title: "Xu hướng đầu tư vào thể thao điện tử tại Việt Nam",
    excerpt: "Các nhà đầu tư nước ngoài đang tìm kiếm cơ hội trong lĩnh vực thể thao điện tử.",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&q=80",
    category: "Thể thao",
    author: "Phạm Thảo",
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 6,
    title: "Top 5 ứng dụng AI hỗ trợ làm việc hiệu quả nhất trong năm 2026",
    excerpt: "Công nghệ AI đang ngày càng trở nên phổ biến và hỗ trợ các chuyên gia viên hơn trong công việc.",
    image: "https://images.unsplash.com/photo-1677442d019cecf8e6c569a4b17e2473?w=600&q=80",
    category: "Công nghệ",
    author: "Nguyễn Duy",
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 7,
    title: "Nhạc Việt vươn tầm thế giới qua các nền tảng trực tuyến",
    excerpt: "Các ca sĩ Việt Nam đạt được những thành tích ấn tượng trên các nền tảng âm nhạc quốc tế.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    category: "Giải trí",
    author: "Trần Minh",
    created_at: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: 8,
    title: "Xe điện thông minh: Tương lai gần của giao thông đô thị",
    excerpt: "Công nghệ xe tự lái và xe điện đang phát triển nhanh chóng tại Việt Nam.",
    image: "https://images.unsplash.com/photo-1560958089-b8a63c51c1f1?w=600&q=80",
    category: "Công nghệ",
    author: "Nguyễn Duy",
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: 9,
    title: "Khám phá văn hóa ẩm thực đặc trưng của miền Trung",
    excerpt: "Du ký ẩm thực khám phá những nét độc đáo trong ẩm thực của miền Trung Việt Nam.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    category: "Giải trí",
    author: "Lý Thanh",
    created_at: new Date(Date.now() - 32400000).toISOString(),
  },
  {
    id: 10,
    title: "Chiến lược kinh doanh mới của các startup tại Việt Nam",
    excerpt: "Các startup Việt Nam đang tìm ra những cách tiếp cận sáng tạo để chinh phục thị trường.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    category: "Kinh doanh",
    author: "Trần Hùng",
    created_at: new Date(Date.now() - 36000000).toISOString(),
  },
  {
    id: 11,
    title: "Phát triển nguồn nhân lực chất lượng cao cho công nghiệp 4.0",
    excerpt: "Giáo dục kỹ thuật đang thay đổi để đáp ứng nhu cầu của thị trường lao động hiện đại.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    category: "Thời sự",
    author: "Nguyễn Minh",
    created_at: new Date(Date.now() - 39600000).toISOString(),
  },
  {
    id: 12,
    title: "Bóng đá nữ Việt Nam: Những bước tiến đáng kể trong năm qua",
    excerpt: "Bóng đá nữ đang trở thành một trong những môn thể thao được chú ý nhất tại Việt Nam.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    category: "Thể thao",
    author: "Phạm Thảo",
    created_at: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 13,
    title: "Blockchain và ứng dụng của nó trong kinh tế số",
    excerpt: "Công nghệ blockchain đang mở ra những cơ hội mới cho nền kinh tế số Việt Nam.",
    image: "https://images.unsplash.com/photo-1639762681033-6461854d8c2f?w=600&q=80",
    category: "Công nghệ",
    author: "Nguyễn Duy",
    created_at: new Date(Date.now() - 46800000).toISOString(),
  },
  {
    id: 14,
    title: "Xu hướng thường xuyên thay đổi trong ngành giải trí",
    excerpt: "Các nhà sáng tạo nội dung đang phải thích ứng nhanh chóng với xu hướng mới.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=600&q=80",
    category: "Giải trí",
    author: "Lý Thanh",
    created_at: new Date(Date.now() - 50400000).toISOString(),
  },
  {
    id: 15,
    title: "Tiêu dùng bền vững: Xu hướng của các công ty lớn",
    excerpt: "Các công ty lớn đang chuyển hướng sang những sản phẩm bền vững và thân thiện với môi trường.",
    image: "https://images.unsplash.com/photo-1542601906960-ba2006ce398f?w=600&q=80",
    category: "Kinh doanh",
    author: "Trần Hùng",
    created_at: new Date(Date.now() - 54000000).toISOString(),
  },
  {
    id: 16,
    title: "Những sự kiện thể thao quốc tế sắp diễn ra tại Việt Nam",
    excerpt: "Năm 2026 sẽ chứng kiến nhiều sự kiện thể thao quy mô lớn diễn ra tại Việt Nam.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    category: "Thể thao",
    author: "Phạm Thảo",
    created_at: new Date(Date.now() - 57600000).toISOString(),
  },
  {
    id: 17,
    title: "Cách các công ty công nghệ lớn phát triển sản phẩm mới",
    excerpt: "Quy trình phát triển sản phẩm của các công ty lớn luôn tham khảo ý kiến của người dùng.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    category: "Công nghệ",
    author: "Nguyễn Duy",
    created_at: new Date(Date.now() - 61200000).toISOString(),
  },
  {
    id: 18,
    title: "Những bộ phim Việt sắp công chiếu trong thời gian tới",
    excerpt: "Ngoài các bộ phim Hàn và Trung, phim Việt đang được chú ý ngày càng nhiều.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
    category: "Giải trí",
    author: "Lý Thanh",
    created_at: new Date(Date.now() - 64800000).toISOString(),
  },
];

const ARTICLES_PER_PAGE = 15; // 5 rows × 3 columns

export default function CategorySection() {
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchArticles();

    // Set up polling for new articles every 30 seconds
    const interval = setInterval(() => {
      fetchArticles();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchArticles = async () => {
    try {
      setError(null);
      const response = await api.get("/articles", {
        params: {
          page: 1,
          limit: 100,
          sort: "-created_at",
        },
      });

      // Ensure we're setting an array and handling the response properly
      const newArticles = Array.isArray(response.data)
        ? response.data
        : response.data.articles || [];

      // Combine mock articles with API articles if any
      if (newArticles.length > 0) {
        // Combine and sort by newest first, avoiding duplicates
        const combined = [...MOCK_ARTICLES, ...newArticles];
        const unique = Array.from(new Map(combined.map(a => [a.id, a])).values());
        setArticles(unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      } else {
        setArticles(MOCK_ARTICLES);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Không thể tải bài viết từ máy chủ");
      setLoading(false);
      // Keep mock articles as fallback
      setArticles(MOCK_ARTICLES);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const displayedArticles = articles.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of section
    document.querySelector(".category-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading && articles.length === 0) {
    return (
      <section className="category-section">
        <div className="category-section__inner">
          <div className="category-section__header">
            <h2 className="category-section__heading">Tất cả bài viết</h2>
            <p className="category-section__sub">Cập nhật tin tức đa chiều trên mọi lĩnh vực</p>
          </div>
          <div className="category-section__loading">
            <p>Đang tải bài viết...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="category-section">
      <div className="category-section__inner">
        <div className="category-section__header">
          <h2 className="category-section__heading">Tất cả bài viết</h2>
          <p className="category-section__sub">Cập nhật tin tức đa chiều trên mọi lĩnh vực</p>
        </div>

        {error && <div className="category-section__error">{error}</div>}

        {displayedArticles.length > 0 ? (
          <>
            <div className="category-section__grid">
              {displayedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="category-section__pagination">
                <button
                  className="category-section__pagination-btn category-section__pagination-prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <div className="category-section__pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`category-section__pagination-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Trang ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="category-section__pagination-btn category-section__pagination-next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="category-section__empty">
            <p>Chưa có bài viết</p>
          </div>
        )}
      </div>
    </section>
  );
}