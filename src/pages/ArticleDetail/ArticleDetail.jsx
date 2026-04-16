import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ArticleDetail.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ArticleSidebar from "../../components/ArticleSidebar/ArticleSidebar";
import CommentSection from "../../components/CommentSection/CommentSection";
import ArticleAuthor from "../../components/ArticleAuthor/ArticleAuthor";
// import { getArticleById } from "../../services/articleService";

// Mock data – xóa khi kết nối API thật
const MOCK_ARTICLE = {
  id: 1,
  category: "Thời sự",
  timeAgo: "15 phút trước",
  title: "Tương lai của hạ tầng đô thị thông minh tại Việt Nam",
  subtitle:
    "Khám phá cách các đô thị lớn đang chuyển mình để thích ứng với cuộc cách mạng công nghệ 4.0 và giải quyết các bài toán về môi trường.",
  heroImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=900&q=80",
  heroCaption: "Ảnh: Toàn cảnh một khu đô thị thông minh kiểu mẫu. Nguồn: Diễn Đàn Press",
  content: [
    {
      type: "paragraph",
      text: "Theo báo cáo mới nhất từ Bộ Xây dựng, việc tích hợp các giải pháp Internet vạn vật (IoT) vào quản lý hạ tầng không chỉ giúp tiết kiệm 30% năng lượng tiêu thụ mà còn cải thiện đáng kể chất lượng sống của cư dân. Đây được xem là bước đi chiến lược trong tầm nhìn phát triển kinh tế bền vững.",
    },
    {
      type: "highlight",
      title: "Các trụ cột chính của đô thị thông minh",
      items: [
        "Hệ thống giao thông thông minh (ITS) giúp giảm thiểu ùn tắc.",
        "Quản lý lưới điện thông minh và năng lượng tái tạo.",
        "Cảm biến chất lượng không khí và xử lý rác thải tự động.",
      ],
    },
    {
      type: "paragraph",
      text: "Tuy nhiên, thách thức lớn nhất hiện nay vẫn là bài toán về bảo mật dữ liệu và nguồn vốn đầu tư. Các chuyên gia cho rằng cần có một cơ chế hợp tác công tư (PPP) linh hoạt hơn để thu hút các tập đoàn công nghệ lớn tham gia vào quá trình xây dựng này.",
    },
    {
      type: "images",
      images: [
        { src: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=500&q=80", alt: "Công nghệ đô thị" },
        { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80", alt: "Hội nghị công nghệ" },
      ],
    },
    {
      type: "paragraph",
      text: "Trong tương lai gần, chúng ta sẽ thấy sự hiện diện ngày càng rõ rệt của AI trong việc điều phối các dịch vụ công ích. Đó không còn là câu chuyện của phim viễn tưởng, mà là thực tế đang diễn ra ngay tại các thành phố lớn như Hà Nội và TP.HCM.",
    },
  ],
  author: {
    name: "Nguyễn Minh Quân",
    avatar: "https://i.pravatar.cc/80?img=11",
    bio: "Phóng viên chuyên trách mảng Công nghệ & Đô thị với hơn 10 năm kinh nghiệm tại Diễn Đàn Press.",
  },
  tags: ["#SmartCity", "#AI_2024", "#Bền_vững", "#Công_nghệ"],
  relatedArticles: [
    {
      id: 2,
      category: "Kinh doanh",
      timeAgo: "1 giờ trước",
      title: "Tối ưu hóa luồng giao thông bằng cảm biến quang học",
      thumbnail: "https://i.pravatar.cc/120?img=3",
    },
    {
      id: 3,
      category: "Công nghệ",
      timeAgo: "3 giờ trước",
      title: "Năm 2024: Kỷ nguyên của chip xử lý Edge AI",
      thumbnail: "https://i.pravatar.cc/120?img=5",
    },
    {
      id: 4,
      category: "Đời sống",
      timeAgo: "6 giờ trước",
      title: "Không gian làm việc tương lai thay đổi thế nào?",
      thumbnail: "https://i.pravatar.cc/120?img=8",
    },
  ],
  comments: [
    {
      id: 1,
      author: "Trần Văn Tú",
      initials: "TV",
      color: "#2563A8",
      timeAgo: "2 giờ trước",
      text: "Tôi đặc biệt quan tâm đến mảng quản lý năng lượng thông minh. Hy vọng sẽ sớm được thấy triển khai thực tế.",
      likes: 12,
    },
    {
      id: 2,
      author: "Lê Hoàng",
      initials: "LH",
      color: "#16A34A",
      timeAgo: "5 giờ trước",
      text: "Cần lưu ý thêm về vấn đề đào tạo nhân lực để vận hành những hệ thống phức tạp này nữa.",
      likes: 7,
    },
  ],
};

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(MOCK_ARTICLE);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const commentSectionRef = useRef(null);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/article/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Đã sao chép liên kết!");
    }).catch(() => {
      alert("Không thể sao chép liên kết");
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleCommentClick = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

//   Uncomment khi có API thật:
//   useEffect(() => {
//     setLoading(true);
//     getArticleById(id)
//       .then(setArticle)
//       .finally(() => setLoading(false));
//   }, [id]);

  if (loading) return <div className="ad-loading">Đang tải bài viết...</div>;
  if (!article) return <div className="ad-loading">Không tìm thấy bài viết.</div>;

  return (
    <>
      <Navbar />
      <div className="ad-page">
        <div className="ad-container">
          {/* ── CỘT TRÁI: nội dung chính ── */}
          <main className="ad-main">
          {/* Meta */}
          <div className="ad-meta">
            <span className="ad-category">{article.category}</span>
            <span className="ad-time">{article.timeAgo}</span>
          </div>

          {/* Tiêu đề */}
          <h1 className="ad-title">{article.title}</h1>
          <p className="ad-subtitle">{article.subtitle}</p>

          {/* Actions share */}
          <div className="ad-share">
            <button className="ad-share-btn" title="Chia sẻ" onClick={handleShare}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button className={`ad-share-btn ${isSaved ? "ad-share-btn--saved" : ""}`} title="Lưu bài" onClick={handleSave}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button className="ad-share-btn" title="Bình luận" onClick={handleCommentClick}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>

          {/* Hero image */}
          <figure className="ad-hero">
            <img src={article.heroImage} alt={article.title} className="ad-hero-img" />
            <figcaption className="ad-hero-caption">{article.heroCaption}</figcaption>
          </figure>

          {/* Body content */}
          <div className="ad-body">
            {article.content.map((block, i) => {
              if (block.type === "paragraph") {
                return <p key={i} className="ad-paragraph">{block.text}</p>;
              }
              if (block.type === "highlight") {
                return (
                  <div key={i} className="ad-highlight">
                    <h3 className="ad-highlight-title">{block.title}</h3>
                    <ul className="ad-highlight-list">
                      {block.items.map((item, j) => (
                        <li key={j} className="ad-highlight-item">
                          <span className="ad-check">✔</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              if (block.type === "images") {
                return (
                  <div key={i} className="ad-image-grid">
                    {block.images.map((img, j) => (
                      <img key={j} src={img.src} alt={img.alt} className="ad-grid-img" />
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="ad-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="ad-tag">{tag}</span>
            ))}
          </div>

          {/* Author */}
          <ArticleAuthor author={article.author} />

          {/* Comments */}
          <div ref={commentSectionRef}>
            <CommentSection comments={article.comments} />
          </div>
        </main>

        {/* ── CỘT PHẢI: sidebar ── */}
        <aside className="ad-aside">
          <ArticleSidebar relatedArticles={article.relatedArticles} tags={article.tags} />
        </aside>
      </div>
      </div>
      <Footer />
    </>
  );
}