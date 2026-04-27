import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useSavedArticles } from "../../contexts/SavedArticlesContext";
import "./HistoryPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { removeSavedArticleId } = useSavedArticles();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchSavedData = async () => {
    if (!currentUser.email) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/articles/saved/${currentUser.email}`);
      if (res.ok) {
        const data = await res.json();
        setSavedArticles(data);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu Duy ơi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedData();
  }, [currentUser.email]);

  const handleRemove = async (articleId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/articles/save/${articleId}/${currentUser.email}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSavedArticles(prev => prev.filter(art => art.id !== articleId));
        removeSavedArticleId(articleId);
      }
    } catch (error) {
      console.error("Lỗi xóa bài Duy ơi:", error);
    }
  };

  return (
    <div className="hp-container">
      <Navbar currentCategory="Lịch sử" />
      
      <main className="hp-content">
        <div className="hp-header">
          <h1 className="hp-title">Lịch sử bài báo đã lưu</h1>
          {/* ✅ ĐÃ XÓA DÒNG THÔNG TIN THEO YÊU CẦU DUY NHÉ */}
        </div>

        {loading ? (
          <div className="hp-status">Đang kết nối database...</div>
        ) : (
          <div className="hp-grid">
            {savedArticles.map((article) => (
              <div key={article.id} className="hp-card">
                <Link to={`/article/${article.id}`} className="hp-card__link">
                  <div className="hp-card__img">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="hp-card__body">
                    <span className="hp-card__tag">{article.category || "TIN NÓNG"}</span>
                    <h3 className="hp-card__text">{article.title}</h3>
                  </div>
                </Link>
                <div className="hp-card__footer">
                  <button className="hp-card__btn" onClick={() => handleRemove(article.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    Gỡ bỏ bài này
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}