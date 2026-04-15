import { useNavigate } from "react-router-dom";
import "./ArticleSidebar.css";

export default function ArticleSidebar({ relatedArticles = [], tags = [] }) {
  const navigate = useNavigate();

  return (
    <div className="sb-wrap">
      {/* Related articles */}
      <section className="sb-section">
        <h3 className="sb-heading">
          <span className="sb-heading-bar" />
          Bài liên quan
        </h3>
        <div className="sb-related-list">
          {relatedArticles.map((a) => (
            <article
              key={a.id}
              className="sb-related-item"
              onClick={() => navigate(`/article/${a.id}`)}
            >
              <img src={a.thumbnail} alt={a.title} className="sb-related-img" />
              <div className="sb-related-info">
                <p className="sb-related-title">{a.title}</p>
                <p className="sb-related-meta">
                  <span className="sb-related-cat">{a.category}</span>
                  <span className="sb-related-time">• {a.timeAgo}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Hot tags */}
      <section className="sb-section">
        <h3 className="sb-heading">
          <span className="sb-heading-bar" />
          Chủ đề hot
        </h3>
        <div className="sb-tags">
          {tags.map((tag) => (
            <span key={tag} className="sb-tag">{tag}</span>
          ))}
        </div>
      </section>
    </div>
  );
}