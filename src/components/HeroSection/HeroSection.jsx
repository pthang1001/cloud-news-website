import { Link } from "react-router-dom";
import { useSavedArticles } from "../../contexts/SavedArticlesContext"; // Duy nhớ check lại đường dẫn file Context nhé
import "./HeroSection.css";

export default function HeroSection({ featuredArticle, loading }) {
  // Lấy các hàm từ Context để làm việc trực tiếp với DB
  const { savedArticleIds, addSavedArticleId, removeSavedArticleId } = useSavedArticles();

  if (loading || !featuredArticle) {
    return <div className="hero-loading">Đang tải tiêu điểm bạn chờ xíu...</div>;
  }

  // Kiểm tra trạng thái đã lưu từ Context Duy nhé
  const isSaved = savedArticleIds.includes(String(featuredArticle.id));

  // Hàm xử lý riêng cho nút Lưu Duy nhé
  const handleSaveClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (isSaved) {
      removeSavedArticleId(featuredArticle.id);
    } else {
      // QUAN TRỌNG: Truyền cả object featuredArticle để Postgres có data lưu
      addSavedArticleId(featuredArticle);
    }
  };

  return (
    <article className="hero-section">
      <Link to={`/article/${featuredArticle.id}`} className="hero__link" style={{ textDecoration: 'none' }}>
        <div className="hero__image-wrap">
          <img src={featuredArticle.image} alt={featuredArticle.title} className="hero__image" />
        </div>
        <div className="hero__content">
          <div className="hero__meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Icon Lưu bài nằm bên góc trái Duy nhé */}
            <button 
              onClick={handleSaveClick}
              className="hero__save-btn"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isSaved ? '#00e5ff' : '#fff', // Màu xanh Cyan khi đã lưu
                display: 'flex',
                alignItems: 'center',
                padding: 0,
                zIndex: 10
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            <span className="hero__badge" style={{ color: '#ff4d4d', fontWeight: '800', textDecoration: 'none', border: 'none' }}>
              TIÊU ĐIỂM
            </span>
          </div>

          <h1 className="hero__title" style={{ textDecoration: 'none', marginBottom: '15px' }}>
            {featuredArticle.title}
          </h1>

          <div className="hero__author">
            <img 
              src="/VnExpress-logo-1.png" 
              alt="VnExpress" 
              className="hero__vnexpress-logo" 
              style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}