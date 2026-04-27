import { useState, useEffect } from "react";
import ArticleCard from "../ArticleCard/ArticleCard";
import "./CategorySection.css";

const ARTICLES_PER_PAGE = 15; 

export default function CategorySection({ articles = [], loading, title = "Tất cả bài viết" }) {
  const [currentPage, setCurrentPage] = useState(1);

  /* ĐÃ FIX: Khi Duy đổi chuyên mục (title đổi) hoặc tìm kiếm (articles đổi), 
     phải đưa về trang 1 để không bị trống trang hoặc loạn dữ liệu */
  useEffect(() => {
    setCurrentPage(1);
  }, [articles, title]);

  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const displayedArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  if (loading && articles.length === 0) {
    return (
      <section className="category-section">
        <div className="category-section__loading">Đang tải tin tức mới nhất...</div>
      </section>
    );
  }

  return (
    <section className="category-section">
      <div className="category-section__inner">
        <div className="category-section__header">
          <h2 className="category-section__heading">{title}</h2>
          <p className="category-section__sub">Tin tức chính xác, cập nhật liên tục</p>
        </div>

        {displayedArticles.length > 0 ? (
          <>
            <div className="category-section__grid">
              {displayedArticles.map((article) => (
                /* Sử dụng article.id từ Backend để đảm bảo không bị trùng lặp bài báo */
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="category-section__pagination">
                <button
                  className="category-section__pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
                <div className="category-section__pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`category-section__pagination-number ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="category-section__pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="category-section__empty">
            <p>Không tìm thấy bài viết nào trong mục này. Bạn thử tìm từ khóa khác nhé! </p>
          </div>
        )}
      </div>
    </section>
  );
}