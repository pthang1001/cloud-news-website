import { Link } from "react-router-dom";
import "./ArticleCard.css";

export default function ArticleCard({ article }) {
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/400x225?text=No+Image";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${import.meta.env.VITE_API_URL}${imageUrl}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Vừa mới";
    if (diffHours < 24) return `${diffHours}g trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <article className="article-card">
      <Link to={`/article/${article.id}`} className="article-card__image-link">
        <div className="article-card__image-wrap">
          <img
            src={getFullImageUrl(article.image)}
            alt={article.title}
            className="article-card__image"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="article-card__content">
        {article.category && (
          <Link
            to={`/category/${article.category.toLowerCase().replace(/\s+/g, "-")}`}
            className="article-card__category"
          >
            {article.category.toUpperCase()}
          </Link>
        )}

        <Link to={`/article/${article.id}`} className="article-card__title-link">
          <h3 className="article-card__title">{article.title}</h3>
        </Link>

        {article.excerpt && (
          <p className="article-card__excerpt">{article.excerpt}</p>
        )}

        <div className="article-card__meta">
          {article.author && (
            <span className="article-card__author">{article.author}</span>
          )}
          {article.author && article.created_at && (
            <span className="article-card__dot">•</span>
          )}
          <span className="article-card__time">{formatDate(article.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
