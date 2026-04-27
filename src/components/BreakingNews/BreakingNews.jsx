import { Link } from "react-router-dom";
import "./BreakingNews.css";

export default function BreakingNews({ 
  articles = [], 
  loading, 
  savedArticleIds = [], 
  addSavedArticleId, 
  removeSavedArticleId 
}) {
  if (loading && articles.length === 0) return null;

  // Hàm xử lý lưu bài viết Duy nhé
  const handleSaveClick = (e, articleId, isSaved) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeSavedArticleId(articleId);
    } else {
      addSavedArticleId(articleId);
    }
  };

  return (
    <aside className="breaking-news">
      <div className="breaking-news__header">
        <span className="breaking-news__bar" />
        <h2 className="breaking-news__title">Tin nổi bật</h2>
      </div>
      <ul className="breaking-news__list">
        {articles.map((item) => {
          const isSaved = savedArticleIds.includes(item.id);
          
          return (
            <li key={item.id} className="breaking-news__item">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                
                {/* FIX: Nút lưu bài viết hiện màu xanh khi đã lưu Duy nhé */}
                <button 
                  onClick={(e) => handleSaveClick(e, item.id, isSaved)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: isSaved ? '#00e5ff' : '#94a3b8',
                    padding: '2px 0 0 0',
                    transition: 'color 0.2s'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                <div style={{ flex: 1 }}>
                  {/* FIX: Chuyên mục màu đỏ, không gạch chân Duy nhé */}
                  <span 
                    className="breaking-news__category" 
                    style={{ color: '#ff4d4d', fontWeight: '700', textDecoration: 'none' }}
                  >
                    {item.category?.toUpperCase()}
                  </span>

                  <Link 
                    to={`/article/${item.id}`} 
                    className="breaking-news__item-title" 
                    style={{ textDecoration: 'none', display: 'block', marginTop: '4px' }}
                  >
                    {item.title}
                  </Link>

                  <div className="breaking-news__item-meta">
                    <span>VnExpress</span>
                    {/* Đã xóa chữ "Mới nhất" ở đây theo yêu cầu của Duy */}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}