import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ArticleDetail.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ArticleSidebar from "../../components/ArticleSidebar/ArticleSidebar";
import CommentSection from "../../components/CommentSection/CommentSection";
import ArticleAuthor from "../../components/ArticleAuthor/ArticleAuthor";
import { getArticleById } from "../../services/articleService";
// Quản lý bài viết đã lưu để đồng bộ với Database PostgreSQL Duy nhé
import { useSavedArticles } from "../../contexts/SavedArticlesContext";

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dynamicComments, setDynamicComments] = useState([]); // State lưu bình luận từ Postgres Duy nhé
  const commentSectionRef = useRef(null);

  // Lấy logic từ Context toàn cục Duy nhé
  const { savedArticleIds, addSavedArticleId, removeSavedArticleId } = useSavedArticles();
  
  // Kiểm tra trạng thái đã lưu bằng chuỗi ID Duy nhé
  const isSaved = savedArticleIds.includes(String(id));

  // --- 1. LOGIC LẤY BÌNH LUẬN TỪ POSTGRES ---
  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/articles/${id}/comments`);
      const data = await res.json();
      setDynamicComments(data);
    } catch (err) {
      console.error("Lỗi lấy bình luận từ Database Duy ơi:", err);
    }
  };

  // --- 2. LOGIC GỬI BÌNH LUẬN MỚI ---
  // ✅ CẬP NHẬT: Thêm parentId để hỗ trợ tính năng Trả lời (Reply) Duy nhé
  const handlePostComment = async (content, parentId = null) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Duy ơi, phải đăng nhập mới bình luận được nhé!");

    try {
      const res = await fetch("http://localhost:5000/api/articles/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          userEmail: user.email,
          userName: user.fullname,
          userAvatar: user.avatar,
          content: content,
          parentId: parentId // Truyền parentId xuống Backend Duy nhé
        })
      });

      if (res.ok) {
        await fetchComments(); // Gửi xong thì load lại danh sách để hiện ngay lập tức
      }
    } catch (err) {
      alert("Không gửi được bình luận rồi bạn ơi!");
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Đã sao chép liên kết bài báo thành công!");
    }).catch(() => {
      alert("Không thể sao chép liên kết Duy ơi.");
    });
  };

  // FIX TRIỆT ĐỂ: Truyền cả OBJECT bài báo sang Backend để lưu vào Postgres
  const handleSave = () => {
    if (isSaved) {
      removeSavedArticleId(id);
    } else {
      const articleToSave = {
        ...article,
        id: id,
        image: article.heroImage || article.image,
        excerpt: article.subtitle || article.excerpt
      };
      
      addSavedArticleId(articleToSave);
      console.log(">>> Đã gửi yêu cầu lưu bài viết chi tiết sang Postgres");
    }
  };

  const handleCommentClick = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    setLoading(true);
    // Load nội dung bài báo
    getArticleById(id)
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => {
        console.error("Lỗi lấy chi tiết bài viết:", err);
      })
      .finally(() => setLoading(false));

    // Load bình luận từ Postgres Duy nhé
    fetchComments();
  }, [id]);

  if (loading) return <div className="ad-loading">Đang tải bài viết xịn cho Duy...</div>;
  if (!article) return <div className="ad-loading">Không tìm thấy bài viết này rồi Duy ơi!</div>;

  return (
    <>
      <Navbar />
      <div className="ad-page">
        <div className="ad-container">
          <main className="ad-main">
            <div className="ad-source-header" style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <img 
                src="/VnExpress-logo-1.png" 
                alt="VnExpress" 
                style={{ height: '26px', width: 'auto', objectFit: 'contain' }} 
              />
            </div>

            <div className="ad-meta">
              <span className="ad-category" style={{ color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' }}>{article.category}</span>
              <span className="ad-time">{article.created_at ? new Date(article.created_at).toLocaleString('vi-VN') : "Vừa mới"}</span>
            </div>

            <h1 className="ad-title" style={{ textDecoration: 'none' }}>{article.title}</h1>
            <p className="ad-subtitle">{article.subtitle || article.excerpt}</p>

            <div className="ad-share" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '25px' }}>
              <button className="ad-share-btn" title="Chia sẻ" onClick={handleShare}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </button>

              <button 
                className={`ad-share-btn ${isSaved ? "ad-share-btn--saved" : ""}`} 
                title={isSaved ? "Bỏ lưu" : "Lưu bài"} 
                onClick={handleSave}
                style={{ color: isSaved ? '#00e5ff' : '#64748b', transition: 'all 0.3s ease' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2-2h3"/>
                </svg>
              </button>

              <button className="ad-share-btn" title="Bình luận" onClick={handleCommentClick}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>

            <figure className="ad-hero" style={{ margin: '0 0 25px 0' }}>
              <img src={article.heroImage || article.image} alt={article.title} className="ad-hero-img" style={{ borderRadius: '12px', width: '100%', objectFit: 'cover' }} />
              <figcaption className="ad-hero-caption" style={{ marginTop: '10px', fontSize: '13px', color: '#94a3b8' }}>
                Nguồn: VnExpress (Cập nhật trực tiếp từ PostgreSQL)
              </figcaption>
            </figure>

            <div className="ad-body">
              {article.content && article.content.map((block, i) => {
                if (block.type === "paragraph") {
                  return <p key={i} className="ad-paragraph" style={{ lineHeight: '1.8', fontSize: '17px', marginBottom: '20px' }}>{block.text}</p>;
                }
                return null;
              })}
            </div>

            <ArticleAuthor author={article.author} />

            {/* ✅ CẬP NHẬT: Truyền thêm fetchComments để CommentSection có thể gọi lại data Duy nhé */}
            <div ref={commentSectionRef} style={{ marginTop: '40px' }}>
              <CommentSection 
                comments={dynamicComments} 
                onCommentSubmit={handlePostComment}
                fetchComments={fetchComments} 
              />
            </div>
          </main>

          <aside className="ad-aside">
            <ArticleSidebar relatedArticles={article.relatedArticles || []} tags={article.tags || []} />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}