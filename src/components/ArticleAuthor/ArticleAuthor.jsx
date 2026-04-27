/* src/components/ArticleAuthor/ArticleAuthor.jsx */
import "./ArticleAuthor.css";

export default function ArticleAuthor({ author }) {
  // Nếu hoàn toàn không có dữ liệu author thì không hiện gì cả Duy nhé
  if (!author) return null;

  // FIX: Thiết lập giá trị mặc định. 
  // Nếu server trả về "Ban biên tập VnExpress" thì nó sẽ hiện ở đây Duy nhé.
  const authorName = author.name || "Ban biên tập VnExpress";
  const authorAvatar = author.avatar || "/VnExpress-logo-1.png";

  return (
    <div className="aa-card">
      <div className="aa-avatar-wrap" style={{ 
        width: '60px', 
        height: '60px', 
        borderRadius: '50%', 
        overflow: 'hidden', 
        background: '#fff', // Thêm nền trắng để logo nổi bật
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e2e8f0',
        flexShrink: 0
      }}>
        <img 
          src={authorAvatar} 
          alt={authorName} 
          className="aa-avatar" 
          style={{ 
            width: '80%', // Thu nhỏ logo lại một chút để không bị chạm viền tròn
            height: 'auto', 
            objectFit: 'contain' // FIX: Giữ nguyên tỷ lệ ảnh, không bị cắt mất chữ Duy nhé
          }}
          // Nếu lỡ ảnh bị lỗi đường dẫn, nó sẽ tự hiện logo báo của Duy
          onError={(e) => { e.target.src = "/VnExpress-logo-1.png"; }}
        />
      </div>
      
      <div className="aa-info">
        <p className="aa-label" style={{ color: '#dc2626', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', marginBottom: '4px' }}>
          Tác giả bài viết
        </p>
        <p className="aa-name" style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
          {authorName}
        </p>
        
        <p className="aa-bio" style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.4' }}>
          {author.bio || `Phóng viên và biên tập viên tại VnExpress - Cập nhật tin tức chính xác, kịp thời từ hiện trường.`}
        </p>
      </div>
    </div>
  );
}