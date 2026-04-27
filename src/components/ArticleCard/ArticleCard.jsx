import { Link } from "react-router-dom";
import { useSavedArticles } from "../../contexts/SavedArticlesContext"; // Nhớ kiểm tra đúng đường dẫn Duy nhé
import "./ArticleCard.css";

export default function ArticleCard({ article }) {
  const { savedArticleIds, addSavedArticleId, removeSavedArticleId } = useSavedArticles();

  // Kiểm tra xem bài này đã được lưu trong Database chưa
  const isSaved = savedArticleIds.includes(String(article.id));

  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.includes("placeholder")) {
        return "https://images.unsplash.com/photo-1504711432869-5d39a110fdd0?w=600&q=80"; 
    }
    return imageUrl.startsWith("http") ? imageUrl : `${import.meta.env.VITE_API_URL}${imageUrl}`;
  };

  // Hàm xử lý khi bấm nút lưu Duy nhé
  const handleSaveToggle = (e) => {
    e.preventDefault(); // Ngăn việc bấm nút bị nhảy vào trang chi tiết
    if (isSaved) {
      removeSavedArticleId(article.id);
    } else {
      // TRUYỀN CẢ OBJECT ARTICLE: Để Backend có title, image... lưu vào Postgres
      addSavedArticleId(article);
    }
  };

  return (
    <article className="article-card">
      <div className="article-card__image-link">
        <div className="article-card__image-wrap">
          <Link to={`/article/${article.id}`}>
            <img
              src={getFullImageUrl(article.image)}
              alt={article.title}
              className="article-card__image"
              loading="lazy"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504711432869-5d39a110fdd0?w=600&q=80" }}
            />
          </Link>
          
          {/* NÚT LƯU BÀI BÁO (BOOKMARK) DUY NHÉ */}
          <button 
            className={`article-card__save-btn ${isSaved ? 'saved' : ''}`} 
            onClick={handleSaveToggle}
            title={isSaved ? "Bỏ lưu" : "Lưu bài viết"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="article-card__content">
        {article.category && (
          <div className="article-card__category">
            {article.category.toUpperCase()}
          </div>
        )}

        <Link to={`/article/${article.id}`} className="article-card__title-link">
          <h3 className="article-card__title">{article.title}</h3>
        </Link>

        {article.excerpt && (
          <p className="article-card__excerpt">
            {article.excerpt.length > 115 ? article.excerpt.substring(0, 115) + "..." : article.excerpt}
          </p>
        )}

        <div className="article-card__meta">
          <img 
            src="/VnExpress-logo-1.png" 
            alt="VnExpress" 
            style={{ height: '16px', width: 'auto', marginRight: '8px', objectFit: 'contain' }}
          />
          <span className="article-card__dot">•</span>
          <span className="article-card__time">Mới nhất</span>
        </div>
      </div>
    </article>
  );
}